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

export interface IProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
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
  slug: string;
  brand: string;
  sku: string;
  featured: boolean;
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
  active?: boolean;
  brand: string;
  gender: 'men' | 'women' | 'kids' | 'unisex';
  ageCategory?: 'infant' | 'toddler' | 'child' | 'teen';
  sizes: IProductSize[];
  colors: IProductColor[];
  ratings: {
    average: number;
    count: number;
  };
  slug: string;
  sku: string;
  featured?: boolean;
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
  ratings: {
    average: number;
    count: number;
  };
  brand?: string;
  isNew?: boolean;
  isFeatured?: boolean;
  category: string;
  sizes?: IProductSize[];
  colors?: IProductColor[];
  sku?: string;
  description?: string;
  images?: string[];
}

// Упрощенный тип для избранного
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
  sizes?: IProductSize[];
  sku?: string;
}

export type ProductDocument = IProduct & Document;

// Типы для админ-панели
export interface OrderItem {
  product: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  size?: string;
  color?: string;
  sku?: string;
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
  totalSales: number;
  sku?: string;
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

// Типы для корзины
export interface CartProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  size?: string;
  color?: string;
  sizes?: IProductSize[];
  requiresSizeSelection?: boolean;
  sku?: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size?: string;
  color?: string;
  productId: string;
  sizes?: IProductSize[];
  sku?: string;
}