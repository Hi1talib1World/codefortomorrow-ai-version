import { Request, Response, NextFunction } from 'express';
import User from '../models/user.model';
import ApiError from '../utils/ApiError';

/**
 * @desc  Middleware that verifies the authenticated user is an admin.
 *        Must be chained AFTER the `protect` middleware (which sets req.user).
 *        Double-checks:
 *          1. User's role in MongoDB === 'admin'
 *          2. User's email is in the ADMIN_EMAILS allowlist (comma-separated env var)
 */
export const adminOnly = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user?.id) {
      return next(new ApiError(401, 'Not authorized'));
    }

    const user = await User.findById(req.user.id).select('email role');
    if (!user) {
      return next(new ApiError(401, 'User not found'));
    }

    // Check role in DB
    if ((user as any).role !== 'admin') {
      return next(new ApiError(403, 'Forbidden: Admin access only'));
    }

    // Check email allowlist
    const allowedEmails = (process.env.ADMIN_EMAILS || '')
      .split(',')
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);

    if (allowedEmails.length > 0 && !allowedEmails.includes(user.email.toLowerCase())) {
      return next(new ApiError(403, 'Forbidden: Email not in admin allowlist'));
    }

    next();
  } catch (error) {
    next(error);
  }
};
