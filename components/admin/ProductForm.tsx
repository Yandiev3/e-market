// components/admin/ProductForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const addSize = () => {
    setFormData(prev => ({
      ...prev,
      sizes: [...prev.sizes, { size: '', inStock: true }]
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Основная информация */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Название</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Цена</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>

      {/* Пол и возрастная категория */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Пол</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="men">Мужской</option>
            <option value="women">Женский</option>
            <option value="kids">Детский</option>
            <option value="unisex">Унисекс</option>
          </select>
        </div>

        {formData.gender === 'kids' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Возрастная категория</label>
            <select
              name="ageCategory"
              value={formData.ageCategory || ''}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
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

      {/* Остальные поля формы... */}
      <button type="submit" disabled={loading} className="bg-blue-600 text-white px-6 py-2 rounded-md">
        {loading ? 'Сохранение...' : 'Сохранить'}
      </button>
    </form>
  );
};

export default ProductForm;