// src/contexts/ActivitiesContext.tsx
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface ActivitiesContextType {
  activitiesPanelOpen: boolean;
  setActivitiesPanelOpen: (open: boolean) => void;
  toggleActivitiesPanel: () => void;
}

const ActivitiesContext = createContext<ActivitiesContextType | undefined>(undefined);

export const useActivities = () => {
  const context = useContext(ActivitiesContext);
  if (!context) {
    throw new Error('useActivities must be used within an ActivitiesProvider');
  }
  return context;
};

export const ActivitiesProvider = ({ children }: { children: ReactNode }) => {
  const [activitiesPanelOpen, setActivitiesPanelOpen] = useState(false);

  const toggleActivitiesPanel = () => {
    setActivitiesPanelOpen(!activitiesPanelOpen);
  };

  return (
    <ActivitiesContext.Provider value={{
      activitiesPanelOpen,
      setActivitiesPanelOpen,
      toggleActivitiesPanel
    }}>
      {children}
    </ActivitiesContext.Provider>
  );
};