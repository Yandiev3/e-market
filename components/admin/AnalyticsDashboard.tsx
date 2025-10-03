// components/admin/AnalyticsDashboard.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { formatPrice } from '@/lib/utils';

interface AnalyticsData {
  totalSales: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  monthlySales: Array<{
    month: string;
    sales: number;
  }>;
  topCategories: Array<{
    category: string;
    count: number;
    revenue: number;
  }>;
  recentActivity: Array<{
    type: string;
    description: string;
    timestamp: string;
  }>;
}

const AnalyticsDashboard: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      const response = await fetch(`/api/admin/analytics?range=${timeRange}`);
      const analyticsData = await response.json();
      setData(analyticsData);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, description, trend }: { title: string; value: string; description?: string; trend?: number }) => (
    <div className="card p-6">
      <div>
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <p className="text-3xl font-bold text-foreground mt-2">{value}</p>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
        {trend !== undefined && (
          <div className={`flex items-center mt-2 text-sm ${
            trend >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            <svg className={`w-4 h-4 mr-1 ${trend >= 0 ? '' : 'rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            {Math.abs(trend)}%
          </div>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="animate-pulse space-y-8">
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

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Не удалось загрузить данные аналитики</p>
      </div>
    );
  }

  const maxSales = Math.max(...data.monthlySales.map(m => m.sales));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Аналитика</h2>
          <p className="text-muted-foreground mt-1">Статистика продаж и активности</p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="border border-input rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
        >
          <option value="7d">Последние 7 дней</option>
          <option value="30d">Последние 30 дней</option>
          <option value="90d">Последние 90 дней</option>
          <option value="1y">Последний год</option>
        </select>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Общие продажи"
          value={formatPrice(data.totalSales)}
          description={`За ${timeRange === '7d' ? '7 дней' : timeRange === '30d' ? '30 дней' : timeRange === '90d' ? '90 дней' : 'год'}`}
          trend={12.5}
        />

        <StatCard
          title="Всего заказов"
          value={data.totalOrders.toString()}
          description="За все время"
          trend={8.2}
        />

        <StatCard
          title="Товары"
          value={data.totalProducts.toString()}
          description="Активные товары"
          trend={3.1}
        />

        <StatCard
          title="Пользователи"
          value={data.totalUsers.toString()}
          description="Зарегистрировано"
          trend={15.7}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Sales Chart */}
        <div className="card p-6">
          <h3 className="text-lg font-medium text-foreground mb-4">Динамика продаж</h3>
          <div className="space-y-4">
            {data.monthlySales.map((item) => (
              <div key={item.month} className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground min-w-16">{item.month}</span>
                <div className="flex items-center space-x-3 flex-1 max-w-md">
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${maxSales > 0 ? (item.sales / maxSales) * 100 : 0}%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-foreground min-w-20 text-right">
                    {formatPrice(item.sales)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Categories */}
        <div className="card p-6">
          <h3 className="text-lg font-medium text-foreground mb-4">Топ категории</h3>
          <div className="space-y-4">
            {data.topCategories.map((category) => (
              <div key={category.category} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <span className="text-sm font-medium text-foreground">{category.category}</span>
                  <p className="text-xs text-muted-foreground mt-1">{category.count} заказов</p>
                </div>
                <span className="text-sm font-medium text-foreground">
                  {formatPrice(category.revenue)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <div className="px-6 py-4 border-b border-border">
          <h3 className="text-lg font-medium text-foreground">Последняя активность</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {data.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center space-x-4 p-3 rounded-lg bg-muted/30">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'order' ? 'bg-primary' : 'bg-green-500'
                }`}></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{activity.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(activity.timestamp).toLocaleString('ru-RU')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;