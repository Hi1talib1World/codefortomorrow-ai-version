
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

export interface TokenPayload {
  id: string;
  email?: string;
  name?: string;
  profilePictureUrl?: string;
  role?: string;
}

/**
 * Generates a JSON Web Token (JWT) for a given user ID and optional user metadata.
 * @param {mongoose.Types.ObjectId | string} userId - The user's ID to embed in the token.
 * @param {Partial<TokenPayload>} [extraData] - Optional extra metadata to include in the token.
 * @returns {string} The generated JWT.
 */
export const generateToken = (
  userId: mongoose.Types.ObjectId | string,
  extraData: Partial<TokenPayload> = {}
): string => {
  const payload: TokenPayload = {
    id: userId.toString(),
    ...extraData,
  };

  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured.');
  }

  const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: '30d',
  });
  return token;
};

const tokenService = {
  generateToken,
};

export default tokenService;
