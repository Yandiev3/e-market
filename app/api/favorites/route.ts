// app/api/favorites/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import Product from '@/models/Product';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
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

    const user = await User.findById(session.user.id)
      .populate('favorites.product', 'name price images slug')
      .select('favorites');

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Проверяем, что favorites существует и является массивом
    const favorites = (user.favorites || []).map((fav: any) => ({
      id: fav.product?._id?.toString(),
      name: fav.product?.name,
      price: fav.product?.price,
      image: fav.product?.images?.[0],
      slug: fav.product?.slug,
      addedAt: fav.addedAt,
    })).filter((fav: any) => fav.id); // Фильтруем невалидные элементы

    return NextResponse.json({ favorites });
  } catch (error: any) {
    console.error('Favorites fetch error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { productId } = await request.json();
    if (!productId) {
      return NextResponse.json({ message: 'Product ID is required' }, { status: 400 });
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

    // Проверяем существование товара
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Инициализируем favorites если undefined
    if (!user.favorites) {
      user.favorites = [];
    }

    // Проверяем, не добавлен ли уже товар в избранное
    const alreadyFavorite = user.favorites.some(
      (fav: any) => fav.product?.toString() === productId
    );

    if (alreadyFavorite) {
      return NextResponse.json({ message: 'Product already in favorites' }, { status: 400 });
    }

    // Добавляем товар в избранное
    user.favorites.push({
      product: productId,
      addedAt: new Date(),
    });

    await user.save();

    return NextResponse.json({ message: 'Product added to favorites' });
  } catch (error: any) {
    console.error('Add to favorites error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// УДАЛЯЕМ обработчик DELETE из этого файла - он должен быть в отдельном [id] route