'use client';

import { useState, useEffect } from 'react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function Template({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 150);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" color="primary" />
          <p className="mt-4 text-muted-foreground text-sm animate-pulse">
            Загрузка...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {children}
    </div>
  );
}