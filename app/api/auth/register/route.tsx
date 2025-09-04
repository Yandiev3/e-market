// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { validateUser, sanitizeInput } from '@/lib/validation';

// app/api/auth/register/route.ts
export async function POST(request: NextRequest) {
  try {
    console.log('=== REGISTRATION START ===');
    await dbConnect();

    const body = await request.json();
    const { name, email, password } = body;
    console.log('Registration data:', { name, email, password: '***' });

    // Validate input
    const validation = validateUser({ name, email, password });
    if (!validation.isValid) {
      console.log('Validation failed:', validation.errors);
      return NextResponse.json(
        { message: validation.errors[0] },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      console.log('User already exists');
      return NextResponse.json(
        { message: 'User already exists with this email' },
        { status: 400 }
      );
    }

    // Create new user
    const user = new User({
      name: sanitizeInput(name),
      email: email.toLowerCase(),
      password,
      role: 'user',
      active: true, // Явно устанавливаем активность
    });

    console.log('User before save:', user);
    console.log('Active field before save:', user.active);
    
    await user.save();
    
    console.log('User after save - active:', user.active);
    console.log('User after save - password hash:', user.password);

    // Проверим в базе
    const savedUser = await User.findById(user._id);
    console.log('User from database - active:', savedUser?.active);

    console.log('=== REGISTRATION SUCCESS ===');
    return NextResponse.json(
      { message: 'User created successfully' },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}