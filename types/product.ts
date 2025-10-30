// types/product.ts
export interface IProductSize {
  size: string;
  inStock: boolean;
  stockQuantity: number;
}

export interface IProductColor {
  name: string;
  value: string;
  image?: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  brand: string;
  sku: string;
  slug: string;
  featured: boolean;
  active: boolean;
  gender: 'men' | 'women' | 'kids' | 'unisex';
  ageCategory?: 'infant' | 'toddler' | 'child' | 'teen';
  specifications?: Record<string, string>;
  sizes: IProductSize[];
  colors: IProductColor[];
  ratings: {
    average: number;
    count: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface IProductLean {
  _id?: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  brand: string;
  sku: string;
  slug: string;
  featured: boolean;
  active: boolean;
  gender: 'men' | 'women' | 'kids' | 'unisex';
  ageCategory?: 'infant' | 'toddler' | 'child' | 'teen';
  specifications?: Record<string, string>;
  sizes: IProductSize[];
  colors: IProductColor[];
  ratings: {
    average: number;
    count: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CartProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  sizes: IProductSize[];
  colors?: IProductColor[];
  sku: string; // Делаем обязательным
  requiresSizeSelection?: boolean;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size?: string;
  color?: string;
  sizes: IProductSize[];
  colors: IProductColor[];
  sku: string;
}

export interface IOrderItemSize {
  size: string;
  quantity: number;
  stockQuantity: number;
  inStock: boolean;
}

export interface OrderItemRequest {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  sizes: IOrderItemSize[];
  color?: string;
  sku: string;
}

export interface FavoriteProduct {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  slug: string;
  ratings: {
    average: number;
    count: number;
  };
  brand?: string;
  category: string;
  sizes: IProductSize[];
  sku: string; // Делаем обязательным
}

// ДОБАВЛЕНО: Интерфейс для элементов избранного в контексте
export interface FavoriteItem {
  _id: string;
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  brand: string;
  sku: string;
  slug: string;
  featured: boolean;
  active: boolean;
  gender: 'men' | 'women' | 'kids' | 'unisex';
  ageCategory?: 'infant' | 'toddler' | 'child' | 'teen';
  specifications?: Record<string, string>;
  sizes: IProductSize[];
  colors: IProductColor[];
  ratings: {
    average: number;
    count: number;
  };
  createdAt: string;
  updatedAt: string;
  addedAt: string | Date;
}

// ДОБАВЛЕНО: Утилитарный тип для преобразования FavoriteItem в Product
export type FavoriteItemAsProduct = FavoriteItem & {
  isNew?: boolean;
  isFeatured?: boolean;
};

export interface ProductFilter {
  category?: string;
  brand?: string;
  priceRange?: [number, number];
  sizes?: string[];
  colors?: string[];
  gender?: string;
  ageCategory?: string;
  inStock?: boolean;
  featured?: boolean;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ProductsResponse {
  products: Product[];
  pagination: PaginationInfo;
  filters: {
    categories: string[];
    brands: string[];
    sizes: string[];
    colors: string[];
    priceRange: [number, number];
  };
}

export interface SearchParams {
  query?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  sizes?: string[];
  colors?: string[];
  gender?: string;
  ageCategory?: string;
  inStock?: boolean;
  featured?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// Admin product
export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  brand: string;
  sku: string;
  slug: string;
  featured: boolean;
  active: boolean;
  gender: 'men' | 'women' | 'kids' | 'unisex';
  ageCategory?: 'infant' | 'toddler' | 'child' | 'teen';
  specifications?: Record<string, string>;
  sizes: Array<{
    size: string;
    inStock: boolean;
    stockQuantity: number;
  }>;
  colors: Array<{
    name: string;
    value: string;
    image?: string;
  }>;
}

// API response
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface CartResponse {
  cart: CartItem[];
}

export interface OrderResponse {
  order: any; 
  message: string;
}