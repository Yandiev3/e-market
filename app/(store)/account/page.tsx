// app/(store)/account/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import ProfileNavigation from '@/components/account/ProfileNavigation';
import { Card, CardContent } from '@/components/ui/Card';
import { User, Mail, Phone, MapPin, Package, Calendar } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface Order {
  _id: string;
  totalPrice: number;
  status: string;
  createdAt: string;
  orderItems: Array<{
    name: string;
    quantity: number;
  }>;
}

export default function AccountPage() {
  const { user } = useAuth();
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentOrders();
  }, []);

  const fetchRecentOrders = async () => {
    try {
      const response = await fetch('/api/orders?limit=3');
      const data = await response.json();
      setRecentOrders(data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'text-green-600 bg-green-100';
      case 'processing':
        return 'text-blue-600 bg-blue-100';
      case 'shipped':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Навигация</h1>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Навигация */}
              <div className="lg:col-span-1">
                <ProfileNavigation />
              </div>

              {/* Основной контент */}
              <div className="lg:col-span-3 space-y-6">
                {/* Информация о пользователе */}
                <Card className="p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">{user?.name || 'Пользователь'}</h2>
                      <p className="text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{user?.phone || 'Не указан'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{user?.email}</span>
                    </div>
                    {user?.address && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{user.address}</span>
                      </div>
                    )}
                  </div>
                </Card>

                {/* Последние заказы */}
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Последние заказы
                    </h3>
                    <a 
                      href="/account/orders" 
                      className="text-primary hover:text-primary/80 text-sm font-medium"
                    >
                      Все заказы →
                    </a>
                  </div>

                  {loading ? (
                    <div className="space-y-3">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="animate-pulse flex justify-between items-center p-3 border rounded-lg">
                          <div className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-32"></div>
                            <div className="h-3 bg-gray-200 rounded w-24"></div>
                          </div>
                          <div className="h-6 bg-gray-200 rounded w-20"></div>
                        </div>
                      ))}
                    </div>
                  ) : recentOrders.length === 0 ? (
                    <div className="text-center py-8">
                      <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">У вас пока нет заказов</p>
                      <a 
                        href="/products" 
                        className="text-primary hover:text-primary/80 text-sm font-medium mt-2 inline-block"
                      >
                        Начать покупки →
                      </a>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {recentOrders.map((order) => (
                        <div key={order._id} className="flex justify-between items-center p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                          <div>
                            <div className="font-medium flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              Заказ #{order._id.slice(-8)}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {formatDate(new Date(order.createdAt))} • 
                              {order.orderItems.length} товар(ов)
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">{order.totalPrice} ₽</div>
                            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>

                {/* Быстрые действия */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Быстрые действия</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <a 
                      href="/products" 
                      className="p-4 border rounded-lg hover:bg-accent/50 transition-colors text-center"
                    >
                      <div className="font-medium">Продолжить покупки</div>
                      <div className="text-sm text-muted-foreground">Найти новые товары</div>
                    </a>
                    <a 
                      href="/favorites" 
                      className="p-4 border rounded-lg hover:bg-accent/50 transition-colors text-center"
                    >
                      <div className="font-medium">Избранное</div>
                      <div className="text-sm text-muted-foreground">Ваши сохраненные товары</div>
                    </a>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}