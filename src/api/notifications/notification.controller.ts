import { Request, Response, NextFunction } from 'express';
import Notification from '../../../src/models/notification.model';
import User from '../../../src/models/user.model';
import Progress from '../../../src/models/progress.model';
import ApiError from '../../../utils/ApiError';

/**
 * @desc    Get all notifications for current user (auto-triggers streak warnings if appropriate)
 * @route   GET /api/notifications
 * @access  Private
 */
export const getNotifications = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?._id;
    if (!userId) {
      throw new ApiError(401, 'Unauthorized');
    }

    // Dynamic Check: Streak at Risk
    const user = await User.findById(userId).populate('progress');
    if (user && user.progress) {
      const progress = user.progress as any;
      if (progress.streak > 0 && progress.lastLessonCompletedDate) {
        const today = new Date();
        const lastCompletion = new Date(progress.lastLessonCompletedDate);
        
        // Calculate difference in hours
        const diffMs = today.getTime() - lastCompletion.getTime();
        const diffHours = diffMs / (1000 * 60 * 60);

        // If it's been more than 18 hours but less than 36 hours since completion, streak is at risk
        if (diffHours >= 18 && diffHours <= 36) {
          const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
          const alreadyCreated = await Notification.findOne({
            userId,
            type: 'streak_at_risk',
            createdAt: { $gte: startOfToday }
          });

          if (!alreadyCreated) {
            await Notification.create({
              userId,
              title: 'Streak at Risk! 🔥',
              message: `Your ${progress.streak}-day learning streak is at risk. Solve a lesson today to keep your fire burning!`,
              type: 'streak_at_risk'
            });
          }
        }
      }
    }

    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(100);

    res.json(notifications);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new notification manually
 * @route   POST /api/notifications
 * @access  Private
 */
export const createNotification = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?._id;
    const { title, message, type } = req.body;

    const notification = await Notification.create({
      userId,
      title,
      message,
      type: type || 'general',
    });

    res.status(201).json(notification);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Mark a specific notification as read
 * @route   PUT /api/notifications/:id/read
 * @access  Private
 */
export const markAsRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?._id;

    const notification = await Notification.findOneAndUpdate(
      { _id: id, userId },
      { read: true },
      { new: true }
    );

    if (!notification) {
      throw new ApiError(404, 'Notification not found');
    }

    res.json(notification);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Mark all unread notifications as read
 * @route   PUT /api/notifications/read-all
 * @access  Private
 */
export const markAllAsRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?._id;

    await Notification.updateMany(
      { userId, read: false },
      { read: true }
    );

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a notification
 * @route   DELETE /api/notifications/:id
 * @access  Private
 */
export const deleteNotification = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?._id;

    const notification = await Notification.findOneAndDelete({ _id: id, userId });

    if (!notification) {
      throw new ApiError(404, 'Notification not found');
    }

    res.json({ message: 'Notification deleted' });
  } catch (error) {
    next(error);
  }
};
