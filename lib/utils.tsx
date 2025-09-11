// lib/utils.tsx
import { IProductLean } from '@/models/Product';

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
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj);
}

export function toProductLean(obj: any): IProductLean | null {
  if (!obj) return null;
  
  return {
    _id: obj._id?.toString(),
    name: obj.name,
    description: obj.description,
    price: obj.price,
    originalPrice: obj.originalPrice,
    images: obj.images || [],
    category: obj.category,
    brand: obj.brand,
    stock: obj.stock,
    sku: obj.sku,
    gender: obj.gender,
    slug: obj.slug,
    featured: obj.featured,
    active: obj.active,
    specifications: obj.specifications,
    ratings: obj.ratings ? {
      average: obj.ratings.average,
      count: obj.ratings.count
    } : { average: 0, count: 0 },
    createdAt: obj.createdAt,
    updatedAt: obj.updatedAt
  };
}