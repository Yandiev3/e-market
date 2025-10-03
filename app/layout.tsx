// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppAuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { FavoritesProvider } from '@/context/FavoritesContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'UGG Store - Премиальные угги',
  description: 'Качественные угги по лучшим ценам. Бесплатная доставка от 5000₽',
  keywords: 'угги, ugg, обувь, зимняя обувь, магазин угги',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className="dark">
      <body className={inter.className}>
        <AppAuthProvider>
          <CartProvider>
            <FavoritesProvider>
              <div className="min-h-screen flex flex-col bg-background text-foreground">
                <Header />
                <main className="flex-1">
                  {children}
                </main>
                <Footer />
              </div>
            </FavoritesProvider>
          </CartProvider>
        </AppAuthProvider>
      </body>
    </html>
  );
}