import express from 'express';
import {
  getPosts,
  createPost,
  likePost,
  commentPost,
  toggleSolvedPost,
  toggleHelpfulComment,
  toggleEndorseComment,
} from './post.controller';
import { protect } from '../../core/permissions/auth.middleware';

const router = express.Router();

// Apply authentication middleware to protect all post/feed routes
router.use(protect);

router.route('/')
  .get(getPosts)
  .post(createPost);

router.put('/:id/like', likePost);
router.post('/:id/comment', commentPost);
router.put('/:id/solve', toggleSolvedPost);
router.put('/:id/comment/:commentId/helpful', toggleHelpfulComment);
router.put('/:id/comment/:commentId/endorse', toggleEndorseComment);

export default router;
