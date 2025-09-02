import React from 'react';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';
import AddToCartButton from '@/components/cart/AddToCartButton';

interface ProductDetailProps {
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    originalPrice?: number;
    images: string[];
    stock: number;
    ratings: {
      average: number;
      count: number;
    };
    specifications?: Record<string, string>;
    category: string;
    sku: string;
  };
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product }) => {
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src={product.images[0] || '/images/placeholder.jpg'}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.slice(1).map((image, index) => (
                <div key={index} className="relative aspect-square bg-gray-100 rounded overflow-hidden">
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 2}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <span key={i}>
                    {i < Math.floor(product.ratings.average) ? '★' : '☆'}
                  </span>
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-600">
                ({product.ratings.count} reviews)
              </span>
            </div>
            
            <span className="text-sm text-gray-500">SKU: {product.sku}</span>
            <span className="text-sm text-gray-500">Category: {product.category}</span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-3xl font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
            {hasDiscount && (
              <span className="text-xl text-gray-500 line-through">
                {formatPrice(product.originalPrice!)}
              </span>
            )}
          </div>

          <div className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </div>

          <div className="prose prose-gray max-w-none">
            <p>{product.description}</p>
          </div>

          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Specifications</h3>
              <dl className="grid grid-cols-1 gap-2">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex">
                    <dt className="font-medium text-gray-900 w-32 flex-shrink-0">{key}:</dt>
                    <dd className="text-gray-600">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          <AddToCartButton
            product={{
              id: product.id,
              name: product.name,
              price: product.price,
              image: product.images[0],
              stock: product.stock,
            }}
            className="max-w-xs"
          />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;