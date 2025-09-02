'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function OrderSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // Clear cart or perform other success actions
  }, []);

  return (
    <div className="max-w-2xl mx-auto text-center py-12">
      <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
        <span className="text-2xl">✓</span>
      </div>
      
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Confirmed!</h1>
      <p className="text-lg text-gray-600 mb-8">
        Thank you for your order. Your order has been confirmed and is being processed.
        You will receive an email confirmation shortly.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/products">
          <Button>Continue Shopping</Button>
        </Link>
        <Link href="/account/orders">
          <Button variant="outline">View Orders</Button>
        </Link>
      </div>
    </div>
  );
}