// models/Product.tsx
import mongoose, { Document, Schema, Types } from 'mongoose';

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
  gender: 'men' | 'women' | 'kids' | 'unisex';
  ageCategory?: 'infant' | 'toddler' | 'child' | 'teen';
  specifications?: Record<string, string>;
  sizes: IProductSize[];
  colors: IProductColor[];
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
  gender: 'men' | 'women' | 'kids' | 'unisex';
  ageCategory?: 'infant' | 'toddler' | 'child' | 'teen';
  specifications?: Record<string, string>;
  sizes: IProductSize[];
  colors: IProductColor[];
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
      size: {
        type: String,
        required: true
      },
      inStock: {
        type: Boolean,
        default: true
      },
      stockQuantity: {
        type: Number,
        default: 0,
        min: 0
      }
    }],
    colors: [{
      name: {
        type: String,
        required: true
      },
      value: {
        type: String,
        required: true
      },
      image: String
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

// Автоматический расчет общего количества на складе на основе размеров
productSchema.pre('save', function(next) {
  if (this.sizes && this.sizes.length > 0) {
    this.stock = this.sizes.reduce((total, size) => total + (size.stockQuantity || 0), 0);
  }
  next();
});

productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ featured: 1 });
productSchema.index({ active: 1 });
productSchema.index({ gender: 1 });
productSchema.index({ ageCategory: 1 });

export default mongoose.models.Product || mongoose.model<IProduct>('Product', productSchema);