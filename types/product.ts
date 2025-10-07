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
  slug: string;
  brand: string;
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
  category: string;
  stock: number;
  active?: boolean;
  brand: string;
  gender: 'men' | 'women' | 'kids' | 'unisex';
  ageCategory?: 'infant' | 'toddler' | 'child' | 'teen';
  ratings: {
    average: number;
    count: number;
  };
  slug: string;
  createdAt?: Date; 
  updatedAt?: Date;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  slug: string;
  stock: number;
  ratings: {
    average: number;
    count: number;
  };
  brand?: string;
  isNew?: boolean;
  isFeatured?: boolean;
  category: string;
}

// Упрощенный тип для избранного
export interface FavoriteProduct {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  slug: string;
  stock: number;
  ratings: {
    average: number;
    count: number;
  };
  brand?: string;
  category: string;
}

export type ProductDocument = IProduct & Document;

// Типы для админ-панели
export interface OrderItem {
  product: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface ShippingAddress {
  street: string;
  city: string;
}

export interface RecentOrder {
  _id: string;
  user?: {
    name?: string;
    email?: string;
  };
  totalPrice: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  orderItems?: OrderItem[];
  shippingAddress?: ShippingAddress;
}

export interface TopProduct {
  _id: string;
  name: string;
  price: number;
  images: string[];
  stock: number;
  totalSales: number;
}

export interface DashboardStats {
  totalSales: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  recentOrders: RecentOrder[];
  topProducts: TopProduct[];
  monthlySales?: Array<{
    month: string;
    sales: number;
  }>;
  topCategories?: Array<{
    category: string;
    count: number;
    revenue: number;
  }>;
  recentActivity?: Array<{
    type: string;
    description: string;
    timestamp: string;
  }>;
}