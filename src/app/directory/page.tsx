// src/app/directory/page.tsx
'use client';

import { useState, useEffect } from 'react';

interface User {
  id: string;
  name?: string;
  displayName?: string;
  email: string;
  role: string;
  isActive: boolean;
  certScore?: {
    cooperation: number;
    engagement: number;
    retention: number;
    trust: number;
    total?: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

export default function UserDirectory() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Fetch users from Firestore using the same approach as migration
      const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'eleutherios-mvp-3c717';
      const response = await fetch(`/api/users`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.statusText}`);
      }
      
      const data = await response.json();
      setUsers(data.users || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users');
      console.error('Error fetching users:', err);
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
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">⚠️ Error Loading Users</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchUsers}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">User Directory</h1>
              <p className="text-gray-600 mt-1">Eleutherios Community Members</p>
            </div>
            <div className="text-sm text-gray-500">
              {users.length} users found
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {users.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">👥</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-600">There are no users in the database yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
              <div
                key={user.id}
                className="bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200 p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {user.name || user.displayName || 'Unknown User'}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">{user.email}</p>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}
                    >
                      {getRoleDisplayName(user.role)}
                    </span>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${user.isActive ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                </div>

                {/* CERT Score */}
                {user.certScore && (
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">CERT Score</span>
                      <span className="text-lg font-bold text-blue-600">
                        {calculateCERTTotal(user.certScore)}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Cooperation:</span>
                        <span>{user.certScore.cooperation}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>Engagement:</span>
                        <span>{user.certScore.engagement}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>Retention:</span>
                        <span>{user.certScore.retention}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>Trust:</span>
                        <span>{user.certScore.trust}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Migration Status Indicator */}
                <div className="mt-4 pt-2 border-t text-xs text-gray-500">
                  {user.name ? (
                    <span className="text-green-600">✓ Migrated</span>
                  ) : user.displayName ? (
                    <span className="text-yellow-600">⚠ Needs Migration</span>
                  ) : (
                    <span className="text-red-600">✗ Incomplete Data</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Navigation */}
        <div className="mt-12 pt-6 border-t text-center">
          <div className="space-x-4">
            <a href="/admin" className="text-blue-600 hover:text-blue-800 hover:underline">
              → Admin Dashboard
            </a>
            <a href="/admin/migrate" className="text-blue-600 hover:text-blue-800 hover:underline">
              → User Migration
            </a>
            <a href="/" className="text-blue-600 hover:text-blue-800 hover:underline">
              → Home Page
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}