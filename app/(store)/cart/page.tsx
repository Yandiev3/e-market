// app/(store)/cart/page.tsx
'use client';

import { useCart } from '@/context/CartContext';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, loading } = useCart();

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-8 w-8 bg-muted rounded-full animate-pulse"></div>
            <div className="h-8 w-48 bg-muted rounded animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="p-4">
                  <div className="flex gap-4">
                    <div className="w-24 h-24 bg-muted rounded"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                      <div className="h-4 bg-muted rounded w-1/2"></div>
                      <div className="h-6 bg-muted rounded w-1/4"></div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            <div className="lg:col-span-1">
              <Card className="p-6">
                <div className="h-6 bg-muted rounded mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded"></div>
                  <div className="h-4 bg-muted rounded"></div>
                  <div className="h-6 bg-muted rounded mt-4"></div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <ShoppingBag className="h-24 w-24 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-semibold mb-2 text-foreground">Корзина пуста</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Добавьте товары для оформления заказа
            </p>
            <Link href="/products">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Перейти к покупкам
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const shippingPrice = subtotal >= 5000 ? 0 : 500;
  const total = subtotal + shippingPrice;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <ShoppingBag className="h-4 w-4 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Корзина</h1>
          </div>
          <Button
            variant="ghost"
            onClick={clearCart}
            className="text-red-600 hover:text-red-800 hover:bg-red-50"
          >
            Очистить корзину
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.id} className="p-4">
                <div className="flex gap-4">
                  <img
                    src={item.image || '/images/placeholder.jpg'}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2 text-foreground">{item.name}</h3>
                    <p className="text-primary font-bold mb-4">
                      {formatPrice(item.price)}
                    </p>
                    
                    {/* Quantity controls */}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center border border-border rounded-md">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="h-8 w-8 p-0 hover:bg-accent"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm font-medium text-foreground">
                          {item.quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                          className="h-8 w-8 p-0 hover:bg-accent"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        className="text-red-600 hover:text-red-800 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Удалить
                      </Button>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-lg font-semibold text-foreground">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {item.quantity} × {formatPrice(item.price)}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-4">
              <h2 className="text-xl font-bold mb-4 text-foreground">Итого</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Товары ({items.reduce((sum, item) => sum + item.quantity, 0)})</span>
                  <span className="text-foreground">{formatPrice(subtotal)}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Доставка</span>
                  <span className={shippingPrice === 0 ? 'text-green-600' : 'text-foreground'}>
                    {shippingPrice === 0 ? 'Бесплатно' : formatPrice(shippingPrice)}
                  </span>
                </div>

                {subtotal >= 5000 && (
                  <div className="text-sm text-green-600 bg-green-50 p-2 rounded">
                    ✓ Бесплатная доставка
                  </div>
                )}

                <div className="border-t border-border pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-foreground">Всего:</span>
                    <span className="text-primary">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>
              
              <Button 
                className="w-full" 
                size="lg"
                onClick={() => window.location.href = '/checkout'}
              >
                Оформить заказ
              </Button>
              
              <Link href="/products">
                <Button variant="outline" className="w-full mt-3">
                  Продолжить покупки
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}