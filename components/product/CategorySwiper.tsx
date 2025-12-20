// components/product/CategorySwiper.tsx
'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CategoryItem {
  id: string;
  brand: string;
  model: string;
  image: string;
  filterParams: string;
  href: string;
}

interface CategorySwiperProps {
  categories: CategoryItem[];
}

const CategorySwiper: React.FC<CategorySwiperProps> = ({ 
  categories, 
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const cardWidth = 240 + 24;
      const scrollAmount = cardWidth * 1;
      const newScrollLeft = scrollContainerRef.current.scrollLeft + 
        (direction === 'left' ? -scrollAmount : scrollAmount);
      
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-16 border-t border-border">
      <div className="container mx-auto px-4">
        {/* Родительский контейнер с фиксированной шириной для 4 карточек */}
        <div 
          className="relative mx-auto"
          style={{
            width: 'calc(240px * 4 + 24px * 3)', // 240px * 4 карточек + 24px * 3 промежутков
            maxWidth: '100%' // Для адаптивности на мобильных
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Контейнер для карточек - теперь без фиксированной ширины */}
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth"
          >
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/products${category.filterParams}`}
                className="flex-none w-60 relative group"
              >
                <div className="bg-card border border-border rounded-xl overflow-hidden">
                  <div className="relative w-60 h-[360px] overflow-hidden">
                    <Image
                      src={category.image}
                      alt={`${category.brand} ${category.model}`}
                      fill
                      className="object-cover"
                      sizes="240px"
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <button
            onClick={() => scroll('left')}
            className={`absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-6 z-10 p-3 bg-black/30 backdrop-blur-sm border border-white rounded-full transition-all duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            } hover:bg-black/60 hover:border-primary`}
            aria-label="Предыдущие товары"
          >
            <ChevronLeft className="w-5 h-5 text-primary" />
          </button>

          <button
            onClick={() => scroll('right')}
            className={`absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-6 z-10 p-3 bg-black/30 backdrop-blur-sm border border-white rounded-full transition-all duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            } hover:bg-black/60 hover:border-primary`}
            aria-label="Следующие товары"
          >
            <ChevronRight className="w-5 h-5 text-primary" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default CategorySwiper;