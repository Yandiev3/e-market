// app/(admin)/manage-products/page.tsx
"use client";

import { useState, useEffect } from 'react';
import ProductList from '@/components/admin/ProductList';
import Button from '@/components/ui/Button';

interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
  active: boolean;
  featured: boolean;
  category: string;
  brand: string;
  images: string[];
  createdAt: string;
}

export default function ManageProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
      } else {
        console.error('Failed to fetch products');
        setProducts([]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId: string) => {
    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchProducts();
      } else {
        console.error('Failed to delete product');
        alert('Ошибка при удалении товара');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Ошибка при удалении товара');
    }
  };

  const handleToggleStatus = async (productId: string, active: boolean) => {
    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ active }),
      });

      if (response.ok) {
        fetchProducts();
      } else {
        console.error('Failed to update product status');
        alert('Ошибка при изменении статуса товара');
      }
    } catch (error) {
      console.error('Error updating product status:', error);
      alert('Ошибка при изменении статуса товара');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Управление товарами</h1>
          <p className="text-muted-foreground mt-2">Создание и редактирование товаров магазина</p>
        </div>
        <Button href="/admin/manage-products/new">
          Добавить товар
        </Button>
      </div>
      <ProductList 
        products={products}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
        loading={loading}
      />
    </div>
  );
}