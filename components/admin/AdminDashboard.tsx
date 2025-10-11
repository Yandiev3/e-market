// components/admin/AdminDashboard.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';
import { DashboardStats, RecentOrder, TopProduct } from '@/types/product';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/admin/analytics');
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color = 'primary' }: { title: string; value: string; icon: React.ReactNode; color?: string }) => (
    <div className="card p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold text-foreground mt-2">{value}</p>
        </div>
        <div className={`p-3 rounded-lg bg-${color}/10 text-${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card p-6">
              <div className="h-4 bg-muted rounded w-1/3 mb-4"></div>
              <div className="h-8 bg-muted rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Не удалось загрузить данные дашборда</p>
        <button 
          onClick={fetchDashboardData}
          className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link href="/manage-products" className="card p-4 text-center hover:bg-accent transition-colors">
          <div className="text-primary mb-2">
            <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <p className="text-sm font-medium">Добавить товар</p>
        </Link>
        
        <Link href="/orders" className="card p-4 text-center hover:bg-accent transition-colors">
          <div className="text-primary mb-2">
            <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <p className="text-sm font-medium">Заказы</p>
        </Link>
        
        <Link href="/users" className="card p-4 text-center hover:bg-accent transition-colors">
          <div className="text-primary mb-2">
            <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
          <p className="text-sm font-medium">Пользователи</p>
        </Link>
        
        <Link href="/analytics" className="card p-4 text-center hover:bg-accent transition-colors">
          <div className="text-primary mb-2">
            <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-sm font-medium">Аналитика</p>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Общие продажи"
          value={formatPrice(stats.totalSales)}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          }
        />

        <StatCard
          title="Всего заказов"
          value={stats.totalOrders.toString()}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          }
          color="green"
        />

        <StatCard
          title="Товары"
          value={stats.totalProducts.toString()}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          }
          color="blue"
        />

        <StatCard
          title="Пользователи"
          value={stats.totalUsers.toString()}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          }
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="card">
          <div className="px-6 py-4 border-b border-border">
            <h3 className="text-lg font-medium text-foreground">Последние заказы</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {stats.recentOrders && stats.recentOrders.length > 0 ? (
                stats.recentOrders.slice(0, 5).map((order: RecentOrder) => (
                  <div key={order._id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium text-foreground">#{order._id.slice(-6)}</p>
                      <p className="text-sm text-muted-foreground">{order.user?.name || 'Гость'}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-foreground">{formatPrice(order.totalPrice)}</p>
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                        order.status === 'delivered' 
                          ? 'bg-green-100 text-green-800'
                          : order.status === 'processing'
                          ? 'bg-blue-100 text-blue-800'
                          : order.status === 'shipped'
                          ? 'bg-yellow-100 text-yellow-800'
                          : order.status === 'cancelled'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-4">Нет заказов</p>
              )}
            </div>
            <Link href="/admin/orders" className="btn-outline w-full mt-4">
              Все заказы
            </Link>
          </div>
        </div>

        {/* Top Products */}
        <div className="card">
          <div className="px-6 py-4 border-b border-border">
            <h3 className="text-lg font-medium text-foreground">Популярные товары</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {stats.topProducts && stats.topProducts.length > 0 ? (
                stats.topProducts.slice(0, 5).map((product: TopProduct) => (
                  <div key={product._id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center space-x-3">
                      <img
                        src={product.images?.[0] || '/images/placeholder.jpg'}
                        alt={product.name}
                        className="w-10 h-10 rounded object-cover"
                      />
                      <div>
                        <p className="font-medium text-foreground text-sm">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{formatPrice(product.price)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-foreground">{product.stock} шт.</p>
                      <p className="text-xs text-muted-foreground">{product.totalSales || 0} продаж</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-4">Нет данных о товарах</p>
              )}
            </div>
            <Link href="/admin/manage-products" className="btn-outline w-full mt-4">
              Все товары
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;