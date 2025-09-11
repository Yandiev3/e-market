// app/(store)/favorites/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useFavorites } from '@/context/FavoritesContext';
import { formatPrice } from '@/lib/utils';
import Button from '@/components/ui/Button';
import AddToCartButton from '@/components/cart/AddToCartButton';

export default function FavoritesPage() {
  const { items, removeFavorite, loading } = useFavorites();

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-4 shadow">
                <div className="aspect-square bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <div className="text-6xl mb-6">❤️</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Ваш список избранного пуст</h1>
        <p className="text-gray-600 mb-8">
          Добавляйте товары в избранное, чтобы не потерять их
        </p>
        <Link href="/products">
          <Button>Начать покупки</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Избранное</h1>
        <span className="text-gray-600">{items.length} товаров</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="relative aspect-square mb-4">
              <Image
                src={item.image || '/images/placeholder.jpg'}
                alt={item.name}
                fill
                className="object-cover rounded"
              />
              <button
                onClick={() => removeFavorite(item.id)}
                className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:text-red-500 transition-colors"
                title="Удалить из избранного"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>
            </div>

            <Link href={`/products/${item.slug}`}>
              <h3 className="font-medium text-gray-900 mb-2 hover:text-blue-600 line-clamp-2">
                {item.name}
              </h3>
            </Link>

            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-bold text-gray-900">
                {formatPrice(item.price)}
              </span>
            </div>

            <AddToCartButton
              product={{
                id: item.id,
                name: item.name,
                price: item.price,
                image: item.image,
                stock: 10, // Assuming available stock
              }}
              className="w-full"
            />
          </div>
        ))}
      </div>

      <div className="mt-12 border-t pt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Вам также может понравиться</h2>
        <Link href="/products">
          <Button variant="outline">Показать больше товаров</Button>
        </Link>
      </div>
    </div>
  );
}