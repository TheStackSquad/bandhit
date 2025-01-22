// src/app/api/signup/route.js
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/utils/dbConnect';
import User from '@/schemas/models/User';
import { signUpSchema, socialSignUpSchema } from '@/schemas/validationSchema/userSchema';
import { getToken } from 'next-auth/jwt';

export async function POST(request) {
  try {
    // Connect to database
    await dbConnect();

    // Parse request body
    const body = await request.json();
    const isSocialSignup = body.socialProvider && body.socialProvider !== 'email';

    try {
      // Validate request data against appropriate schema
      if (isSocialSignup) {
        await socialSignUpSchema.validate(body, { abortEarly: false });
      } else {
        await signUpSchema.validate(body, { abortEarly: false });
      }
    } catch (validationError) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Validation failed', 
          errors: validationError.errors 
        }, 
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [
        { email: body.email.toLowerCase() },
        // Check social accounts if it's a social signup
        ...(isSocialSignup ? [{
          'socialAccounts.providerId': body.providerId,
          'socialAccounts.provider': body.socialProvider
        }] : [])
      ]
    });

    if (existingUser) {
      // If user exists and it's a social signup, update their social accounts
      if (isSocialSignup) {
        const hasProvider = existingUser.socialAccounts?.some(
          account => account.provider === body.socialProvider
        );

        if (!hasProvider) {
          existingUser.socialAccounts.push({
            provider: body.socialProvider,
            providerId: body.providerId,
            email: body.email,
            lastUsed: new Date()
          });

          await existingUser.save();

          const userResponse = existingUser.toObject();
          delete userResponse.password;

          return NextResponse.json({
            success: true,
            message: 'Social account linked successfully',
            user: userResponse
          }, { status: 200 });
        }
      }

      return NextResponse.json(
        { 
          success: false, 
          message: 'Account already exists with this email' 
        }, 
        { status: 409 }
      );
    }

    // Prepare user data
    const userData = {
      name: body.name.trim(),
      email: body.email.toLowerCase().trim(),
      phoneNumber: body.phoneNumber,
      isAdult: body.isAdult,
      city: body.city?.trim(),
      referralSource: body.referralSource,
      socialProvider: body.socialProvider || 'email',
      socialAccounts: []
    };

    // Handle password for email signup
    if (!isSocialSignup) {
      const salt = await bcrypt.genSalt(10);
      userData.password = await bcrypt.hash(body.password, salt);
    }

    // Add social account details if it's a social signup
    if (isSocialSignup) {
      userData.socialAccounts.push({
        provider: body.socialProvider,
        providerId: body.providerId,
        email: body.email,
        lastUsed: new Date()
      });
    }

    // Create user in database
    const user = await User.create(userData);

    // Remove sensitive data from response
    const userResponse = user.toObject();
    delete userResponse.password;

    return NextResponse.json(
      {
        success: true,
        message: 'User registered successfully',
        user: userResponse
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Signup error:', error);

    // Handle MongoDB duplicate key errors
    if (error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          message: 'This account already exists'
        },
        { status: 409 }
      );
    }

    // Handle other errors
    return NextResponse.json(
      {
        success: false,
        message: 'An error occurred during registration'
      },
      { status: 500 }
    );
  }
}

// Verify social authentication token
export async function PUT(request) {
  try {
    const token = await getToken({ req: request });
    
    if (!token) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid or expired token' 
        }, 
        { status: 401 }
      );
    }

    const user = await User.findOne({ email: token.email });
    
    if (!user) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'User not found' 
        }, 
        { status: 404 }
      );
    }

    // Update last used timestamp for the social account
    const socialAccount = user.socialAccounts.find(
      account => account.provider === token.provider
    );

    if (socialAccount) {
      socialAccount.lastUsed = new Date();
      await user.save();
    }

    const userResponse = user.toObject();
    delete userResponse.password;

    return NextResponse.json({
      success: true,
      user: userResponse
    });

  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error verifying token'
      },
      { status: 500 }
    );
  }
}

// Handle GET requests
export async function GET() {
  return NextResponse.json(
    { 
      success: false, 
      message: 'Method not allowed' 
    }, 
    { status: 405 }
  );
}