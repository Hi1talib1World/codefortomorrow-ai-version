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
      // DB is not available — set req.user from the JWT payload so controllers
      // can use their existing mock-data fallback paths.
      console.warn("⚠️ MongoDB not connected. Auth middleware using JWT payload only.");
      const decodedAny = decoded as any;
      const name = decodedAny.name || decodedAny.email?.split('@')[0] || 'Offline User';
      const email = decodedAny.email || `offline_${decodedAny.id}@codefortomorrow.com`;
      req.user = {
        _id: decodedAny.id,
        id: decodedAny.id,
        name,
        email,
        profilePictureUrl:
          decodedAny.profilePictureUrl ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff`,
        role: decodedAny.role || 'student',
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
