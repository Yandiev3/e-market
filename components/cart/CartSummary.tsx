// components/cart/CartSummary.tsx
import React from 'react';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import Button from '@/components/ui/Button';

interface CartSummaryProps {
  items: Array<{
    price: number;
    quantity: number;
  }>;
  shippingPrice: number;
  onCheckout: (e?: React.MouseEvent) => void;
  loading?: boolean;
}

const CartSummary: React.FC<CartSummaryProps> = ({
  items,
  shippingPrice,
  onCheckout,
  loading = false,
}) => {
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const total = subtotal + shippingPrice;
  const freeShippingThreshold = 5000;
  const remainingForFreeShipping = freeShippingThreshold - subtotal;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Итого</h2>

      {/* Free shipping progress */}
      {subtotal < freeShippingThreshold && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-blue-700">
              До бесплатной доставки осталось:
            </span>
            <span className="font-semibold text-blue-700">
              {formatPrice(remainingForFreeShipping)}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{
                width: `${(subtotal / freeShippingThreshold) * 100}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Order summary */}
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Товары ({items.reduce((sum, item) => sum + item.quantity, 0)})</span>
          <span className="text-gray-900">{formatPrice(subtotal)}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Доставка</span>
          <span className={shippingPrice === 0 ? 'text-green-600' : 'text-gray-900'}>
            {shippingPrice === 0 ? 'Бесплатно' : formatPrice(shippingPrice)}
          </span>
        </div>

        {subtotal >= freeShippingThreshold && (
          <div className="text-sm text-green-600 bg-green-50 p-2 rounded">
            ✓ Бесплатная доставка
          </div>
        )}

        <div className="border-t border-gray-200 pt-3 mt-3">
          <div className="flex justify-between text-lg font-semibold">
            <span>Итого</span>
            <span className="text-gray-900">{formatPrice(total)}</span>
          </div>
        </div>
      </div>

      {/* Checkout button */}
      <Button
        onClick={onCheckout}
        loading={loading}
        disabled={items.length === 0}
        className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 text-base"
      >
        Перейти к оформлению
      </Button>

      {/* Continue shopping */}
      <Link
        href="/products"
        className="block text-center text-blue-600 hover:text-blue-700 mt-4 text-sm font-medium"
      >
        ← Продолжить покупки
      </Link>

      {/* Security badges */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-center space-x-6 text-gray-400">
          <div className="text-center">
            <div className="text-2xl">🔒</div>
            <div className="text-xs mt-1">Безопасная оплата</div>
          </div>
          <div className="text-center">
            <div className="text-2xl">↩️</div>
            <div className="text-xs mt-1">Возврат 30 дней</div>
          </div>
          <div className="text-center">
            <div className="text-2xl">⭐</div>
            <div className="text-xs mt-1">Гарантия качества</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;