// app/api/products/route.tsx
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { toProductsArray, toPlainObject } from '@/lib/utils';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sortBy = searchParams.get('sortBy') || 'name';
    const featured = searchParams.get('featured');
    const inStock = searchParams.get('inStock');

    let query: any = { active: true };

    // Category filter
    if (category) {
      query.category = category;
    }

    // Search filter
    if (search) {
      query.$text = { $search: search };
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    // Featured filter
    if (featured === 'true') {
      query.featured = true;
    }

    // Stock filter - теперь проверяем наличие через размеры
    if (inStock === 'true') {
      query['sizes.stockQuantity'] = { $gt: 0 };
      query['sizes.inStock'] = true;
    }

    // Sort options
    let sortOptions: any = {};
    switch (sortBy) {
      case 'price':
        sortOptions.price = 1;
        break;
      case 'price-desc':
        sortOptions.price = -1;
        break;
      case 'rating':
        sortOptions['ratings.average'] = -1;
        break;
      case 'name-desc':
        sortOptions.name = -1;
        break;
      default:
        sortOptions.name = 1;
    }

    const skip = (page - 1) * limit;
    const products = await Product.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .select('-specifications -description')
      .lean();

    const total = await Product.countDocuments(query);

    // Преобразуем продукты в простые объекты
    const plainProducts = toProductsArray(products);

    return NextResponse.json({
      products: plainProducts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error: any) {
    console.error('Products fetch error:', error);
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
    const product = new Product(body);
    await product.save();

    // Преобразуем созданный продукт
    const plainProduct = toPlainObject(product);

    return NextResponse.json(plainProduct, { status: 201 });
  } catch (error: any) {
    console.error('Product creation error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}