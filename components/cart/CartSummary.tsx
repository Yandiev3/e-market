'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import Button from '@/components/ui/Button';

interface CartSummaryProps {
  onCheckout?: () => void;
  loading?: boolean;
}

const CartSummary: React.FC<CartSummaryProps> = ({ onCheckout, loading = false }) => {
  const { items, totalPrice, totalItems } = useCart();

  if (items.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Cart Summary</h3>
        <p className="text-gray-500">Your cart is empty</p>
      </div>
    );
  }

  const shipping = totalPrice > 100 ? 0 : 10;
  const tax = totalPrice * 0.1; // 10% tax
  const finalTotal = totalPrice + shipping + tax;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Items ({totalItems})</span>
          <span>{formatPrice(totalPrice)}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span>Shipping</span>
          <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span>Tax</span>
          <span>{formatPrice(tax)}</span>
        </div>
        
        <div className="border-t border-gray-200 pt-2 mt-2">
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>{formatPrice(finalTotal)}</span>
          </div>
        </div>
      </div>

      <Button
        onClick={onCheckout}
        loading={loading}
        className="w-full mt-6"
        disabled={items.length === 0}
      >
        Proceed to Checkout
      </Button>

      {totalPrice < 100 && (
        <p className="text-sm text-green-600 mt-2 text-center">
          Add {formatPrice(100 - totalPrice)} more for free shipping!
        </p>
      )}
    </div>
  );
};

export default CartSummary;