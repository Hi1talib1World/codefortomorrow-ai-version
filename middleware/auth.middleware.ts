import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
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
 * It verifies the JWT stored in the cookie.
 * When MongoDB is not connected, it falls back to using JWT-decoded data
 * so controllers can serve mock responses for offline development.
 */
export const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization?.toString();
    const token = req.cookies?.token || (authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : undefined);

    if (!token) {
      return res.status(401).json({ message: "No token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

    // Check if MongoDB is actually connected before querying it.
    // readyState: 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
    const isDbConnected = mongoose.connection.readyState === 1;

    if (!isDbConnected) {
      console.warn("⚠️ MongoDB not connected. Authentication cannot proceed.");
      return res.status(503).json({ message: 'Service unavailable: database connection is required for authentication.' });
    }

    const user = await User.findById((decoded as any).id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("AUTH ERROR:", err.message);
    return res.status(401).json({ message: "Invalid token" });
  }
};
