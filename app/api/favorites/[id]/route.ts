// app/api/favorites/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id: productId } = await context.params;
    
    if (!productId) {
      return NextResponse.json(
        { message: 'Product ID is required' },
        { status: 400 }
      );
    }

    try {
      await dbConnect();
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      return NextResponse.json(
        { message: 'Database connection failed' },
        { status: 500 }
      );
    }

    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Инициализируем favorites если undefined
    if (!user.favorites) {
      user.favorites = [];
    }

    // Удаляем товар из избранного
    const initialLength = user.favorites.length;
    user.favorites = user.favorites.filter(
      (fav: any) => fav.product?.toString() !== productId
    );

    if (user.favorites.length === initialLength) {
      return NextResponse.json(
        { message: 'Product not found in favorites' },
        { status: 404 }
      );
    }

    await user.save();

    return NextResponse.json({ message: 'Product removed from favorites' });
  } catch (error: any) {
    console.error('Remove from favorites error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}