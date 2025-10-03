// app/(store)/products/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/Radio-group';
import { Truck, Shield, RotateCcw } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import AddToCartButton from '@/components/cart/AddToCartButton';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  sizes: { size: string; inStock: boolean }[];
  description: string;
  details: string[];
  stock: number;
  brand: string;
  slug: string;
  ratings: {
    average: number;
    count: number;
  };
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [product, setProduct] = useState<Product | null>(null);
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
        setProduct(productData);
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Failed to load product');
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
            <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
            <p className="text-muted-foreground mb-6">{error || 'The product you are looking for does not exist.'}</p>
            <Button onClick={() => window.location.href = '/products'}>
              Back to Products
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount 
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-background">

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg bg-secondary relative">
              <img
                src={product.images[selectedImage] || product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {hasDiscount && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  -{discountPercent}%
                </div>
              )}
            </div>
            
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`aspect-square overflow-hidden rounded border-2 transition-colors ${
                      selectedImage === idx 
                        ? 'border-primary' 
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <span className="text-sm text-muted-foreground uppercase tracking-wider">
                {product.category === "shoes" ? "Обувь" : "Одежда"}
              </span>
              <h1 className="text-4xl font-bold mt-2 mb-4">{product.name}</h1>
              
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-sm">
                      {i < Math.floor(product.ratings.average) ? '★' : '☆'}
                    </span>
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  ({product.ratings.count} отзывов)
                </span>
              </div>

              <div className="flex items-center space-x-3">
                <span className="text-3xl font-bold text-primary">
                  {formatPrice(product.price)}
                </span>
                {hasDiscount && product.originalPrice && (
                  <>
                    <span className="text-xl text-muted-foreground line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                    <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm font-medium">
                      Экономия {discountPercent}%
                    </span>
                  </>
                )}
              </div>
            </div>

            <p className="text-muted-foreground text-lg leading-relaxed">
              {product.description}
            </p>

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <Label className="text-base font-semibold mb-3 block">
                  Выберите размер
                </Label>
                <RadioGroup value={selectedSize} onValueChange={setSelectedSize}>
                  <div className="grid grid-cols-5 gap-2">
                    {product.sizes.map((sizeObj) => (
                      <RadioGroupItem
                        key={sizeObj.size}
                        value={sizeObj.size}
                        id={sizeObj.size}
                        className="w-full"
                      >
                        <Label
                          htmlFor={sizeObj.size}
                          className={`flex items-center justify-center rounded-md border-2 px-3 py-3 cursor-pointer transition-all text-sm font-medium w-full ${
                            selectedSize === sizeObj.size
                              ? 'border-primary bg-primary text-primary-foreground'
                              : sizeObj.inStock
                              ? 'border-border bg-secondary hover:bg-accent hover:text-accent-foreground'
                              : 'border-border bg-muted text-muted-foreground cursor-not-allowed'
                          }`}
                        >
                          {sizeObj.size}
                        </Label>
                      </RadioGroupItem>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            )}

            {/* Stock status */}
            <div className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
              {product.stock > 0 ? `✓ В наличии: ${product.stock} шт.` : '✗ Нет в наличии'}
            </div>

            {/* Add to cart */}
            <AddToCartButton
              product={{
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                stock: product.stock,
              }}
              disabled={!selectedSize || product.stock === 0}
              size="lg"
              className="w-full"
            />

            {/* Product Details */}
            {product.details && product.details.length > 0 && (
              <Card className="p-6">
                <h3 className="font-semibold mb-4 text-lg">Характеристики</h3>
                <ul className="space-y-2">
                  {product.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <span className="text-primary mt-1">•</span>
                      <span className="text-muted-foreground">{detail}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {/* Benefits */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="text-center">
                <Truck className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="text-xs text-muted-foreground">Бесплатная доставка</p>
              </div>
              <div className="text-center">
                <Shield className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="text-xs text-muted-foreground">Гарантия качества</p>
              </div>
              <div className="text-center">
                <RotateCcw className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="text-xs text-muted-foreground">Возврат 30 дней</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}