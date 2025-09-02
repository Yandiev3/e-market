import OrderList from '@/components/admin/OrderList';

export default function OrdersPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Orders Management</h1>
      <OrderList />
    </div>
  );
}