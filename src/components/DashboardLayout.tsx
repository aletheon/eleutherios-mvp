'use client';

import React, { useEffect, useState } from 'react';
import Navigation from './Navigation';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [activitiesExpanded, setActivitiesExpanded] = useState(false);

  useEffect(() => {
    // Load Material Icons font
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/icon?family=Material+Icons';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    // Listen for activities panel toggle events
    const handleActivitiesToggle = (event: CustomEvent) => {
      setActivitiesExpanded(event.detail.expanded);
    };

    window.addEventListener('activitiesPanelToggle', handleActivitiesToggle as EventListener);

    // Load initial state from localStorage
    const savedState = localStorage.getItem('activitiesExpanded');
    if (savedState) {
      setActivitiesExpanded(JSON.parse(savedState));
    }

    return () => {
      window.removeEventListener('activitiesPanelToggle', handleActivitiesToggle as EventListener);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Main Content Area */}
      <main 
        className={`transition-all duration-300 ${
          activitiesExpanded ? 'ml-80' : 'ml-16'
        } pt-16`}
      >
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;