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
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: "No token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

    // Check if MongoDB is actually connected before querying it.
    // readyState: 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
    const isDbConnected = mongoose.connection.readyState === 1;

    if (!isDbConnected) {
      // DB is not available — set req.user from the JWT payload so controllers
      // can use their existing mock-data fallback paths.
      console.warn("⚠️ MongoDB not connected. Auth middleware using JWT payload only.");
      req.user = {
        _id: (decoded as any).id,
        id: (decoded as any).id,
        name: "Developer Wizard 🪄",
        email: "wizard@codefortomorrow.org",
        profilePictureUrl: "https://ui-avatars.com/api/?name=W&background=random&color=fff",
        role: "student",
      };
      return next();
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
