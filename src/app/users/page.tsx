// src/app/users/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';

interface UserProfile {
  uid: string;
  name: string;
  role: 'person' | 'caseworker' | 'housing-officer' | 'healthcare-provider' | 'admin';
  organization?: string;
  bio?: string;
  location?: string;
  website?: string;
  certScore?: {
    cooperation?: number;
    engagement?: number;
    retention?: number;
    trust?: number;
  };
  activities?: {
    policies?: string[];
    forums?: string[];
    services?: string[];
  };
  createdAt: string;
  updatedAt: string;
}

type ViewMode = 'grid' | 'list';
type SortOption = 'name' | 'role' | 'location' | 'trust' | 'recent';

const roleLabels = {
  'person': 'Person',
  'caseworker': 'Caseworker',
  'housing-officer': 'Housing Officer',
  'healthcare-provider': 'Healthcare Provider',
  'admin': 'Administrator'
};

const roleColors = {
  'person': 'bg-blue-100 text-blue-800',
  'caseworker': 'bg-green-100 text-green-800',
  'housing-officer': 'bg-purple-100 text-purple-800',
  'healthcare-provider': 'bg-red-100 text-red-800',
  'admin': 'bg-gray-100 text-gray-800'
};

export default function UsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters and view options
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // Fetch users from Firebase
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);

        const usersCollection = collection(db, 'users');
        const usersQuery = query(usersCollection, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(usersQuery);

        const fetchedUsers: UserProfile[] = [];
        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          fetchedUsers.push({
            uid: doc.id,
            ...userData
          } as UserProfile);
        });

        setUsers(fetchedUsers);
        setFilteredUsers(fetchedUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Failed to load users. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter and sort users
  useEffect(() => {
    let filtered = [...users];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.organization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply role filter
    if (selectedRole !== 'all') {
      filtered = filtered.filter(user => user.role === selectedRole);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a.name || '').localeCompare(b.name || '');
        case 'role':
          return (a.role || '').localeCompare(b.role || '');
        case 'location':
          return (a.location || '').localeCompare(b.location || '');
        case 'trust':
          return (b.certScore?.trust || 0) - (a.certScore?.trust || 0);
        case 'recent':
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        default:
          return 0;
      }
    });

    setFilteredUsers(filtered);
  }, [users, searchTerm, selectedRole, sortBy]);

  const getTotalCERTScore = (certScore?: UserProfile['certScore']) => {
    if (!certScore) {
      return 0;
    }
    
    const {
      cooperation = 0,
      engagement = 0,
      retention = 0,
      trust = 0
    } = certScore;
    
    return Math.round((cooperation + engagement + retention + trust) / 4);
  };

  const getActivityCount = (activities?: UserProfile['activities']) => {
    if (!activities) {
      return 0;
    }
    
    const {
      policies = [],
      forums = [],
      services = []
    } = activities;
    
    return policies.length + forums.length + services.length;
  };

  const CERTCircle = ({ score, color }: { score: number, color: string }) => (
    <div className={`w-8 h-8 rounded-full ${color} flex items-center justify-center text-white text-xs font-bold`}>
      {score || 0}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow p-6">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Network Participants</h1>
          <p className="text-gray-600">
            Connect with stakeholders in the Eleutherios governance network
          </p>
          <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
            <span>{filteredUsers.length} participants</span>
            {currentUser && (
              <span>• Viewing as {roleLabels[currentUser.profile?.role || 'person']}</span>
            )}
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search by name, role, organization, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Roles</option>
                <option value="person">Person</option>
                <option value="caseworker">Caseworker</option>
                <option value="housing-officer">Housing Officer</option>
                <option value="healthcare-provider">Healthcare Provider</option>
                <option value="admin">Administrator</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="name">Sort by Name</option>
                <option value="role">Sort by Role</option>
                <option value="location">Sort by Location</option>
                <option value="trust">Sort by Trust Score</option>
                <option value="recent">Sort by Recent</option>
              </select>
            </div>

            {/* View Toggle */}
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 text-sm font-medium ${
                  viewMode === 'grid'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 text-sm font-medium ${
                  viewMode === 'list'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                List
              </button>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {filteredUsers.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">👥</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {users.length === 0 ? 'No users yet' : 'No users match your search'}
            </h3>
            <p className="text-gray-600 mb-6">
              {users.length === 0 
                ? 'Be the first to join the Eleutherios network!'
                : 'Try adjusting your search or filters.'
              }
            </p>
            {users.length === 0 && (
              <Link
                href="/register"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 inline-block"
              >
                Join Network
              </Link>
            )}
          </div>
        )}

        {/* Users Grid */}
        {viewMode === 'grid' && filteredUsers.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((user) => (
              <Link
                key={user.uid}
                href={`/users/${user.uid}`}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 block"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {user.name || 'Unknown User'}
                    </h3>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${roleColors[user.role] || roleColors.person}`}>
                      {roleLabels[user.role] || 'Person'}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">
                      {getTotalCERTScore(user.certScore)}
                    </div>
                    <div className="text-xs text-gray-500">CERT Score</div>
                  </div>
                </div>

                {user.organization && (
                  <p className="text-sm text-gray-600 mb-2">{user.organization}</p>
                )}

                {user.location && (
                  <p className="text-sm text-gray-500 mb-4">{user.location}</p>
                )}

                {user.bio && (
                  <p className="text-sm text-gray-700 mb-4 line-clamp-2">
                    {user.bio}
                  </p>
                )}

                {/* CERT Scores */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex space-x-2">
                    <CERTCircle score={user.certScore?.cooperation || 0} color="bg-blue-500" />
                    <CERTCircle score={user.certScore?.engagement || 0} color="bg-green-500" />
                    <CERTCircle score={user.certScore?.retention || 0} color="bg-yellow-500" />
                    <CERTCircle score={user.certScore?.trust || 0} color="bg-purple-500" />
                  </div>
                  <div className="text-xs text-gray-500">
                    {getActivityCount(user.activities)} activities
                  </div>
                </div>

                <div className="text-xs text-gray-400">
                  Joined {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Users List */}
        {viewMode === 'list' && filteredUsers.length > 0 && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    CERT Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Activities
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.uid} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link href={`/users/${user.uid}`} className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                          <span className="text-blue-600 font-semibold text-sm">
                            {(user.name || 'U').charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {user.name || 'Unknown User'}
                          </div>
                          {user.organization && (
                            <div className="text-sm text-gray-500">
                              {user.organization}
                            </div>
                          )}
                        </div>
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${roleColors[user.role] || roleColors.person}`}>
                        {roleLabels[user.role] || 'Person'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.location || '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1">
                        <CERTCircle score={user.certScore?.cooperation || 0} color="bg-blue-500" />
                        <CERTCircle score={user.certScore?.engagement || 0} color="bg-green-500" />
                        <CERTCircle score={user.certScore?.retention || 0} color="bg-yellow-500" />
                        <CERTCircle score={user.certScore?.trust || 0} color="bg-purple-500" />
                        <span className="ml-2 text-sm font-medium text-gray-900">
                          {getTotalCERTScore(user.certScore)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getActivityCount(user.activities)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}