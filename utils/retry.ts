/**
 * Retries an asynchronous function a specified number of times with exponential backoff.
 * 
 * @param fn The asynchronous function to execute
 * @param retries Maximum number of retries (default: 3)
 * @param delay Initial delay in milliseconds (default: 1000)
 * @param context Helpful text to identify what failed in the logs
 */
export const withRetry = async <T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 1000,
  context = 'Operation'
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 1) {
      console.error(`❌ [Retry] All attempts failed for: "${context}". Final error:`, error);
      throw error;
    }
    console.warn(`⚠️ [Retry] Failed attempt for: "${context}". Retrying in ${delay}ms... (${retries - 1} attempts left). Error:`, (error as Error).message);
    await new Promise((resolve) => setTimeout(resolve, delay));
    return withRetry(fn, retries - 1, delay * 2, context);
  }
};
