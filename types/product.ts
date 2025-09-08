// types/product.ts
export interface IProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  stock: number;
  active: boolean;
  gender: 'men' | 'women' | 'kids' | 'unisex'; // Добавлено
  ageCategory?: 'infant' | 'toddler' | 'child' | 'teen'; // Добавлено
  specifications?: Record<string, string>;
  sizes?: { size: string; inStock: boolean }[]; // Добавлено
  colors?: { name: string; value: string }[]; // Добавлено
  ratings: {
    average: number;
    count: number;
  };
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProductLean {
  _id: unknown;
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category?: string;
  stock: number;
  active?: boolean;
  brand: string;
  gender: 'men' | 'women' | 'kids' | 'unisex'; // Добавлено
  ageCategory?: 'infant' | 'toddler' | 'child' | 'teen'; // Добавлено
  ratings: {
    average: number;
    count: number;
  };
  slug: string;
  createdAt?: Date; 
  updatedAt?: Date;
}

export type ProductDocument = IProduct & Document;