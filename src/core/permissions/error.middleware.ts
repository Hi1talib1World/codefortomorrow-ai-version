import { Request, Response, NextFunction } from 'express';
import ApiError from '../../utils/ApiError';

/**
 * @desc    Global error handling middleware.
 *          This should be the last middleware added to the Express app.
 *          It catches any errors passed to `next()` from other parts of the application.
 */
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  let statusCode = 500;
  let message = 'An internal server error occurred.';

  // If the error is an instance of our custom ApiError, use its properties
  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
  } else {
    // For unexpected errors, log them to the console for debugging
    console.error('UNEXPECTED ERROR:', err);
  }
  
  res.status(statusCode);

  res.json({
    message: message,
    // Only show stack trace in development environment
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};
