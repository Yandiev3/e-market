// types/next-auth.d.ts
import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      lastname: string;
      image?: string | null;
      role: string;
      phone?: string | null;
      address?: string | null;
      city?: string | null;
    };
  }

  interface User {
    id: string;
    email: string;
    phone: string;
    name?: string | null;
    lastname: string;
    image?: string | null;
    role: string;
    address: string;
  }

  interface JWT {
    id: string;
    role: string;
    lastname: string;
    phone: string;
    address: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: string;
    lastname: string;
    phone: string;
    address: string;
  }
}