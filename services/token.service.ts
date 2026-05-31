
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

/**
 * Generates a JSON Web Token (JWT) for a given user ID.
 * @param {mongoose.Types.ObjectId | string} userId - The user's ID to embed in the token.
 * @returns {string} The generated JWT.
 */
export const generateToken = (userId: mongoose.Types.ObjectId | string): string => {
  const payload = {
    id: userId.toString(),
  };

  // In a real app, JWT_EXPIRES_IN would also be in the .env file for configuration.
  const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: '30d',
  });
  console.log('Generated backend JWT:', token);
  return token;
};

const tokenService = {
  generateToken,
};

export default tokenService;
