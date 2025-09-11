// context/FavoritesContext.tsx
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

export interface FavoriteItem {
  id: string;
  name: string;
  price: number;
  image: string;
  slug: string;
  addedAt: Date;
}

interface FavoritesContextType {
  items: FavoriteItem[];
  addFavorite: (item: Omit<FavoriteItem, 'addedAt'>) => Promise<void>;
  removeFavorite: (id: string) => Promise<void>;
  isFavorite: (id: string) => boolean;
  loading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType>({
  items: [],
  addFavorite: async () => {},
  removeFavorite: async () => {},
  isFavorite: () => false,
  loading: false,
});

export const useFavorites = () => useContext(FavoritesContext);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  // Загрузка избранного при монтировании
  useEffect(() => {
    loadFavorites();
  }, [isAuthenticated]);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      if (isAuthenticated) {
        // Загрузка с сервера для авторизованных пользователей
        const response = await fetch('/api/favorites');
        if (response.ok) {
          const data = await response.json();
          setItems(data.favorites || []);
        }
      } else {
        // Загрузка из localStorage для гостей
        const savedFavorites = localStorage.getItem('favorites');
        if (savedFavorites) {
          setItems(JSON.parse(savedFavorites));
        }
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const addFavorite = async (item: Omit<FavoriteItem, 'addedAt'>) => {
    const newItem = { ...item, addedAt: new Date() };
    
    if (isAuthenticated) {
      // Синхронизация с сервером
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId: item.id }),
      });

      if (response.ok) {
        setItems(prev => [...prev, newItem]);
      }
    } else {
      // Локальное хранение для гостей
      setItems(prev => {
        const newItems = [...prev, newItem];
        localStorage.setItem('favorites', JSON.stringify(newItems));
        return newItems;
      });
    }
  };

  const removeFavorite = async (id: string) => {
    if (isAuthenticated) {
      // Удаление с сервера
      const response = await fetch(`/api/favorites/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setItems(prev => prev.filter(item => item.id !== id));
      }
    } else {
      // Локальное удаление для гостей
      setItems(prev => {
        const newItems = prev.filter(item => item.id !== id);
        localStorage.setItem('favorites', JSON.stringify(newItems));
        return newItems;
      });
    }
  };

  const isFavorite = (id: string) => {
    return items.some(item => item.id === id);
  };

  return (
    <FavoritesContext.Provider
      value={{
        items,
        addFavorite,
        removeFavorite,
        isFavorite,
        loading,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};