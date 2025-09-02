import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function ProductsLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  );
}