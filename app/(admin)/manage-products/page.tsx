// app/(admin)/manage-products/page.tsx
import ProductList from '@/components/admin/ProductList';

export default function ManageProductsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Products Management</h1>
      <ProductList />
    </div>
  );
}