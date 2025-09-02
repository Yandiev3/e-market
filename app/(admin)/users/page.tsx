import UserList from '@/components/admin/UserList';

export default function UsersPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Users Management</h1>
      <UserList />
    </div>
  );
}