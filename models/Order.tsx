// models/Order.tsx
import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IOrderItemSize {
  size: string;
  quantity: number;
  stockQuantity: number;
  inStock: boolean;
}

export interface IOrderItem {
  product: Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
  image: string;
  sizes: IOrderItemSize[];
  color?: string;
  sku: string;
}

export interface IShippingAddress {
  street: string;
  apartment?: string;
  city?: string;
  postalCode?: string;
  country?: string;
}

export interface IOrder extends Document {
  user: Types.ObjectId;
  orderItems: IOrderItem[];
  shippingAddress: IShippingAddress;
  paymentMethod: string;
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  isPaid: boolean;
  paidAt?: Date;
  isDelivered: boolean;
  deliveredAt?: Date;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSizeSchema = new Schema<IOrderItemSize>({
  size: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  stockQuantity: {
    type: Number,
    required: true,
    min: 0
  },
  inStock: {
    type: Boolean,
    required: true
  }
});

const orderItemSchema = new Schema<IOrderItem>({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  image: {
    type: String,
    required: true
  },
  sizes: [orderItemSizeSchema],
  color: String,
  sku: {
    type: String,
    required: true
  }
});

const shippingAddressSchema = new Schema<IShippingAddress>({
  street: {
    type: String,
    required: true
  },
  apartment: String,
  city: String,
  postalCode: String,
  country: String
});

const orderSchema = new Schema<IOrder>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    orderItems: [orderItemSchema],
    shippingAddress: shippingAddressSchema,
    paymentMethod: {
      type: String,
      required: true,
      enum: ['card', 'cash', 'online'],
      default: 'card'
    },
    itemsPrice: {
      type: Number,
      required: true,
      min: 0
    },
    taxPrice: {
      type: Number,
      required: true,
      min: 0
    },
    shippingPrice: {
      type: Number,
      required: true,
      min: 0
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    isPaid: {
      type: Boolean,
      default: false
    },
    paidAt: Date,
    isDelivered: {
      type: Boolean,
      default: false
    },
    deliveredAt: Date,
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending'
    }
  },
  {
    timestamps: true
  }
);

orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: 1 });

export default mongoose.models.Order || mongoose.model<IOrder>('Order', orderSchema);