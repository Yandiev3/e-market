// app/(store)/order-success/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function OrderSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // Clear cart or perform other success actions
  }, []);

  return (
    <div className="min-h-screen section-padding">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="feature-icon mx-auto bg-green-500/20 text-green-400">
            <span className="text-2xl">✓</span>
          </div>
          
          <h1 className="heading-2 mb-6 text-foreground">Заказ Подтвержден!</h1>
          <p className="body-large mb-8 text-muted-foreground">
            Спасибо за ваш заказ. Ваш заказ был подтвержден и обрабатывается.
            Вы получите подтверждение по электронной почте в ближайшее время.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products" className="btn-minimal-primary">
              Продолжить покупки
            </Link>
            <Link href="/account/orders" className="btn-minimal-outline">
              Посмотреть заказы
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}