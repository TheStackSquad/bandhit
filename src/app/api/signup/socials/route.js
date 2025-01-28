// src/app/api/signup/social/route.js

// src/app/api/signup/social/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import SocialSignUp from '@/schemas/models/SocialSignUp';
import { socialSignUpSchema } from '@/schemas/validationSchema/userSchema';
import { verifyToken } from '@/utils/tokenManager';

// Helper function to format error responses
const createErrorResponse = (message, status = 400) => {
  return NextResponse.json(
    { success: false, message },
    { status }
  );
};

// Helper function to format success responses
const createSuccessResponse = (data, status = 200) => {
  return NextResponse.json(
    { success: true, data },
    { status }
  );
};

// POST: Create or update social sign-up
export async function POST(request) {
  try {
    // Connect to database
    await dbConnect();

    // Parse request body
    const body = await request.json();

    try {
      // Validate request data against schema
      await socialSignUpSchema.validate(body, { abortEarly: false });
    } catch (validationError) {
      return createErrorResponse('Validation failed: ' + validationError.errors.join(', '));
    }

    const { email, socialProvider, socialId } = body;

    // Check if user already exists
    let user = await SocialSignUp.findOne({ email: email.toLowerCase() });

    if (user) {
      // Update existing user's social account information
      if (user.socialAccounts[socialProvider]?.id === socialId) {
        // User already registered with this social account
        return createSuccessResponse({
          message: 'User already registered with this social account',
          user
        });
      }

      // Add new social account to existing user
      user.socialAccounts[socialProvider] = {
        id: socialId,
        email: email
      };
      user.lastLogin = new Date();
      await user.save();

      return createSuccessResponse({
        message: 'Social account added to existing user',
        user
      });
    }

    // Create new user with social account
    const newUser = new SocialSignUp({
      email: email.toLowerCase(),
      socialAccounts: {
        [socialProvider]: {
          id: socialId,
          email: email
        }
      },
      lastLogin: new Date()
    });

    await newUser.save();

    return createSuccessResponse({
      message: 'User successfully created',
      user: newUser
    }, 201);

  } catch (error) {
    console.error('Social signup error:', error);
    return createErrorResponse(
      'Internal server error during social signup',
      500
    );
  }
}

// GET: Retrieve user's social signup information
export async function GET(request) {
  try {
    // Connect to database
    await dbConnect();

    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return createErrorResponse('Authorization token required', 401);
    }

    // Verify token and extract user email
    const token = authHeader.split(' ')[1];
    const decoded = await verifyToken(token);
    if (!decoded?.email) {
      return createErrorResponse('Invalid token', 401);
    }

    // Find user by email
    const user = await SocialSignUp.findOne({ email: decoded.email.toLowerCase() });
    if (!user) {
      return createErrorResponse('User not found', 404);
    }

    // Update last login time
    user.lastLogin = new Date();
    await user.save();

    return createSuccessResponse({
      message: 'User information retrieved successfully',
      user
    });

  } catch (error) {
    console.error('Error retrieving social signup info:', error);
    return createErrorResponse(
      'Internal server error while retrieving user information',
      500
    );
  }
}

// Helper function to validate social provider
//eslint-disable-next-line
export async function validateSocialProvider(provider, token) {
  // This function would contain provider-specific validation logic
  switch (provider) {
    case 'google':
      // Verify Google token with Google OAuth API
      break;
    case 'facebook':
      // Verify Facebook token with Facebook Graph API
      break;
    case 'linkedin':
      // Verify LinkedIn token with LinkedIn API
      break;
    case 'twitter':
      // Verify Twitter token with Twitter API
      break;
    default:
      throw new Error('Invalid social provider');
  }
}