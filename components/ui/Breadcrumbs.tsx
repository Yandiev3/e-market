// components/ui/Breadcrumbs.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href: string;
  isCurrent?: boolean;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  className?: string;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = '' }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Автоматическое создание хлебных крошек из пути и параметров
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = pathname.split('/').filter(segment => segment);
    const breadcrumbs: BreadcrumbItem[] = [];
    
    // Главная страница
    breadcrumbs.push({
      label: 'Главная',
      href: '/',
      isCurrent: pathname === '/'
    });

    // Если мы на странице продуктов
    if (pathname.startsWith('/products')) {
      breadcrumbs.push({
        label: 'Каталог',
        href: '/products',
        isCurrent: pathname === '/products' && !searchParams.toString()
      });

      // Добавляем фильтры из search params
      const filters: string[] = [];
      
      if (searchParams.get('category')) {
        filters.push(`Категория: ${searchParams.get('category')}`);
      }
      if (searchParams.get('brand')) {
        filters.push(`Бренд: ${searchParams.get('brand')}`);
      }
      if (searchParams.get('gender')) {
        const genderMap: { [key: string]: string } = {
          'women': 'Женские',
          'men': 'Мужские', 
          'kids': 'Детские'
        };
        filters.push(genderMap[searchParams.get('gender')!] || searchParams.get('gender')!);
      }
      if (searchParams.get('search')) {
        filters.push(`Поиск: "${searchParams.get('search')}"`);
      }

      if (filters.length > 0) {
        breadcrumbs.push({
          label: filters.join(', '),
          href: pathname + '?' + searchParams.toString(),
          isCurrent: true
        });
      }
    }

    return breadcrumbs;
  };

  const breadcrumbItems = items || generateBreadcrumbs();

  return (
    <nav className={`flex items-center space-x-2 text-sm ${className}`}>
      {breadcrumbItems.map((item, index) => (
        <div key={item.href} className="flex items-center space-x-2">
          {index === 0 ? (
            <Home className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          )}
          
          {item.isCurrent ? (
            <span className="text-foreground font-medium">{item.label}</span>
          ) : (
            <Link
              href={item.href}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
};

export default Breadcrumbs;