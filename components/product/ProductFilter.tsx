// components/product/ProductFilter.tsx
'use client';

import React, { useState } from 'react';

interface FilterOptions {
  category: string;
  priceRange: string;
  sortBy: string;
  inStock: boolean;
  featured: boolean;
  brand: string;
  size: string;
  color: string;
}

interface ProductFilterProps {
  categories: string[];
  brands: string[];
  onFilterChange: (filters: Partial<FilterOptions>) => void;
  loading?: boolean;
}

const ProductFilter: React.FC<ProductFilterProps> = ({
  categories = [], // Добавлено значение по умолчанию
  brands = [], // Добавлено значение по умолчанию
  onFilterChange,
  loading = false,
}) => {
  const [filters, setFilters] = useState<FilterOptions>({
    category: '',
    priceRange: '',
    sortBy: 'popular',
    inStock: false,
    featured: false,
    brand: '',
    size: '',
    color: '',
  });

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const defaultFilters: FilterOptions = {
      category: '',
      priceRange: '',
      sortBy: 'popular',
      inStock: false,
      featured: false,
      brand: '',
      size: '',
      color: '',
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  const priceRanges = [
    { value: '0-5000', label: 'до 5 000₽' },
    { value: '5000-10000', label: '5 000 - 10 000₽' },
    { value: '10000-15000', label: '10 000 - 15 000₽' },
    { value: '15000+', label: 'от 15 000₽' },
  ];

  const sortOptions = [
    { value: 'popular', label: 'По популярности' },
    { value: 'price-asc', label: 'По возрастанию цены' },
    { value: 'price-desc', label: 'По убыванию цены' },
    { value: 'newest', label: 'Сначала новинки' },
    { value: 'rating', label: 'По рейтингу' },
  ];

  const sizes = ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44'];
  const colors = ['Черный', 'Коричневый', 'Серый', 'Бежевый', 'Розовый', 'Синий'];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Фильтры</h3>
        <button
          onClick={clearFilters}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          Сбросить все
        </button>
      </div>

      <div className="space-y-6">
        {/* Sort by */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Сортировка</h4>
          <select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            disabled={loading}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Price range */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Цена</h4>
          <select
            value={filters.priceRange}
            onChange={(e) => handleFilterChange('priceRange', e.target.value)}
            disabled={loading}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="">Все цены</option>
            {priceRanges.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
        </div>

        {/* Category */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Категория</h4>
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            disabled={loading}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="">Все категории</option>
            {categories.map((category) => ( // Теперь categories гарантированно массив
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Brand */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Бренд</h4>
          <select
            value={filters.brand}
            onChange={(e) => handleFilterChange('brand', e.target.value)}
            disabled={loading}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="">Все бренды</option>
            {brands.map((brand) => ( // Теперь brands гарантированно массив
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </div>

        {/* Size */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Размер</h4>
          <div className="grid grid-cols-3 gap-2">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => handleFilterChange('size', filters.size === size ? '' : size)}
                className={`p-2 border rounded text-center text-sm ${
                  filters.size === size
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 text-gray-700 hover:border-gray-400'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Color */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Цвет</h4>
          <div className="grid grid-cols-2 gap-2">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => handleFilterChange('color', filters.color === color ? '' : color)}
                className={`p-2 border rounded text-center text-sm ${
                  filters.color === color
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 text-gray-700 hover:border-gray-400'
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>

        {/* Checkbox filters */}
        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={filters.inStock}
              onChange={(e) => handleFilterChange('inStock', e.target.checked)}
              disabled={loading}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Только в наличии</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={filters.featured}
              onChange={(e) => handleFilterChange('featured', e.target.checked)}
              disabled={loading}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Хиты продаж</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default ProductFilter;