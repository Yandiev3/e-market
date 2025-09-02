'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Input from '../ui/Input';
import Button from '@/components/ui/Button';
import { validateProduct } from '@/lib/validation';

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  stock: number;
  sku: string;
  featured: boolean;
  active: boolean;
  specifications: Record<string, string>;
}

interface ProductFormProps {
  product?: any;
  onSubmit: (data: ProductFormData) => Promise<void>;
  loading?: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({
  product,
  onSubmit,
  loading = false,
}) => {
  const router = useRouter();
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: 0,
    originalPrice: 0,
    category: '',
    stock: 0,
    sku: '',
    featured: false,
    active: true,
    specifications: {},
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [specKey, setSpecKey] = useState('');
  const [specValue, setSpecValue] = useState('');

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || 0,
        originalPrice: product.originalPrice || 0,
        category: product.category || '',
        stock: product.stock || 0,
        sku: product.sku || '',
        featured: product.featured || false,
        active: product.active !== undefined ? product.active : true,
        specifications: product.specifications || {},
      });
    }
  }, [product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked 
              : type === 'number' ? parseFloat(value) || 0 
              : value,
    }));
  };

  const addSpecification = () => {
    if (specKey && specValue) {
      setFormData(prev => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [specKey]: specValue,
        },
      }));
      setSpecKey('');
      setSpecValue('');
    }
  };

  const removeSpecification = (key: string) => {
    setFormData(prev => {
      const newSpecs = { ...prev.specifications };
      delete newSpecs[key];
      return { ...prev, specifications: newSpecs };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validateProduct(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setErrors([]);
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.length > 0 && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <ul className="list-disc list-inside">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Product Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <Input
          label="SKU"
          name="sku"
          value={formData.sku}
          onChange={handleChange}
          required
        />

        <Input
          label="Price"
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          required
          min="0"
          step="0.01"
        />

        <Input
          label="Original Price"
          type="number"
          name="originalPrice"
          value={formData.originalPrice}
          onChange={handleChange}
          min="0"
          step="0.01"
        />

        <Input
          label="Category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        />

        <Input
          label="Stock Quantity"
          type="number"
          name="stock"
          value={formData.stock}
          onChange={handleChange}
          required
          min="0"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Specifications */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">Specifications</h4>
        <div className="flex space-x-2 mb-2">
          <Input
            placeholder="Key"
            value={specKey}
            onChange={(e) => setSpecKey(e.target.value)}
          />
          <Input
            placeholder="Value"
            value={specValue}
            onChange={(e) => setSpecValue(e.target.value)}
          />
          <Button type="button" onClick={addSpecification}>
            Add
          </Button>
        </div>
        
        <div className="space-y-2">
          {Object.entries(formData.specifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between bg-gray-50 p-2 rounded">
              <span className="text-sm">
                <strong>{key}:</strong> {value}
              </span>
              <Button
                type="button"
                variant="danger"
                size="sm"
                onClick={() => removeSpecification(key)}
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex space-x-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            name="featured"
            checked={formData.featured}
            onChange={handleChange}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm text-gray-700">Featured Product</span>
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            name="active"
            checked={formData.active}
            onChange={handleChange}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm text-gray-700">Active</span>
        </label>
      </div>

      <div className="flex space-x-4">
        <Button type="submit" loading={loading}>
          {product ? 'Update Product' : 'Create Product'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/admin/products')}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;