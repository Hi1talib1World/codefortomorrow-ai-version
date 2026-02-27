
import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/user.model';
import Progress from '../models/progress.model';
import { generateToken } from '../services/token.service';
import ApiError from '../utils/ApiError';

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
// Fix: Use Request, Response, NextFunction types from express to resolve property errors.
export const register = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      throw new ApiError(400, 'User already exists');
    }

    // Each new user gets a corresponding progress document.
    const newProgress = await Progress.create({});

    const user = await User.create({
      name,
      email,
      password,
      progress: newProgress._id,
    });

    if (user) {
      // We don't want to send the password back, even if it's hashed.
      const userResponse = {
        _id: user._id,
        name: user.name,
        email: user.email,
        profilePictureUrl: user.profilePictureUrl,
        progress: newProgress,
        currentPath: null,
      };

      res.status(201).json({
        ...userResponse,
        token: generateToken(user._id),
      });
    } else {
      throw new ApiError(400, 'Invalid user data');
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Authenticate a user
 * @route   POST /api/auth/login
 * @access  Public
 */
// Fix: Use Request, Response, NextFunction types from express to resolve property errors.
export const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).populate('progress');

    if (user && (await bcrypt.compare(password, user.password || ''))) {
      
      const userResponse = {
        _id: user._id,
        name: user.name,
        email: user.email,
        profilePictureUrl: user.profilePictureUrl,
        progress: user.progress,
        currentPath: (user as any).currentPath,
      };
      
      res.json({
        ...userResponse,
        token: generateToken(user._id),
      });
    } else {
      throw new ApiError(401, 'Invalid email or password');
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
// Fix: Use Request, Response, NextFunction types from express to resolve property errors.
export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // @ts-ignore
    const user = await User.findById(req.user.id).select('-password').populate('progress');
    if (!user) {
        throw new ApiError(404, 'User not found');
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Google OAuth callback (conceptual)
 * @route   GET /api/auth/google/callback
 * @access  Public
 */
// Fix: Use Request, Response, NextFunction types from express to resolve property errors.
export const googleCallback = async (req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore
    const googleProfile = req.user;

    try {
        // @ts-ignore
        let user = await User.findOne({ googleId: googleProfile.id });

        if (!user) {
            const newProgress = await Progress.create({});
            user = await User.create({
                // @ts-ignore
                name: googleProfile.displayName,
                // @ts-ignore
                email: googleProfile.emails[0].value,
                // @ts-ignore
                googleId: googleProfile.id,
                // @ts-ignore
                profilePictureUrl: googleProfile.photos[0].value,
                progress: newProgress._id,
            });
        }
        
        const token = generateToken(user._id);

        res.status(200).json({
            message: "Google Auth successful",
            token: token,
            user: user,
        });

    } catch (error) {
        next(error);
    }
};
