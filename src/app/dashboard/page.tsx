// src/app/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [activitiesPanelOpen, setActivitiesPanelOpen] = useState(false);

  // Listen for activities panel state changes from Navigation
  useEffect(() => {
    const handleStorageChange = () => {
      const panelState = localStorage.getItem('activitiesPanelOpen');
      setActivitiesPanelOpen(panelState === 'true');
    };

    // Listen for custom events from Navigation component
    window.addEventListener('activitiesPanelChange', handleStorageChange);
    
    // Check initial state
    handleStorageChange();

    return () => {
      window.removeEventListener('activitiesPanelChange', handleStorageChange);
    };
  }, []);

  return (
    <div 
      className={`min-h-screen transition-all duration-300 ease-in-out ${
        activitiesPanelOpen ? 'ml-80' : 'ml-16'
      }`}
    >
      {/* Your existing dashboard content */}
      <div className="p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
        
        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Stripe Balance</h3>
            <p className="text-3xl font-bold text-green-600">$1250.75</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Favorites</h3>
            <p className="text-3xl font-bold text-blue-600">0</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Following</h3>
            <p className="text-3xl font-bold text-purple-600">0</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Income vs Expenses</h3>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-green-600">● Income: $400</span>
              <span className="text-sm text-red-600">● Expenses: $100</span>
            </div>
          </div>
        </div>

        {/* Policies Section */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">My Policies (0)</h2>
            <div className="flex items-center space-x-4">
              <button className="flex items-center text-gray-600">
                <span className="material-icons mr-1">view_list</span>
                List
              </button>
              <button className="flex items-center text-gray-600">
                <span className="material-icons mr-1">grid_view</span>
                Grid
              </button>
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                + Create Policy
              </button>
            </div>
          </div>
          <div className="p-12 text-center">
            <p className="text-gray-500 mb-6">No policies created yet</p>
            <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700">
              + Create Your First Policy
            </button>
          </div>
        </div>

        {/* Services Section */}
        <div className="bg-white rounded-lg shadow">
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">My Services (0)</h2>
            <div className="flex items-center space-x-4">
              <button className="flex items-center text-gray-600">
                <span className="material-icons mr-1">view_list</span>
                List
              </button>
              <button className="flex items-center text-gray-600">
                <span className="material-icons mr-1">grid_view</span>
                Grid
              </button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:blue-700">
                + Create Service
              </button>
            </div>
          </div>
          <div className="p-12 text-center">
            <p className="text-gray-500 mb-6">No services created yet</p>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
              + Create Your First Service
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}