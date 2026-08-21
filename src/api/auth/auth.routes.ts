
import express from 'express';
import rateLimit from 'express-rate-limit';
import { register, login, getMe, googleLogin, firebaseLogin, logout } from './auth.controller';
import { protect } from '../../../src/core/permissions/auth.middleware';

// Stricter rate limiter for authentication routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10000,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => !process.env.NODE_ENV || process.env.NODE_ENV === 'development',
  message: { message: 'Too many login or registration attempts, please try again after 15 minutes' },
});

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', authLimiter, register);

/**
 * @route   POST /api/auth/login
 * @desc    Log in a user
 * @access  Public
 */
router.post('/login', authLimiter, login);

/**
 * @route   POST /api/auth/google
 * @desc    Verify Google Token and login/register
 * @access  Public
 */
router.post('/google', authLimiter, googleLogin);

/**
 * @route   POST /api/auth/firebase
 * @desc    Verify Firebase Token and login/register
 * @access  Public
 */
router.post('/firebase', authLimiter, firebaseLogin);

/**
 * @route   GET /api/auth/me
 * @desc    Get the profile of the currently logged-in user
 * @access  Private (requires JWT)
 */
router.get('/me', protect, getMe);

/**
 * @route   POST /api/auth/logout
 * @desc    Log out the user (clears auth cookie)
 * @access  Private (requires JWT)
 */
router.post('/logout', protect, logout);

export default router;
