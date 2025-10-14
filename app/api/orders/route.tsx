// app/api/orders/route.tsx
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order';
import Product from '@/models/Product';
import User from '@/models/User';
import { validateOrder } from '@/lib/validation';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');

    let query: any = { user: session.user.id };

    if (status && status !== 'all') {
      query.status = status;
    }

    const skip = (page - 1) * limit;
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('orderItems.product', 'name images')
      .lean();

    const total = await Order.countDocuments(query);

    return NextResponse.json({
      orders,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error: any) {
    console.error('Orders fetch error:', error);
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

    await dbConnect();

    const body = await request.json();
    console.log('Received order data:', body);

    const { 
      items, 
      shippingAddress, 
      paymentMethod,
      email,
      phone,
      firstName,
      lastName
    } = body;

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { message: 'Заказ должен содержать товары' },
        { status: 400 }
      );
    }

    if (!shippingAddress || !shippingAddress.street) {
      return NextResponse.json(
        { message: 'Необходимо указать полный адрес доставки' },
        { status: 400 }
      );
    }

    if (!email || !phone || !firstName || !lastName) {
      return NextResponse.json(
        { message: 'Необходимо заполнить все контактные данные' },
        { status: 400 }
      );
    }

    // Calculate prices and validate stock
    let itemsPrice = 0;
    const orderItems = [];
    const stockUpdates = [];

    for (const item of items) {
      const product = await Product.findById(item.id);
      if (!product) {
        return NextResponse.json(
          { message: `Товар "${item.name}" не найден` },
          { status: 404 }
        );
      }

      // Проверяем наличие через размеры
      const hasStock = product.sizes.some(size => size.inStock && size.stockQuantity > 0);
      if (!hasStock) {
        return NextResponse.json(
          { 
            message: `Товар "${product.name}" отсутствует в наличии`,
            productId: product._id
          },
          { status: 400 }
        );
      }

      const itemTotal = product.price * item.quantity;
      itemsPrice += itemTotal;

      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.images[0] || '/images/placeholder.jpg',
      });

      // Подготавливаем обновление количества для выбранного размера
      if (item.size && product.sizes) {
        const sizeIndex = product.sizes.findIndex(s => s.size === item.size);
        if (sizeIndex !== -1) {
          stockUpdates.push({
            updateOne: {
              filter: { _id: product._id, 'sizes.size': item.size },
              update: { 
                $inc: { 'sizes.$.stockQuantity': -item.quantity },
                $set: { 
                  'sizes.$.inStock': product.sizes[sizeIndex].stockQuantity - item.quantity > 0 
                }
              }
            }
          });
        }
      }
    }

    // Update all product stocks
    if (stockUpdates.length > 0) {
      await Product.bulkWrite(stockUpdates);
    }

    // Calculate taxes and shipping
    const taxPrice = itemsPrice * 0.1; // 10% tax
    const shippingPrice = itemsPrice > 5000 ? 0 : 500;
    const totalPrice = itemsPrice + taxPrice + shippingPrice;

    // Create order
    const order = new Order({
      user: session.user.id,
      orderItems,
      shippingAddress: {
        street: shippingAddress.street,
      },
      paymentMethod: paymentMethod || 'card',
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      email,
      phone,
      firstName,
      lastName,
      isPaid: paymentMethod === 'card' ? false : false,
      isDelivered: false,
      status: 'pending',
    });

    const savedOrder = await order.save();
    console.log('Order created successfully:', savedOrder._id);

    // Clear user's cart after successful order
    try {
      const user = await User.findById(session.user.id);
      if (user) {
        user.cart = [];
        await user.save();
        console.log('User cart cleared');
      }
    } catch (cartError) {
      console.error('Error clearing cart:', cartError);
      // Don't fail the order if cart clearing fails
    }

    await savedOrder.populate('orderItems.product', 'name images slug');

    return NextResponse.json(
      { 
        order: savedOrder,
        message: 'Заказ успешно создан' 
      }, 
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Order creation error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { message: 'Ошибка валидации данных', errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { message: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}