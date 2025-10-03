// app/(store)/cart/page.tsx
'use client';

import { useCart } from '@/context/CartContext';
import CartItem from '@/components/cart/CartItem';
import CartSummary from '@/components/cart/CartSummary';
import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function CartPage() {
  const { items, clearCart, loading } = useCart();

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white rounded-lg p-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center py-6 border-b border-gray-200">
                  <div className="w-20 h-20 bg-gray-200 rounded"></div>
                  <div className="ml-4 flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="lg:col-span-1">
              <div className="p-6 rounded-lg h-64 bg-gray-200"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <div className="text-6xl mb-6">🛒</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Ваша корзина пуста</h1>
        <p className="text-gray-600 mb-8">
          Добавьте товары в корзину, чтобы продолжить покупки
        </p>
        <Link href="/products">
          <Button>Начать покупки</Button>
        </Link>
      </div>
    );
  }

  const handleCheckout = () => {
    window.location.href = '/checkout';
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Корзина</h1>
        <button
          onClick={clearCart}
          className="text-red-600 hover:text-red-800 text-sm font-medium"
        >
          Очистить корзину
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            {items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <CartSummary onCheckout={handleCheckout} />
          
          <div className="mt-4">
            <Link href="/products">
              <Button variant="outline" className="w-full">
                Продолжить покупки
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}