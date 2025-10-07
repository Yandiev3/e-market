// components/admin/OrderList.tsx
"use client";

import React from 'react';
import { formatPrice, formatDate } from '@/lib/utils';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface ShippingAddress {
  street: string;
  city: string;
}

interface OrderData {
  _id: string;
  orderNumber: string;
  user: {
    name: string;
    email: string;
  };
  totalPrice: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: string;
  createdAt: string;
  items: OrderItem[];
  shippingAddress?: ShippingAddress;
}

interface OrderListProps {
  orders: OrderData[];
  onStatusChange: (id: string, status: OrderData['status']) => void;
  loading?: boolean;
}

const OrderList: React.FC<OrderListProps> = ({ orders, onStatusChange, loading = false }) => {
  const statusColors = {
    pending: 'bg-yellow-500/20 text-yellow-600 border-yellow-500/30',
    processing: 'bg-blue-500/20 text-blue-600 border-blue-500/30',
    shipped: 'bg-purple-500/20 text-purple-600 border-purple-500/30',
    delivered: 'bg-green-500/20 text-green-600 border-green-500/30',
    cancelled: 'bg-red-500/20 text-red-600 border-red-500/30',
  };

  const statusLabels = {
    pending: 'Ожидание',
    processing: 'В обработке',
    shipped: 'Отправлен',
    delivered: 'Доставлен',
    cancelled: 'Отменен',
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center justify-between p-4 border-b border-border">
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded w-32"></div>
              <div className="h-3 bg-muted rounded w-24"></div>
            </div>
            <div className="flex space-x-2">
              <div className="h-8 bg-muted rounded w-16"></div>
              <div className="h-8 bg-muted rounded w-16"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12 card">
        <div className="text-6xl mb-4">📦</div>
        <h3 className="text-lg font-medium text-foreground mb-2">Заказы не найдены</h3>
        <p className="text-muted-foreground">Нет заказов для отображения</p>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Заказ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Клиент
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Адрес доставки
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Товары
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Сумма
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Статус
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Дата
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {orders.map((order) => (
              <tr key={order._id} className="hover:bg-muted/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-foreground">
                    #{order.orderNumber || order._id.slice(-8)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {order.paymentMethod}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-foreground">
                    {order.user.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {order.user.email}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-foreground max-w-xs">
                    {order.shippingAddress ? (
                      <>
                        <div>{order.shippingAddress.city}</div>
                        <div className="text-muted-foreground text-xs">
                          {order.shippingAddress.street}
                        </div>
                      </>
                    ) : (
                      <span className="text-muted-foreground">Не указан</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-foreground">
                  {order.items.length} товар(ов)
                </td>
                <td className="px-6 py-4 text-sm font-medium text-foreground">
                  {formatPrice(order.totalPrice)}
                </td>
                <td className="px-6 py-4">
                  <select
                    value={order.status}
                    onChange={(e) => onStatusChange(order._id, e.target.value as OrderData['status'])}
                    className={`text-sm border rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors ${
                      statusColors[order.status]
                    }`}
                  >
                    <option value="pending">Ожидание</option>
                    <option value="processing">В обработке</option>
                    <option value="shipped">Отправлен</option>
                    <option value="delivered">Доставлен</option>
                    <option value="cancelled">Отменен</option>
                  </select>
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {formatDate(order.createdAt)}
                </td>
                <td className="px-6 py-4 text-right text-sm font-medium">
                  <button className="text-primary hover:text-primary/80 transition-colors">
                    Подробнее
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderList;