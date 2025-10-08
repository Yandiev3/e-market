// context/AuthContext.tsx
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { SessionProvider, useSession } from 'next-auth/react';

interface User {
  id: string;
  email: string;
  name: string;
  lastname: string;
  role: string;
  phone?: string;
  address?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  updateUser: (userData: Partial<User>) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAuthenticated: false,
  isAdmin: false,
  updateUser: () => {},
  refreshUser: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: session, status, update } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Функция для обновления данных пользователя из API
  const refreshUser = async () => {
    try {
      const response = await fetch('/api/account/profile');
      if (response.ok) {
        const data = await response.json();
        if (data.user) {
          setUser(data.user);
          // Обновляем сессию NextAuth
          await update({
            ...session,
            user: {
              ...session?.user,
              ...data.user
            }
          });
        }
      }
    } catch (error) {
      console.error('Failed to refresh user data:', error);
    }
  };

  useEffect(() => {
    const initializeUser = async () => {
      if (status === 'loading') {
        setLoading(true);
      } else if (session?.user) {
        try {
          // При загрузке получаем актуальные данные из API
          const response = await fetch('/api/account/profile');
          if (response.ok) {
            const data = await response.json();
            if (data.user) {
              setUser(data.user);
            }
          } else {
            // Fallback на данные из сессии
            setUser({
              id: session.user.id,
              email: session.user.email!,
              name: session.user.name!,
              lastname: session.user.lastname || '', 
              role: session.user.role || 'user',
              phone: session.user.phone || '',
              address: session.user.address || '',
            });
          }
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
          // Fallback на данные из сессии
          setUser({
            id: session.user.id,
            email: session.user.email!,
            name: session.user.name!,
            lastname: session.user.lastname || '',
            role: session.user.role || 'user',
            phone: session.user.phone || '',
            address: session.user.address || '',
          });
        }
        setLoading(false);
      } else {
        setUser(null);
        setLoading(false);
      }
    };

    initializeUser();
  }, [session, status, update]);

  const updateUser = (userData: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...userData } : null);
  };

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    updateUser,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const AppAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <SessionProvider>
      <AuthProvider>{children}</AuthProvider>
    </SessionProvider>
  );
};