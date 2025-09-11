import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Product, { IProductLean } from '@/models/Product';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { toProductLean } from '@/lib/utils';

interface Params {
  params: { id: string };
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    await dbConnect();

    // Проверяем, является ли params.id ObjectId (24 hex characters) или slug
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(params.id);
    
    let product;
    
    if (isObjectId) {
      // Если это ObjectId, ищем по ID
      product = await Product.findById(params.id).lean();
    } else {
      // Если это не ObjectId, ищем по slug
      product = await Product.findOne({ 
        slug: params.id, 
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

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const body = await request.json();
    
    // Проверяем, является ли params.id ObjectId или slug
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(params.id);
    let product;
    
    if (isObjectId) {
      product = await Product.findByIdAndUpdate(params.id, body, {
        new: true,
        runValidators: true,
      });
    } else {
      product = await Product.findOneAndUpdate({ slug: params.id }, body, {
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

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // Проверяем, является ли params.id ObjectId или slug
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(params.id);
    let product;
    
    if (isObjectId) {
      product = await Product.findByIdAndDelete(params.id);
    } else {
      product = await Product.findOneAndDelete({ slug: params.id });
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

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const body = await request.json();
    
    // Проверяем, является ли params.id ObjectId или slug
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(params.id);
    let product;
    
    if (isObjectId) {
      product = await Product.findByIdAndUpdate(params.id, body, {
        new: true,
        runValidators: true,
      });
    } else {
      product = await Product.findOneAndUpdate({ slug: params.id }, body, {
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