import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { validateUser } from '@/lib/validation';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { email, password } = await request.json();

    // Валидация данных
    const validation = validateUser({ email, password });
    if (!validation.isValid) {
      return NextResponse.json(
        { message: validation.errors[0] },
        { status: 400 }
      );
    }

    // Проверка существования пользователя
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { message: 'Пользователь с таким email уже существует' },
        { status: 400 }
      );
    }

    // Создание пользователя
    const user = await User.create({
      email: email.toLowerCase(),
      password,
      name: email.split('@')[0], // Генерируем имя из email
    });

    return NextResponse.json(
      { 
        message: 'Пользователь успешно зарегистрирован',
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}