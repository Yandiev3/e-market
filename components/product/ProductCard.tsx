// components/product/ProductCard.tsx
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { formatPrice } from '@/lib/utils';
import AddToCartButton from '@/components/cart/AddToCartButton';
import AddToFavoritesButton from '@/components/favorites/AddToFavoritesButton';
import { Product } from '@/types/product';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const hasDiscount = product.originalPrice !== undefined && product.originalPrice > product.price;
  const discountPercent = hasDiscount && product.originalPrice 
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  const ratings = product.ratings || { average: 0, count: 0 };
  const averageRating = Math.max(0, Math.min(5, ratings.average || 0));
  const ratingCount = ratings.count || 0;

  // Общее количество на складе
  const totalStock = product.sizes?.reduce((total, size) => total + size.stockQuantity, 0) || 0;

  // Получаем массив изображений
  const images = product.images && product.images.length > 0 
    ? product.images 
    : [product.image || '/images/placeholder.jpg'];

  const hasMultipleImages = images.length > 1;

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToImage = (index: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex(index);
  };

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="relative">
        <Link href={`/products/${product.slug}`} className="block relative">
          <div className="relative aspect-square overflow-hidden bg-secondary">
            <Image
              src={images[currentImageIndex]}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            
            {/* Кнопки навигации карусели */}
            {hasMultipleImages && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
                  aria-label="Предыдущее изображение"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
                  aria-label="Следующее изображение"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </>
            )}

            {/* Индикаторы изображений */}
            {hasMultipleImages && (
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1 z-10">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => goToImage(index, e)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentImageIndex 
                        ? 'bg-white/50' 
                        : 'bg-black/30 hover:bg-white/70'
                    }`}
                    aria-label={`Перейти к изображению ${index + 1}`}
                  />
                ))}
              </div>
            )}

            <div className="absolute top-2 left-2 flex flex-col space-y-1 z-10">
              {hasDiscount && (
                <div className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                  -{discountPercent}%
                </div>
              )}
              {product.isNew && (
                <div className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-bold">
                  NEW
                </div>
              )}
            </div>

            {totalStock === 0 && (
              <div className="absolute inset-0 bg-background/60 flex items-center justify-center z-20">
                <span className="text-foreground font-semibold bg-background/80 px-3 py-1 rounded">
                  Нет в наличии
                </span>
              </div>
            )}
          </div>
        </Link>

        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <AddToFavoritesButton
            product={{
              id: product.id,
              name: product.name,
              price: product.price,
              originalPrice: product.originalPrice,
              image: images[0],
              slug: product.slug,
              sizes: product.sizes,
              ratings: product.ratings,
              brand: product.brand,
              category: product.category,
            }}
            size="sm"
          />
        </div>
      </div>

      <div className="p-4">
        {product.brand && (
          <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">
            {product.brand}
          </p>
        )}
        
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-medium text-foreground mb-2 hover:text-primary line-clamp-2 transition-colors text-sm leading-tight">
            {product.name}
          </h3>
        </Link>

        {/* {ratingCount > 0 && (
          <div className="flex items-center mb-3">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-xs">
                  {i < Math.floor(averageRating) ? '★' : '☆'}
                </span>
              ))}
            </div>
            <span className="text-xs text-muted-foreground ml-2">
              ({ratingCount})
            </span>
          </div>
        )} */}

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-foreground">
              {formatPrice(product.price)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.originalPrice!)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;