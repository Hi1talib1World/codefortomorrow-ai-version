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
    const { content, milestone, postType, codeSnippet } = req.body;
    if (!content) {
      throw new ApiError(400, 'Content is required');
    }
    const post = await Post.create({
      author: userId,
      content,
      milestone,
      postType: postType || 'general',
      codeSnippet,
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
      isAnswer: false,
      isEndorsed: false,
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

/**
 * @desc    Toggle solved state for a question post
 * @route   PUT /api/posts/:id/solve
 * @access  Private
 */
export const toggleSolvedPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?._id;
    const userRole = (req as any).user?.role;
    if (!userId) {
      throw new ApiError(401, 'Unauthorized');
    }
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) {
      throw new ApiError(404, 'Post not found');
    }
    
    // Only post author or teacher/admin can mark it as solved
    if (post.author.toString() !== userId.toString() && userRole !== 'teacher' && userRole !== 'admin') {
      throw new ApiError(403, 'Permission denied');
    }
    
    post.isSolved = !post.isSolved;
    await post.save();
    
    res.json({ isSolved: post.isSolved });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Toggle helpful/answer state for a comment
 * @route   PUT /api/posts/:id/comment/:commentId/helpful
 * @access  Private
 */
export const toggleHelpfulComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?._id;
    const userRole = (req as any).user?.role;
    if (!userId) {
      throw new ApiError(401, 'Unauthorized');
    }
    const { id, commentId } = req.params;
    const post = await Post.findById(id);
    if (!post) {
      throw new ApiError(404, 'Post not found');
    }
    
    // Only post author or teacher/admin can toggle helpful answers
    if (post.author.toString() !== userId.toString() && userRole !== 'teacher' && userRole !== 'admin') {
      throw new ApiError(403, 'Permission denied');
    }
    
    const comment = (post.comments as any).id(commentId);
    if (!comment) {
      throw new ApiError(404, 'Comment not found');
    }
    
    comment.isAnswer = !comment.isAnswer;
    await post.save();
    
    const updatedPost = await Post.findById(id)
      .populate('comments.author', 'name profilePictureUrl role professionalTitle');
      
    res.json(updatedPost?.comments);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Toggle endorsed state for a comment
 * @route   PUT /api/posts/:id/comment/:commentId/endorse
 * @access  Private (Teachers/Admins only)
 */
export const toggleEndorseComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?._id;
    const userRole = (req as any).user?.role;
    if (!userId) {
      throw new ApiError(401, 'Unauthorized');
    }
    if (userRole !== 'teacher' && userRole !== 'admin') {
      throw new ApiError(403, 'Permission denied. Only educators can endorse comments.');
    }
    
    const { id, commentId } = req.params;
    const post = await Post.findById(id);
    if (!post) {
      throw new ApiError(404, 'Post not found');
    }
    
    const comment = (post.comments as any).id(commentId);
    if (!comment) {
      throw new ApiError(404, 'Comment not found');
    }
    
    comment.isEndorsed = !comment.isEndorsed;
    await post.save();
    
    const updatedPost = await Post.findById(id)
      .populate('comments.author', 'name profilePictureUrl role professionalTitle');
      
    res.json(updatedPost?.comments);
  } catch (error) {
    next(error);
  }
};
