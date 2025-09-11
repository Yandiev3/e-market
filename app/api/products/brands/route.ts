// app/api/products/brands/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product';

export async function GET() {
  try {
    await dbConnect();
    
    const brands = await Product.distinct('brand', { active: true });
    
    return NextResponse.json({ brands });
  } catch (error: any) {
    console.error('Brands fetch error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}