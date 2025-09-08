// components/cart/CartItem.tsx
import React from 'react';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';

interface CartItemProps {
  item: {
    id: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
    size?: string;
    color?: string;
  };
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onUpdateQuantity, onRemove }) => {
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      onUpdateQuantity(item.id, newQuantity);
    }
  };

  return (
    <div className="flex items-center py-6 border-b border-gray-200 last:border-b-0">
      {/* Product image */}
      <div className="relative w-20 h-20 md:w-24 md:h-24 flex-shrink-0">
        <Image
          src={item.image || '/images/placeholder.jpg'}
          alt={item.name}
          fill
          className="object-cover rounded"
        />
      </div>

      {/* Product info */}
      <div className="ml-4 flex-1 min-w-0">
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
          {item.name}
        </h3>
        
        {/* Size and color */}
        {(item.size || item.color) && (
          <div className="mt-1 text-xs text-gray-500">
            {item.size && <span>Размер: {item.size}</span>}
            {item.size && item.color && <span className="mx-2">•</span>}
            {item.color && <span>Цвет: {item.color}</span>}
          </div>
        )}

        {/* Price */}
        <div className="mt-2 text-sm font-semibold text-gray-900">
          {formatPrice(item.price)}
        </div>

        {/* Quantity controls */}
        <div className="mt-3 flex items-center">
          <div className="flex items-center border border-gray-300 rounded-md">
            <button
              onClick={() => handleQuantityChange(item.quantity - 1)}
              disabled={item.quantity <= 1}
              className="px-3 py-1 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              −
            </button>
            <span className="px-3 py-1 text-sm font-medium w-8 text-center">
              {item.quantity}
            </span>
            <button
              onClick={() => handleQuantityChange(item.quantity + 1)}
              disabled={item.quantity >= 10}
              className="px-3 py-1 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              +
            </button>
          </div>

          {/* Remove button */}
          <button
            onClick={() => onRemove(item.id)}
            className="ml-4 text-red-600 hover:text-red-800 text-sm font-medium"
          >
            Удалить
          </button>
        </div>
      </div>

      {/* Total price */}
      <div className="ml-4 text-right">
        <div className="text-lg font-semibold text-gray-900">
          {formatPrice(item.price * item.quantity)}
        </div>
      </div>
    </div>
  );
};

export default CartItem;