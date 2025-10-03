// src/components/DashboardLayout.tsx
'use client';

import { ReactNode } from 'react';
import { Navigation } from './Navigation';
import { MainContent } from './MainContent';

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="relative">
      <Navigation />
      <MainContent>
        {children}
      </MainContent>
    </div>
  );
};