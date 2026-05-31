import logger from '../utils/logger.js';

export const requestLogger = (req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      url: req.originalUrl || req.url,
      ip: req.ip,
      status: res.statusCode,
      responseTimeMs: duration,
    };
    
    if (res.statusCode >= 500) {
      logger.error(`Request failed: ${req.method} ${logData.url}`, logData);
    } else if (res.statusCode >= 400) {
      logger.warn(`Client error response: ${req.method} ${logData.url}`, logData);
    } else {
      logger.info(`Request completed: ${req.method} ${logData.url}`, logData);
    }
  });
  next();
};

export default requestLogger;
