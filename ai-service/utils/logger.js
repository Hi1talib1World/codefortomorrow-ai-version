export const logger = {
  info: (message, meta = {}) => {
    console.log(JSON.stringify({ timestamp: new Date().toISOString(), level: 'INFO', message, ...meta }));
  },
  warn: (message, meta = {}) => {
    console.warn(JSON.stringify({ timestamp: new Date().toISOString(), level: 'WARN', message, ...meta }));
  },
  error: (message, meta = {}) => {
    let errorDetails = {};
    if (meta instanceof Error) {
      errorDetails = {
        errorMessage: meta.message,
        errorStack: meta.stack
      };
      meta = {};
    } else if (meta.error instanceof Error) {
      errorDetails = {
        errorMessage: meta.error.message,
        errorStack: meta.error.stack
      };
    }
    console.error(JSON.stringify({ 
      timestamp: new Date().toISOString(), 
      level: 'ERROR', 
      message, 
      ...meta, 
      ...errorDetails 
    }));
  }
};

export default logger;
