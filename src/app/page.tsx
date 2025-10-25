'use client';

import React from 'react';
import Navigation from '@/components/Navigation';
import { useAuth } from '@/contexts/AuthContext';

const DashboardPage = () => {
  const { user } = useAuth();

  // Click handlers
  const handleCreatePolicy = () => {
    console.log('Create Policy clicked from root page');
    window.location.href = '/policies/create';
  };

  const handleCreateService = () => {
    console.log('Create Service clicked from root page');
    window.location.href = '/services/create';
  };

  return (
    <>
      <Navigation />

      {/* Main Content */}
      <main className="p-6 min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-gray-500 text-sm font-medium">Stripe Balance</h3>
              <p className="text-2xl font-bold text-green-600">$1250.75</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-gray-500 text-sm font-medium">Favorites</h3>
              <p className="text-2xl font-bold text-blue-600">0</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-gray-500 text-sm font-medium">Following</h3>
              <p className="text-2xl font-bold text-purple-600">0</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-gray-500 text-sm font-medium">Income vs Expenses</h3>
              <div className="flex items-center space-x-4 mt-2">
                <span className="text-sm text-green-600">● Income: $400</span>
                <span className="text-sm text-red-600">● Expenses: $100</span>
              </div>
            </div>
          </div>

          {/* Policies Section */}
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">My Policies (0)</h2>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <span className="material-icons">view_list</span>
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <span className="material-icons">grid_view</span>
                    </button>
                  </div>
                  {/* FIXED: Added onClick handler */}
                  <button
                    onClick={handleCreatePolicy}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
                  >
                    <span>+</span>
                    <span>Create Policy</span>
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-12 text-center">
              <p className="text-gray-500 mb-4">No policies created yet</p>
              {/* FIXED: Added onClick handler */}
              <button
                onClick={handleCreatePolicy}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
              >
                + Create Your First Policy
              </button>
            </div>
          </div>

          {/* Services Section */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">My Services (0)</h2>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <span className="material-icons">view_list</span>
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <span className="material-icons">grid_view</span>
                    </button>
                  </div>
                  {/* FIXED: Added onClick handler */}
                  <button
                    onClick={handleCreateService}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                  >
                    <span>+</span>
                    <span>Create Service</span>
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-12 text-center">
              <p className="text-gray-500 mb-4">No services created yet</p>
              {/* FIXED: Added onClick handler */}
              <button
                onClick={handleCreateService}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
              >
                + Create Your First Service
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default DashboardPage;