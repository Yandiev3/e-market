// components/account/ProfileNavigation.tsx
'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { User, ShoppingBag, Settings, Heart, LayoutDashboard } from 'lucide-react';

interface ProfileNavigationProps {
  className?: string;
}

export default function ProfileNavigation({ className = '' }: ProfileNavigationProps) {
  const pathname = usePathname();

  const navigationItems = [
    {
      href: '/account',
      label: 'Обзор',
      icon: LayoutDashboard,
      active: pathname === '/account'
    },
    {
      href: '/account/orders',
      label: 'Заказы',
      icon: ShoppingBag,
      active: pathname === '/account/orders'
    },
    {
      href: '/account/profile',
      label: 'Редактирование профиля',
      icon: Settings,
      active: pathname === '/account/profile'
    },
  ];

  return (
    <nav className={`space-y-1 ${className}`}>
      {navigationItems.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              item.active
                ? 'bg-primary/10 text-primary border-l-2 border-primary'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <Icon className={`h-4 w-4 mr-3 ${item.active ? 'text-primary' : 'text-gray-400'}`} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}