// components/admin/ProductForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  brand: string;
  stock: number;
  sku: string;
  slug: string;
  featured: boolean;
  active: boolean;
  gender: 'men' | 'women' | 'kids' | 'unisex';
  ageCategory?: 'infant' | 'toddler' | 'child' | 'teen';
  specifications: Record<string, string>;
  sizes: { size: string; inStock: boolean }[];
  colors: { name: string; value: string }[];
}

interface ProductFormProps {
  initialData?: ProductFormData;
  onSubmit: (data: ProductFormData) => Promise<void>;
  loading?: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({ initialData, onSubmit, loading = false }) => {
  const router = useRouter();
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: 0,
    originalPrice: undefined,
    images: [],
    category: '',
    brand: '',
    stock: 0,
    sku: '',
    slug: '',
    featured: false,
    active: true,
    gender: 'unisex',
    ageCategory: undefined,
    specifications: {},
    sizes: [],
    colors: []
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
               type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const addSize = () => {
    setFormData(prev => ({
      ...prev,
      sizes: [...prev.sizes, { size: '', inStock: true }]
    }));
  };

  const removeSize = (index: number) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.filter((_, i) => i !== index)
    }));
  };

  const updateSize = (index: number, field: 'size' | 'inStock', value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.map((size, i) => 
        i === index ? { ...size, [field]: value } : size
      )
    }));
  };

  const addColor = () => {
    setFormData(prev => ({
      ...prev,
      colors: [...prev.colors, { name: '', value: '#000000' }]
    }));
  };

  const removeColor = (index: number) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== index)
    }));
  };

  const updateColor = (index: number, field: 'name' | 'value', value: string) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.map((color, i) => 
        i === index ? { ...color, [field]: value } : color
      )
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Основная информация */}
      <div className="card p-6">
        <h3 className="text-lg font-medium text-foreground mb-4">Основная информация</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Название товара"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            placeholder="Введите название товара"
          />
          
          <Input
            label="Цена"
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            required
            min="0"
            step="0.01"
            placeholder="0.00"
          />
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-foreground mb-2">Описание</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            rows={4}
            className="w-full px-3 py-2 bg-input border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground placeholder-muted-foreground"
            placeholder="Подробное описание товара"
          />
        </div>
      </div>

      {/* Категория и бренд */}
      <div className="card p-6">
        <h3 className="text-lg font-medium text-foreground mb-4">Категория и бренд</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Категория</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 bg-input border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
            >
              <option value="">Выберите категорию</option>
              <option value="classic">Классические угги</option>
              <option value="mini">Мини угги</option>
              <option value="tall">Высокие угги</option>
              <option value="slippers">Домашние тапочки</option>
            </select>
          </div>

          <Input
            label="Бренд"
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleInputChange}
            required
            placeholder="UGG, EMU и т.д."
          />
        </div>
      </div>

      {/* Пол и возрастная категория */}
      <div className="card p-6">
        <h3 className="text-lg font-medium text-foreground mb-4">Аудитория</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Пол</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-input border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
            >
              <option value="men">Мужской</option>
              <option value="women">Женский</option>
              <option value="kids">Детский</option>
              <option value="unisex">Унисекс</option>
            </select>
          </div>

          {formData.gender === 'kids' && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Возрастная категория</label>
              <select
                name="ageCategory"
                value={formData.ageCategory || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-input border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
              >
                <option value="">Выберите категорию</option>
                <option value="infant">Младенцы (0-2)</option>
                <option value="toddler">Малыши (2-4)</option>
                <option value="child">Дети (4-12)</option>
                <option value="teen">Подростки (12-16)</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Размеры и цвета */}
      <div className="card p-6">
        <h3 className="text-lg font-medium text-foreground mb-4">Размеры и цвета</h3>
        
        {/* Размеры */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium text-foreground">Размеры</label>
            <Button type="button" variant="outline" size="sm" onClick={addSize}>
              Добавить размер
            </Button>
          </div>
          <div className="space-y-3">
            {formData.sizes.map((size, index) => (
              <div key={index} className="flex items-center space-x-3">
                <Input
                  placeholder="Размер (например: 36)"
                  value={size.size}
                  onChange={(e) => updateSize(index, 'size', e.target.value)}
                />
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={size.inStock}
                    onChange={(e) => updateSize(index, 'inStock', e.target.checked)}
                    className="rounded border-input text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-foreground">В наличии</span>
                </label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSize(index)}
                >
                  Удалить
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Цвета */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium text-foreground">Цвета</label>
            <Button type="button" variant="outline" size="sm" onClick={addColor}>
              Добавить цвет
            </Button>
          </div>
          <div className="space-y-3">
            {formData.colors.map((color, index) => (
              <div key={index} className="flex items-center space-x-3">
                <Input
                  placeholder="Название цвета"
                  value={color.name}
                  onChange={(e) => updateColor(index, 'name', e.target.value)}
                />
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={color.value}
                    onChange={(e) => updateColor(index, 'value', e.target.value)}
                    className="w-10 h-10 rounded border border-input"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeColor(index)}
                  >
                    Удалить
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Дополнительные настройки */}
      <div className="card p-6">
        <h3 className="text-lg font-medium text-foreground mb-4">Дополнительные настройки</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Input
            label="SKU"
            type="text"
            name="sku"
            value={formData.sku}
            onChange={handleInputChange}
            required
            placeholder="Уникальный код"
          />

          <Input
            label="Остаток на складе"
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleInputChange}
            required
            min="0"
            placeholder="0"
          />

          <Input
            label="URL slug"
            type="text"
            name="slug"
            value={formData.slug}
            onChange={handleInputChange}
            required
            placeholder="product-slug"
          />
        </div>

        <div className="mt-6 space-y-4">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleInputChange}
              className="rounded border-input text-primary focus:ring-primary"
            />
            <span className="text-sm font-medium text-foreground">Рекомендуемый товар</span>
          </label>

          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              name="active"
              checked={formData.active}
              onChange={handleInputChange}
              className="rounded border-input text-primary focus:ring-primary"
            />
            <span className="text-sm font-medium text-foreground">Активный товар</span>
          </label>
        </div>
      </div>

      {/* Кнопки действий */}
      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          Отмена
        </Button>
        <Button
          type="submit"
          loading={loading}
        >
          {initialData ? 'Обновить товар' : 'Создать товар'}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;