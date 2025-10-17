// app/api/cart/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import Product from '@/models/Product';
import { IProductSize } from '@/types/product';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const user = await User.findById(session.user.id)
      .populate('cart.product', 'name price images sizes colors sku')
      .select('cart');

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const cart = user.cart.map((item: any) => ({
      id: item.product._id.toString(),
      name: item.product.name,
      price: item.product.price,
      image: item.product.images?.[0] || '/images/placeholder.jpg',
      quantity: item.quantity,
      size: item.size,
      color: item.color,
      sizes: item.product.sizes,
      colors: item.product.colors,
      sku: item.product.sku,
      productId: item.product._id.toString(),
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

    // Валидация и обновление корзины с учетом параметров
    const validCartItems = [];
    for (const item of cart) {
      const product = await Product.findById(item.id);
      if (product) {
        // Проверяем наличие через размеры
        let hasStock = true;
        if (item.size && product.sizes.length > 0) {
          const sizeInfo = product.sizes.find((s: IProductSize) => s.size === item.size);
          hasStock = sizeInfo ? sizeInfo.inStock && sizeInfo.stockQuantity > 0 : false;
        } else {
          hasStock = product.sizes.some((size: IProductSize) => size.inStock && size.stockQuantity > 0);
        }
        
        if (hasStock) {
          validCartItems.push({
            product: item.id,
            quantity: item.quantity,
            size: item.size || null,
            color: item.color || null,
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