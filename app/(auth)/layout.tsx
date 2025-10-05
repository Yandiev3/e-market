import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth-config';

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  
  // If user is already logged in, redirect to home
  if (session) {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
}
