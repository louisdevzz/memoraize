import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import User, { IUser } from '@/models/User';

export async function POST(req: Request) {
  try {
    await connectDB();
    
    const { name, email, password } = await req.json();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    }) as IUser;

    // Create session data
    const sessionData = {
      userId: user._id.toHexString(),
      email: user.email,
      name: user.name
    };

    // Set cookie options
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
      path: '/'
    };

    // Create the response
    const response = NextResponse.json({
      message: 'Registration successful',
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
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}