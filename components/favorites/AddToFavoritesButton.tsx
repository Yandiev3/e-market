// components/favorites/AddToFavoritesButton.tsx
'use client';

import React, { useState } from 'react';
import { useFavorites } from '@/context/FavoritesContext';
import { useAuth } from '@/context/AuthContext';
import { Product } from '@/types/product';

interface AddToFavoritesButtonProps {
  product: Product;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const AddToFavoritesButton: React.FC<AddToFavoritesButtonProps> = ({
  product,
  className = '',
  size = 'md',
}) => {
  const { addFavorite, removeFavorite, isFavorite, loading } = useFavorites();
  const { isAuthenticated } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);

  const favorite = isFavorite(product.id);

  const handleToggleFavorite = async () => {
    if (loading || isProcessing) return;
    
    setIsProcessing(true);
    try {
      if (favorite) {
        await removeFavorite(product.id);
      } else {
        await addFavorite(product);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <button
      onClick={handleToggleFavorite}
      disabled={loading || isProcessing}
      className={`flex items-center justify-center rounded-full bg-background/80 backdrop-blur-sm border border-border shadow-md hover:shadow-lg transition-all duration-200 ${
        favorite ? 'text-primary' : 'text-muted-foreground hover:text-primary'
      } ${sizeClasses[size]} ${className}`}
      title={favorite ? 'Удалить из избранного' : 'Добавить в избранное'}
    >
      {isProcessing ? (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
      ) : (
        <svg
          className={iconSizes[size]}
          fill={favorite ? 'currentColor' : 'none'}
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={favorite ? 0 : 1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
          />
        </svg>
      )}
    </button>
  );
};

export default AddToFavoritesButton;