// app/(admin)/analytics/page.tsx
import AnalyticsDashboard from '@/components/admin/AnalyticsDashboard';

export default function AnalyticsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Аналитика</h1>
        <p className="text-muted-foreground mt-2">Статистика продаж и активности магазина</p>
      </div>
      <AnalyticsDashboard />
    </div>
  );
}