// components/cart/AddToCartButton.tsx
'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import Button from '@/components/ui/Button';

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  stock: number;
}

interface AddToCartButtonProps {
  product: Product;
  quantity?: number;
  className?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  product,
  quantity = 1,
  className = '',
  disabled = false,
  size = 'md'
}) => {
  const { addItem } = useCart();
  const [adding, setAdding] = useState(false);

  const handleAddToCart = async () => {
    if (disabled) return;
    
    setAdding(true);
    
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 500));
    
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      stock: product.stock,
    });
    
    setAdding(false);
  };

  const isOutOfStock = product.stock === 0;

  return (
    <Button
      onClick={handleAddToCart}
      loading={adding}
      disabled={isOutOfStock || adding || disabled}
      className={`w-full ${className}`}
      variant={isOutOfStock ? 'secondary' : 'primary'}
      size={size}
    >
      {isOutOfStock ? 'Нет в наличии' : 'В корзину'}
    </Button>
  );
};

export default AddToCartButton;