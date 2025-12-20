// components/layout/Header.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useFavorites } from '@/context/FavoritesContext';
import { useAuth } from '@/context/AuthContext';

const Header: React.FC = () => {
  const { totalItems } = useCart();
  const { items: favoriteItems } = useFavorites();
  const { isAuthenticated, user, isAdmin } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const pathname = usePathname();

  const categories = [
    {
      name: 'Женщинам',
      href: '/products?gender=women',
    },
    {
      name: 'Мужчинам',
      href: '/products?gender=men',
    },
    {
      name: 'Детям',
      href: '/products?gender=kids',
    },
  ];

  const mainNavigation = [
    { 
      name: 'Обувь', 
      href: '/products?category=shoes',
      subcategories: [
        'Вся обувь',
        'Ботинки',
        'Угги',
        'Кроссовки',
        'Тапочки',
        'Кеды',
        'Мюли',
        'Сандалии',
        'Сланцы',
      ] 
    },
    { 
      name: 'Одежда', 
      href: '/products?category=clothing',
      subcategories: [
        'Вся одежда',
        'Куртки',
        'Толстовки',
        'Брюки',
        'Термобельё',
        'Ветровки',
        'Жилеты',
        'Лонгсливы',
        'Рубашки',
        'Футболки и майки',
      ]
    },
    { 
      name: 'Аксессуары', 
      href: '/products?category=accessories',
      subcategories: [
        'Все аксессуары',
        'Шапки',
        'Перчатки и шарфы',
        'Рюкзаки и сумки',
        'Поясные сумки',
        'Уход за обувью',
        'Носки',
        'Кепки',
        'Панамы',
        'Нижнее белье',
      ] 
    },
    { 
      name: 'Бренды', 
      href: '/products',
      subcategories: [
        'Все бренды',
        'STREETBEAT',
        'Nike',
        'New Balance',
        'Vans',
        'adidas',
        'PUMA',
      ] 
    }
  ];

  const toggleCategory = (categoryName: string) => {
    setOpenCategory(openCategory === categoryName ? null : categoryName);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  const handleSubcategoryClick = (categoryHref: string, subcategory: string) => {
    const baseHref = categoryHref.includes('?') ? categoryHref : `${categoryHref}?`;
    const subcategoryParam = subcategory.toLowerCase().replace(/\s+/g, '-');
    
    let href = '';
    if (categoryHref.includes('category=')) {
      href = `${baseHref}&type=${subcategoryParam}`;
    } else if (categoryHref.includes('?')) {
      href = `${baseHref}&category=${subcategoryParam}`;
    } else {
      href = `${baseHref}category=${subcategoryParam}`;
    }
    
    window.location.href = href;
    setIsMobileMenuOpen(false);
    setOpenCategory(null);
  };

  return (
    <header className="border-b border-border z-50 bg-card static top-0">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Меню"
            >
              {isMobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>

            <div className="hidden lg:flex items-center space-x-6">
              {categories.map((category) => (
                <Link
                  key={category.name}
                  href={category.href}
                  className="text-muted-foreground hover:text-foreground text-sm font-medium py-3 transition-colors"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="absolute left-1/2 transform -translate-x-1/2">
            <Link 
              href="/" 
              className="text-2xl font-bold text-foreground hover:opacity-80 transition-opacity"
            >
              <span className="text-primary">KASTOM</span>
            </Link>
          </div>

          <div className='hidden lg:flex items-center space-x-4 pr-4'>
              <Link
                  href="/promo"
                  className="text-muted-foreground text-sm font-medium py-3 transition-colors hover:text-primary"
              >
                  <span>Акции</span>
              </Link>

              <Link
                  href="/news"
                  className="text-muted-foreground text-sm font-medium py-3 transition-colors hover:text-primary"
              >
                  <span>Новости</span>
              </Link>

              <Link
                  href="/privileges"
                  className="text-muted-foreground text-sm font-medium py-3 transition-colors hover:text-primary"
              >
                  <span>Программа привилегий</span>
              </Link>  
          </div>
        </div>


        <div className="hidden lg:flex items-center justify-between h-12 border-t border-border ">
          <nav className="flex space-x-2 pl-4">
            {mainNavigation.map((item) => (
              <div key={item.name} className="relative group">
                <Link 
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground font-medium text-sm transition-colors py-3 flex items-center space-x-1"
                >
                  <span>{item.name}</span>
                  {item.subcategories && (
                    <svg 
                      className="w-4 h-4 transition-transform group-hover:rotate-180"
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </Link>
                
                {item.subcategories && (
                  <div className="absolute top-full left-0 w-64 bg-card shadow-lg rounded-md p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all border border-border z-50 grid grid-cols-2 gap-1">
                    {item.subcategories.map((subcat) => (
                      <button
                        key={subcat}
                        onClick={() => handleSubcategoryClick(item.href, subcat)}
                        className="text-left px-3 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground rounded transition-colors"
                      >
                        {subcat}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="flex items-center space-x-2 pr-2">
            {isSearchOpen ? (
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Поиск товаров..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-48 px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-foreground placeholder-muted-foreground text-sm"
                  autoFocus
                />
                <button 
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
                <button 
                  type="button"
                  className="absolute right-8 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setIsSearchOpen(false)}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </form>
            ) : (
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Поиск"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            )}

            <Link 
              href="/favorites" 
              className="p-2 text-muted-foreground hover:text-foreground transition-colors relative"
              aria-label="Избранное"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {favoriteItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {favoriteItems.length}
                </span>
              )}
            </Link>

            <Link 
              href="/cart" 
              className="p-2 text-muted-foreground hover:text-foreground transition-colors relative"
              aria-label="Корзина"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="relative group">
                <button 
                  className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Личный кабинет"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </button>
                <div className="absolute right-0 top-full w-48 bg-card shadow-lg rounded-md p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all border border-border z-50">
                  <div className="px-3 py-2 text-sm text-muted-foreground border-b border-border">
                    Привет, {user?.name}
                  </div>
                  {isAdmin && (
                    <Link 
                      href="/dashboard" 
                      className="block px-3 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground rounded transition-colors"
                      onClick={() => setOpenCategory(null)}
                    >
                      Панель администратора
                    </Link>
                  )}
                  <Link 
                    href="/account" 
                    className="block px-3 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground rounded transition-colors"
                    onClick={() => setOpenCategory(null)}
                  >
                    Личный кабинет
                  </Link>
                  <Link 
                    href="/account/orders" 
                    className="block px-3 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground rounded transition-colors"
                    onClick={() => setOpenCategory(null)}
                    >
                    Заказы
                  </Link>
                  <Link 
                    href="/favorites" 
                    className="block px-3 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground rounded transition-colors"
                    onClick={() => setOpenCategory(null)}
                  >
                    Избранное
                  </Link>
                  <Link 
                    href="/api/auth/signout" 
                    className="block px-3 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground rounded transition-colors"
                    onClick={() => setOpenCategory(null)}
                  >
                    Выйти
                  </Link>
                </div>
              </div>
            ) : (
              <Link 
                href="/login" 
                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Войти"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>
            )}
          </div>  

        </div>
      </div>
            
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-16 bg-card z-50 overflow-y-auto">
          <div className="border-b border-border p-4">
            <div className="grid grid-cols-4 gap-4 text-center">
              <button 
                className="flex flex-col items-center space-y-1 text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => {
                  setIsSearchOpen(true);
                  setIsMobileMenuOpen(false);
                }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="text-xs">Поиск</span>
              </button>

              <Link 
                href="/favorites" 
                className="flex flex-col items-center space-y-1 text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="relative">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  {favoriteItems.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {favoriteItems.length}
                    </span>
                  )}
                </div>
                <span className="text-xs">Избранное</span>
              </Link>

              <Link 
                href="/cart" 
                className="flex flex-col items-center space-y-1 text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="relative">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6" />
                  </svg>
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </div>
                <span className="text-xs">Корзина</span>
              </Link>

              <Link 
                href={isAuthenticated ? "/account" : "/login"} 
                className="flex flex-col items-center space-y-1 text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-xs">Профиль</span>
              </Link>
            </div>
          </div>

          <div className="p-4 border-b border-border">
            <h3 className="font-semibold text-foreground mb-3 text-lg">Каталог</h3>
            <nav className="space-y-2">
              {mainNavigation.map((item) => (
                <div key={item.name} className="border-b border-border last:border-b-0">
                  {item.subcategories ? (
                    <>
                      <button
                        onClick={() => toggleCategory(item.name)}
                        className="flex items-center justify-between w-full py-3 px-3 text-foreground hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors font-medium"
                      >
                        <span>{item.name}</span>
                        <svg 
                          className={`w-4 h-4 transition-transform ${openCategory === item.name ? 'rotate-180' : ''}`}
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {openCategory === item.name && (
                        <div className="ml-4 space-y-1 pb-2">
                          {item.subcategories.map((subcat) => (
                            <button
                              key={subcat}
                              onClick={() => handleSubcategoryClick(item.href, subcat)}
                              className="block w-full text-left py-2 px-3 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded transition-colors"
                            >
                              {subcat}
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className="block py-3 px-3 text-foreground hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
            </nav>
          </div>

          <div className="p-4 border-b border-border">
            <h3 className="font-semibold text-foreground mb-3 text-lg">Дополнительно</h3>
            <div className="space-y-1">
              <Link
                href="/promo"
                className="block py-3 px-3 text-primary hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors font-medium border-b border-border last:border-b-0"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Акции
              </Link>
              <Link
                href="/news"
                className="block py-3 px-3 text-foreground hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors font-medium border-b border-border last:border-b-0"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Новости
              </Link>
              <Link
                href="/privileges"
                className="block py-3 px-3 text-foreground hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors font-medium border-b border-border last:border-b-0"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Программа привилегий
              </Link>
            </div>
          </div>

          <div className="p-4">
            <h3 className="font-semibold text-foreground mb-3 text-lg">Для кого</h3>
            <div className="space-y-1">
              {categories.map((category) => (
                <Link
                  key={category.name}
                  href={category.href}
                  className="block py-3 px-3 text-foreground hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors font-medium border-b border-border last:border-b-0"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;