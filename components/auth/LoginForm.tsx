"use client";

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Label from '@/components/ui/Label';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
        if (result.error.includes('заблокирован')) {
          setError('Ваш аккаунт заблокирован. Обратитесь к администратору.');
        } else if (result.error.includes('Неверный email или пароль')) {
          setError('Неверный email или пароль');
        } else if (result.error.includes('Пользователь не найден')) {
          setError('Пользователь с таким email не найден');
        } else {
          setError('Произошла ошибка при входе. Попробуйте еще раз.');
        }
        setLoading(false);
        return;
      }

      if (result?.ok) {
        router.push('/');
        router.refresh();
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Произошла ошибка при входе. Попробуйте еще раз.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 card p-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground">
            Вход в аккаунт
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Или{' '}
            <Link
              href="/register"
              className="font-medium text-primary hover:text-primary/80"
            >
              создайте новый аккаунт
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Введите ваш email"
              />
            </div>
            <div>
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Введите ваш пароль"
              />
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-destructive/15 p-4">
              <div className="text-sm text-destructive">{error}</div>
            </div>
          )}

          <div>
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Вход...' : 'Войти'}
            </Button>
          </div>

          <div className="text-center">
            <Link
              href="/"
              className="font-medium text-primary hover:text-primary/80 text-sm"
            >
              Вернуться на главную
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}