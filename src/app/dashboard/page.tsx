// src/app/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [activitiesPanelOpen, setActivitiesPanelOpen] = useState(false);

  // Listen for activities panel state changes from Navigation
  useEffect(() => {
    console.log('Dashboard component mounted'); // Debug log
    
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

  // Simple test handlers
  const testClick = () => {
    console.log('BUTTON CLICKED!');
    alert('Button works!');
  };

  const handleCreatePolicy = () => {
    console.log('Create Policy clicked');
    alert('Navigating to create policy...');
    // Add navigation after we confirm clicks work
    window.location.href = '/policies/create';
  };

  const handleCreateService = () => {
    console.log('Create Service clicked');
    alert('Create Service clicked!');
  };

  console.log('Dashboard rendering...'); // Debug log

  return (
    <div 
      className={`min-h-screen transition-all duration-300 ease-in-out ${
        activitiesPanelOpen ? 'ml-80' : 'ml-16'
      }`}
    >
      {/* Dashboard content */}
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex items-center space-x-4">
            {/* Test button first */}
            <button 
              onClick={testClick}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              TEST CLICK
            </button>
            <button 
              onClick={handleCreatePolicy}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
            >
              <span className="material-icons mr-2">add</span>
              Create Policy
            </button>
            <button 
              onClick={handleCreateService}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
            >
              <span className="material-icons mr-2">add</span>
              Create Service
            </button>
          </div>
        </div>
        
        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Stripe Balance</h3>
            <p className="text-3xl font-bold text-green-600">$1,250.75</p>
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
              <button 
                onClick={handleCreatePolicy}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
              >
                <span className="material-icons mr-1">add</span>
                Create Policy
              </button>
            </div>
          </div>
          <div className="p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="bg-green-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="material-icons text-green-600 text-2xl">policy</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No policies created yet</h3>
              <p className="text-gray-500 mb-6">
                Create your first governance policy using our form-based EleuScript generator.
              </p>
              <button 
                onClick={handleCreatePolicy}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 flex items-center mx-auto"
              >
                <span className="material-icons mr-2">add</span>
                Create Your First Policy
              </button>
            </div>
          </div>
        </div>

        {/* Services Section */}
        <div className="bg-white rounded-lg shadow">
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">My Services (0)</h2>
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleCreateService}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
              >
                <span className="material-icons mr-1">add</span>
                Create Service
              </button>
            </div>
          </div>
          <div className="p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="bg-blue-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="material-icons text-blue-600 text-2xl">room_service</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No services created yet</h3>
              <p className="text-gray-500 mb-6">
                Register your first service to offer coordination and support.
              </p>
              <button 
                onClick={handleCreateService}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center mx-auto"
              >
                <span className="material-icons mr-2">add</span>
                Create Your First Service
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}