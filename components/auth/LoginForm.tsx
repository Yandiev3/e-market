'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Label } from '@/components/ui/Label';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

const LoginForm: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const message = searchParams.get('message');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Неверный email или пароль');
      } else {
        router.push('/');
        router.refresh();
      }
    } catch (err) {
      setError('Произошла ошибка при входе');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="container mx-auto px-4 py-16 flex-1 flex items-center justify-center">
        <div className="max-w-md w-full">
          <Card className="p-8 border-border/50 bg-card/50 backdrop-blur-sm">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2 gradient-text-primary">kastom</h1>
              <p className="text-muted-foreground">
                Войдите в свой аккаунт
              </p>
            </div>

            {message && (
              <div className="bg-green-500/10 border border-green-500/20 text-green-600 px-4 py-3 rounded-lg mb-4 text-sm">
                {message}
              </div>
            )}

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="email" className="text-foreground">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="test@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 bg-input border-border"
                  required
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-foreground">Пароль</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-2 bg-input border-border"
                  required
                  minLength={6}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3" 
                disabled={loading}
              >
                {loading ? "Загрузка..." : "Войти"}
              </Button>

              <div className="text-center">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => router.push('/register')}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Нет аккаунта? Зарегистрироваться
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;