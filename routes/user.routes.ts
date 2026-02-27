
import express from 'express';
import { updateUserProfile, updateUserProgress } from '../controllers/user.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

// Apply the 'protect' middleware to all routes in this file.
// This ensures that only authenticated users can access these endpoints.
router.use(protect);

/**
 * @route   PUT /api/users/profile
 * @desc    Update the profile of the logged-in user
 * @access  Private
 */
router.put('/profile', updateUserProfile);

/**
 * @route   PUT /api/users/progress
 * @desc    Update the learning progress of the logged-in user
 * @access  Private
 */
router.put('/progress', updateUserProgress);

export default router;
