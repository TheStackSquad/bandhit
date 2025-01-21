
// src/app/api/auth/signin/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import User from '@/schemas/models/User';
import { generateToken } from '@/utils/tokenManager';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    await dbConnect();
    
    const { email, password } = await request.json();

    const user = await User.findOne({ email }).select('+password');
    
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

    const token = generateToken(user._id);
    
    // Create a user object without the password
    const userWithoutPassword = {
      _id: user._id,
      email: user.email,
      name: user.name,
      // Add other user fields as needed
    };

    return NextResponse.json({
      user: userWithoutPassword,
      token
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
