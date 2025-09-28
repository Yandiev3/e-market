"use client";

// app/(admin)/users/page.tsx
import { useState, useEffect } from 'react';
import UserList from '@/components/admin/UserList';

interface User {
  _id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  active: boolean;
  createdAt: string;
  ordersCount: number;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      } else {
        console.error('Failed to fetch users');
        setUsers([]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, role: 'user' | 'admin') => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role }),
      });

      if (response.ok) {
        // Обновляем список пользователей после изменения роли
        fetchUsers();
      } else {
        console.error('Failed to update user role');
        alert('Ошибка при изменении роли пользователя');
      }
    } catch (error) {
      console.error('Error updating user role:', error);
      alert('Ошибка при изменении роли пользователя');
    }
  };

  const handleStatusChange = async (userId: string, active: boolean) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ active }),
      });

      if (response.ok) {
        // Обновляем список пользователей после изменения статуса
        fetchUsers();
      } else {
        console.error('Failed to update user status');
        alert('Ошибка при изменении статуса пользователя');
      }
    } catch (error) {
      console.error('Error updating user status:', error);
      alert('Ошибка при изменении статуса пользователя');
    }
  };

  const handleDelete = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Обновляем список пользователей после удаления
        fetchUsers();
      } else {
        console.error('Failed to delete user');
        alert('Ошибка при удалении пользователя');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Ошибка при удалении пользователя');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Управление пользователями</h1>
      <UserList 
        users={users}
        onRoleChange={handleRoleChange}
        onStatusChange={handleStatusChange}
        onDelete={handleDelete}
        loading={loading}
      />
    </div>
  );
}