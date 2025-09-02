'use client';

import React from 'react';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import Button from '@/components/ui/Button';

interface CartItemProps {
  item: {
    id: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
    stock: number;
  };
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeItem } = useCart();

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(item.id);
    } else {
      updateQuantity(item.id, newQuantity);
    }
  };

  return (
    <div className="flex items-center space-x-4 border-b border-gray-200 py-4">
      <div className="relative w-16 h-16 flex-shrink-0">
        <Image
          src={item.image || '/images/placeholder.jpg'}
          alt={item.name}
          fill
          className="object-cover rounded"
        />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-gray-900 truncate">
          {item.name}
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          {formatPrice(item.price)}
        </p>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={() => handleQuantityChange(item.quantity - 1)}
          className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-50"
        >
          -
        </button>
        
        <span className="w-8 text-center text-sm font-medium">
          {item.quantity}
        </span>
        
        <button
          onClick={() => handleQuantityChange(item.quantity + 1)}
          disabled={item.quantity >= item.stock}
          className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          +
        </button>
      </div>

      <div className="flex flex-col items-end space-y-2">
        <p className="text-sm font-medium text-gray-900">
          {formatPrice(item.price * item.quantity)}
        </p>
        
        <Button
          variant="danger"
          size="sm"
          onClick={() => removeItem(item.id)}
          className="text-xs"
        >
          Remove
        </Button>
      </div>
    </div>
  );
};

export default CartItem;