// app/api/admin/analytics/route.tsx
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order';
import Product from '@/models/Product';
import User from '@/models/User';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '30d';

    // Calculate date range
    const now = new Date();
    let startDate = new Date();

    switch (range) {
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(now.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setDate(now.getDate() - 30);
    }

    // Get total counts
    const totalSales = await Order.aggregate([
      {
        $match: {
          status: 'delivered',
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalPrice' },
        },
      },
    ]);

    const totalOrders = await Order.countDocuments({
      createdAt: { $gte: startDate },
    });

    const totalProducts = await Product.countDocuments({ active: true });
    const totalUsers = await User.countDocuments();

    // Get recent orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('user', 'name email')
      .lean();

    // Get top products
    const topProducts = await Order.aggregate([
      {
        $match: {
          status: 'delivered',
          createdAt: { $gte: startDate },
        },
      },
      {
        $unwind: '$orderItems',
      },
      {
        $group: {
          _id: '$orderItems.product',
          totalSales: { $sum: '$orderItems.quantity' },
          totalRevenue: { $sum: { $multiply: ['$orderItems.price', '$orderItems.quantity'] } },
        },
      },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product',
        },
      },
      {
        $unwind: '$product',
      },
      {
        $project: {
          _id: '$product._id',
          name: '$product.name',
          price: '$product.price',
          images: '$product.images',
          stock: '$product.stock',
          totalSales: '$totalSales',
        },
      },
      {
        $sort: { totalSales: -1 },
      },
      {
        $limit: 10,
      },
    ]);

    // Get monthly sales
    const monthlySales = await Order.aggregate([
      {
        $match: {
          status: 'delivered',
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          sales: { $sum: '$totalPrice' },
        },
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 },
      },
    ]);

    // Get top categories
    const topCategories = await Order.aggregate([
      {
        $match: {
          status: 'delivered',
          createdAt: { $gte: startDate },
        },
      },
      {
        $unwind: '$orderItems',
      },
      {
        $lookup: {
          from: 'products',
          localField: 'orderItems.product',
          foreignField: '_id',
          as: 'product',
        },
      },
      {
        $unwind: '$product',
      },
      {
        $group: {
          _id: '$product.category',
          count: { $sum: '$orderItems.quantity' },
          revenue: { $sum: { $multiply: ['$orderItems.price', '$orderItems.quantity'] } },
        },
      },
      {
        $sort: { revenue: -1 },
      },
      {
        $limit: 5,
      },
    ]);

    // Get recent activity
    const recentActivity = recentOrders.map((order) => ({
      type: 'order',
      description: `New order from ${order.user?.name || 'Guest'}`,
      timestamp: order.createdAt,
    }));

    return NextResponse.json({
      totalSales: totalSales[0]?.total || 0,
      totalOrders,
      totalProducts,
      totalUsers,
      recentOrders,
      topProducts,
      monthlySales: monthlySales.map((item) => ({
        month: `${item._id.year}-${item._id.month.toString().padStart(2, '0')}`,
        sales: item.sales,
      })),
      topCategories: topCategories.map((item) => ({
        category: item._id,
        count: item.count,
        revenue: item.revenue,
      })),
      recentActivity,
    });
  } catch (error: any) {
    console.error('Analytics fetch error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}