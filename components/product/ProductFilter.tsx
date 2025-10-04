// components/product/ProductFilter.tsx
'use client';

import React, { useState } from 'react';
import { Label } from '@/components/ui/Label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/Radio-group';
import { Slider } from '@/components/ui/Slider';

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
  categories = [],
  brands = [],
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

  const [priceRange, setPriceRange] = useState<[number, number]>([0, 20000]);

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handlePriceRangeChange = (range: [number, number]) => {
    setPriceRange(range);
    const priceRangeString = `${range[0]}-${range[1]}`;
    handleFilterChange('priceRange', priceRangeString);
  };

  const handleCategoryChange = (category: string) => {
    handleFilterChange('category', category);
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
    setPriceRange([0, 20000]);
    onFilterChange(defaultFilters);
  };

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
    <div className="bg-card p-6 rounded-lg border border-border">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Фильтры</h3>
        <button
          onClick={clearFilters}
          className="text-primary hover:text-primary/80 text-sm font-medium transition-colors"
          disabled={loading}
        >
          Сбросить все
        </button>
      </div>

      <div className="space-y-6">
        {/* Sort by */}
        <div>
          <Label className="text-base font-semibold mb-3 block">Сортировка</Label>
          <select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            disabled={loading}
            className="
              w-full p-3 bg-input border border-border rounded-lg 
              focus:ring-2 focus:ring-primary focus:border-transparent 
              text-foreground text-sm transition-all
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <Label className="text-base font-semibold mb-3 block">Категория</Label>
          <RadioGroup value={filters.category} onValueChange={handleCategoryChange}>
            <div className="flex items-center space-x-2 mb-3">
              <RadioGroupItem value="" id="all-categories">
                <Label htmlFor="all-categories" className="cursor-pointer text-foreground">
                  Все категории
                </Label>
              </RadioGroupItem>
            </div>
            {categories.map((category) => (
              <div key={category} className="flex items-center space-x-2 mb-3">
                <RadioGroupItem value={category} id={category}>
                  <Label htmlFor={category} className="cursor-pointer text-foreground">
                    {category}
                  </Label>
                </RadioGroupItem>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Price Range Filter */}
        <div>
          <Label className="text-base font-semibold mb-3 block">
            Цена: {priceRange[0].toLocaleString()} - {priceRange[1].toLocaleString()} ₽
          </Label>
          <Slider
            value={[priceRange[1]]}
            onValueChange={(value) => handlePriceRangeChange([priceRange[0], value[0]])}
            max={20000}
            step={1000}
            className="mt-4"
          />
          <div className="flex justify-between text-sm text-muted-foreground mt-2">
            <span>0 ₽</span>
            <span>20 000 ₽</span>
          </div>
        </div>

        {/* Brand */}
        <div>
          <Label className="text-base font-semibold mb-3 block">Бренд</Label>
          <select
            value={filters.brand}
            onChange={(e) => handleFilterChange('brand', e.target.value)}
            disabled={loading}
            className="
              w-full p-3 bg-input border border-border rounded-lg 
              focus:ring-2 focus:ring-primary focus:border-transparent 
              text-foreground text-sm transition-all
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            <option value="">Все бренды</option>
            {brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </div>

        {/* Size */}
        <div>
          <Label className="text-base font-semibold mb-3 block">Размер</Label>
          <div className="grid grid-cols-3 gap-2">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => handleFilterChange('size', filters.size === size ? '' : size)}
                disabled={loading}
                className={`
                  p-2 border rounded-lg text-center text-sm font-medium transition-all
                  ${filters.size === size
                    ? 'border-primary text-primary'
                    : 'border-border text-foreground hover:border-primary/50 2px'
                  }
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Color */}
        <div>
          <Label className="text-base font-semibold mb-3 block">Цвет</Label>
          <div className="grid grid-cols-2 gap-2">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => handleFilterChange('color', filters.color === color ? '' : color)}
                disabled={loading}
                className={`
                  p-2 border rounded-lg text-center text-sm font-medium transition-all
                  ${filters.color === color
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border text-foreground hover:border-primary/50'
                  }
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              >
                {color}
              </button>
            ))}
          </div>
        </div>

        {/* Checkbox filters */}
        <div className="space-y-4">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={filters.inStock}
              onChange={(e) => handleFilterChange('inStock', e.target.checked)}
              disabled={loading}
              className="
                h-4 w-4 text-primary border-border rounded 
                focus:ring-primary focus:ring-2
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            />
            <span className="text-sm text-foreground font-medium">Только в наличии</span>
          </label>

          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={filters.featured}
              onChange={(e) => handleFilterChange('featured', e.target.checked)}
              disabled={loading}
              className="
                h-4 w-4 text-primary border-border rounded 
                focus:ring-primary focus:ring-2
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            />
            <span className="text-sm text-foreground font-medium">Хиты продаж</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default ProductFilter;