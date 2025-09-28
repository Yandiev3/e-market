import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Product, { IProductLean } from '@/models/Product';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { toProductLean } from '@/lib/utils';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    await dbConnect();

    const { id } = await context.params;

    // Проверяем, является ли id ObjectId (24 hex characters) или slug
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);
    
    let product;
    
    if (isObjectId) {
      // Если это ObjectId, ищем по ID
      product = await Product.findById(id).lean();
    } else {
      // Если это не ObjectId, ищем по slug
      product = await Product.findOne({ 
        slug: id, 
        active: true 
      }).lean();
    }

    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    // Безопасное преобразование
    const typedProduct = toProductLean(product);
    if (!typedProduct) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }
    
    if (!typedProduct.active) {
      const session = await getServerSession(authOptions);
      if (!session || session.user.role !== 'admin') {
        return NextResponse.json({ message: 'Product not found' }, { status: 404 });
      }
    }

    return NextResponse.json(typedProduct);
  } catch (error: any) {
    console.error('Product fetch error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const { id } = await context.params;
    const body = await request.json();
    
    // Проверяем, является ли id ObjectId или slug
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);
    let product;
    
    if (isObjectId) {
      product = await Product.findByIdAndUpdate(id, body, {
        new: true,
        runValidators: true,
      });
    } else {
      product = await Product.findOneAndUpdate({ slug: id }, body, {
        new: true,
        runValidators: true,
      });
    }

    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error: any) {
    console.error('Product update error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const { id } = await context.params;

    // Проверяем, является ли id ObjectId или slug
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);
    let product;
    
    if (isObjectId) {
      product = await Product.findByIdAndDelete(id);
    } else {
      product = await Product.findOneAndDelete({ slug: id });
    }

    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error: any) {
    console.error('Product deletion error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const { id } = await context.params;
    const body = await request.json();
    
    // Проверяем, является ли id ObjectId или slug
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);
    let product;
    
    if (isObjectId) {
      product = await Product.findByIdAndUpdate(id, body, {
        new: true,
        runValidators: true,
      });
    } else {
      product = await Product.findOneAndUpdate({ slug: id }, body, {
        new: true,
        runValidators: true,
      });
    }

    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error: any) {
    console.error('Product patch error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}