// src/app/users/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

interface User {
  id: string;
  name?: string;
  displayName?: string;
  email: string;
  role: string;
  isActive: boolean;
  bio?: string;
  location?: string;
  website?: string;
  certScore?: {
    cooperation: number;
    engagement: number;
    retention: number;
    trust: number;
    total?: number;
  };
  activities?: {
    forums: string[];
    policies: string[];
    services: string[];
    lastActivity?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export default function UserDetailPage() {
  const params = useParams();
  const userId = params.id as string;
  
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      fetchUser(userId);
    }
  }, [userId]);

  const fetchUser = async (id: string) => {
    try {
      setLoading(true);
      
      // First, try to get all users and find the specific one
      const response = await fetch('/api/users');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.statusText}`);
      }
      
      const data = await response.json();
      const foundUser = data.users?.find((u: User) => u.id === id);
      
      if (!foundUser) {
        throw new Error('User not found');
      }
      
      setUser(foundUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load user');
      console.error('Error fetching user:', err);
    } finally {
      setLoading(false);
    }
  };

  const getRoleDisplayName = (role: string) => {
    const roleMap: { [key: string]: string } = {
      'person': 'Person in Need',
      'caseworker': 'Case Worker',
      'korepresentative': 'KO Representative',
      'msdcaseworker': 'MSD Case Worker',
      'admin': 'Administrator',
      'provider': 'Service Provider'
    };
    
    return roleMap[role.toLowerCase()] || role;
  };

  const getRoleColor = (role: string) => {
    const colorMap: { [key: string]: string } = {
      'person': 'bg-blue-100 text-blue-800',
      'caseworker': 'bg-green-100 text-green-800',
      'korepresentative': 'bg-purple-100 text-purple-800',
      'msdcaseworker': 'bg-orange-100 text-orange-800',
      'admin': 'bg-red-100 text-red-800',
      'provider': 'bg-yellow-100 text-yellow-800'
    };
    
    return colorMap[role.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  const calculateCERTTotal = (certScore: User['certScore']) => {
    if (!certScore) return 0;
    return certScore.cooperation + certScore.engagement + certScore.retention + certScore.trust;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading user...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl text-gray-400 mb-4">👤</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">User Not Found</h1>
          <p className="text-gray-600 mb-6">The user profile you're looking for doesn't exist.</p>
          <a
            href="/directory"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Users Directory
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-6">
            <a
              href="/directory"
              className="text-blue-600 hover:text-blue-800 mr-4"
            >
              ← Back to Directory
            </a>
            <h1 className="text-2xl font-bold text-gray-900">User Profile</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* User Header */}
          <div className="px-6 py-8 bg-gradient-to-r from-blue-500 to-purple-600">
            <div className="flex items-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-3xl font-bold text-gray-700">
                {(user.name || user.displayName || 'U').charAt(0).toUpperCase()}
              </div>
              <div className="ml-6 text-white">
                <h2 className="text-3xl font-bold">
                  {user.name || user.displayName || 'Unknown User'}
                </h2>
                <p className="text-blue-100 mt-1">{user.email}</p>
                <div className="mt-3">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white bg-opacity-20 text-white`}>
                    {getRoleDisplayName(user.role)}
                  </span>
                  <span className={`ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* User Details */}
          <div className="px-6 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">User ID</label>
                    <p className="text-gray-900">{user.id}</p>
                  </div>
                  {user.bio && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Bio</label>
                      <p className="text-gray-900">{user.bio}</p>
                    </div>
                  )}
                  {user.location && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Location</label>
                      <p className="text-gray-900">{user.location}</p>
                    </div>
                  )}
                  {user.website && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Website</label>
                      <a href={user.website} className="text-blue-600 hover:underline">{user.website}</a>
                    </div>
                  )}
                  {user.createdAt && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Member Since</label>
                      <p className="text-gray-900">{new Date(user.createdAt).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* CERT Score */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">CERT Score</h3>
                {user.certScore ? (
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-blue-600 mb-2">
                        {calculateCERTTotal(user.certScore)}
                      </div>
                      <p className="text-sm text-gray-500">Total CERT Score</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-gray-50 rounded">
                        <div className="text-xl font-semibold text-gray-900">{user.certScore.cooperation}</div>
                        <p className="text-xs text-gray-500">Cooperation</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded">
                        <div className="text-xl font-semibold text-gray-900">{user.certScore.engagement}</div>
                        <p className="text-xs text-gray-500">Engagement</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded">
                        <div className="text-xl font-semibold text-gray-900">{user.certScore.retention}</div>
                        <p className="text-xs text-gray-500">Retention</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded">
                        <div className="text-xl font-semibold text-gray-900">{user.certScore.trust}</div>
                        <p className="text-xs text-gray-500">Trust</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">No CERT score available</p>
                )}
              </div>
            </div>

            {/* Activities */}
            {user.activities && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Activities</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Forums</h4>
                    <p className="text-2xl font-bold text-blue-600">{user.activities.forums?.length || 0}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Policies</h4>
                    <p className="text-2xl font-bold text-green-600">{user.activities.policies?.length || 0}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Services</h4>
                    <p className="text-2xl font-bold text-purple-600">{user.activities.services?.length || 0}</p>
                  </div>
                </div>
                {user.activities.lastActivity && (
                  <p className="text-sm text-gray-500 mt-4">
                    Last activity: {new Date(user.activities.lastActivity).toLocaleDateString()}
                  </p>
                )}
              </div>
            )}

            {/* Migration Status */}
            <div className="mt-8 pt-6 border-t">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Migration Status</h3>
              <div className="flex items-center">
                {user.name ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    ✓ Data Migrated
                  </span>
                ) : user.displayName ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                    ⚠ Needs Migration
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                    ✗ Incomplete Data
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}