// components/layout/Header.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

const Header: React.FC = () => {
  const { totalItems } = useCart();
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
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      {/* Top announcement bar */}
      <div className="bg-gray-900 text-white text-sm py-2 text-center">
        🚚 Бесплатная доставка при заказе от 5000₽ • ⚡ Быстрая доставка за 1-3 дня
      </div>

      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4">
        {/* First row - Logo and actions */}
        <div className="flex items-center justify-between h-16">
          {/* Left side */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              UGGHOUSE
            </Link>

            {/* Desktop navigation */}
            <nav className="hidden lg:flex space-x-6">
              {categories.slice(0, 4).map((category) => (
                <Link
                  key={category.name}
                  href={category.href}
                  className="text-gray-700 hover:text-gray-900 font-medium text-sm"
                >
                  {category.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-gray-600 hover:text-gray-900"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* User account */}
            {isAuthenticated ? (
              <div className="relative group">
                <button className="p-2 text-gray-600 hover:text-gray-900">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </button>
                <div className="absolute right-0 top-full w-48 bg-white shadow-lg rounded-md p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <div className="px-3 py-2 text-sm text-gray-600 border-b">
                    Привет, {user?.name}
                  </div>
                  <Link href="/account" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
                    Личный кабинет
                  </Link>
                  <Link href="/account/orders" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
                    Заказы
                  </Link>
                  <Link href="/account/favorites" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
                    Избранное
                  </Link>
                  <Link href="/api/auth/signout" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
                    Выйти
                  </Link>
                </div>
              </div>
            ) : (
              <Link href="/login" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                Войти
              </Link>
            )}

            {/* Favorites */}
            <Link href="/favorites" className="p-2 text-gray-600 hover:text-gray-900 relative">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                3
              </span>
            </Link>

            {/* Cart */}
            <Link href="/cart" className="p-2 text-gray-600 hover:text-gray-900 relative">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Second row - Categories */}
        <div className="hidden lg:flex items-center justify-between h-12 border-t border-gray-200">
          <div className="flex space-x-6">
            {categories.map((category) => (
              <div key={category.name} className="relative group">
                <Link
                  href={category.href}
                  className="text-gray-600 hover:text-gray-900 text-sm font-medium py-3"
                >
                  {category.name}
                </Link>
                {category.subcategories && (
                  <div className="absolute top-full left-0 w-48 bg-white shadow-lg rounded-md p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    {category.subcategories.map((subcat) => (
                      <Link
                        key={subcat}
                        href={`${category.href}&type=${subcat.toLowerCase().replace(/\s+/g, '-')}`}
                        className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
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