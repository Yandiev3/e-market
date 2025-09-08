// app/page.tsx
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product';
import ProductGrid from '@/components/product/ProductGrid';
import Button from '@/components/ui/Button';
import { IProductLean } from '@/types/product';

export default async function Home() {
  await dbConnect();
  
  // Get featured products
  const featuredProducts = await Product.find({
    featured: true,
    active: true,
    stock: { $gt: 0 },
  })
    .limit(12)
    .select('name price images slug stock ratings brand')
    .lean() as unknown as IProductLean[];

  // Get new arrivals
  const newProducts = await Product.find({
    active: true,
    stock: { $gt: 0 },
  })
    .sort({ createdAt: -1 })
    .limit(12)
    .select('name price images slug stock ratings brand')
    .lean() as unknown as IProductLean[];

  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner */}
      <section className="relative h-96 bg-gradient-to-r from-gray-900 to-gray-700">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative h-full max-w-7xl mx-auto px-4 flex items-center">
          <div className="text-white max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Стильные угги
              <br />
              для вашего комфорта
            </h1>
            <p className="text-lg md:text-xl mb-8 opacity-90">
              Откройте мир уюта и стиля с нашей коллекцией угг
            </p>
            <div className="flex gap-4">
              <Link href="/products">
                <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100">
                  Смотреть коллекцию
                </Button>
              </Link>
              {!session && (
                <Link href="/register">
                  <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-gray-900">
                    Создать аккаунт
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
            Категории
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Женские угги', href: '/products?category=women', image: '/women.jpg' },
              { name: 'Мужские угги', href: '/products?category=men', image: '/men.jpg' },
              { name: 'Детские угги', href: '/products?category=kids', image: '/kids.jpg' },
              { name: 'Аксессуары', href: '/products?category=accessories', image: '/accessories.jpg' },
            ].map((category, index) => (
              <Link key={index} href={category.href} className="group">
                <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-200">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="font-semibold text-lg">{category.name}</h3>
                    <p className="text-sm opacity-90 group-hover:underline">Смотреть все</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Новинки</h2>
            <Link href="/products?sort=newest" className="text-gray-600 hover:text-gray-900 font-semibold">
              Смотреть все →
            </Link>
          </div>
          <ProductGrid 
            products={newProducts.map(product => ({
              id: product._id?.toString() || '',
              name: product.name,
              price: product.price,
              originalPrice: product.originalPrice,
              image: product.images?.[0] || '/images/placeholder.jpg',
              slug: product.slug,
              stock: product.stock,
              ratings: product.ratings,
              brand: product.brand,
              isNew: true
            }))} 
          />
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Популярные товары</h2>
            <Link href="/products?sort=popular" className="text-gray-600 hover:text-gray-900 font-semibold">
              Смотреть все →
            </Link>
          </div>
          <ProductGrid 
            products={featuredProducts.map(product => ({
              id: product._id?.toString() || '',
              name: product.name,
              price: product.price,
              originalPrice: product.originalPrice,
              image: product.images?.[0] || '/images/placeholder.jpg',
              slug: product.slug,
              stock: product.stock,
              ratings: product.ratings,
              brand: product.brand
            }))} 
          />
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: '🚚', title: 'Бесплатная доставка', desc: 'При заказе от 5000₽' },
              { icon: '↩️', title: 'Возврат', desc: 'В течение 30 дней' },
              { icon: '🔒', title: 'Безопасная оплата', desc: 'Разные способы оплаты' },
              { icon: '⭐', title: 'Гарантия качества', desc: 'Оригинальная продукция' },
            ].map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl mb-4">{benefit.icon}</div>
                <h3 className="font-semibold mb-2">{benefit.title}</h3>
                <p className="text-gray-400 text-sm">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}