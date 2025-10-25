'use client';

import Link from 'next/link';
import Navigation from '@/components/Navigation';

export default function UsersPage() {

  const mockUsers = [
    {
      id: '1',
      name: 'Sarah Chen',
      role: 'caseworker',
      organization: 'Community Services',
      location: 'Christchurch, NZ',
      certScore: 85,
      avatar: '👩‍💼',
      status: 'online',
      bio: 'Dedicated caseworker specializing in housing assistance and family support.'
    },
    {
      id: '2',
      name: 'Marcus Johnson',
      role: 'healthcare-provider',
      organization: 'Canterbury Health Board',
      location: 'Canterbury, NZ',
      certScore: 92,
      avatar: '👨‍⚕️',
      status: 'busy',
      bio: 'Healthcare provider focused on community health and preventive care.'
    },
    {
      id: '3',
      name: 'Elena Rodriguez',
      role: 'housing-officer',
      organization: 'Housing Department',
      location: 'Christchurch, NZ',
      certScore: 78,
      avatar: '👩‍🏫',
      status: 'away',
      bio: 'Housing officer working on emergency accommodation and tenant support.'
    },
    {
      id: '4',
      name: 'David Kim',
      role: 'person',
      organization: null,
      location: 'Canterbury, NZ',
      certScore: 67,
      avatar: '👨‍💻',
      status: 'online',
      bio: 'Community member seeking housing and healthcare support.'
    },
    {
      id: '5',
      name: 'Rachel Thompson',
      role: 'admin',
      organization: 'Eleutherios Foundation',
      location: 'Christchurch, NZ',
      certScore: 95,
      avatar: '👩‍💼',
      status: 'online',
      bio: 'Platform administrator and community coordinator.'
    }
  ];

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'caseworker': return 'bg-blue-100 text-blue-800';
      case 'healthcare-provider': return 'bg-red-100 text-red-800';
      case 'housing-officer': return 'bg-green-100 text-green-800';
      case 'person': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUserStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'busy': return 'bg-yellow-500';
      case 'away': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getCertScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatRole = (role: string) => {
    return role.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <>
      <Navigation />
      <main className="ml-16 pt-16 p-6 min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8 mt-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Users</h1>
              <p className="text-gray-600 mt-2">
                Network participants with different roles in the governance system. Each user has a CERT score reflecting their cooperation, engagement, retention, and trust levels.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <input 
                type="text" 
                placeholder="Search users..." 
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Filter
              </button>
            </div>
          </div>

          {/* Users Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {mockUsers.map((user) => (
              <div key={user.id} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="text-3xl">{user.avatar}</div>
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getUserStatusColor(user.status)}`}></div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(user.role)}`}>
                        {formatRole(user.role)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">CERT Score</div>
                    <div className={`text-xl font-bold ${getCertScoreColor(user.certScore)}`}>
                      {user.certScore}
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{user.bio}</p>

                <div className="space-y-2 text-sm text-gray-500 mb-4">
                  {user.organization && (
                    <div className="flex items-center space-x-2">
                      <span>🏢</span>
                      <span>{user.organization}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <span>📍</span>
                    <span>{user.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>🕒</span>
                    <span className="capitalize">{user.status}</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Link 
                    href={`/users/${user.id}`}
                    className="flex-1 bg-blue-600 text-white text-center py-2 rounded-lg hover:bg-blue-700 text-sm"
                  >
                    View Profile
                  </Link>
                  <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm">
                    Connect
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* CERT Score Info */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">CERT Scoring System</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl mb-2 text-blue-600">🤝</div>
                <h4 className="font-medium text-gray-900">Cooperation</h4>
                <p className="text-xs text-gray-500">How often you collaborate with others</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl mb-2 text-green-600">⚡</div>
                <h4 className="font-medium text-gray-900">Engagement</h4>
                <p className="text-xs text-gray-500">Responsiveness and interaction quality</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl mb-2 text-yellow-600">🔄</div>
                <h4 className="font-medium text-gray-900">Retention</h4>
                <p className="text-xs text-gray-500">User loyalty and repeat interactions</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl mb-2 text-purple-600">⭐</div>
                <h4 className="font-medium text-gray-900">Trust</h4>
                <p className="text-xs text-gray-500">Community endorsements and reputation</p>
              </div>
            </div>
          </div>

          {/* User Roles Info */}
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">User Roles</h3>
            <p className="text-blue-800 text-sm mb-4">
              Each user has a role that determines their permissions and responsibilities within the governance system:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-sm">
              <div className="bg-white p-3 rounded border">
                <div className="font-medium text-purple-800">Admin</div>
                <div className="text-gray-600">Platform management</div>
              </div>
              <div className="bg-white p-3 rounded border">
                <div className="font-medium text-blue-800">Caseworker</div>
                <div className="text-gray-600">Client support services</div>
              </div>
              <div className="bg-white p-3 rounded border">
                <div className="font-medium text-red-800">Healthcare Provider</div>
                <div className="text-gray-600">Medical services</div>
              </div>
              <div className="bg-white p-3 rounded border">
                <div className="font-medium text-green-800">Housing Officer</div>
                <div className="text-gray-600">Housing coordination</div>
              </div>
              <div className="bg-white p-3 rounded border">
                <div className="font-medium text-gray-800">Person</div>
                <div className="text-gray-600">Community member</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}