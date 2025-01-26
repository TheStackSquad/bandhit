// src/app/api/signup/social/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import SocialSignUp from '@/schemas/models/SocialSignUp';
import { socialSignUpSchema } from '@/schemas/validationSchema/userSchema';

export async function POST(request) {
  try {
    await dbConnect();
    const data = await request.json();
  //  console.log('Incoming data:', data);

    // Validate input
    await socialSignUpSchema.validate(data);

    // Check if the social account is already linked
    const existingSocialUser = await SocialSignUp.findOne({
      email: data.email,
      [`socialAccounts.${data.socialProvider}`]: { $exists: true },
    });

    if (existingSocialUser) {
      return NextResponse.json(
        { message: 'User already exists with this social account' },
        { status: 400 }
      );
    }

    // Create a new social user
    const newSocialUser = new SocialSignUp({
      email: data.email,
      socialAccounts: {
        [data.socialProvider]: {
          id: data.socialId,
          email: data.email,
        },
      },
    });

    await newSocialUser.save();

    return NextResponse.json(
      {
        message: 'Social signup successful',
        user: {
          id: newSocialUser._id,
          email: newSocialUser.email,
          socialProvider: data.socialProvider,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Social signup error:', error);

    return NextResponse.json(
      {
        message: error.message || 'Social signup failed',
        error: error.errors || null,
      },
      { status: 500 }
    );
  }
}
