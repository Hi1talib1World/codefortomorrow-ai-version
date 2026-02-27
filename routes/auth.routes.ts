
import express from 'express';
import { register, login, getMe, googleCallback } from '../controllers/auth.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', register);

/**
 * @route   POST /api/auth/login
 * @desc    Log in a user
 * @access  Public
 */
router.post('/login', login);

/**
 * @route   GET /api/auth/google
 * @desc    Initiate Google OAuth flow (conceptual)
 * @access  Public
 */
// In a real app, this would use a library like Passport.js:
// router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

/**
 * @route   GET /api/auth/me
 * @desc    Get the profile of the currently logged-in user
 * @access  Private (requires JWT)
 */
router.get('/me', protect, getMe);

export default router;
