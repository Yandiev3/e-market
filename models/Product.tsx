// models/Product.tsx
import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  brand: string;
  stock: number;
  sku: string;
  slug: string;
  featured: boolean;
  active: boolean;
  gender: 'men' | 'women' | 'kids' | 'unisex'; // Добавлено поле пола
  ageCategory?: 'infant' | 'toddler' | 'child' | 'teen'; // Возрастная категория для детей
  specifications?: Record<string, string>;
  sizes?: { size: string; inStock: boolean }[]; // Добавлены размеры
  colors?: { name: string; value: string }[]; // Добавлены цвета
  ratings: {
    average: number;
    count: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface IProductLean {
  _id: Types.ObjectId | string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  brand: string;
  stock: number;
  sku: string;
  slug: string;
  featured: boolean; 
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
  createdAt: Date;
  updatedAt: Date;
}

export type ProductDocument = IProduct & Document;

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    originalPrice: {
      type: Number,
      min: 0,
    },
    images: [{
      type: String,
    }],
    category: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    sku: {
      type: String,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: true,
    },
    gender: {
      type: String,
      enum: ['men', 'women', 'kids', 'unisex'],
      required: true,
      default: 'unisex'
    },
    ageCategory: {
      type: String,
      enum: ['infant', 'toddler', 'child', 'teen'],
      required: function() {
        return this.gender === 'kids';
      }
    },
    specifications: {
      type: Map,
      of: String,
    },
    sizes: [{
      size: String,
      inStock: Boolean
    }],
    colors: [{
      name: String,
      value: String
    }],
    ratings: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
        min: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);

productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ featured: 1 });
productSchema.index({ active: 1 });
productSchema.index({ gender: 1 }); // Добавлен индекс по полу
productSchema.index({ ageCategory: 1 }); // Добавлен индекс по возрастной категории

export default mongoose.models.Product || mongoose.model<IProduct>('Product', productSchema);