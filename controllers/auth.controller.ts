
import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/user.model';
import Progress from '../models/progress.model';
import { generateToken } from '../services/token.service';
import ApiError from '../utils/ApiError';


const setAuthCookie = (res: Response, token: string, req?: Request) => {
  const cookieOptions: any = {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  };

  if (req) {
    const host = req.headers.host || '';
    const hostname = host.split(':')[0];
    if (hostname.endsWith('palycofoto.club')) {
      cookieOptions.domain = '.palycofoto.club';
    }
  }

  res.cookie('token', token, cookieOptions);
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
// Fix: Use Request, Response, NextFunction types from express to resolve property errors.
export const register = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;

  try {
    const isDbConnected = mongoose.connection.readyState === 1;
    
    if (!isDbConnected) {
      console.warn("⚠️ MongoDB is not connected. Returning mock registered user.");
      const mockUserId = new mongoose.Types.ObjectId().toString();
      const mockProgress = {
        _id: new mongoose.Types.ObjectId().toString(),
        xp: 0,
        streak: 0,
        completedLessons: new Map(),
        scores: new Map(),
        badgesEarned: new Map(),
        skillMastery: new Map(),
        learningProfile: { strengths: [], weaknesses: [], recommendations: [], lastAIUpdate: new Date() },
        skillGraph: {},
        lastLessonCompletedDate: null
      };
      const userResponse = {
        _id: mockUserId,
        name,
        email,
        profilePictureUrl: `https://ui-avatars.com/api/?name=${name?.charAt(0) || 'U'}&background=random&color=fff`,
        progress: mockProgress,
        currentPath: null,
      };
      const token = generateToken(mockUserId, {
        email,
        name,
        profilePictureUrl: userResponse.profilePictureUrl,
        role: 'student',
      });
      setAuthCookie(res, token, req);
      res.status(201).json({ ...userResponse, token });
      return;
    }

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

      const token = generateToken(user._id);
      setAuthCookie(res, token, req);

      res.status(201).json({
        ...userResponse,
        token,
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
    const isDbConnected = mongoose.connection.readyState === 1;

    if (!isDbConnected) {
      console.warn("⚠️ MongoDB is not connected. Simulating login for offline developer testing.");
      const mockUserId = new mongoose.Types.ObjectId().toString();
      const mockProgress = {
        _id: new mongoose.Types.ObjectId().toString(),
        xp: 150,
        streak: 3,
        completedLessons: new Map(),
        scores: new Map(),
        badgesEarned: new Map(),
        skillMastery: new Map(),
        learningProfile: { strengths: [], weaknesses: [], recommendations: [], lastAIUpdate: new Date() },
        skillGraph: {},
        lastLessonCompletedDate: new Date()
      };
      const userResponse = {
        _id: mockUserId,
        name: email.split('@')[0],
        email,
        profilePictureUrl: `https://ui-avatars.com/api/?name=${email.charAt(0).toUpperCase()}&background=random&color=fff`,
        progress: mockProgress,
        currentPath: "block_coding",
      };
      const token = generateToken(mockUserId, {
        email,
        name: userResponse.name,
        profilePictureUrl: userResponse.profilePictureUrl,
        role: 'student',
      });
      setAuthCookie(res, token, req);
      res.json({ ...userResponse, token });
      return;
    }

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
      
      const token = generateToken(user._id);
      setAuthCookie(res, token, req);

      res.json({
        ...userResponse,
        token,
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
    const isDbConnected = mongoose.connection.readyState === 1;

    if (!isDbConnected) {
      console.warn("⚠️ MongoDB is not connected. Returning mock user details.");
      const mockUserId = req.user?._id || new mongoose.Types.ObjectId().toString();
      const mockProgress = {
        _id: new mongoose.Types.ObjectId().toString(),
        xp: 150,
        streak: 3,
        completedLessons: new Map(),
        scores: new Map(),
        badgesEarned: new Map(),
        skillMastery: new Map(),
        learningProfile: { strengths: [], weaknesses: [], recommendations: [], lastAIUpdate: new Date() },
        skillGraph: {},
        lastLessonCompletedDate: new Date()
      };
      res.json({
        _id: mockUserId,
        name: req.user?.name || "Developer Wizard 🪄",
        email: req.user?.email || "wizard@codefortomorrow.org",
        profilePictureUrl: req.user?.profilePictureUrl || "https://ui-avatars.com/api/?name=W&background=random&color=fff",
        progress: mockProgress,
        currentPath: "block_coding",
        role: req.user?.role || "student",
      });
      return;
    }

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

        const isDbConnected = mongoose.connection.readyState === 1;
        if (!isDbConnected) {
            console.warn("⚠️ MongoDB is not connected. Simulating Google login via developer fallback.");
            const mockUserId = new mongoose.Types.ObjectId().toString();
            const mockProgress = {
                _id: new mongoose.Types.ObjectId().toString(),
                xp: 120,
                streak: 4,
                completedLessons: new Map(),
                scores: new Map(),
                badgesEarned: new Map(),
                skillMastery: new Map(),
                learningProfile: { strengths: [], weaknesses: [], recommendations: [], lastAIUpdate: new Date() },
                skillGraph: {},
                lastLessonCompletedDate: null
            };
            const userResponse = {
                _id: mockUserId,
                name,
                email,
                profilePictureUrl: picture || `https://ui-avatars.com/api/?name=${name?.charAt(0) || 'U'}&background=random&color=fff`,
                progress: mockProgress,
                currentPath: "block_coding",
                role: "student",
            };
            const appToken = generateToken(mockUserId, {
              email,
              name,
              profilePictureUrl: userResponse.profilePictureUrl,
              role: userResponse.role,
            });
            setAuthCookie(res, appToken, req);
            res.status(200).json({ ...userResponse, token: appToken });
            return;
        }

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

        setAuthCookie(res, appToken, req);

        res.status(200).json({
            ...userResponse,
            token: appToken,
        });

    } catch (error) {
        console.error("Google Auth Error:", error);
        next(new ApiError(401, 'Google authentication failed'));
    }
};

/**
 * @desc    Firebase Auth login (Verify Firebase ID token and authenticate)
 * @route   POST /api/auth/firebase
 * @access  Public
 */
export const firebaseLogin = async (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.body;

    if (!token) {
       return next(new ApiError(400, 'Firebase ID token is required'));
    }

    try {
        // Decode the Firebase ID Token
        const decodedToken: any = jwt.decode(token);
        if (!decodedToken) {
            throw new ApiError(400, 'Invalid Firebase ID token');
        }

        const email = decodedToken.email;
        const name = decodedToken.name || email.split('@')[0];
        const picture = decodedToken.picture || `https://ui-avatars.com/api/?name=${name?.charAt(0) || 'U'}&background=random&color=fff`;
        const googleId = decodedToken.sub; // Firebase user ID (uid)

        const isDbConnected = mongoose.connection.readyState === 1;
        if (!isDbConnected) {
            console.warn("⚠️ MongoDB is not connected. Simulating Firebase login via developer fallback.");
            const mockUserId = new mongoose.Types.ObjectId().toString();
            const mockProgress = {
                _id: new mongoose.Types.ObjectId().toString(),
                xp: 120,
                streak: 4,
                completedLessons: new Map(),
                scores: new Map(),
                badgesEarned: new Map(),
                skillMastery: new Map(),
                learningProfile: { strengths: [], weaknesses: [], recommendations: [], lastAIUpdate: new Date() },
                skillGraph: {},
                lastLessonCompletedDate: null
            };
            const userResponse = {
                _id: mockUserId,
                name,
                email,
                profilePictureUrl: picture,
                progress: mockProgress,
                currentPath: "block_coding",
                role: "student",
            };
            const appToken = generateToken(mockUserId, {
              email,
              name,
              profilePictureUrl: userResponse.profilePictureUrl,
              role: userResponse.role,
            });
            setAuthCookie(res, appToken, req);
            res.status(200).json({ ...userResponse, token: appToken });
            return;
        }

        // Find or create user
        let user = await User.findOne({ 
            $or: [{ googleId }, { email }] 
        }).populate('progress');

        if (!user) {
            const newProgress = await Progress.create({
                xp: 0,
                streak: 0,
                completedLessons: new Map(),
                scores: new Map(),
                badgesEarned: new Map(),
                skillMastery: new Map(),
                learningProfile: {
                    strengths: [],
                    weaknesses: [],
                    recommendations: [],
                    lastAIUpdate: new Date(),
                },
                skillGraph: {},
                lastLessonCompletedDate: null
            });

            user = await User.create({
                name,
                email,
                googleId,
                profilePictureUrl: picture,
                progress: newProgress._id,
            });
            user = await user.populate('progress');
        } else if (!user.googleId) {
             user.googleId = googleId;
             await user.save();
        }

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

        setAuthCookie(res, appToken, req);

        res.status(200).json({
            ...userResponse,
            token: appToken,
        });

    } catch (error) {
        console.error("Firebase Auth Error:", error);
        next(new ApiError(401, 'Firebase authentication failed'));
    }
};

/**
 * @desc    Log out a user (clear the token cookie)
 * @route   POST /api/auth/logout
 * @access  Private
 */
export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const clearOptions: any = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    };

    const host = req.headers.host || '';
    const hostname = host.split(':')[0];
    if (hostname.endsWith('palycofoto.club')) {
      clearOptions.domain = '.palycofoto.club';
    }

    res.clearCookie('token', clearOptions);
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};
