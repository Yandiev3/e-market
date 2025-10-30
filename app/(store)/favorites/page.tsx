// app/(store)/favorites/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { useFavorites } from '@/context/FavoritesContext';
import ProductCard from '@/components/product/ProductCard';
import Button from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Heart } from 'lucide-react';

export default function FavoritesPage() {
  const { items: favoriteProducts, loading } = useFavorites();

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-8 w-8 bg-muted rounded-full animate-pulse"></div>
            <div className="h-8 w-48 bg-muted rounded animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-lg p-4 animate-pulse">
                <div className="aspect-square bg-muted rounded-lg mb-4"></div>
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-4 bg-muted rounded w-2/3 mb-4"></div>
                <div className="h-10 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {favoriteProducts.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="h-24 w-24 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-semibold mb-2 text-foreground">Ваше избранное пусто</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Добавляйте товары в избранное, чтобы не потерять их и быстро вернуться к понравившимся моделям
            </p>
            <Link href="/products">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Начать покупки
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <Heart className="h-4 w-4 text-primary-foreground" />
                </div>
                <h1 className="text-3xl font-bold text-foreground">Избранное</h1>
              </div>
              <div className="text-muted-foreground">
                {favoriteProducts.length} товар{favoriteProducts.length === 1 ? '' : favoriteProducts.length > 1 && favoriteProducts.length < 5 ? 'а' : 'ов'}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favoriteProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
            
            <div className="mt-12 border-t border-border pt-8 text-center">
              <h2 className="text-xl font-semibold text-foreground mb-4">Найдите больше интересных товаров</h2>
              <Link href="/products">
                <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                  Показать все товары
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}