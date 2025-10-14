// app/(admin)/manage-products/new/page.tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProductForm from '@/components/admin/ProductForm';

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  brand: string;
  sku: string;
  slug: string;
  featured: boolean;
  active: boolean;
  gender: 'men' | 'women' | 'kids' | 'unisex';
  ageCategory?: 'infant' | 'toddler' | 'child' | 'teen';
  specifications: Record<string, string>;
  sizes: { size: string; inStock: boolean; stockQuantity: number }[];
  colors: { name: string; value: string }[];
}

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData: ProductFormData) => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create product');
      }

      const product = await response.json();
      
      // Перенаправляем на страницу управления товарами
      router.push('/admin/manage-products');
      router.refresh();
      
    } catch (error: any) {
      console.error('Error creating product:', error);
      alert(error.message || 'Ошибка при создании товара');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Добавить новый товар</h1>
        <p className="text-muted-foreground mt-2">
          Заполните информацию о новом товаре
        </p>
      </div>
      
      <ProductForm 
        onSubmit={handleSubmit}
        loading={loading}
      />
    </div>
  );
}