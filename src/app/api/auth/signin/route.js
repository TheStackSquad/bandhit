
// src/app/api/auth/signin/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import User from '@/schemas/models/User';
import {generateTokens } from '@/utils/tokenManager';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    await dbConnect();
    
    const { email, password } = await request.json();

    const user = await User.findOne({ email }).select('+password');
    const role = user?.role || 'user'; 
    if (!user) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const { accessToken, refreshToken } = generateTokens(user._id, role);

    // Create a user object without the password
    const userWithoutPassword = {
      _id: user._id,
      role: role,
      email: user.email,
      name: user.name,
      phone: user.phoneNumber,
      city: user.city,
      accessToken, // Include the token values directly
      refreshToken, // Include the refresh token directly
      // Add other user fields as needed
    };
    
    return NextResponse.json(userWithoutPassword, { status: 200 });
    

  } catch (error) {
    console.error('Error in signup route:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
