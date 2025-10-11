// components/admin/ProductForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { IProductSize, IProductColor } from '@/models/Product';

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
  sizes: IProductSize[];
  colors: IProductColor[];
}

interface ProductFormProps {
  initialData?: ProductFormData;
  onSubmit: (data: ProductFormData) => Promise<void>;
  loading?: boolean;
}

// Стандартные размеры для разных категорий
const STANDARD_SIZES = {
  adult: ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45'],
  kids: ['25', '26', '27', '28', '29', '30', '31', '32', '33', '34'],
  infant: ['18', '19', '20', '21', '22', '23', '24']
};

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

  // Автогенерация slug из названия
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\w\u0400-\u04FF]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData(prev => ({
      ...prev,
      name,
      slug: generateSlug(name)
    }));
  };

  // Управление размерами
  const addSize = (size?: string) => {
    setFormData(prev => ({
      ...prev,
      sizes: [...prev.sizes, { 
        size: size || '', 
        inStock: true,
        stockQuantity: 0
      }]
    }));
  };

  const removeSize = (index: number) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.filter((_, i) => i !== index)
    }));
  };

  const updateSize = (index: number, field: keyof IProductSize, value: string | boolean | number) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.map((size, i) => 
        i === index ? { ...size, [field]: value } : size
      )
    }));
  };

  const addStandardSizes = () => {
    let sizesToAdd: string[] = [];
    
    if (formData.gender === 'kids' && formData.ageCategory) {
      switch (formData.ageCategory) {
        case 'infant':
          sizesToAdd = STANDARD_SIZES.infant;
          break;
        case 'toddler':
        case 'child':
          sizesToAdd = STANDARD_SIZES.kids;
          break;
        case 'teen':
          sizesToAdd = STANDARD_SIZES.adult.slice(0, 8); // Меньшие размеры для подростков
          break;
      }
    } else {
      sizesToAdd = STANDARD_SIZES.adult;
    }

    const newSizes = sizesToAdd.map(size => ({
      size,
      inStock: true,
      stockQuantity: 0
    }));

    setFormData(prev => ({
      ...prev,
      sizes: [...prev.sizes, ...newSizes]
    }));
  };

  // Управление цветами
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

  const updateColor = (index: number, field: keyof IProductColor, value: string) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.map((color, i) => 
        i === index ? { ...color, [field]: value } : color
      )
    }));
  };

  // Расчет общего количества на складе
  const totalStock = formData.sizes.reduce((sum, size) => sum + (size.stockQuantity || 0), 0);

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
            onChange={handleNameChange}
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
              <option value="boots">Ботинки</option>
              <option value="sandals">Сандалии</option>
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

      {/* Размеры */}
      <div className="card p-6">
        <h3 className="text-lg font-medium text-foreground mb-4">
          Размеры 
          <span className="ml-2 text-sm font-normal text-muted-foreground">
            (Общее количество: {totalStock} шт.)
          </span>
        </h3>
        
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium text-foreground">Управление размерами</label>
            <div className="flex space-x-2">
              <Button type="button" variant="outline" size="sm" onClick={addStandardSizes}>
                Добавить стандартные размеры
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => addSize()}>
                Добавить размер
              </Button>
            </div>
          </div>
          
          {formData.sizes.length > 0 ? (
            <div className="space-y-4">
              {formData.sizes.map((size, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 border border-border rounded-lg">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                      label="Размер"
                      placeholder="Например: 36, 37, M, L"
                      value={size.size}
                      onChange={(e) => updateSize(index, 'size', e.target.value)}
                      required
                    />
                    
                    <Input
                      label="Количество"
                      type="number"
                      min="0"
                      value={size.stockQuantity}
                      onChange={(e) => updateSize(index, 'stockQuantity', parseInt(e.target.value) || 0)}
                      required
                    />
                    
                    <div className="flex items-end space-x-4">
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
                        className="text-destructive hover:text-destructive/80"
                      >
                        Удалить
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 border-2 border-dashed border-border rounded-lg">
              <p className="text-muted-foreground mb-4">Размеры не добавлены</p>
              <Button type="button" variant="outline" onClick={addStandardSizes}>
                Добавить стандартные размеры
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Цвета */}
      <div className="card p-6">
        <h3 className="text-lg font-medium text-foreground mb-4">Цвета</h3>
        
        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium text-foreground">Управление цветами</label>
            <Button type="button" variant="outline" size="sm" onClick={addColor}>
              Добавить цвет
            </Button>
          </div>
          
          {formData.colors.length > 0 ? (
            <div className="space-y-4">
              {formData.colors.map((color, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 border border-border rounded-lg">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Название цвета"
                      placeholder="Например: Черный, Бежевый"
                      value={color.name}
                      onChange={(e) => updateColor(index, 'name', e.target.value)}
                      required
                    />
                    
                    <div className="flex items-end space-x-4">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-foreground mb-2">Цвет</label>
                        <div className="flex items-center space-x-3">
                          <input
                            type="color"
                            value={color.value}
                            onChange={(e) => updateColor(index, 'value', e.target.value)}
                            className="w-12 h-12 rounded border border-input cursor-pointer"
                          />
                          <span className="text-sm text-muted-foreground">{color.value}</span>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeColor(index)}
                        className="text-destructive hover:text-destructive/80 mt-2"
                      >
                        Удалить
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 border-2 border-dashed border-border rounded-lg">
              <p className="text-muted-foreground">Цвета не добавлены</p>
            </div>
          )}
        </div>
      </div>

      {/* Дополнительные настройки */}
      <div className="card p-6">
        <h3 className="text-lg font-medium text-foreground mb-4">Дополнительные настройки</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Input
            label="SKU (Артикул)"
            type="text"
            name="sku"
            value={formData.sku}
            onChange={handleInputChange}
            required
            placeholder="UGG-CLASSIC-36"
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

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Общее количество: {totalStock} шт.
            </label>
            <p className="text-xs text-muted-foreground">
              Рассчитывается автоматически из количества по размерам
            </p>
          </div>
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