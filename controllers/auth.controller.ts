
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

import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * @desc    Google OAuth login (Receives token from frontend)
 * @route   POST /api/auth/google
 * @access  Public
 */
export const googleLogin = async (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.body;

    if (!token) {
       return next(new ApiError(400, 'Google token is required'));
    }

    try {
        // 1. Verify the Google Token
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID, 
        });
        
        const payload = ticket.getPayload();
        if (!payload || !payload.email) {
            throw new ApiError(400, 'Invalid Google token payload');
        }

        const { email, name, picture, sub: googleId } = payload;

        // 2. Check if the user already exists by Google ID or Email
        let user = await User.findOne({ 
            $or: [{ googleId }, { email }] 
        }).populate('progress');

        // 3. Create the user if they don't exist
        if (!user) {
            const newProgress = await Progress.create({});
            user = await User.create({
                name,
                email,
                googleId,
                profilePictureUrl: picture || `https://ui-avatars.com/api/?name=${name?.charAt(0) || 'U'}&background=random&color=fff`,
                progress: newProgress._id,
            });
            // Populate progress for the response
            user = await user.populate('progress');
        } else if (!user.googleId) {
             // If user existed via email but now logs in via Google, link the account
             user.googleId = googleId;
             if (!user.profilePictureUrl && picture) {
                 user.profilePictureUrl = picture;
             }
             await user.save();
        }

        // 4. Generate backend JWT Token
        const appToken = generateToken(user._id);

        const userResponse = {
            _id: user._id,
            name: user.name,
            email: user.email,
            profilePictureUrl: user.profilePictureUrl,
            progress: user.progress,
            currentPath: (user as any).currentPath,
            role: (user as any).role,
        };

        res.status(200).json({
            ...userResponse,
            token: appToken,
        });

    } catch (error) {
        console.error("Google Auth Error:", error);
        next(new ApiError(401, 'Google authentication failed'));
    }
};
