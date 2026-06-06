import express from 'express';
import {
  getPosts,
  createPost,
  likePost,
  commentPost,
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

export default router;
