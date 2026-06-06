
import express from 'express';
import { updateUserProfile, updateUserProgress, getTeachers, toggleSaveItem, searchUsers, getLeaderboard } from './user.controller';
import { getMe } from '../auth/auth.controller';
import { protect } from '../../../src/core/permissions/auth.middleware';

const router = express.Router();

// Apply the 'protect' middleware to all routes in this file.
// This ensures that only authenticated users can access these endpoints.
router.use(protect);

/**
 * @route   GET /api/users/leaderboard
 * @desc    Get top users ranked by XP
 * @access  Private
 */
router.get('/leaderboard', getLeaderboard);

/**
 * @route   GET /api/users/search
 * @desc    Search registered users by name
 * @access  Private
 */
router.get('/search', searchUsers);

/**
 * @route   GET /api/users/teachers
 * @desc    Get all teachers
 * @access  Private
 */
router.get('/teachers', getTeachers);

/**
 * @route   GET /api/users/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me', getMe);

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

/**
 * @route   PUT /api/users/save
 * @desc    Toggle saving a repository or blog post
 * @access  Private
 */
router.put('/save', toggleSaveItem);

export default router;
