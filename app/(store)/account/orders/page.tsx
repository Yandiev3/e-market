// app/(store)/account/orders/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import ProfileNavigation from '@/components/account/ProfileNavigation';
import { Card, CardContent } from '@/components/ui/Card';
import { formatPrice, formatDate } from '@/lib/utils';
import { Package, Calendar, CreditCard, Truck, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface Order {
  _id: string;
  orderItems: Array<{
    name: string;
    quantity: number;
    price: number;
    image: string;
    sizes: Array<{
      size: string;
      quantity: number;
      stockQuantity: number;
      inStock: boolean;
    }>;
  }>;
  totalPrice: number;
  status: string;
  createdAt: string;
  paymentMethod: string;
  isPaid: boolean;
  // isDelivered: boolean;
}

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      const data = await response.json();
      setOrders(data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string, ) => {
    if (status === 'delivered') return <CheckCircle className={` text-green-600`} />;
    if (status === 'processing') return <Clock className={` text-blue-600`} />;
    if (status === 'shipped') return <Truck className={` text-orange-600`} />;
    if (status === 'cancelled') return <AlertCircle className={` text-red-600`} />;
      return <AlertCircle className={` text-yellow-600`} />;
  };

  const getStatusText = (status: string, ) => {
    if (status === 'delivered') return 'Доставлен';
    if (status === 'processing') return 'Обрабатывается';
    if (status === 'shipped') return 'В пути';
    if (status === 'cancelled') return 'Отменен';
      return 'Ожидает';
  };

  const getStatusColor = (status: string, ) => {
    if (status === 'delivered') return 'bg-green-100 text-green-800 border-green-200';
    if (status === 'processing') return 'bg-blue-100 text-blue-800 border-blue-200';
    if (status === 'shipped') return 'bg-orange-100 text-orange-800 border-orange-200';
    if (status === 'cancelled') return 'bg-red-100 text-red-800 border-red-200';
    return 'bg-yellow-100 text-yellow-800 border-yellow-200';
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-background">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center gap-3 mb-8">
                <Package className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold">Мои заказы</h1>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-1">
                  <ProfileNavigation />
                </div>
                <div className="lg:col-span-3">
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <Card key={i} className="p-6 animate-pulse">
                        <div className="space-y-4">
                          <div className="flex justify-between">
                            <div className="h-6 bg-muted rounded w-1/4"></div>
                            <div className="h-6 bg-muted rounded w-1/6"></div>
                          </div>
                          <div className="h-4 bg-muted rounded w-1/2"></div>
                          <div className="space-y-2">
                            <div className="h-4 bg-muted rounded"></div>
                            <div className="h-4 bg-muted rounded w-3/4"></div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Заголовок */}
            <div className="flex items-center gap-3 mb-8">
              <Package className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">Мои заказы</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Навигация */}
              <div className="lg:col-span-1">
                <ProfileNavigation />
              </div>

              {/* Основной контент */}
              <div className="lg:col-span-3">
                {orders.length === 0 ? (
                  <Card className="p-8 text-center">
                    <CardContent className="space-y-4">
                      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                        <Package className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">Заказов пока нет</h3>
                        <p className="text-muted-foreground mb-6">
                          Вы еще не сделали ни одного заказа. Самое время это исправить!
                        </p>
                      </div>
                      <a 
                        href="/products" 
                        className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
                      >
                        Начать покупки
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                      </a>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-6">
                    {orders.map((order) => (
                      <Card key={order._id} className="overflow-hidden border-border hover:shadow-lg transition-shadow duration-300">
                        <CardContent className="p-0">
                          {/* Шапка заказа */}
                          <div className="bg-card border-b border-border p-6">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full">
                              <div className="space-y-2 w-full">
                                <div className="flex items-center gap-3">
                                  <h3 className="font-semibold text-lg">
                                    Заказ #{order._id.slice(-8).toUpperCase()}
                                  </h3>
                                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                                    {getStatusIcon(order.status)}
                                    {getStatusText(order.status)}
                                  </span>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    {formatDate(new Date(order.createdAt))}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <CreditCard className="h-4 w-4" />
                                    {order.paymentMethod === 'cash' ? 'Наличные' : order.paymentMethod === 'card' ? 'Карта' : 'Неизвестно'}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Товары */}
                          <div className="p-6">
                            <div className="space-y-4">
                              {order.orderItems.map((item, index) => (
                                <div key={index} className="flex items-center gap-4 py-2">
                                  <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                                    {item.image ? (
                                      <img 
                                        src={item.image} 
                                        alt={item.name}
                                        className="w-10 h-10 object-cover rounded"
                                      />
                                    ) : (
                                      <Package className="h-6 w-6 text-muted-foreground" />
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-medium text-sm truncate">
                                      {item.name}
                                    </h4>
                                    <p className="text-sm text-muted-foreground">
                                      Размер: {item.sizes?.[0]?.size || 'Не указан'}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      Количество: {item.quantity}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <div className="font-semibold">
                                      {formatPrice(item.price * item.quantity)}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Итого */}
                            <div className="border-t border-border pt-4 mt-4">
                              <div className="flex justify-between items-center">
                                <span className="font-semibold">Общая сумма:</span>
                                <span className="text-xl font-bold text-primary">
                                  {formatPrice(order.totalPrice)}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Футер заказа */}
                          <div className="bg-muted/30 px-6 py-4 border-t border-border">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                              <div className="text-sm text-muted-foreground">
                                ID заказа: {order._id}
                              </div>
                              <div className="flex gap-3">
                                <button className="text-sm text-primary hover:text-primary/80 font-medium transition-colors">
                                  Подробнее
                                </button>
                                <button className="text-sm text-primary hover:text-primary/80 font-medium transition-colors">
                                  Повторить заказ
                                </button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}