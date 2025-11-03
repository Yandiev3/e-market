// app/api/products/search/route.tsx
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product';
import { toProductsArray } from '@/lib/utils';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!q) {
      return NextResponse.json([]);
    }

    const products = await Product.find(
      {
        $text: { $search: q },
        active: true,
      },
      {
        score: { $meta: 'textScore' },
      }
    )
      .sort({ score: { $meta: 'textScore' } })
      .limit(limit)
      .select('name price images slug brand')
      .lean();

    // Преобразуем продукты в простые объекты
    const plainProducts = toProductsArray(products);

    return NextResponse.json(plainProducts);
  } catch (error: any) {
    console.error('Search error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}