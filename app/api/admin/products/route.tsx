import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product';
import { validateProduct } from '@/lib/validation';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const status = searchParams.get('status');

    let query: any = {};

    if (search) {
      query.$text = { $search: search };
    }

    if (category && category !== 'all') {
      query.category = category;
    }

    if (status === 'active') {
      query.active = true;
    } else if (status === 'inactive') {
      query.active = false;
    }

    const skip = (page - 1) * limit;
    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Product.countDocuments(query);

    return NextResponse.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error: any) {
    console.error('Admin products fetch error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const body = await request.json();
    
    // Валидация данных
    const validation = validateProduct(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { message: 'Validation failed', errors: validation.errors },
        { status: 400 }
      );
    }

    // Проверка уникальности SKU
    const existingSku = await Product.findOne({ sku: body.sku });
    if (existingSku) {
      return NextResponse.json(
        { message: 'Товар с таким SKU уже существует' },
        { status: 400 }
      );
    }

    // Проверка уникальности slug
    const existingSlug = await Product.findOne({ slug: body.slug });
    if (existingSlug) {
      return NextResponse.json(
        { message: 'Товар с таким slug уже существует' },
        { status: 400 }
      );
    }

    const { ...productData } = body;

    const product = new Product({
      ...productData,
      ratings: {
        average: 0,
        count: 0,
      },
      // Убедимся, что массивы размеров и цветов инициализированы
      sizes: productData.sizes || [],
      colors: productData.colors || [],
    });

    await product.save();

    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    console.error('Product creation error:', error);
    
    if (error.code === 11000) {
      return NextResponse.json(
        { message: 'Товар с таким SKU или slug уже существует' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}