// components/layout/Header.tsx (обновленная версия)
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
  const [searchQuery, setSearchQuery] = useState('');
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

  return (
    <header className="border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-card/95">
      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4">
        {/* First row - Logo and actions */}
        <div className="flex items-center justify-between h-16">
          {/* Left side */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-2xl font-bold text-foreground">
              <span className="text-primary">KASTOM</span>
            </Link>

            {/* Desktop navigation */}
            <nav className="hidden lg:flex space-x-6">
              <Link 
                href="/products" 
                className="text-muted-foreground hover:text-foreground font-medium text-sm transition-colors"
              >
                Каталог
              </Link>
              <Link 
                href="/products?sale=true" 
                className="text-muted-foreground hover:text-foreground font-medium text-sm transition-colors"
              >
                Акции
              </Link>
              <Link 
                href="/contacts" 
                className="text-muted-foreground hover:text-foreground font-medium text-sm transition-colors"
              >
                Контакты
              </Link>
            </nav>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

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
                    <Link href="/admin/dashboard" className="block px-3 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground rounded transition-colors">
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
              <Link href="/login" className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors">
                Войти
              </Link>
            )}

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
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
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
                <Link
                  href={category.href}
                  className="text-muted-foreground hover:text-foreground text-sm font-medium py-3 transition-colors"
                >
                  {category.name}
                </Link>
                {category.subcategories && (
                  <div className="absolute top-full left-0 w-48 bg-card shadow-lg rounded-md p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all border border-border">
                    {category.subcategories.map((subcat) => (
                      <Link
                        key={subcat}
                        href={`${category.href}&type=${subcat.toLowerCase().replace(/\s+/g, '-')}`}
                        className="block px-3 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground rounded transition-colors"
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
    </header>
  );
};

export default Header;