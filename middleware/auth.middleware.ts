import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import User from '../models/user.model';

// Augment Express Request type to include our user payload
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

/**
 * Middleware to protect routes that require authentication.
 * It verifies the JWT stored in the cookie or Authorization header.
 */
export const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token: string | undefined;

  // 1. Check cookies first
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  // 2. Fall back to Authorization header
  else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  console.log('COOKIES:', req.cookies);
  console.log('TOKEN:', req.cookies?.token);

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    // Try to verify as our backend JWT first
    const secret = process.env.JWT_SECRET || 'dev-secret';
    const decoded = jwt.verify(token, secret) as { id: string };
    console.log('TOKEN TYPE: Backend JWT');
    console.log('VERIFY METHOD: jwt.verify');

    const isDbConnected = require('mongoose').connection.readyState === 1;
    let user;

    if (isDbConnected) {
      user = await User.findById(decoded.id).select('-password');
    } else {
      // Mock user for offline dev
      user = {
        _id: decoded.id,
        name: 'Developer Wizard 🪄',
        email: 'wizard@codefortomorrow.org',
        profilePictureUrl: 'https://ui-avatars.com/api/?name=W&background=random&color=fff',
        role: 'student',
      };
    }

    if (!user) {
      return res.status(401).json({ message: 'Not authorized, user not found' });
    }

    req.user = user;
    next();
  } catch (jwtError) {
    console.warn('Backend JWT verification failed, trying Firebase ID token', jwtError);
    // Fallback: try Firebase Admin verification (for tokens coming directly from client)
    try {
      const admin = require('firebase-admin');
      if (!admin.apps.length) {
        admin.initializeApp({
          credential: admin.credential.applicationDefault(),
        });
      }
      const decodedToken = await admin.auth().verifyIdToken(token);
      console.log('TOKEN TYPE: Firebase ID Token');
      console.log('VERIFY METHOD: admin.auth().verifyIdToken');

      const uid = decodedToken.uid;
      const isDbConnected = require('mongoose').connection.readyState === 1;
      let user;

      if (isDbConnected) {
        user = await User.findById(uid).select('-password');
      } else {
        user = {
          _id: uid,
          name: decodedToken.name || 'Developer Wizard 🪄',
          email: decodedToken.email || 'wizard@codefortomorrow.org',
          profilePictureUrl:
            decodedToken.picture ||
            'https://ui-avatars.com/api/?name=W&background=random&color=fff',
          role: decodedToken.role || 'student',
        };
      }

      if (!user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      req.user = user;
      next();
    } catch (firebaseError) {
      console.error('Auth verification error:', firebaseError);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }
};
