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
  gender: 'men' | 'women' | 'kids' | 'unisex';
  ageCategory?: 'infant' | 'toddler' | 'child' | 'teen';
  specifications?: Record<string, string>;
  sizes?: { size: string; inStock: boolean }[];
  colors?: { name: string; value: string }[];
  ratings: {
    average: number;
    count: number;
  };
  slug: string; // Добавлено поле slug
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
  gender: 'men' | 'women' | 'kids' | 'unisex';
  ageCategory?: 'infant' | 'toddler' | 'child' | 'teen';
  ratings: {
    average: number;
    count: number;
  };
  slug: string; // Добавлено поле slug
  createdAt?: Date; 
  updatedAt?: Date;
}

export interface ProductForFavorites {
  id: string;
  name: string;
  price: number;
  image: string;
  slug: string;
}

export type ProductDocument = IProduct & Document;