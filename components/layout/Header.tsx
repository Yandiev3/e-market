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
      href: '/products?category=women',
      subcategories: [
        'Классические угги',
        'Угги с мехом',
        'Короткие угги',
        'Угги с принтом',
        'Домашние угги'
      ]
    },
    {
      name: 'Мужчинам',
      href: '/products?category=men',
      subcategories: [
        'Классические угги',
        'Угги с мехом',
        'Высокие угги'
      ]
    },
    {
      name: 'Детям',
      href: '/products?category=kids',
      subcategories: [
        'Для девочек',
        'Для мальчиков',
        'Угги для малышей'
      ]
    },
    { name: 'Новинки', href: '/products?new=true' },
    { name: 'Акции', href: '/products?sale=true' },
    { name: 'Бренды', href: '/brands' }
  ];

  const mainNavigation = [
    { name: 'Каталог', href: '/products' },
    { name: 'Акции', href: '/products?sale=true' },
    { name: 'Контакты', href: '/contacts' }
  ];

  const toggleCategory = (categoryName: string) => {
    setOpenCategory(openCategory === categoryName ? null : categoryName);
  };

  return (
    <header className="border-b border-border sticky top-0 z-50 bg-card">
      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4">
        {/* First row - Logo and actions */}
        <div className="flex items-center justify-between h-16">
          {/* Left side - Logo and mobile menu button */}
          <div className="flex items-center space-x-4">
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
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

            <Link 
              href="/" 
              className="text-2xl font-bold text-foreground"
            >
              <span className="text-primary">KASTOM</span>
            </Link>

            {/* Desktop navigation */}
            <nav className="hidden lg:flex space-x-6">
              {mainNavigation.map((item) => (
                <Link 
                  key={item.name}
                  href={item.href} 
                  className="text-muted-foreground hover:text-foreground font-medium text-sm transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right side - Actions (только для десктопа) */}
          <div className="hidden lg:flex items-center space-x-2">
            {/* Search */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Favorites */}
            <Link href="/favorites" className="p-2 text-muted-foreground hover:text-foreground transition-colors relative">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {favoriteItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {favoriteItems.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link href="/cart" className="p-2 text-muted-foreground hover:text-foreground transition-colors relative">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* User account */}
            {isAuthenticated ? (
              <div className="relative group">
                <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </button>
                <div className="absolute right-0 top-full w-48 bg-card shadow-lg rounded-md p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all border border-border">
                  <div className="px-3 py-2 text-sm text-muted-foreground border-b border-border">
                    Привет, {user?.name}
                  </div>
                  {isAdmin && (
                    <Link href="/dashboard" className="block px-3 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground rounded transition-colors">
                      Панель администратора
                    </Link>
                  )}
                  <Link href="/account" className="block px-3 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground rounded transition-colors">
                    Личный кабинет
                    </Link>
                  <Link href="/account/orders" className="block px-3 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground rounded transition-colors">
                    Заказы
                  </Link>
                  <Link href="/favorites" className="block px-3 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground rounded transition-colors">
                    Избранное
                  </Link>
                  <Link href="/api/auth/signout" className="block px-3 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground rounded transition-colors">
                    Выйти
                  </Link>
                </div>
              </div>
            ) : (
              <Link href="/login" className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>
            )}
          </div>
        </div>

        {/* Search bar */}
        {isSearchOpen && (
          <div className="pb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Поиск товаров..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 bg-input border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-foreground placeholder-muted-foreground"
              />
              <button 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => setIsSearchOpen(false)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Second row - Categories */}
        <div className="hidden lg:flex items-center justify-between h-12 border-t border-border">
          <div className="flex space-x-6">
            {categories.map((category) => (
              <div key={category.name} className="relative group">
                {category.subcategories ? (
                  <button
                    onClick={() => toggleCategory(category.name)}
                    className="flex items-center space-x-1 text-muted-foreground hover:text-foreground text-sm font-medium py-3 transition-colors"
                  >
                    <span>{category.name}</span>
                    <svg 
                      className={`w-4 h-4 transition-transform ${openCategory === category.name ? 'rotate-180' : ''}`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                ) : (
                  <Link
                    href={category.href}
                    className="text-muted-foreground hover:text-foreground text-sm font-medium py-3 transition-colors"
                  >
                    {category.name}
                  </Link>
                )}
                
                {category.subcategories && openCategory === category.name && (
                  <div className="absolute top-full left-0 w-48 bg-card shadow-lg rounded-md p-2 border border-border z-10">
                    {category.subcategories.map((subcat) => (
                      <Link
                        key={subcat}
                        href={`${category.href}&type=${subcat.toLowerCase().replace(/\s+/g, '-')}`}
                        className="block px-3 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground rounded transition-colors"
                        onClick={() => setOpenCategory(null)}
                      >
                        {subcat}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-16 bg-card z-50 overflow-y-auto">
          {/* Quick Actions */}
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

          {/* Main Navigation */}
          {/* <div className="p-4 border-b border-border">
            <nav className="space-y-2">
              {mainNavigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block py-3 px-3 text-foreground hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors text-lg font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div> */}

          {/* Categories */}
          <div className="p-4">
            <h3 className="font-semibold text-foreground mb-3 text-lg">Категории</h3>
            <div className="space-y-1">
              {categories.map((category) => (
                <div key={category.name} className="border-b border-border last:border-b-0">
                  {category.subcategories ? (
                    <>
                      <button
                        onClick={() => toggleCategory(category.name)}
                        className="flex items-center justify-between w-full py-3 px-3 text-foreground hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors font-medium"
                      >
                        <span>{category.name}</span>
                        <svg 
                          className={`w-4 h-4 transition-transform ${openCategory === category.name ? 'rotate-180' : ''}`}
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {openCategory === category.name && (
                        <div className="ml-4 space-y-1 pb-2">
                          {category.subcategories.map((subcat) => (
                            <Link
                              key={subcat}
                              href={`${category.href}&type=${subcat.toLowerCase().replace(/\s+/g, '-')}`}
                              className="block py-2 px-3 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded transition-colors"
                              onClick={() => {
                                setIsMobileMenuOpen(false);
                                setOpenCategory(null);
                              }}
                            >
                              {subcat}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={category.href}
                      className="block py-3 px-3 text-foreground hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {category.name}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;