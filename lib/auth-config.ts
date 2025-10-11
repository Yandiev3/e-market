// lib/auth-config.ts
import { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import dbConnect from './dbConnect';
import User, { IUser } from '@/models/User';
import { validateEmail } from './utils';
import { Types } from 'mongoose'; 

interface IUserWithId extends IUser {
  _id: Types.ObjectId;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          console.log('=== AUTHORIZE START ===');
          console.log('Credentials received:', credentials);
          
          await dbConnect();
          console.log('DB connected successfully');

          if (!credentials?.email || !credentials?.password) {
            console.log('Missing credentials');
            throw new Error('Email and password are required');
          }

          if (!validateEmail(credentials.email)) {
            console.log('Invalid email format');
            throw new Error('Invalid email format');
          }

          const userEmail = credentials.email.toLowerCase();
          console.log('Searching for user with email:', userEmail);

          const user: IUserWithId | null = await User.findOne({ email: userEmail });
          console.log('User found:', user ? 'Yes' : 'No');
          
          if (!user) {
            console.log('User not found in database');
            throw new Error('No user found with this email');
          }

          console.log('Stored password hash:', user.password.substring(0, 20) + '...');
          console.log('Input password:', credentials.password);

          const isPasswordValid = await user.comparePassword(credentials.password);
          console.log('Password validation result:', isPasswordValid);

          if (!isPasswordValid) {
            console.log('Password comparison failed');
            throw new Error('Invalid password');
          }

          if (!user.active) {
            console.log('User account is not active');
            throw new Error('Account is deactivated');
          }

          console.log('=== AUTHORIZE SUCCESS ===');
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            lastname: user.lastname,
            role: user.role,
            phone: user.phone || '',
          };
        } catch (error) {
          console.error('Authorize error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.phone = user.phone;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.phone = token.phone as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    newUser: '/register',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
};