// src/app/api/signup/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import User from '@/schemas/models/User';
import { signUpSchema } from '@/schemas/validationSchema/userSchema';

export async function POST(request) {
  try {
    await dbConnect();
    const data = await request.json();

    // Validate input
    await signUpSchema.validate(data);

    // Check for existing user
    const existingUser = await User.findOne({
      $or: [{ email: data.email }, { phoneNumber: data.phoneNumber }],
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email or phone number already exists' },
        { status: 400 }
      );
    }

    // Create new user
    const newUser = new User({
      name: data.name,
      email: data.email,
      phoneNumber: data.phoneNumber,
      city: data.city,
      referralSource: data.referralSource,
      isAdult: data.isAdult,
      password: data.password, // Hashing is handled in the schema pre-save
    });

    await newUser.save();

    return NextResponse.json(
      {
        message: 'Signup successful',
        user: { id: newUser._id, name: newUser.name, email: newUser.email },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);

    return NextResponse.json(
      {
        message: error.message || 'Signup failed',
        error: error.errors || null,
      },
      { status: 500 }
    );
  }
}
