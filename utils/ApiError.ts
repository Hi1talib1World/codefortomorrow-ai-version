
/**
 * Custom error class for API-specific errors.
 * Extends the built-in Error class to include an HTTP status code.
 * This allows for more structured error handling in our middleware.
 */
class ApiError extends Error {
  public statusCode: number;

  /**
   * Creates an instance of ApiError.
   * @param {number} statusCode - The HTTP status code (e.g., 400, 404, 500).
   * @param {string} message - A descriptive error message.
   */
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;

    // Fix: Using a type cast for Error constructor to access captureStackTrace if available.
    if ((Error as any).captureStackTrace) {
      (Error as any).captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
