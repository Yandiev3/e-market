// lib/utils.tsx
import { IProductLean } from '@/models/Product';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
  }).format(price);
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(null, args), wait);
  };
}

export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('ru-RU', {
    month: 'long',
    day: 'numeric',
  }).format(dateObj);
}

// Универсальная функция для преобразования MongoDB документа в простой объект
export function toPlainObject(obj: any): any {
  if (!obj) return null;
  
  if (Array.isArray(obj)) {
    return obj.map(item => toPlainObject(item));
  }
  
  if (obj && typeof obj === 'object') {
    // Преобразуем ObjectId в строку
    if (obj._id && typeof obj._id === 'object' && obj._id.toString) {
      obj._id = obj._id.toString();
    }
    
    // Преобразуем другие поля ObjectId
    if (obj.id && typeof obj.id === 'object' && obj.id.toString) {
      obj.id = obj.id.toString();
    }
    
    // Рекурсивно обрабатываем вложенные объекты
    const result: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        result[key] = toPlainObject(obj[key]);
      }
    }
    return result;
  }
  
  return obj;
}

// Специализированная функция для продуктов
export function toProductLean(obj: any): IProductLean | null {
  if (!obj) return null;
  
  const plainObj = toPlainObject(obj);
  
  return {
    _id: plainObj._id?.toString(),
    name: plainObj.name,
    description: plainObj.description,
    price: plainObj.price,
    originalPrice: plainObj.originalPrice,
    images: plainObj.images || [],
    category: plainObj.category,
    brand: plainObj.brand,
    sku: plainObj.sku,
    gender: plainObj.gender,
    slug: plainObj.slug,
    featured: plainObj.featured,
    active: plainObj.active,
    specifications: plainObj.specifications,
    sizes: Array.isArray(plainObj.sizes) ? plainObj.sizes : [],
    colors: Array.isArray(plainObj.colors) ? plainObj.colors : [],
    ratings: plainObj.ratings ? {
      average: plainObj.ratings.average,
      count: plainObj.ratings.count
    } : { average: 0, count: 0 },
    createdAt: plainObj.createdAt,
    updatedAt: plainObj.updatedAt
  };
}

// Функция для преобразования массива продуктов
export function toProductsArray(products: any[]): IProductLean[] {
  if (!Array.isArray(products)) return [];
  return products.map(product => toProductLean(product)).filter(Boolean) as IProductLean[];
}