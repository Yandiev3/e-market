// app/(admin)/manage-products/edit/[id]/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
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

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<ProductFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/admin/products/${id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch product');
        }
        
        const productData = await response.json();
        setProduct(productData);
      } catch (error) {
        console.error('Error fetching product:', error);
        alert('Ошибка при загрузке товара');
        router.push('/admin/manage-products');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, router]);

  const handleSubmit = async (formData: ProductFormData) => {
    try {
      setSubmitting(true);
      
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update product');
      }

      // Перенаправляем на страницу управления товарами
      router.push('/manage-products');
      router.refresh();
      
    } catch (error: any) {
      console.error('Error updating product:', error);
      alert(error.message || 'Ошибка при обновлении товара');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Редактирование товара</h1>
          <p className="text-muted-foreground mt-2">Загрузка...</p>
        </div>
        <div className="animate-pulse">
          <div className="card p-6 h-96"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Товар не найден</h1>
          <p className="text-muted-foreground mt-2">
            Товар, который вы пытаетесь редактировать, не существует.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Редактирование товара</h1>
        <p className="text-muted-foreground mt-2">
          Измените информацию о товаре
        </p>
      </div>
      
      <ProductForm 
        initialData={product}
        onSubmit={handleSubmit}
        loading={submitting}
      />
    </div>
  );
}