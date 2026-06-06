import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import User from '../../../src/models/user.model';

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
 * It verifies the JWT stored in the cookie or authorization header.
 * If the database is unavailable, authentication is blocked.
 */
export const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization?.toString();
    const token = req.cookies?.token || 
                  req.query.token?.toString() || 
                  (authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : undefined);

    if (!token) {
      return res.status(401).json({ error: 'No token' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    console.log('Protected JWT payload:', decoded);

    const isDbConnected = mongoose.connection.readyState === 1;
    if (!isDbConnected) {
      console.warn('⚠️ MongoDB not connected. Authentication cannot proceed.');
      return res.status(503).json({ error: 'Database unavailable' });
    }

    const user = await User.findById((decoded as any).id).select('-password');
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = user;
    return next();
  } catch (err) {
    console.error('AUTH ERROR:', (err as Error).message);
    return res.status(401).json({ error: 'Invalid token' });
  }
};
