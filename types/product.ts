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
  ratings: {
    average: number;
    count: number;
  };
  slug: string;
  createdAt?: Date; 
  updatedAt?: Date;
}

export type ProductDocument = IProduct & Document;