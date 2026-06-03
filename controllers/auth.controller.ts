
import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import admin from 'firebase-admin';
import User from '../models/user.model';
import Progress from '../models/progress.model';
import { generateToken } from '../services/token.service';
import ApiError from '../utils/ApiError';

const initializeFirebaseAdmin = () => {
  if (admin.apps.length > 0) {
    return admin.app();
  }

  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    return admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    });
  }

  if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    throw new Error(
      'Firebase admin credentials are not configured. Set FIREBASE_SERVICE_ACCOUNT_KEY or GOOGLE_APPLICATION_CREDENTIALS.'
    );
  }

  return admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
};

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
      console.warn("⚠️ MongoDB is not connected. Registration cannot proceed.");
      throw new ApiError(503, 'Service unavailable: database connection is required to register users.');
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
      console.warn("⚠️ MongoDB is not connected. Login cannot proceed.");
      throw new ApiError(503, 'Service unavailable: database connection is required to authenticate users.');
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
      console.warn("⚠️ MongoDB is not connected. User profile cannot be retrieved.");
      throw new ApiError(503, 'Service unavailable: database connection is required to retrieve user profile.');
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
            console.warn("⚠️ MongoDB is not connected. Google login cannot proceed.");
            throw new ApiError(503, 'Service unavailable: database connection is required for Google authentication.');
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
                emailVerified: true,
            });
            // Populate progress for the response
            user = await user.populate('progress');
        } else {
             let changed = false;
             if (!user.googleId) {
                 user.googleId = googleId;
                 changed = true;
             }
             if (!user.profilePictureUrl && picture) {
                 user.profilePictureUrl = picture;
                 changed = true;
             }
             if (!user.emailVerified) {
                 user.emailVerified = true;
                 changed = true;
             }
             if (changed) {
                 await user.save();
             }
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
    const token =
      req.body.token ||
      req.body.idToken ||
      req.body.id_token;

    console.log('Firebase auth endpoint hit');
    console.log('Token received:', !!token);

    if (!token) {
       return next(new ApiError(400, 'Firebase ID token is required'));
    }

    try {
        let decodedToken: any;
        const hasAdminCredentials = !!(process.env.FIREBASE_SERVICE_ACCOUNT_KEY || process.env.GOOGLE_APPLICATION_CREDENTIALS);

        if (!hasAdminCredentials) {
            console.warn('⚠️ Firebase admin credentials are not configured. Decoding token without signature verification (Development Mode Only).');
            decodedToken = jwt.decode(token);
            if (!decodedToken) {
                throw new ApiError(400, 'Invalid Firebase ID token format');
            }
        } else {
            console.log('Verifying Firebase token using Admin SDK...');
            const firebaseAdmin = initializeFirebaseAdmin();
            decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
        }

        if (!decodedToken) {
            throw new ApiError(400, 'Invalid Firebase ID token');
        }

        const emailVerified = decodedToken.email_verified ?? decodedToken.emailVerified;
        const isPasswordProvider = decodedToken.firebase?.sign_in_provider === 'password';

        const email = decodedToken.email;
        const googleId = decodedToken.uid || decodedToken.sub;

        // Query the database for the user to determine if they are an existing account
        const existingUser = await User.findOne({ 
            $or: [{ googleId }, { email }] 
        });

        // Threshold cutoff date: June 3, 2026. Only users created on/after this require email verification.
        const registrationThreshold = new Date('2026-06-03T00:00:00.000Z');
        const userNeedsVerification = !existingUser || (existingUser && existingUser.createdAt >= registrationThreshold);

        if (hasAdminCredentials && isPasswordProvider && emailVerified === false && userNeedsVerification) {
             console.log('Blocking unverified login attempt for email:', decodedToken.email);
             throw new ApiError(401, 'Please verify your email address before logging in.');
        }

        console.log('Firebase ID token decoded:', {
          uid: googleId,
          email: email,
          name: decodedToken.name,
          picture: decodedToken.picture,
        });

        const name = decodedToken.name || (email ? email.split('@')[0] : 'User');
        const picture = decodedToken.picture || `https://ui-avatars.com/api/?name=${name?.charAt(0) || 'U'}&background=random&color=fff`;

        const isDbConnected = mongoose.connection.readyState === 1;
        if (!isDbConnected) {
            console.warn("⚠️ MongoDB is not connected. Firebase login cannot proceed.");
            throw new ApiError(503, 'Service unavailable: database connection is required for Firebase authentication.');
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
                emailVerified: emailVerified,
            });
            user = await user.populate('progress');
        } else {
             let changed = false;
             if (!user.googleId) {
                 user.googleId = googleId;
                 changed = true;
             }
             if (user.emailVerified !== emailVerified) {
                 user.emailVerified = emailVerified;
                 changed = true;
             }
             if (changed) {
                 await user.save();
             }
        }

        console.log('Firebase auth found/created user:', {
          id: user._id,
          email: user.email,
          googleId: user.googleId,
        });

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

    } catch (error: any) {
        console.error('Firebase verify failed: raw error:', error);
        try {
          console.error('Firebase verify failed: error JSON', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
        } catch (jsonErr) {
          console.error('Firebase verify failed: error JSON stringify failed', jsonErr);
        }
        console.error('Firebase Auth Error code:', error?.code, 'message:', error?.message, 'errorInfo:', error?.errorInfo);
        const firebaseErrorMessage =
          error?.message ||
          error?.code ||
          error?.errorInfo?.message ||
          (typeof error === 'string' ? error : undefined) ||
          (error?.toString && error.toString() !== '[object Object]' ? error.toString() : 'Unknown Firebase auth error');
        next(new ApiError(401, `Firebase authentication failed [PATCHED]: ${firebaseErrorMessage}`));
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
