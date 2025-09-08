// components/product/ProductCard.tsx
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import AddToCartButton from '@/components/cart/AddToCartButton';

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  slug: string;
  stock: number;
  ratings: {
    average: number;
    count: number;
  };
  brand?: string;
  isNew?: boolean;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount 
    ? Math.round((1 - product.price / product.originalPrice!) * 100)
    : 0;

  return (
    <div className="group bg-white rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300">
      <Link href={`/products/${product.slug}`} className="block relative">
        <div className="relative aspect-square overflow-hidden bg-gray-100">
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
            <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>

          {/* Out of stock overlay */}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
              <span className="text-white font-semibold">Нет в наличии</span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-3">
        {/* Brand */}
        {product.brand && (
          <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">
            {product.brand}
          </p>
        )}
        
        {/* Product name */}
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-normal text-gray-900 mb-2 hover:text-blue-600 line-clamp-2 transition-colors text-sm leading-tight">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.originalPrice!)}
              </span>
            )}
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center mb-3">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-xs">
                {i < Math.floor(product.ratings.average) ? '★' : '☆'}
              </span>
            ))}
          </div>
          <span className="text-xs text-gray-500 ml-2">
            ({product.ratings.count})
          </span>
        </div>

        {/* Add to cart button */}
        <AddToCartButton
          product={product}
          className="text-sm"
        />
      </div>
    </div>
  );
};

export default ProductCard;