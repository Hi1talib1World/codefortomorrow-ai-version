import { Request, Response, NextFunction } from 'express';
import Post from '../../models/post.model';
import ApiError from '../../../utils/ApiError';

/**
 * @desc    Get all feed posts sorted by newest
 * @route   GET /api/posts
 * @access  Private
 */
export const getPosts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const posts = await Post.find()
      .populate('author', 'name profilePictureUrl role professionalTitle')
      .populate('comments.author', 'name profilePictureUrl role professionalTitle')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new feed post
 * @route   POST /api/posts
 * @access  Private
 */
export const createPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?._id;
    if (!userId) {
      throw new ApiError(401, 'Unauthorized');
    }
    const { content, milestone } = req.body;
    if (!content) {
      throw new ApiError(400, 'Content is required');
    }
    const post = await Post.create({
      author: userId,
      content,
      milestone,
      likes: [],
      comments: [],
    });
    
    const populatedPost = await Post.findById(post._id)
      .populate('author', 'name profilePictureUrl role professionalTitle');
      
    res.status(201).json(populatedPost);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Toggle like state for a post
 * @route   PUT /api/posts/:id/like
 * @access  Private
 */
export const likePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?._id;
    if (!userId) {
      throw new ApiError(401, 'Unauthorized');
    }
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) {
      throw new ApiError(404, 'Post not found');
    }
    
    const likeIndex = post.likes.indexOf(userId);
    if (likeIndex > -1) {
      post.likes.splice(likeIndex, 1);
    } else {
      post.likes.push(userId);
    }
    await post.save();
    
    res.json({ likes: post.likes });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add a comment to a post
 * @route   POST /api/posts/:id/comment
 * @access  Private
 */
export const commentPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?._id;
    if (!userId) {
      throw new ApiError(401, 'Unauthorized');
    }
    const { id } = req.params;
    const { content } = req.body;
    if (!content) {
      throw new ApiError(400, 'Comment content is required');
    }
    const post = await Post.findById(id);
    if (!post) {
      throw new ApiError(404, 'Post not found');
    }
    
    post.comments.push({
      author: userId,
      content,
      createdAt: new Date(),
    } as any);
    await post.save();
    
    const updatedPost = await Post.findById(id)
      .populate('comments.author', 'name profilePictureUrl role professionalTitle');
      
    res.status(201).json(updatedPost?.comments);
  } catch (error) {
    next(error);
  }
};
