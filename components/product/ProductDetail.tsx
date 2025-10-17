// components/product/ProductDetail.tsx
import React, { useState } from 'react';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';
import AddToCartButton from '@/components/cart/AddToCartButton';
import AddToFavoritesButton from '@/components/favorites/AddToFavoritesButton';
import { IProduct, IProductSize, IProductColor, CartProduct } from '@/types/product';

// Расширяем базовый интерфейс IProduct для компонента
interface ProductDetailProduct extends IProduct {
  description: string;
  images: string[];
  specifications?: Record<string, string>;
  sku: string;
  colors: IProductColor[];
  sizes: IProductSize[];
  // Для обратной совместимости
  image?: string;
}

interface ProductDetailProps {
  product: ProductDetailProduct;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('description');
  const [showSizeError, setShowSizeError] = useState(false);
  
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount 
    ? Math.round((1 - product.price / product.originalPrice!) * 100)
    : 0;

  // Доступные размеры (в наличии)
  const availableSizes = product.sizes?.filter(size => size.inStock && size.stockQuantity > 0) || [];
  
  // Общее количество на складе
  const totalStock = product.sizes?.reduce((total, size) => total + size.stockQuantity, 0) || 0;
  
  // Определяем, требуется ли обязательный выбор размера
  const requiresSizeSelection = availableSizes.length > 0;

  const tabs = [
    { id: 'description', label: 'Описание' },
    { id: 'specifications', label: 'Характеристики' },
    { id: 'sizes', label: 'Размеры' },
    { id: 'delivery', label: 'Доставка и возврат' },
  ];

  // Основное изображение (для обратной совместимости)
  const mainImage = product.images?.[0] || product.image;

  // Продукт для корзины
  const cartProduct: CartProduct = {
    id: product._id.toString(),
    name: product.name,
    price: product.price,
    image: mainImage || '',
    sizes: product.sizes,
    requiresSizeSelection: requiresSizeSelection
  };

  // Обработчик требования выбора размера
  const handleSizeRequired = () => {
    setShowSizeError(true);
    
    // Автоматически скрываем ошибку через 3 секунды
    setTimeout(() => {
      setShowSizeError(false);
    }, 3000);
  };

  // Обработчик выбора размера
  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
    setShowSizeError(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <nav className="text-sm text-muted-foreground mb-8">
        <span className="hover:text-foreground cursor-pointer">Главная</span>
        <span className="mx-2">/</span>
        <span className="hover:text-foreground cursor-pointer">{product.category}</span>
        <span className="mx-2">/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main image */}
          <div className="relative aspect-square bg-secondary rounded-lg overflow-hidden">
            <Image
              src={product.images[selectedImage] || mainImage || '/images/placeholder.jpg'}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
            {hasDiscount && (
              <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                -{discountPercent}%
              </div>
            )}
            
            {/* Favorite button */}
            <div className="absolute top-4 right-4">
              <AddToFavoritesButton
                product={{
                  id: product._id.toString(),
                  name: product.name,
                  price: product.price,
                  image: mainImage || '',
                  slug: product.slug,
                  sizes: product.sizes,
                  ratings: product.ratings,
                  brand: product.brand,
                  category: product.category,
                  originalPrice: product.originalPrice,
                  sku: product.sku
                }}
                size="lg"
              />
            </div>
          </div>
          
          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square bg-secondary rounded overflow-hidden border-2 ${
                    selectedImage === index ? 'border-primary' : 'border-transparent'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Brand and name */}
          <div>
            <p className="text-muted-foreground text-sm uppercase tracking-wide mb-2">
              {product.brand}
            </p>
            <h1 className="text-2xl md:text-3xl font-light text-foreground mb-2">
              {product.name}
            </h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-sm">
                      {i < Math.floor(product.ratings.average) ? '★' : '☆'}
                    </span>
                  ))}
                </div>
                <span className="text-sm text-muted-foreground ml-2">
                  ({product.ratings.count} отзывов)
                </span>
              </div>
              <span className="text-sm text-muted-foreground">Артикул: {product.sku}</span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center space-x-3">
            <span className="text-2xl md:text-3xl font-bold text-foreground">
              {formatPrice(product.price)}
            </span>
            {hasDiscount && (
              <>
                <span className="text-xl text-muted-foreground line-through">
                  {formatPrice(product.originalPrice!)}
                </span>
                <span className="bg-red-500/10 text-red-600 px-2 py-1 rounded text-sm font-medium">
                  Экономия {discountPercent}%
                </span>
              </>
            )}
          </div>

          {/* Stock status */}
          <div className={totalStock > 0 ? 'text-green-600' : 'text-red-600'}>
            {totalStock > 0 ? `✓ В наличии: ${totalStock} шт.` : '✗ Нет в наличии'}
          </div>

          {/* Color selection */}
          {product.colors && product.colors.length > 0 && (
            <div>
              <h3 className="font-semibold text-foreground mb-3">Цвет:</h3>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedColor(color.name)}
                    className={`flex items-center space-x-2 px-3 py-2 border rounded text-sm transition-colors ${
                      selectedColor === color.name
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border text-foreground hover:border-primary'
                    }`}
                  >
                    <div
                      className="w-4 h-4 rounded border"
                      style={{ backgroundColor: color.value }}
                    />
                    <span>{color.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size selection - ПЕРЕНЕСЕН НАД КНОПКОЙ КОРЗИНЫ */}
          {availableSizes.length > 0 && (
            <div data-size-selection className={`transition-all duration-300 ${
              showSizeError ? 'ring-2 ring-red-500 rounded-lg p-4 bg-red-50' : ''
            }`}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-foreground">Размер: *</h3>
                {selectedSize && (
                  <span className="text-sm text-muted-foreground">
                    В наличии: {product.sizes.find(s => s.size === selectedSize)?.stockQuantity} шт.
                  </span>
                )}
              </div>
              
              {/* Сообщение об ошибке */}
              {showSizeError && (
                <div className="mb-3 p-3 bg-red-100 border border-red-300 rounded-md">
                  <p className="text-red-700 text-sm font-medium flex items-center">
                    <span className="mr-2">⚠</span>
                    Пожалуйста, выберите размер перед добавлением в корзину
                  </p>
                </div>
              )}
              
              <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                {availableSizes.map((size) => (
                  <button
                    key={size.size}
                    onClick={() => handleSizeSelect(size.size)}
                    className={`p-3 border rounded text-center text-sm font-medium transition-all duration-200 ${
                      selectedSize === size.size
                        ? 'border-primary bg-primary/10 text-primary shadow-md scale-105'
                        : 'border-border text-foreground hover:border-primary hover:text-primary hover:shadow-sm'
                    } ${
                      size.stockQuantity === 0 ? 'opacity-50 cursor-not-allowed' : ''
                    } ${
                      showSizeError && !selectedSize ? 'border-red-300 bg-red-50' : ''
                    }`}
                    disabled={size.stockQuantity === 0}
                    title={size.stockQuantity === 0 ? 'Нет в наличии' : `В наличии: ${size.stockQuantity} шт.`}
                  >
                    {size.size}
                  </button>
                ))}
              </div>
              
              {!selectedSize && !showSizeError && (
                <p className="text-sm text-muted-foreground mt-2">
                  * Обязательно для выбора
                </p>
              )}
              
              <button className="text-primary text-sm mt-2 hover:underline">
                Таблица размеров →
              </button>
            </div>
          )}

          {/* Add to cart - КНОПКА ТЕПЕРЬ ПОД ВЫБОРОМ РАЗМЕРА */}
          <div className="pt-4">
            <AddToCartButton
              product={cartProduct}
              selectedSize={selectedSize || undefined}
              selectedColor={selectedColor || undefined}
              requiresSizeSelection={requiresSizeSelection}
              onSizeRequired={handleSizeRequired}
              size="lg"
            />
            
            {/* Дополнительное сообщение под кнопкой */}
            {requiresSizeSelection && !selectedSize && (
              <p className="text-sm text-muted-foreground mt-2 text-center">
                Для добавления в корзину необходимо выбрать размер
              </p>
            )}
          </div>

          {/* Quick features */}
          <div className="border-t border-border pt-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center">
                <span className="text-muted-foreground mr-2">🚚</span>
                <span className="text-muted-foreground">Бесплатная доставка от 5000₽</span>
              </div>
              <div className="flex items-center">
                <span className="text-muted-foreground mr-2">↩️</span>
                <span className="text-muted-foreground">Возврат в течение 30 дней</span>
              </div>
              <div className="flex items-center">
                <span className="text-muted-foreground mr-2">🔒</span>
                <span className="text-muted-foreground">Безопасная оплата</span>
              </div>
              <div className="flex items-center">
                <span className="text-muted-foreground mr-2">⭐</span>
                <span className="text-muted-foreground">Оригинальная продукция</span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-border">
            <div className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-3 px-1 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab content */}
          <div className="prose prose-sm max-w-none">
            {activeTab === 'description' && (
              <div className="text-muted-foreground leading-relaxed">
                <p>{product.description}</p>
              </div>
            )}

            {activeTab === 'specifications' && product.specifications && (
              <div className="space-y-3">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between border-b border-border/50 py-2">
                    <span className="text-muted-foreground font-medium">{key}:</span>
                    <span className="text-foreground">{value}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'sizes' && (
              <div>
                <h4 className="font-semibold text-foreground mb-4">Доступные размеры</h4>
                <div className="space-y-3">
                  {product.sizes.map((size) => (
                    <div key={size.size} className="flex justify-between items-center p-3 bg-secondary rounded-lg">
                      <span className="font-medium">Размер {size.size}</span>
                      <div className="flex items-center space-x-4">
                        <span className={`text-sm ${size.inStock && size.stockQuantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {size.inStock && size.stockQuantity > 0 ? 'В наличии' : 'Нет в наличии'}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {size.stockQuantity} шт.
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'delivery' && (
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Доставка</h4>
                  <p className="text-muted-foreground">
                    Бесплатная доставка при заказе от 5000₽. Срок доставки: 1-3 рабочих дня.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Возврат</h4>
                  <p className="text-muted-foreground">
                    Возврат товара возможен в течение 30 дней с момента покупки.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;