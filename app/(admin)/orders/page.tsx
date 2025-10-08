// app/(admin)/orders/page.tsx
"use client";

import { useState, useEffect } from 'react';
import OrderList from '@/components/admin/OrderList';

interface OrderItem {
  product: {
    name: string;
  };
  quantity: number;
  price: number;
}

interface ShippingAddress {
  street: string;
  // city: string;
}

interface ApiOrder {
  _id: string;
  orderNumber: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  totalPrice: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod?: string;
  createdAt: string;
  orderItems: OrderItem[];
  shippingAddress: ShippingAddress;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/orders');
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      } else {
        console.error('Failed to fetch orders');
        setOrders([]);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, status: ApiOrder['status']) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        fetchOrders();
      } else {
        console.error('Failed to update order status');
        alert('Ошибка при обновлении статуса заказа');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Ошибка при обновлении статуса заказа');
    }
  };

  const transformedOrders = orders.map(order => ({
    _id: order._id,
    orderNumber: order.orderNumber || order._id.slice(-8),
    user: {
      name: order.user.name,
      email: order.user.email,
    },
    totalPrice: order.totalPrice,
    status: order.status,
    paymentMethod: order.paymentMethod || 'Не указан',
    createdAt: order.createdAt,
    items: order.orderItems.map(item => ({
      name: item.product?.name || 'Товар',
      quantity: item.quantity,
      price: item.price,
    })),
    shippingAddress: order.shippingAddress
  }));

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Управление заказами</h1>
        <p className="text-muted-foreground mt-2">Просмотр и управление заказами клиентов</p>
      </div>
      <OrderList 
        orders={transformedOrders}
        onStatusChange={handleStatusChange}
        loading={loading}
      />
    </div>
  );
}