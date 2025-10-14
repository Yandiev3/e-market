// app/api/cart/route.ts
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

    await dbConnect();

    const user = await User.findById(session.user.id)
      .populate('cart.product', 'name price images sizes')
      .select('cart');

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const cart = user.cart.map((item: any) => ({
      id: item.product._id.toString(),
      name: item.product.name,
      price: item.product.price,
      image: item.product.images[0],
      quantity: item.quantity,
      sizes: item.product.sizes,
      size: item.product.size,
    }));

    return NextResponse.json({ cart });
  } catch (error: any) {
    console.error('Cart fetch error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { cart } = await request.json();
    if (!Array.isArray(cart)) {
      return NextResponse.json({ message: 'Cart must be an array' }, { status: 400 });
    }

    await dbConnect();

    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Валидация и обновление корзины
    const validCartItems = [];
    for (const item of cart) {
      const product = await Product.findById(item.id);
      if (product) {
        // Проверяем наличие через размеры
        const hasStock = product.sizes.some(size => size.inStock && size.stockQuantity > 0);
        if (hasStock) {
          validCartItems.push({
            product: item.id,
            quantity: item.quantity,
            addedAt: new Date(),
          });
        }
      }
    }

    user.cart = validCartItems;
    await user.save();

    return NextResponse.json({ message: 'Cart updated successfully' });
  } catch (error: any) {
    console.error('Cart update error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    user.cart = [];
    await user.save();

    return NextResponse.json({ message: 'Cart cleared successfully' });
  } catch (error: any) {
    console.error('Cart clear error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}