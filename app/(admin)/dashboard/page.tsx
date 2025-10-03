// app/(admin)/dashboard/page.tsx
import AdminDashboard from '@/components/admin/AdminDashboard';

export default function DashboardPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Дашборд</h1>
          <p className="text-muted-foreground mt-2">Обзор статистики и активности магазина</p>
        </div>
      </div>
      <AdminDashboard />
    </div>
  );
}