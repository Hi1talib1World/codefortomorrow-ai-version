export const validate = (schema) => {
  return (req, res, next) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      const err = new Error('Input validation failed');
      err.status = 400;
      err.code = 'VALIDATION_ERROR';
      err.message = error.errors 
        ? error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ') 
        : error.message;
      next(err);
    }
  };
};

export default validate;
