// components/cart/AddToCartButton.tsx
'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import Button from '@/components/ui/Button';
import { CartProduct } from '@/types/product';

interface AddToCartButtonProps {
  product: CartProduct;
  quantity?: number;
  className?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  selectedSize?: string;  
  selectedColor?: string;
  requiresSizeSelection?: boolean;
  onSizeRequired?: () => void;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  product,
  quantity = 1,
  className = '',
  disabled = false,
  size = 'md',
  selectedSize,
  selectedColor,
  requiresSizeSelection = false,
  onSizeRequired
}) => {
  const { addItem } = useCart();
  const [adding, setAdding] = useState(false);

  // Проверяем, требуется ли выбор размера и выбран ли он
  const hasAvailableSizes = product.sizes && product.sizes.length > 0;
  const requiresSize = requiresSizeSelection || hasAvailableSizes;
  const isSizeRequiredButNotSelected = requiresSize && !selectedSize;
  
  // Проверяем наличие товара на основе выбранного размера или общего количества
  const isOutOfStock = selectedSize 
    ? !product.sizes?.some(size => size.size === selectedSize && size.inStock && size.stockQuantity > 0)
    : !product.sizes?.some(size => size.inStock && size.stockQuantity > 0);

  const handleAddToCart = async () => {
    // ЕСЛИ РАЗМЕР ОБЯЗАТЕЛЕН И НЕ ВЫБРАН - ТРЕБУЕМ ВЫБОР
    if (isSizeRequiredButNotSelected) {
      // Показываем уведомление/подсвечиваем выбор размера
      if (onSizeRequired) {
        onSizeRequired(); // Уведомляем родительский компонент
      }
      
      // Можно добавить вибрацию или анимацию для привлечения внимания
      const sizeSelectionElement = document.querySelector('[data-size-selection]');
      if (sizeSelectionElement) {
        sizeSelectionElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        sizeSelectionElement.classList.add('animate-pulse', 'ring-2', 'ring-red-500');
        setTimeout(() => {
          sizeSelectionElement.classList.remove('animate-pulse', 'ring-2', 'ring-red-500');
        }, 2000);
      }
      
      return; // ПРЕКРАЩАЕМ выполнение - не добавляем в корзину
    }
    
    if (disabled || isOutOfStock) return;
    
    setAdding(true);
    
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 500));
    
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: selectedSize,
      color: selectedColor,
      sizes: product.sizes
    });
    
    setAdding(false);
  };

  const isDisabled = isOutOfStock || adding || disabled;

  const getButtonText = () => {
    if (isOutOfStock) return 'Нет в наличии';
    if (isSizeRequiredButNotSelected) return 'Выберите размер';
    return 'В корзину';
  };

  const getButtonVariant = () => {
    if (isOutOfStock) return 'secondary';
    if (isSizeRequiredButNotSelected) return 'danger';
    return 'primary';
  };

  return (
    <Button
      onClick={handleAddToCart}
      loading={adding}
      disabled={isDisabled}
      className={`w-full ${className} ${
        isSizeRequiredButNotSelected ? 'cursor-not-allowed opacity-90' : ''
      }`}
      variant={getButtonVariant()}
      size={size}
      title={isSizeRequiredButNotSelected ? 'Сначала выберите размер' : isOutOfStock ? 'Товар отсутствует' : undefined}
    >
      {getButtonText()}
    </Button>
  );
};

export default AddToCartButton;