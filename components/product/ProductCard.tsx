// components/product/ProductCard.tsx
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { formatPrice } from '@/lib/utils';
import AddToCartButton from '@/components/cart/AddToCartButton';
import AddToFavoritesButton from '@/components/favorites/AddToFavoritesButton';
import { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount 
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300">
      <Link href={`/products/${product.slug}`} className="block relative">
        <div className="relative aspect-square overflow-hidden bg-secondary">
          <Image
            src={product.image || '/images/placeholder.jpg'}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col space-y-1">
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

          {/* Quick actions */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <AddToFavoritesButton
              product={{
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                slug: product.slug,
              }}
              size="sm"
            />
          </div>

          {/* Out of stock overlay */}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
              <span className="text-foreground font-semibold bg-background/80 px-3 py-1 rounded">
                Нет в наличии
              </span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        {/* Brand */}
        {product.brand && (
          <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">
            {product.brand}
          </p>
        )}
        
        {/* Product name */}
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-medium text-foreground mb-2 hover:text-primary line-clamp-2 transition-colors text-sm leading-tight">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center mb-3">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-xs">
                {i < Math.floor(product.ratings.average) ? '★' : '☆'}
              </span>
            ))}
          </div>
          <span className="text-xs text-muted-foreground ml-2">
            ({product.ratings.count})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-foreground">
              {formatPrice(product.price)}
            </span>
            {hasDiscount && product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
        </div>

        {/* Add to cart button */}
        <AddToCartButton
          product={product}
          className="text-sm"
          size="sm"
        />
      </div>
    </Card>
  );
};

export default ProductCard;