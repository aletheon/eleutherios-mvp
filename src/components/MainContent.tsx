// src/components/MainContent.tsx
'use client';

import { useActivities } from '@/contexts/ActivitiesContext';
import { ReactNode } from 'react';

interface MainContentProps {
  children: ReactNode;
}

export const MainContent = ({ children }: MainContentProps) => {
  const { activitiesPanelOpen } = useActivities();

  return (
    <div
      className={`min-h-screen transition-all duration-300 ease-in-out ${
        activitiesPanelOpen 
          ? 'ml-80' // Full panel width (320px)
          : 'ml-16' // Collapsed panel width (64px)
      }`}
    >
      {children}
    </div>
  );
};