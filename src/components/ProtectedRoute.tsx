// src/components/ProtectedRoute.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string[];
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole,
  redirectTo = '/login' 
}) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // Redirect to login if not authenticated
      if (!user) {
        router.push(redirectTo);
        return;
      }

      // Check role requirements
      if (requiredRole && user.profile?.role && !requiredRole.includes(user.profile.role)) {
        router.push('/unauthorized');
        return;
      }
    }
  }, [user, loading, requiredRole, redirectTo, router]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render children if not authenticated or authorized
  if (!user) {
    return null;
  }

  if (requiredRole && user.profile?.role && !requiredRole.includes(user.profile.role)) {
    return null;
  }

  return <>{children}</>;
};