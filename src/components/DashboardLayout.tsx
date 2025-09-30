'use client';

import { Navigation } from './Navigation';
import { ActivitiesPanel } from './ActivitiesPanel';
import { useDashboard } from '@/contexts/DashboardContext';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  headerActions?: React.ReactNode;
}

export function DashboardLayout({ children, title, subtitle, headerActions }: DashboardLayoutProps) {
  const { activitiesPanelOpen } = useDashboard();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="flex">
        {/* Activities Panel - slides from LEFT */}
        <ActivitiesPanel />
        
        {/* Main Content Area - pushes RIGHT when panel opens */}
        <div className={`flex-1 transition-all duration-300 ${
          activitiesPanelOpen ? 'ml-80' : 'ml-0'
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Page Header */}
            {(title || headerActions) && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    {title && (
                      <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
                    )}
                  </div>
                  {headerActions && (
                    <div className="flex items-center gap-3">
                      {headerActions}
                    </div>
                  )}
                </div>
                {subtitle && (
                  <p className="text-gray-600">{subtitle}</p>
                )}
              </div>
            )}
            
            {/* Page Content */}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}