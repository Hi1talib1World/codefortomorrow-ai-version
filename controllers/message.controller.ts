import { Request, Response } from 'express';
import Message from '../models/Message';
import User from '../models/user.model';

/**
 * @desc    Send a message
 * @route   POST /api/messages
 * @access  Private
 */
export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { receiverId, content } = req.body;
    const senderId = req.user?._id;

    if (!receiverId || !content) {
      return res.status(400).json({ message: 'Receiver and content are required.' });
    }

    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: 'Receiver not found.' });
    }

    const message = await Message.create({
      sender: senderId,
      receiver: receiverId,
      content,
    });

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name profilePictureUrl role')
      .populate('receiver', 'name profilePictureUrl role');

    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

/**
 * @desc    Get conversation between current user and another user
 * @route   GET /api/messages/conversation/:userId
 * @access  Private
 */
export const getConversation = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user?._id;

    const messages = await Message.find({
      $or: [
        { sender: currentUserId, receiver: userId },
        { sender: userId, receiver: currentUserId },
      ],
    })
      .sort({ createdAt: 1 })
      .populate('sender', 'name profilePictureUrl role')
      .populate('receiver', 'name profilePictureUrl role');

    // Mark messages as read
    await Message.updateMany(
      { sender: userId, receiver: currentUserId, isRead: false },
      { $set: { isRead: true } }
    );

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

/**
 * @desc    Get all conversations for the current user
 * @route   GET /api/messages/conversations
 * @access  Private
 */
export const getConversations = async (req: Request, res: Response) => {
  try {
    const currentUserId = req.user?._id;

    // Find unique users the current user has messaged with
    const messages = await Message.find({
      $or: [{ sender: currentUserId }, { receiver: currentUserId }],
    }).sort({ createdAt: -1 });

    const conversationUserIds = new Set<string>();
    messages.forEach((msg) => {
      const otherId = msg.sender.toString() === currentUserId.toString() 
        ? msg.receiver.toString() 
        : msg.sender.toString();
      conversationUserIds.add(otherId);
    });

    const conversationUsers = await User.find({
      _id: { $in: Array.from(conversationUserIds) },
    }).select('name profilePictureUrl role');

    // Add last message and unread count for each conversation
    const conversations = await Promise.all(
      conversationUsers.map(async (user) => {
        const lastMessage = await Message.findOne({
          $or: [
            { sender: currentUserId, receiver: user._id },
            { sender: user._id, receiver: currentUserId },
          ],
        }).sort({ createdAt: -1 });

        const unreadCount = await Message.countDocuments({
          sender: user._id,
          receiver: currentUserId,
          isRead: false,
        });

        return {
          user,
          lastMessage,
          unreadCount,
        };
      })
    );

    res.json(conversations.sort((a, b) => {
      const dateA = a.lastMessage?.createdAt.getTime() || 0;
      const dateB = b.lastMessage?.createdAt.getTime() || 0;
      return dateB - dateA;
    }));
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
