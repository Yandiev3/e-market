'use client';

import React, { useState } from 'react';

interface FilterOptions {
  category: string;
  priceRange: string;
  sortBy: string;
  inStock: boolean;
  featured: boolean;
}

interface ProductFilterProps {
  categories: string[];
  onFilterChange: (filters: Partial<FilterOptions>) => void;
  loading?: boolean;
}

const ProductFilter: React.FC<ProductFilterProps> = ({
  categories,
  onFilterChange,
  loading = false,
}) => {
  const [filters, setFilters] = useState<FilterOptions>({
    category: '',
    priceRange: '',
    sortBy: 'name',
    inStock: false,
    featured: false,
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
      sortBy: 'name',
      inStock: false,
      featured: false,
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Filters</h3>
      
      <div className="space-y-4">
        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            disabled={loading}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price Range
          </label>
          <select
            value={filters.priceRange}
            onChange={(e) => handleFilterChange('priceRange', e.target.value)}
            disabled={loading}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Prices</option>
            <option value="0-50">$0 - $50</option>
            <option value="50-100">$50 - $100</option>
            <option value="100-200">$100 - $200</option>
            <option value="200+">$200+</option>
          </select>
        </div>

        {/* Sort By */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sort By
          </label>
          <select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            disabled={loading}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="name">Name A-Z</option>
            <option value="name-desc">Name Z-A</option>
            <option value="price">Price Low to High</option>
            <option value="price-desc">Price High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>

        {/* Checkbox Filters */}
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={filters.inStock}
              onChange={(e) => handleFilterChange('inStock', e.target.checked)}
              disabled={loading}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">In Stock Only</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={filters.featured}
              onChange={(e) => handleFilterChange('featured', e.target.checked)}
              disabled={loading}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Featured Only</span>
          </label>
        </div>

        {/* Clear Filters */}
        <button
          onClick={clearFilters}
          disabled={loading}
          className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
};

export default ProductFilter;