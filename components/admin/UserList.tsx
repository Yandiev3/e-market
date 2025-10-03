// components/admin/UserList.tsx
"use client";

import React, { useState } from 'react';
import { formatDate } from '@/lib/utils';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';

interface User {
  _id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  active: boolean;
  createdAt: string;
  ordersCount: number;
}

interface UserListProps {
  users: User[];
  onRoleChange: (id: string, role: 'user' | 'admin') => void;
  onStatusChange: (id: string, active: boolean) => void;
  onDelete: (id: string) => void;
  loading?: boolean;
}

const UserList: React.FC<UserListProps> = ({
  users,
  onRoleChange,
  onStatusChange,
  onDelete,
  loading = false,
}) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedUser) {
      onDelete(selectedUser._id);
      setDeleteModalOpen(false);
      setSelectedUser(null);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center justify-between p-4 border-b border-border">
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded w-32"></div>
              <div className="h-3 bg-muted rounded w-24"></div>
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

  if (users.length === 0) {
    return (
      <div className="text-center py-12 card">
        <div className="text-6xl mb-4">👥</div>
        <h3 className="text-lg font-medium text-foreground mb-2">Пользователи не найдены</h3>
        <p className="text-muted-foreground">Нет зарегистрированных пользователей</p>
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
                  Пользователь
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Роль
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Статус
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Заказы
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Дата регистрации
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-foreground">
                      {user.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">
                    {user.email}
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={user.role}
                      onChange={(e) => onRoleChange(user._id, e.target.value as 'user' | 'admin')}
                      className="text-sm border border-input rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                    >
                      <option value="user">Пользователь</option>
                      <option value="admin">Администратор</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.active ? 'Активен' : 'Неактивен'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">
                    {user.ordersCount}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium space-x-2">
                    <Button
                      variant={user.active ? 'secondary' : 'success'}
                      size="sm"
                      onClick={() => onStatusChange(user._id, !user.active)}
                    >
                      {user.active ? 'Деактивировать' : 'Активировать'}
                    </Button>
                    <button
                      onClick={() => handleDeleteClick(user)}
                      className="text-destructive hover:text-destructive/80 transition-colors"
                    >
                      Удалить
                    </button>
                  </td>
                </tr>
              ))}
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
            Вы уверены, что хотите удалить пользователя "{selectedUser?.name}"?
          </p>
          <p className="text-sm text-muted-foreground">
            Все данные пользователя будут безвозвратно удалены.
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

export default UserList;