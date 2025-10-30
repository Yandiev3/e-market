// app/page.tsx
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product';
import ProductGrid from '@/components/product/ProductGrid';
import Button from '@/components/ui/Button';
import { IProductLean, Product as ProductType } from '@/types/product';

export default async function Home() {
  await dbConnect();
  
  // Get featured products
  const featuredProducts = await Product.find({
    featured: true,
    active: true,
    'sizes.stockQuantity': { $gt: 0 },
  })
    .limit(8)
    .select('name price images slug sizes ratings brand category')
    .lean() as unknown as IProductLean[];

  // Get new arrivals
  const newProducts = await Product.find({
    active: true,
    'sizes.stockQuantity': { $gt: 0 },
  })
    .sort({ createdAt: -1 })
    .limit(8)
    .select('name price images slug sizes ratings brand category')
    .lean() as unknown as IProductLean[];

  const session = await getServerSession(authOptions);


  const mapToProduct = (product: IProductLean): ProductType => ({
    _id: product._id?.toString() || '',
    name: product.name,
    price: product.price,
    originalPrice: product.originalPrice,
    images: product.images || [],
    slug: product.slug,
    category: product.category || '',
    sizes: product.sizes,
    ratings: product.ratings,
    brand: product.brand,
    description: '', 
    sku: '',
    active: true,
    featured: false,
    gender: 'unisex',
    colors: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  return (
    <div className="min-h-screen bg-background">
      <section className="relative overflow-hidden flex items-center justify-center min-h-[calc(100vh-113px)] border-[2px] border-primary">
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-6xl md:text-8xl font-bold mb-6 tracking-tight">
              KAS<span className="text-primary">TOM</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Премиальные обувь для максимального комфорта в городской жизни
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/products">
                <Button size="lg" className="text-lg px-8 py-6 h-auto">
                   Смотреть каталог
                </Button>
              </Link>
              {!session && (
                <Link href="/register">
                  <Button variant="outline" size="lg" className="text-lg px-8 py-6 h-auto border-2">
                    👤 Создать аккаунт
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center p-6 group hover:bg-card/50 rounded-lg transition-all duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4 group-hover:bg-primary/20 transition-colors">
                🚚
              </div>
              <h3 className="text-xl font-semibold mb-2">Быстрая доставка</h3>
              <p className="text-muted-foreground">
                Бесплатная доставка по России от 5000₽
              </p>
            </div>

            <div className="text-center p-6 group hover:bg-card/50 rounded-lg transition-all duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4 group-hover:bg-primary/20 transition-colors">
                🛡️
              </div>
              <h3 className="text-xl font-semibold mb-2">Гарантия качества</h3>
              <p className="text-muted-foreground">
                Оригинальная продукция с гарантией
              </p>
            </div>

            <div className="text-center p-6 group hover:bg-card/50 rounded-lg transition-all duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4 group-hover:bg-primary/20 transition-colors">
                ⚡
              </div>
              <h3 className="text-xl font-semibold mb-2">Новые коллекции</h3>
              <p className="text-muted-foreground">
                Следите за последними трендами
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-20 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">Новинки</h2>
              <p className="text-muted-foreground">Самые свежие поступления в коллекции</p>
            </div>
            <Link 
              href="/products?sort=newest" 
              className="group flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              Смотреть все
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
          
          <ProductGrid 
            products={newProducts.map(product => ({
              ...mapToProduct(product),
              isNew: true
            }))} 
          />
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 border-t border-border bg-card/30">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">Популярные товары</h2>
              <p className="text-muted-foreground">Выбор наших покупателей</p>
            </div>
            <Link 
              href="/products?sort=popular" 
              className="group flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              Смотреть все
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
          
          <ProductGrid 
            products={featuredProducts.map(product => ({
              ...mapToProduct(product),
              isFeatured: true
            }))} 
          />
        </div>
      </section>

      {/* Categories Preview */}
      <section className="py-20 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">Коллекции</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Откройте для себя разнообразие стилей и моделей
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { name: 'Женские', href: '/products?category=women', count: '24 товара' },
              { name: 'Мужские', href: '/products?category=men', count: '18 товаров' },
              { name: 'Детские', href: '/products?category=kids', count: '12 товаров' },
              { name: 'Аксессуары', href: '/products?category=accessories', count: '8 товаров' },
            ].map((category, index) => (
              <Link 
                key={index} 
                href={category.href}
                className="group p-6 bg-card border border-border rounded-lg hover:bg-primary/5 hover:border-primary/20 transition-all duration-300 text-center"
              >
                <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-muted-foreground">{category.count}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">
              Готовы к максимальному комфорту?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Откройте для себя коллекцию премиальных угг для любого сезона
            </p>
            <Link href="/products">
              <Button size="lg" className="text-lg px-8 py-6 h-auto">
                📦 Перейти в каталог
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}