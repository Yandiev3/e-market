"use client";

// app/(admin)/orders/page.tsx
import { useState, useEffect } from 'react';
import OrderList from '@/components/admin/OrderList';

interface OrderItem {
  product: {
    name: string;
  };
  quantity: number;
  price: number;
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
        // Обновляем список заказов после изменения статуса
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

  // Преобразуем данные из API в формат для OrderList
  const transformedOrders = orders.map(order => ({
    _id: order._id,
    orderNumber: order.orderNumber,
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
    }))
  }));

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Управление заказами</h1>
      <OrderList 
        orders={transformedOrders}
        onStatusChange={handleStatusChange}
        loading={loading}
      />
    </div>
  );
}