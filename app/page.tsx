// app/page.tsx
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product';
import Button from '@/components/ui/Button';
import { IProductLean, Product as ProductType } from '@/types/product';
import CategorySwiper from '@/components/product/CategorySwiper';
import Legendaryseries from '@/components/product/LegendarySeries';

export default async function Home() {
  await dbConnect();
  
  const categoryItems = [
  {
    id: '1',
    brand: 'PUMA',
    model: 'Tuff Terra',
    description: 'Удобные тапочки для дома и улицы',
    image: 'https://static.street-beat.ru/upload/resize_cache/iblock/059/240_360_1/wfg6bw02lkva33wwn6a27m3k7hgklq6x.jpg',
    filterParams: '?brand=PUMA&category=tapochki',
    href: '/products?brand=PUMA&category=tapochki'
  },
  {
    id: '2', 
    brand: 'Kipling',
    model: 'River Collection',
    description: 'Стильные женские аксессуары и обувь',
    image: 'https://static.street-beat.ru/upload/resize_cache/iblock/7d5/240_360_1/9n6k1l1hddox5jac513y4q803dmtpa5o.jpg',
    filterParams: '?brand=Kipling&gender=women',
    href: '/products?brand=Kipling&gender=women'
  },
  {
    id: '4',
    brand: 'The North Face',
    model: 'ThermoBall',
    description: 'Теплые и легкие тапочки для активного отдыха',
    image: 'https://static.street-beat.ru/upload/resize_cache/iblock/79e/240_360_1/r64wev7ii1038f2nxn31c8ge8u47404m.jpg',
    filterParams: '?brand=The North Face&gender=women&category=tapochki',
    href: '/products?brand=The North Face&gender=women&category=tapochki'
  },
  {
    id: '5',
    brand: 'Napapijri',
    model: 'Urban Style',
    description: 'Городская одежда и обувь для современной женщины',
    image: 'https://static.street-beat.ru/upload/resize_cache/iblock/ebe/240_360_1/fejcvmtik3aso0yrm8e6epm40y3903j6.jpg',
    filterParams: '?brand=Napapijri&gender=women&category=clothing',
    href: '/products?brand=Napapijri&gender=women&category=clothing'
  },
  {
    id: '6',
    brand: 'Vans',
    model: 'SK8-Hi',
    description: 'Культовые высокие кеды для скейтбординга',
    image: 'https://static.street-beat.ru/upload/resize_cache/iblock/c8e/240_360_1/d84t0sbyh75bh4yao6ojql6w1tcb50n7.jpg',
    filterParams: '?brand=Vans&category=sneakers',
    href: '/products?brand=Vans&category=sneakers'
  },
];

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
      <section className="relative overflow-hidden flex items-center justify-center min-h-[calc(100vh-113px)]">
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

      {/* Promo Section - Полная ширина, без отступов и скруглений */}
      <section className="py-5 border-t border-border ">
        <div className="w-full">
          <div className="grid grid-cols-3 max-lg:flex flex-col">
            {[
              {
                image: "https://static.street-beat.ru/upload/iblock/5a5/c1dco842874x9snhtz3yledhz5zghkbm.jpg",
                text: "Зимняя коллекция",
                title: "UGG Classic Natural",
                href: "/promo#winter-collection"
              },
              {
                image: "https://static.street-beat.ru/upload/iblock/90e/ixzo16910c2ir0rwqbany3r3b2uw8d4i.jpg",
                text: "Новые поступления",
                title: "Nike Air Max",
                href: "/promo#new-arrivals"
              },
              {
                image: "https://static.street-beat.ru/upload/iblock/230/1mapmy300mc8jn0dmjim6dn7bi4tb26d.jpg",
                text: "Распродажа",
                title: "Adidas Ultraboost",
                href: "/promo#sale"
              }
            ].map((promo, index) => (
              <Link 
                key={index} 
                href={promo.href}
                className="group relative overflow-hidden cursor-pointer aspect-square"
              >
              <div className="group relative overflow-hidden cursor-pointer aspect-square">

                <div className="absolute inset-0 bg-black/20 z-10"></div>
                <img 
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-400 relative z-0" 
                  src={promo.image} 
                  alt={promo.title} 
                />
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-30 transition-all duration-400"></div>
                
                <div className="absolute inset-0 z-20 flex flex-col justify-end p-5">
                  <div className="pl-5">
                    <p className="text-white text-sm mb-1">{promo.text}</p>
                    <h3 className="text-white font-semibold text-lg mb-3">{promo.title}</h3>
                    <Button variant="outline" className="bg-transparent text-white border-white hover:bg-white hover:text-black">
                      Смотреть
                    </Button>
                  </div>
                </div>   
              </div>       
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CategorySwiper 
        categories={categoryItems}
      />

      {/* Legendary Series */}
      
      <Legendaryseries/>

      {/* Featured Products
      // <section className="py-20 border-t border-border bg-card/30">
      //   <div className="container mx-auto px-4">
      //     <div className="flex justify-between items-center mb-12">
      //       <div>
      //         <h2 className="text-3xl md:text-4xl font-bold mb-2">Популярные товары</h2>
      //         <p className="text-muted-foreground">Выбор наших покупателей</p>
      //       </div>
      //       <Link 
      //         href="/products?sort=popular" 
      //         className="group flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
      //       >
      //         Смотреть все
      //         <span className="group-hover:translate-x-1 transition-transform">→</span>
      //       </Link>
      //     </div>
          
      //     <ProductGrid 
      //       products={featuredProducts.map(product => ({
      //         ...mapToProduct(product),
      //         isFeatured: true
      //       }))} 
      //     />
      //   </div>
      // </section> */}

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
              { name: 'Женские', href: '/products?gender=women', count: '24 товара' },
              { name: 'Мужские', href: '/products?gender=men', count: '18 товаров' },
              { name: 'Детские', href: '/products?gender=kids', count: '12 товаров' },
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
                 Перейти в каталог
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}