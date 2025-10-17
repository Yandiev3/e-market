// app/(store)/checkout/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { formatPrice } from '@/lib/utils';
import SubmitButton from '@/components/ui/SubmitButton';
import Input from '@/components/ui/Input';
import Link from 'next/link';
import Image from 'next/image';

export default function CheckoutPage() {
  const { items, clearCart, createOrder } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastname: '',
    phone: '',
    address: '',
    // city: '',
    paymentMethod: '',
    saveInfo: true,
  });

  // Инициализация формы данными пользователя
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        email: user.email || '',
        firstName: user.name?.split(' ')[0] || '',
        lastname: user.lastname || '',
        phone: user.phone || '',
        address: user.address || '',
        // city: '',
      }));
    }
  }, [user]);

  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const shippingPrice = subtotal >= 5000 ? 0 : 500;
  const total = subtotal + shippingPrice;

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  try {
    const orderData = {
      shippingAddress: {
        street: formData.address,
        // city: formData.city,
      },
      paymentMethod: formData.paymentMethod,
      email: formData.email,
      phone: formData.phone,
      firstName: formData.firstName,
      lastName: formData.lastname
    };

    console.log('Submitting order data:', orderData);
    console.log('Cart items:', items);

    const result = await createOrder(orderData);
    
    if (result.success) {
      console.log('Order created successfully, redirecting...');
      router.push('/order-success');
    } else {
      console.error('Order creation failed:', result.error);
      setError(result.error || 'Произошла ошибка при создании заказа');
    }
  } catch (error: any) {
    console.error('Checkout error:', error);
    setError('Произошла ошибка при оформлении заказа');
  } finally {
    setLoading(false);
  }
};

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen section-padding">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="feature-icon mx-auto">
              <span className="text-2xl">🛒</span>
            </div>
            <h1 className="heading-2 mb-4">Корзина пуста</h1>
            <p className="body-large mb-8">Добавьте товары в корзину для оформления заказа</p>
            <Link href="/products" className="btn-minimal-primary">
              Вернуться к покупкам
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background section-padding">
      <div className="container mx-auto px-4">
        <h1 className="heading-2 mb-8 text-center">Оформление заказа</h1>

        {error && (
          <div className="max-w-6xl mx-auto mb-6 p-4 bg-destructive/10 border border-destructive rounded-lg">
            <p className="text-destructive text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Left column - Form */}
          <div className="space-y-6">
            {/* Contact information */}
            <section className="card-minimal">
              <h2 className="heading-3 mb-6 text-foreground">Контактная информация</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Имя *"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  className="bg-input border-border"
                />
                <Input
                  label="Фамилия *"
                  name="lastName"
                  value={formData.lastname}
                  onChange={handleInputChange}
                  required
                  className="bg-input border-border"
                />
                <Input
                  label="Email *"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="bg-input border-border"
                />
                <Input
                  label="Телефон *"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="bg-input border-border"
                />
              </div>
            </section>

            {/* Shipping address */}
            <section className="card-minimal">
              <h2 className="heading-3 mb-6 text-foreground">Адрес доставки</h2>
              <div className="grid grid-cols-1 gap-4">
                {/* <Input
                  label="Город *"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  placeholder="Например: Москва"
                  className="bg-input border-border"
                /> */}
                <Input
                  label="Адрес *"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  placeholder="Город, улица, дом"
                  className="bg-input border-border"
                />
              </div>
            </section>

            {/* Payment method */}
            <section className="card-minimal">
              <h2 className="heading-3 mb-6 text-foreground">Способ оплаты</h2>
              <div className="space-y-3">
                <label className="flex items-center p-4 border border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors duration-200 bg-input">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={formData.paymentMethod === 'card'}
                    onChange={handleInputChange}
                    className="text-primary focus:ring-primary"
                  />
                  <div className="ml-3">
                    <span className="font-medium text-foreground">Банковская карта</span>
                    <p className="text-sm text-muted-foreground">Visa, Mastercard, МИР</p>
                  </div>
                </label>

                <label className="flex items-center p-4 border border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors duration-200 bg-input">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash"
                    checked={formData.paymentMethod === 'cash'}
                    onChange={handleInputChange}
                    className="text-primary focus:ring-primary"
                  />
                  <div className="ml-3">
                    <span className="font-medium text-foreground">Наличные при получении</span>
                    <p className="text-sm text-muted-foreground">Оплата курьеру</p>
                  </div>
                </label>
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <div className="card-minimal">
              <h2 className="heading-3 mb-6 text-foreground">Ваш заказ</h2>
              
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-16 h-16 bg-secondary rounded-lg flex items-center justify-center overflow-hidden">
                        {item.image ? (
                          <Image 
                            src={item.image} 
                            alt={item.name}
                            width={64}
                            height={64}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <span className="text-lg">👟</span>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{item.name}</p>
                        <p className="text-sm text-muted-foreground">× {item.quantity}</p>
                      </div>
                    </div>
                    <span className="text-foreground font-medium">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Промежуточный итог</span>
                  <span className="text-foreground">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Доставка</span>
                  <span className={shippingPrice === 0 ? 'text-green-400' : 'text-foreground'}>
                    {shippingPrice === 0 ? 'Бесплатно' : formatPrice(shippingPrice)}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-semibold pt-3 border-t border-border">
                  <span className="text-foreground">Итого</span>
                  <span className="gradient-text-primary">{formatPrice(total)}</span>
                </div>
              </div>

              <SubmitButton
                loading={loading}
                disabled={items.length === 0}
                className="mt-6"
              >
                Подтвердить заказ
              </SubmitButton>
            </div>

            {/* Security info */}
            <div className="card-minimal bg-primary/5 border-primary/20">
              <div className="flex items-center">
                <div className="text-primary text-2xl mr-3">🔒</div>
                <div>
                  <p className="text-sm font-medium text-foreground">Безопасная оплата</p>
                  <p className="text-sm text-muted-foreground">Ваши данные защищены шифрованием</p>
                </div>
              </div>
            </div>

            {/* Continue shopping link */}
            <div className="text-center">
              <Link 
                href="/products" 
                className="text-primary hover:text-primary/80 transition-colors duration-200 text-sm"
              >
                ← Вернуться к покупкам
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}