// app/(store)/products/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Filter } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import ProductCard from '@/components/product/ProductCard';
import ProductFilter from '@/components/product/ProductFilter';
import { Product, IProductLean } from '@/types/product';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    category: '',
    priceRange: '',
    sortBy: 'popular',
    inStock: false,
    featured: false,
    brand: '',
    size: '',
    color: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch products
        const productsResponse = await fetch('/api/products');
        if (productsResponse.ok) {
          const responseData = await productsResponse.json();
          
          // Обрабатываем разные форматы ответа
          let productsData: IProductLean[] = [];
          
          if (Array.isArray(responseData)) {
            productsData = responseData;
          } else if (responseData && Array.isArray(responseData.products)) {
            productsData = responseData.products;
          } else if (responseData && responseData.data && Array.isArray(responseData.data)) {
            productsData = responseData.data;
          } else {
            console.warn('Unexpected API response format:', responseData);
            productsData = [];
          }
          
          console.log('Products data received:', productsData);
          
          // Преобразуем IProductLean в Product
          const formattedProducts: Product[] = productsData.map(product => ({
            id: product._id?.toString() || '',
            name: product.name || '',
            price: product.price || 0,
            originalPrice: product.originalPrice,
            image: product.images?.[0] || '/images/placeholder.jpg',
            images: product.images || [],
            slug: product.slug || '',
            category: product.category || '',
            stock: product.stock || 0,
            ratings: product.ratings || { average: 0, count: 0 },
            brand: product.brand || '',
            description: '',
            sizes: [],
            colors: []
          }));
          
          setProducts(formattedProducts);
          setFilteredProducts(formattedProducts);
        } else {
          console.error('Products API response not ok:', productsResponse.status);
          setProducts([]);
          setFilteredProducts([]);
        }

        // Fetch categories
        const categoriesResponse = await fetch('/api/products/categories');
        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json();
          setCategories(Array.isArray(categoriesData) ? categoriesData : []);
        } else {
          setCategories([]);
        }

        // Fetch brands
        const brandsResponse = await fetch('/api/products/brands');
        if (brandsResponse.ok) {
          const brandsData = await brandsResponse.json();
          setBrands(Array.isArray(brandsData) ? brandsData : []);
        } else {
          setBrands([]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setProducts([]);
        setFilteredProducts([]);
        setCategories([]);
        setBrands([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, products]);

  const applyFilters = () => {
    setLoading(true);
    
    let filtered = [...products];

    // Apply category filter
    if (filters.category) {
      filtered = filtered.filter(product => product.category === filters.category);
    }

    // Apply brand filter
    if (filters.brand) {
      filtered = filtered.filter(product => product.brand === filters.brand);
    }

    // Apply in-stock filter
    if (filters.inStock) {
      filtered = filtered.filter(product => product.stock > 0);
    }

    // Apply featured filter
    if (filters.featured) {
      filtered = filtered.filter(product => product.isFeatured);
    }

    // Apply price range filter
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number);
      if (max) {
        filtered = filtered.filter(product => product.price >= min && product.price <= max);
      } else {
        filtered = filtered.filter(product => product.price >= min);
      }
    }

    // Apply sorting
    switch (filters.sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case 'rating':
        filtered.sort((a, b) => b.ratings.average - a.ratings.average);
        break;
      default: // popular
        filtered.sort((a, b) => b.ratings.count - a.ratings.count);
    }

    setFilteredProducts(filtered);
    setLoading(false);
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters */}
          <aside className="w-full md:w-80 shrink-0">
            <div className="sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                <Filter className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Фильтры</h2>
              </div>
              
              <ProductFilter
                categories={categories}
                brands={brands}
                onFilterChange={handleFilterChange}
                loading={loading}
              />
            </div>
          </aside>

          {/* Products Grid */}
          <main className="flex-1">
            <div className="mb-6">
              <h2 className="text-3xl font-bold mb-2">Каталог товаров</h2>
              <p className="text-muted-foreground">
                Найдено товаров: {filteredProducts.length}
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="aspect-square bg-muted rounded-t-lg"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-muted rounded"></div>
                      <div className="h-4 bg-muted rounded w-2/3"></div>
                      <div className="h-6 bg-muted rounded w-1/2"></div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {filteredProducts.length === 0 && (
                  <div className="text-center py-16">
                    <p className="text-xl text-muted-foreground">
                      Товары не найдены. Попробуйте изменить фильтры.
                    </p>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}