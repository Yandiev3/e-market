import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { signIn } from 'next-auth/react';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Note: signIn should be used on client side
    // For server-side authentication, use getServerSession or direct validation
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    return NextResponse.json({ message: 'Login successful' }, { status: 200 });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}