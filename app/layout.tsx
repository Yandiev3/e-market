import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppAuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'E-Store - Your Online Shopping Destination',
  description: 'Discover amazing products at great prices. Shop now!',
  keywords: 'ecommerce, shopping, online store, products',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppAuthProvider>
          <CartProvider>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
          </CartProvider>
        </AppAuthProvider>
      </body>
    </html>
  );
}