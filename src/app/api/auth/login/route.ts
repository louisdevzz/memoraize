import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import User, { IUser } from '@/models/User';
import connectDB from '@/lib/mongodb';
import { cookies } from 'next/headers';
import { Types } from 'mongoose';

export async function POST(request: Request) {
  try {
    await connectDB();
    const { email, password } = await request.json();

    // Find user by email and explicitly type it
    const user = await User.findOne({ email }) as IUser | null;

    if (!user) {
      return NextResponse.json(
        { message: 'Email not found' },
        { status: 401 }
      );
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Invalid password' },
        { status: 401 }
      );
    }

    // Create session data with properly typed _id
    const sessionData = {
      userId: user._id.toHexString(),
      email: user.email,
      name: user.name
    };

    // Set cookie with user info
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
      path: '/'
    };

    // Create the response
    const response = NextResponse.json({
      message: 'Login successful',
      user: {
        id: user._id.toHexString(),
        email: user.email,
        name: user.name
      }
    });

    // Set the cookie in the response
    response.cookies.set('session', JSON.stringify(sessionData), cookieOptions);

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}