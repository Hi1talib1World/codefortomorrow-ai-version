
import express from 'express';
import { register, login, getMe, googleLogin } from '../controllers/auth.controller';
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
 * @route   POST /api/auth/google
 * @desc    Verify Google Token and login/register
 * @access  Public
 */
router.post('/google', googleLogin);

/**
 * @route   GET /api/auth/me
 * @desc    Get the profile of the currently logged-in user
 * @access  Private (requires JWT)
 */
router.get('/me', protect, getMe);

export default router;
