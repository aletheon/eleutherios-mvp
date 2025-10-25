'use client';

import { AuthProvider } from '@/contexts/AuthContext';
import { ActivitiesProvider } from '@/contexts/ActivitiesContext';
import { DashboardProvider } from '@/contexts/DashboardContext';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ActivitiesProvider>
          <DashboardProvider>
            {children}
          </DashboardProvider>
        </ActivitiesProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
