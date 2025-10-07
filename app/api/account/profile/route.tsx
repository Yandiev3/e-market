// app/api/account/profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function PUT(request: NextRequest) {
  try {
    // Проверяем аутентификацию
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { message: 'Не авторизован' },
        { status: 401 }
      );
    }

    await dbConnect();

    // Получаем данные из запроса
    const body = await request.json();
    const { 
      name, 
      currentPassword, 
      newPassword,
      phone,
      address,
    } = body;

    // Находим пользователя
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { message: 'Пользователь не найден' },
        { status: 404 }
      );
    }

    // Обновляем основные данные
    const updateData: any = {};
    
    if (name) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (address !== undefined) updateData.address = address;

    // Обрабатываем смену пароля
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { message: 'Текущий пароль обязателен для смены пароля' },
          { status: 400 }
        );
      }

      // Проверяем текущий пароль
      const isCurrentPasswordValid = await bcrypt.compare(
        currentPassword, 
        user.password
      );

      if (!isCurrentPasswordValid) {
        return NextResponse.json(
          { message: 'Текущий пароль неверен' },
          { status: 400 }
        );
      }

      // Хешируем новый пароль
      const salt = await bcrypt.genSalt(12);
      updateData.password = await bcrypt.hash(newPassword, salt);
    }

    // Обновляем пользователя
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password'); // Исключаем пароль из ответа

    return NextResponse.json(
      { 
        message: 'Профиль успешно обновлен',
        user: updatedUser 
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Profile update error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { message: 'Ошибка валидации', errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { message: 'Не авторизован' },
        { status: 401 }
      );
    }

    await dbConnect();

    const user = await User.findOne({ email: session.user.email })
      .select('-password'); // Исключаем пароль

    if (!user) {
      return NextResponse.json(
        { message: 'Пользователь не найден' },
        { status: 404 }
      );
    }

    return NextResponse.json({ user }, { status: 200 });

  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { message: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}