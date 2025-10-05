'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Label } from '@/components/ui/Label';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

const RegisterForm: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Пароль должен содержать минимум 6 символов');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Ошибка регистрации');
      }

      router.push('/login?message=Регистрация прошла успешно. Войдите в свой аккаунт.');
    } catch (err: any) {
      setError(err.message || 'Произошла ошибка при регистрации');
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
                Создайте аккаунт
              </p>
            </div>

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
                <p className="text-xs text-muted-foreground mt-2">
                  Минимум 6 символов
                </p>
              </div>

              <div>
                <Label htmlFor="confirmPassword" className="text-foreground">Подтвердите пароль</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                {loading ? "Загрузка..." : "Зарегистрироваться"}
              </Button>

              <div className="text-center">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => router.push('/login')}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Уже есть аккаунт? Войти
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;