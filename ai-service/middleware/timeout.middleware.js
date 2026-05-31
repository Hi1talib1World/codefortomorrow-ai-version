export const requestTimeout = (timeoutMs = 30000) => {
  return (req, res, next) => {
    res.setTimeout(timeoutMs, () => {
      const err = new Error(`Request timed out after ${timeoutMs}ms`);
      err.status = 503;
      err.code = 'REQUEST_TIMEOUT';
      next(err);
    });
    next();
  };
};

export default requestTimeout;
