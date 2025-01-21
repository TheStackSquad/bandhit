// src/app/api/signup/route.js
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/utils/dbConnect';
import User from '@/schemas/models/User';
import { signUpSchema } from '@/schemas/validationSchema/userSchema';

export async function POST(request) {
  try {
    // Connect to database
    await dbConnect();

    // Parse request body
    const body = await request.json();

    try {
      // Validate request data against schema
      await signUpSchema.validate(body, { abortEarly: false });
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
    const existingUser = await User.findOne({ email: body.email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Email already registered' 
        }, 
        { status: 409 }
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(body.password, salt);

    // Create new user object
    const userData = {
      name: body.name.trim(),
      email: body.email.toLowerCase().trim(),
      password: hashedPassword,
      phoneNumber: body.phoneNumber,
      isAdult: body.isAdult,
      city: body.city.trim(),
      referralSource: body.referralSource,
      socialProvider: 'email' // default to email for regular sign-ups
    };

    // Create user in database
    const user = await User.create(userData);

    // Remove password from response
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
          message: 'This email is already registered'
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

// Prevent GET requests to signup endpoint
export async function GET() {
  return NextResponse.json(
    { 
      success: false, 
      message: 'Method not allowed' 
    }, 
    { status: 405 }
  );
}