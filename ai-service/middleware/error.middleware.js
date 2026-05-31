import logger from '../utils/logger.js';

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.status || err.statusCode || 500;
  const errorCode = err.code || 'INTERNAL_SERVER_ERROR';
  
  const responseError = {
    success: false,
    error: {
      message: err.message || 'An unexpected error occurred.',
      code: errorCode,
    }
  };

  if (process.env.NODE_ENV !== 'production') {
    responseError.error.stack = err.stack;
  }

  logger.error(`Error processing request: ${req.method} ${req.originalUrl || req.url}`, {
    error: err,
    status: statusCode,
    code: errorCode,
  });

  return res.status(statusCode).json(responseError);
};

export default errorHandler;
