// models/User.tsx
import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface ICartItem {
  product: mongoose.Types.ObjectId;
  quantity: number;
  addedAt: Date;
}

export interface IFavoriteItem {
  product: mongoose.Types.ObjectId;
  addedAt: Date;
}

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  lastname: string;
  phone: string;
  role: 'user' | 'admin';
  active: boolean;
  cart: ICartItem[];
  favorites: IFavoriteItem[];
  address: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    phone:{
      type: String,
      required: false,
    },
    address: {
      type: String,
      required: false,
      default: '',
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    lastname: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    active: {
      type: Boolean,
      default: true,
    },
    cart: [{
      product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1,
      },
      addedAt: {
        type: Date,
        default: Date.now,
      },
    }],
    favorites: [{
      product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      addedAt: {
        type: Date,
        default: Date.now,
      },
    }],
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Убедитесь, что модель пересоздается при горячей перезагрузке
if (mongoose.models.User) {
  delete mongoose.models.User;
}

export default mongoose.model<IUser>('User', userSchema);