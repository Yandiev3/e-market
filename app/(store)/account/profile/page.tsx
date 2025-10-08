// app/(store)/account/profile/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import ProfileNavigation from '@/components/account/ProfileNavigation';
import { Card, CardContent } from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Separator } from '@/components/ui/Separator';
import Button from '@/components/ui/Button';
import { User, Mail, Phone, MapPin, Save, ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    email: '',
    phone: '',
    address: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        lastname: user.lastname || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
      }));
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Валидация паролей
      if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
        toast.error('Новые пароли не совпадают');
        setLoading(false);
        return;
      }

      if (formData.newPassword && !formData.currentPassword) {
        toast.error('Для смены пароля необходимо указать текущий пароль');
        setLoading(false);
        return;
      }

      const response = await fetch('/api/account/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          lastname: formData.lastname,
          phone: formData.phone,
          address: formData.address,
          currentPassword: formData.currentPassword || undefined,
          newPassword: formData.newPassword || undefined,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Показываем успешный тостер
        toast.success('Профиль успешно обновлен');
        
        // Реактивное обновление данных в контексте без перезагрузки страницы
        updateUser({
          name: formData.name,
          lastname: formData.lastname,
          phone: formData.phone,
          address: formData.address,
        });

        // Очищаем поля паролей и закрываем секцию
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        }));
        setShowPasswordSection(false);
      } else {
        // Показываем ошибку с деталями из API
        const errorMessage = data.errors 
          ? data.errors.join(', ') 
          : data.message || 'Не удалось обновить профиль';
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Произошла ошибка при обновлении профиля');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const togglePasswordSection = () => {
    setShowPasswordSection(!showPasswordSection);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        {/* Добавляем Toaster компонент */}
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 4000,
              style: {
                background: '#10b981',
              },
            },
            error: {
              duration: 5000,
              style: {
                background: '#ef4444',
              },
            },
          }}
        />
        
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Редактирование профиля</h1>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Навигация */}
              <div className="lg:col-span-1">
                <ProfileNavigation />
              </div>

              {/* Основной контент */}
              <div className="lg:col-span-3">
                <Card className="p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-10 w-10 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">{formData.name}</h2>
                      <p className="text-muted-foreground">{formData.email}</p>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                      <div>
                        <Label htmlFor="name" className="flex items-center gap-2 mb-2">
                          <User className="h-4 w-4" />
                          Имя
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div>
                      <Label htmlFor="lastname" className="flex items-center gap-2 mb-2">
                          <User className="h-4 w-4" />
                          Фамилия
                        </Label>
                        <Input
                          id="lastname"
                          name="lastname"
                          value={formData.lastname}
                          onChange={handleChange}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className="flex items-center gap-2 mb-2">
                          <Mail className="h-4 w-4" />
                          Email
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          disabled
                        />
                      </div>

                      <div>
                        <Label htmlFor="phone" className="flex items-center gap-2 mb-2">
                          <Phone className="h-4 w-4" />
                          Телефон
                        </Label>
                        <Input
                          id="phone"
                          name="phone"
                          maxLength={11}
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+7 999 123-45-67"
                        />
                      </div>

                      <div>
                        <Label htmlFor="address" className="flex items-center gap-2 mb-2">
                          <MapPin className="h-4 w-4" />
                          Адрес доставки
                        </Label>
                        <Input
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          placeholder="ул. Примерная, д. 1"
                        />
                      </div>

                      {/* Раскрывающаяся секция смены пароля */}
                      <div className="border border-border rounded-lg">
                        <button
                          type="button"
                          onClick={togglePasswordSection}
                          className="w-full flex items-center justify-between p-4 text-left hover:bg-accent/50 transition-colors rounded-lg"
                        >
                          <h3 className="text-lg font-semibold">Смена пароля</h3>
                          {showPasswordSection ? (
                            <ChevronUp className="h-5 w-5 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-muted-foreground" />
                          )}
                        </button>

                        {showPasswordSection && (
                          <div className="p-4 border-t border-border space-y-4 animate-in fade-in duration-300">
                            <div>
                              <Label htmlFor="currentPassword" className="mb-2">
                                Текущий пароль
                              </Label>
                              <Input
                                id="currentPassword"
                                name="currentPassword"
                                type="password"
                                value={formData.currentPassword}
                                onChange={handleChange}
                                placeholder="Введите текущий пароль"
                              />
                            </div>

                            <div>
                              <Label htmlFor="newPassword" className="mb-2">
                                Новый пароль
                              </Label>
                              <Input
                                id="newPassword"
                                name="newPassword"
                                type="password"
                                value={formData.newPassword}
                                onChange={handleChange}
                                placeholder="Введите новый пароль"
                              />
                            </div>

                            <div>
                              <Label htmlFor="confirmPassword" className="mb-2">
                                Подтвердите новый пароль
                              </Label>
                              <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Подтвердите новый пароль"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      loading={loading} 
                      className="w-full mt-6"
                      size="lg"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Сохранить изменения
                    </Button>
                  </form>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}