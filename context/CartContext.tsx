// context/CartContext.tsx
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { CartItem } from '@/types/product';

export interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity' | 'productId'>) => Promise<void>; // Изменено здесь
  removeItem: (id: string, size?: string, color?: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number, size?: string, color?: string) => Promise<void>;
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

  // Генерация уникального ID для элемента корзины с учетом размера и цвета
  const generateCartItemId = (id: string, size?: string, color?: string) => {
    return `${id}-${size || 'no-size'}-${color || 'no-color'}`;
  };

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

  const addItem = async (item: Omit<CartItem, 'quantity' | 'productId'>) => { // Изменено здесь
    const cartItemId = generateCartItemId(item.id, item.size, item.color);
    
    setItems(prev => {
      const existingItem = prev.find(i => 
        generateCartItemId(i.id, i.size, i.color) === cartItemId
      );
      
      let newItems: CartItem[];
      
      if (existingItem) {
        newItems = prev.map(i =>
          generateCartItemId(i.id, i.size, i.color) === cartItemId
            ? { ...i, quantity: Math.min(i.quantity + 1, item.stock) }
            : i
        );
      } else {
        newItems = [...prev, { 
          ...item, 
          quantity: 1, 
          productId: item.id // Добавляем productId здесь
        }];
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

  const removeItem = async (id: string, size?: string, color?: string) => {
    const cartItemId = generateCartItemId(id, size, color);
    
    setItems(prev => {
      const newItems = prev.filter(item => 
        generateCartItemId(item.id, item.size, item.color) !== cartItemId
      );
      
      if (!isAuthenticated) {
        localStorage.setItem('cart', JSON.stringify(newItems));
      }
      
      syncCartWithServer(newItems);
      return newItems;
    });
  };

  const updateQuantity = async (id: string, quantity: number, size?: string, color?: string) => {
    if (quantity <= 0) {
      removeItem(id, size, color);
      return;
    }

    const cartItemId = generateCartItemId(id, size, color);
    
    setItems(prev => {
      const newItems = prev.map(item =>
        generateCartItemId(item.id, item.size, item.color) === cartItemId
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