//src/utils/tokenManager.js
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'your-refresh-secret';

export const generateTokens = (userId, role) => {
//  console.log('Generating tokens for userId:', userId, 'with role:', role); // Debugging statement

  // Create access token with userId and role in the payload
  const accessToken = jwt.sign(
    { userId, role }, // Added role to payload
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  // Create refresh token with userId and role in the payload
  const refreshToken = jwt.sign(
    { userId, role }, // Added role to payload
    REFRESH_SECRET,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
};


export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET); // Attempt to verify access token
  } catch (error) {
    console.error('Token verification failed:', error); // Error handling
    return null;
  }
};


export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, REFRESH_SECRET); // Attempt to verify refresh token
  } catch (error) {
    console.error('Refresh token verification failed:', error); // Error handling
    return null;
  }
};

