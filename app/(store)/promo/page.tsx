// app/(store)/promo/page.tsx
import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function PromoPage() {
  const promoItems = [
    {
      id: 1,
      title: "Зимняя коллекция UGG",
      subtitle: "Тепло и стиль",
      description: "Настоящие угги для холодной погоды. Премиальная овчина и качественная сборка.",
      image: "https://static.street-beat.ru/upload/iblock/5a5/c1dco842874x9snhtz3yledhz5zghkbm.jpg",
      buttonText: "Смотреть коллекцию",
      href: "/products?brand=ugg&season=winter",
      badge: "НОВИНКА"
    },
    {
      id: 2,
      title: "Распродажа до -50%",
      subtitle: "Скидки на прошлые коллекции",
      description: "Успейте купить любимые модели по выгодным ценам. Ограниченное количество.",
      image: "https://static.street-beat.ru/upload/iblock/90e/ixzo16910c2ir0rwqbany3r3b2uw8d4i.jpg",
      buttonText: "Перейти к распродаже",
      href: "/products?sale=true",
      badge: "СКИДКА"
    },
    {
      id: 3,
      title: "Новые поступления",
      subtitle: "Свежие модели каждый день",
      description: "Эксклюзивные модели и ограниченные серии от ведущих брендов.",
      image: "https://static.street-beat.ru/upload/iblock/230/1mapmy300mc8jn0dmjim6dn7bi4tb26d.jpg",
      buttonText: "Смотреть новинки",
      href: "/products?sort=newest",
      badge: "АКЦИЯ"
    },
    {
      id: 4,
      title: "Премиум коллекция",
      subtitle: "Эксклюзивные материалы",
      description: "Обувь из кожи премиум-качества с ручной работой и вниманием к деталям.",
      image: "https://static.street-beat.ru/upload/iblock/5a5/c1dco842874x9snhtz3yledhz5zghkbm.jpg",
      buttonText: "Изучить коллекцию",
      href: "/products?category=premium",
      badge: "ПРЕМИУМ"
    },
    {
      id: 5,
      title: "Спортивный стиль",
      subtitle: "Комфорт и технологии",
      description: "Инновационные технологии для активного образа жизни. Дышащие материалы.",
      image: "https://static.street-beat.ru/upload/iblock/90e/ixzo16910c2ir0rwqbany3r3b2uw8d4i.jpg",
      buttonText: "Выбрать кроссовки",
      href: "/products?category=sneakers",
      badge: "ПОПУЛЯРНО"
    },
    {
      id: 6,
      title: "Летняя коллекция",
      subtitle: "Легкость и стиль",
      description: "Сандалии и босоножки для теплого сезона. Натуральные материалы.",
      image: "https://static.street-beat.ru/upload/iblock/230/1mapmy300mc8jn0dmjim6dn7bi4tb26d.jpg",
      buttonText: "Смотреть летнее",
      href: "/products?season=summer",
      badge: "СЕЗОН"
    }
  ];

  const featuredPromo = {
    title: "Специальное предложение",
    subtitle: "Только этой неделей",
    description: "Уникальная скидка на все модели угг. Акция действует до конца месяца.",
    image: "https://static.street-beat.ru/upload/iblock/5a5/c1dco842874x9snhtz3yledhz5zghkbm.jpg",
    buttonText: "Узнать подробнее",
    href: "/products?promo=special"
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Акции и <span className="text-primary">спецпредложения</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Выгодные предложения, ограниченные коллекции и эксклюзивные скидки для наших покупателей
            </p>
          </div>
        </div>
      </section>

      {/* Featured Promo */}
      <section className="py-16 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="relative aspect-square lg:aspect-auto">
                <img
                  src={featuredPromo.image}
                  alt={featuredPromo.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20"></div>
              </div>
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary text-primary-foreground text-sm font-medium mb-4 self-start">
                  ГЛАВНАЯ АКЦИЯ
                </div>
                <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                  {featuredPromo.title}
                </h2>
                <p className="text-lg text-muted-foreground mb-2">
                  {featuredPromo.subtitle}
                </p>
                <p className="text-muted-foreground mb-6">
                  {featuredPromo.description}
                </p>
                <Link href={featuredPromo.href}>
                  <Button size="lg" className="text-lg px-8">
                    {featuredPromo.buttonText}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* All Promotions Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Все акции
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Выбирайте из множества специальных предложений и ограниченных коллекций
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {promoItems.map((item) => (
              <div
                key={item.id}
                className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                      {item.badge}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground mb-1">
                    {item.subtitle}
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    {item.description}
                  </p>
                  <Link href={item.href}>
                    <Button variant="outline" className="w-full">
                      {item.buttonText}
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-card/50 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Не упустите выгоду!
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Подпишитесь на рассылку и будьте первыми среди тех, кто узнает о новых акциях и скидках
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Ваш email"
                className="flex-1 px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <Button size="lg" className="whitespace-nowrap">
                Подписаться
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Подписываясь, вы соглашаетесь с нашей Политикой конфиденциальности
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}