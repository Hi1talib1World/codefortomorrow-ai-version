
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
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header (format: "Bearer <token>")
      token = req.headers.authorization.split(' ')[1];

      // Verify the token using the secret
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };

      // Attach the user's document from the database to the request object
      // so our controllers can identify the user and verify roles/permissions.
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
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};
