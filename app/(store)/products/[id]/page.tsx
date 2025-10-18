// app/(store)/products/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import ProductDetail from '@/components/product/ProductDetail';
import { IProduct } from '@/types/product';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/products/${id}`);
        
        if (!response.ok) {
          throw new Error('Product not found');
        }
        
        const productData = await response.json();
        
        // Преобразуем данные в формат, ожидаемый ProductDetail
        const formattedProduct: IProduct = {
 _id: productData._id || productData.id,
          name: productData.name,
          description: productData.description,
          price: productData.price,
          originalPrice: productData.originalPrice,
          images: productData.images || [productData.image].filter(Boolean),
          category: productData.category,
          active: productData.active ?? true,
          brand: productData.brand,
          slug: productData.slug,
          ratings: productData.ratings || { average: 0, count: 0 },
          specifications: productData.specifications,
          sku: productData.sku,
          sizes: productData.sizes || [],
          colors: productData.colors || [],
          gender: productData.gender || 'unisex',
          ageCategory: productData.ageCategory,
          featured: productData.featured || false,
          createdAt: productData.createdAt ? new Date(productData.createdAt) : new Date(),
          updatedAt: productData.updatedAt ? new Date(productData.updatedAt) : new Date(),
        };

        setProduct(formattedProduct);
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Не удалось загрузить товар');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Image skeleton */}
              <div className="space-y-4">
                <div className="aspect-square bg-muted rounded-lg"></div>
                <div className="grid grid-cols-4 gap-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="aspect-square bg-muted rounded"></div>
                  ))}
                </div>
              </div>
              
              {/* Content skeleton */}
              <div className="space-y-6">
                <div>
                  <div className="h-4 bg-muted rounded w-1/4 mb-2"></div>
                  <div className="h-8 bg-muted rounded w-3/4 mb-4"></div>
                  <div className="h-6 bg-muted rounded w-1/4"></div>
                </div>
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-2/3"></div>
                <div className="h-12 bg-muted rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold mb-4">Товар не найден</h2>
            <p className="text-muted-foreground mb-6">
              {error || 'Товар, который вы ищете, не существует или был удален.'}
            </p>
            <button 
              onClick={() => window.location.href = '/products'}
              className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Вернуться к товарам
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <ProductDetail product={product} />;
}