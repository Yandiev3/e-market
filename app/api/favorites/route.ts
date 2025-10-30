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
      .populate('favorites.product')
      .select('favorites');

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const favorites = (user.favorites || []).map((fav: any) => {
      const product = fav.product;
      if (!product) return null;

      return {
        _id: product._id?.toString(),
        id: product._id?.toString(),
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.images?.[0] || '/images/placeholder.jpg',
        slug: product.slug,
        ratings: product.ratings || { average: 0, count: 0 },
        brand: product.brand,
        category: product.category,
        sizes: product.sizes || [],
        sku: product.sku,
        addedAt: fav.addedAt,
      };
    }).filter((fav: any) => fav !== null); // Фильтруем невалидные элементы

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