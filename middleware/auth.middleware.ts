
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import User from '../models/user.model';

// Augment Express Request type to include our user payload from the JWT
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

/**
 * @desc Middleware to protect routes that require authentication.
 * It verifies the JWT from the Authorization header.
 */
// Fix: Use Request, Response, NextFunction types from express to resolve property errors.
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

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
    return;
  }

  try {
    // Verify the token using the secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };

    // Attach the user's document from the database to the request object
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      res.status(401).json({ message: 'Not authorized, user not found' });
      return;
    }

    req.user = user;
    next(); // Proceed to the next middleware or the controller function
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Not authorized, token failed' });
    return;
  }
};
