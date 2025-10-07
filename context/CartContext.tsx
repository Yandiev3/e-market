// context/CartContext.tsx
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  createOrder: (orderData: any) => Promise<{ success: boolean; order?: any; error?: string }>;
  totalItems: number;
  totalPrice: number;
  loading: boolean;
}

const CartContext = createContext<CartContextType>({
  items: [],
  addItem: async () => {},
  removeItem: async () => {},
  updateQuantity: async () => {},
  clearCart: async () => {},
  createOrder: async () => ({ success: false }),
  totalItems: 0,
  totalPrice: 0,
  loading: false,
});

export const useCart = () => useContext(CartContext);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    loadCart();
  }, [isAuthenticated]);

  const loadCart = async () => {
    try {
      setLoading(true);
      if (isAuthenticated) {
        // Загрузка корзины с сервера
        const response = await fetch('/api/cart');
        if (response.ok) {
          const data = await response.json();
          setItems(data.cart || []);
        }
      } else {
        // Загрузка из localStorage для гостей
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          setItems(JSON.parse(savedCart));
        }
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const syncCartWithServer = async (newItems: CartItem[]) => {
    if (isAuthenticated) {
      try {
        await fetch('/api/cart', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ cart: newItems }),
        });
      } catch (error) {
        console.error('Error syncing cart with server:', error);
      }
    }
  };

  const addItem = async (item: Omit<CartItem, 'quantity'>) => {
    setItems(prev => {
      const existingItem = prev.find(i => i.id === item.id);
      let newItems: CartItem[];
      
      if (existingItem) {
        newItems = prev.map(i =>
          i.id === item.id
            ? { ...i, quantity: Math.min(i.quantity + 1, item.stock) }
            : i
        );
      } else {
        newItems = [...prev, { ...item, quantity: 1 }];
      }

      // Сохранение в localStorage для гостей
      if (!isAuthenticated) {
        localStorage.setItem('cart', JSON.stringify(newItems));
      }

      // Синхронизация с сервером
      syncCartWithServer(newItems);
      
      return newItems;
    });
  };

  const removeItem = async (id: string) => {
    setItems(prev => {
      const newItems = prev.filter(item => item.id !== id);
      
      if (!isAuthenticated) {
        localStorage.setItem('cart', JSON.stringify(newItems));
      }
      
      syncCartWithServer(newItems);
      return newItems;
    });
  };

  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }

    setItems(prev => {
      const newItems = prev.map(item =>
        item.id === id
          ? { ...item, quantity: Math.min(quantity, item.stock) }
          : item
      );

      if (!isAuthenticated) {
        localStorage.setItem('cart', JSON.stringify(newItems));
      }

      syncCartWithServer(newItems);
      return newItems;
    });
  };

  const clearCart = async () => {
    setItems([]);
    
    if (!isAuthenticated) {
      localStorage.removeItem('cart');
    }
    
    if (isAuthenticated) {
      try {
        await fetch('/api/cart', {
          method: 'DELETE',
        });
      } catch (error) {
        console.error('Error clearing cart:', error);
      }
    }
  };

  const createOrder = async (orderData: any) => {
    try {
      console.log('Creating order with data:', {
        ...orderData,
        items: items
      });

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...orderData,
          items: items,
        }),
      });

      const data = await response.json();
      console.log('Order creation response:', data);

      if (response.ok) {
        // Clear cart on successful order
        await clearCart();
        return { success: true, order: data.order };
      } else {
        return { 
          success: false, 
          error: data.message || 'Не удалось создать заказ' 
        };
      }
    } catch (error: any) {
      console.error('Order creation error:', error);
      return { 
        success: false, 
        error: error.message || 'Ошибка сети' 
      };
    }
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        createOrder,
        totalItems,
        totalPrice,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};