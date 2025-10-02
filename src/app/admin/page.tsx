// src/app/admin/page.tsx
'use client';

import { useState, useEffect } from 'react';

interface AdminStats {
  totalUsers: number;
  totalPolicies: number;
  totalForums: number;
  recentActivity: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalPolicies: 0,
    totalForums: 0,
    recentActivity: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      // You can implement these API calls later
      setStats({
        totalUsers: 12,     // Placeholder
        totalPolicies: 8,   // Placeholder
        totalForums: 15,    // Placeholder
        recentActivity: 5   // Placeholder
      });
    } catch (error) {
      console.error('Failed to fetch admin stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const adminTools = [
    {
      title: 'User Data Migration',
      description: 'Standardize inconsistent user data in Firestore',
      href: '/admin/migrate',
      icon: '🔄',
      status: 'Ready',
      statusColor: 'text-green-600 bg-green-100'
    },
    {
      title: 'User Management',
      description: 'View, edit, and manage user accounts',
      href: '/admin/users',
      icon: '👥',
      status: 'Coming Soon',
      statusColor: 'text-yellow-600 bg-yellow-100'
    },
    {
      title: 'Database Tools',
      description: 'Seed test data and database utilities',
      href: '/admin/database',
      icon: '🗄️',
      status: 'Coming Soon',
      statusColor: 'text-yellow-600 bg-yellow-100'
    },
    {
      title: 'Analytics',
      description: 'CERT scores, user activity, and system metrics',
      href: '/admin/analytics',
      icon: '📊',
      status: 'Coming Soon',
      statusColor: 'text-yellow-600 bg-yellow-100'
    },
    {
      title: 'System Settings',
      description: 'Configure application settings and preferences',
      href: '/admin/settings',
      icon: '⚙️',
      status: 'Coming Soon',
      statusColor: 'text-yellow-600 bg-yellow-100'
    },
    {
      title: 'Policy Management',
      description: 'Create, edit, and manage policies',
      href: '/admin/policies',
      icon: '📋',
      status: 'Coming Soon',
      statusColor: 'text-yellow-600 bg-yellow-100'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">Eleutherios MVP Administration</p>
            </div>
            <div className="flex space-x-4">
              <a
                href="/"
                className="text-blue-600 hover:text-blue-800 hover:underline"
              >
                ← Back to Site
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {loading ? (
            // Loading skeleton
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))
          ) : (
            <>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Total Users</h3>
                <p className="text-3xl font-bold text-blue-600">{stats.totalUsers}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Policies</h3>
                <p className="text-3xl font-bold text-green-600">{stats.totalPolicies}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Forums</h3>
                <p className="text-3xl font-bold text-purple-600">{stats.totalForums}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Recent Activity</h3>
                <p className="text-3xl font-bold text-orange-600">{stats.recentActivity}</p>
              </div>
            </>
          )}
        </div>

        {/* Admin Tools Grid */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Admin Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {adminTools.map((tool, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-3xl">{tool.icon}</div>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${tool.statusColor}`}
                    >
                      {tool.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {tool.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {tool.description}
                  </p>
                  {tool.status === 'Ready' ? (
                    <a
                      href={tool.href}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Open Tool →
                    </a>
                  ) : (
                    <button
                      disabled
                      className="inline-flex items-center px-4 py-2 bg-gray-300 text-gray-500 text-sm font-medium rounded-lg cursor-not-allowed"
                    >
                      Coming Soon
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a
                href="/directory"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span className="text-2xl mr-3">👥</span>
                <div>
                  <h3 className="font-medium text-gray-900">View User Directory</h3>
                  <p className="text-sm text-gray-600">Browse all users</p>
                </div>
              </a>
              <a
                href="/policies"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span className="text-2xl mr-3">📋</span>
                <div>
                  <h3 className="font-medium text-gray-900">View Policies</h3>
                  <p className="text-sm text-gray-600">Browse all policies</p>
                </div>
              </a>
              <a
                href="/forums"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span className="text-2xl mr-3">💬</span>
                <div>
                  <h3 className="font-medium text-gray-900">View Forums</h3>
                  <p className="text-sm text-gray-600">Browse all forums</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}