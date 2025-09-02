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
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  product,
  quantity = 1,
  className = '',
}) => {
  const { addItem } = useCart();
  const [adding, setAdding] = useState(false);

  const handleAddToCart = async () => {
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
      disabled={isOutOfStock || adding}
      className={`w-full ${className}`}
      variant={isOutOfStock ? 'secondary' : 'primary'}
    >
      {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
    </Button>
  );
};

export default AddToCartButton;