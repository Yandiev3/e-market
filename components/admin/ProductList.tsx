// components/admin/ProductList.tsx
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { IProduct } from '@/types/product';

interface ProductListProps {
  products: IProduct[];
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, active: boolean) => void;
  loading?: boolean;
}

const ProductList: React.FC<ProductListProps> = ({
  products,
  onDelete,
  onToggleStatus,
  loading = false,
}) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);

  const handleDeleteClick = (product: IProduct) => {
    setSelectedProduct(product);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedProduct) {
      onDelete(selectedProduct._id);
      setDeleteModalOpen(false);
      setSelectedProduct(null);
    }
  };

  // Расчет общего количества на складе
  const getTotalStock = (product: IProduct) => {
    return product.sizes.reduce((total, size) => total + (size.stockQuantity || 0), 0);
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('ru-RU');
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-muted rounded"></div>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-32"></div>
                <div className="h-3 bg-muted rounded w-24"></div>
              </div>
            </div>
            <div className="flex space-x-2">
              <div className="h-8 bg-muted rounded w-16"></div>
              <div className="h-8 bg-muted rounded w-16"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12 card">
        <div className="text-6xl mb-4">📦</div>
        <h3 className="text-lg font-medium text-foreground mb-2">Товары не найдены</h3>
        <p className="text-muted-foreground">Начните с добавления первого товара</p>
        <Button href="/manage-products/new" className="mt-4">
          Добавить товар
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Товар
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Категория
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Цена
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Наличие
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Статус
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Дата
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.map((product) => {
                const totalStock = getTotalStock(product);
                const hasStock = totalStock > 0;
                
                return (
                  <tr key={product._id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded object-cover"
                            src={product.images[0] || '/images/placeholder.jpg'}
                            alt={product.name}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-foreground">
                            {product.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {product.brand}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {formatPrice(product.price)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        hasStock 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {totalStock} шт.
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        product.active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.active ? 'Активен' : 'Неактивен'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {formatDate(product.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium space-x-2">
                      <Button
                        variant={product.active ? 'secondary' : 'success'}
                        size="sm"
                        onClick={() => onToggleStatus(product._id, !product.active)}
                      >
                        {product.active ? 'Деактивировать' : 'Активировать'}
                      </Button>
                      <Link
                        href={`/manage-products/edit/${product._id}`}
                        className="text-primary hover:text-primary/80 transition-colors"
                      >
                        Редактировать
                      </Link>
                      <button
                        onClick={() => handleDeleteClick(product)}
                        className="text-destructive hover:text-destructive/80 transition-colors"
                      >
                        Удалить
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete confirmation modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Подтверждение удаления"
      >
        <div className="space-y-4">
          <p className="text-foreground">
            Вы уверены, что хотите удалить товар "{selectedProduct?.name}"?
          </p>
          <p className="text-sm text-muted-foreground">
            Это действие нельзя будет отменить.
          </p>
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setDeleteModalOpen(false)}
            >
              Отмена
            </Button>
            <Button
              variant="danger"
              onClick={handleConfirmDelete}
            >
              Удалить
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ProductList;