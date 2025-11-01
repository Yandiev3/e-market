import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email и пароль обязательны');
        }

        await dbConnect();

        try {
          const user = await User.findOne({ email: credentials.email.toLowerCase() });

          if (!user) {
            throw new Error('Пользователь не найден');
          }

          // Проверяем активность аккаунта
          if (!user.active) {
            throw new Error('Ваш аккаунт заблокирован. Обратитесь к администратору.');
          }

          const isPasswordValid = await user.comparePassword(credentials.password);

          if (!isPasswordValid) {
            throw new Error('Неверный email или пароль');
          }

          return {
            id: user.id.toString(),
            email: user.email,
            name: user.name,
            lastname: user.lastname,
            phone: user.phone,
            role: user.role,
            address: user.address,
          };
        } catch (error) {
          console.error('Auth error:', error);
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.lastname = user.lastname;
        token.phone = user.phone;
        token.address = user.address;
      }

      // Обработка обновления сессии
      if (trigger === 'update' && session) {
        token = { ...token, ...session };
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.lastname = token.lastname as string;
        session.user.phone = token.phone as string;
        session.user.address = token.address as string;
      }

      // Дополнительная проверка активности пользователя при каждой сессии
      if (session.user.id) {
        try {
          await dbConnect();
          const user = await User.findById(session.user.id);
          if (!user || !user.active) {
            // Возвращаем сессию без данных пользователя, что приведет к разлогину
            return {
              ...session,
              user: {
                id: '',
                email: '',
                name: null,
                lastname: '',
                role: '',
                phone: null,
                address: null,
              }
            };
          }
        } catch (error) {
          console.error('Session validation error:', error);
          // Возвращаем пустую сессию при ошибке
          return {
            ...session,
            user: {
              id: '',
              email: '',
              name: null,
              lastname: '',
              role: '',
              phone: null,
              address: null,
            }
          };
        }
      }

      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 дней
  },
  secret: process.env.NEXTAUTH_SECRET,
};