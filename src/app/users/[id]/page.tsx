'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import Navigation from '@/components/Navigation';

export default function UserDetailPage() {
  const params = useParams();
  const userId = params.id;

  // Mock user data - in real app, fetch based on userId
  const user = {
    id: userId,
    name: 'Sarah Chen',
    role: 'caseworker',
    organization: 'Community Services',
    location: 'Christchurch, NZ',
    certScore: 85,
    avatar: '👩‍💼',
    status: 'online',
    bio: 'Dedicated caseworker specializing in housing assistance and family support. Experienced in crisis intervention and community coordination.',
    email: 'sarah.chen@community.nz',
    joinDate: '2023-06-15',
    certBreakdown: {
      cooperation: 88,
      engagement: 82,
      retention: 90,
      trust: 80
    },
    connections: 24,
    reviews: 18,
    responseTime: '2 hours',
    successRate: 94
  };

  // Mock user contributions
  const contributions = [
    {
      id: '1',
      type: 'policy',
      title: 'Emergency Housing Protocol',
      description: 'Created comprehensive housing assistance policy',
      date: '2024-01-15',
      status: 'active'
    },
    {
      id: '2',
      type: 'forum',
      title: 'Community Coordination',
      description: 'Leading discussion on multi-agency collaboration',
      date: '2024-01-10',
      status: 'active'
    },
    {
      id: '3',
      type: 'service',
      title: 'Case Management Service',
      description: 'Providing direct case management support',
      date: '2024-01-05',
      status: 'active'
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'forum': return '💬';
      case 'policy': return '📋';
      case 'service': return '🔧';
      default: return '📄';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'completed': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

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

      {/* Main Content */}
      <main className="pt-16 p-6 min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <div className="mb-6 mt-8">
            <Link href="/users" className="text-blue-600 hover:text-blue-800">
              ← Back to Users
            </Link>
          </div>

          {/* User Profile Header */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <div className="text-6xl">{user.avatar}</div>
                  <div className={`absolute -bottom-2 -right-2 w-6 h-6 rounded-full border-4 border-white ${getUserStatusColor(user.status)}`}></div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{user.name}</h1>
                  <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${getRoleColor(user.role)} mb-2`}>
                    {formatRole(user.role)}
                  </span>
                  <div className="space-y-1 text-gray-600">
                    <p className="flex items-center space-x-2">
                      <span>🏢</span>
                      <span>{user.organization}</span>
                    </p>
                    <p className="flex items-center space-x-2">
                      <span>📍</span>
                      <span>{user.location}</span>
                    </p>
                    <p className="flex items-center space-x-2">
                      <span>📧</span>
                      <span>{user.email}</span>
                    </p>
                    <p className="flex items-center space-x-2">
                      <span>📅</span>
                      <span>Joined {new Date(user.joinDate).toLocaleDateString()}</span>
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-sm text-gray-500 mb-1">CERT Score</div>
                <div className={`text-4xl font-bold ${getCertScoreColor(user.certScore)} mb-4`}>
                  {user.certScore}
                </div>
                <div className="flex space-x-2">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm">
                    Connect
                  </button>
                  <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm">
                    Message
                  </button>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-gray-700">{user.bio}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* CERT Score Breakdown */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">CERT Score Breakdown</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl mb-2 text-blue-600">🤝</div>
                    <h4 className="font-medium text-gray-900">Cooperation</h4>
                    <div className={`text-2xl font-bold ${getCertScoreColor(user.certBreakdown.cooperation)}`}>
                      {user.certBreakdown.cooperation}
                    </div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl mb-2 text-green-600">⚡</div>
                    <h4 className="font-medium text-gray-900">Engagement</h4>
                    <div className={`text-2xl font-bold ${getCertScoreColor(user.certBreakdown.engagement)}`}>
                      {user.certBreakdown.engagement}
                    </div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl mb-2 text-yellow-600">🔄</div>
                    <h4 className="font-medium text-gray-900">Retention</h4>
                    <div className={`text-2xl font-bold ${getCertScoreColor(user.certBreakdown.retention)}`}>
                      {user.certBreakdown.retention}
                    </div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl mb-2 text-purple-600">⭐</div>
                    <h4 className="font-medium text-gray-900">Trust</h4>
                    <div className={`text-2xl font-bold ${getCertScoreColor(user.certBreakdown.trust)}`}>
                      {user.certBreakdown.trust}
                    </div>
                  </div>
                </div>
              </div>

              {/* Contributions */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Contributions</h3>
                <div className="space-y-4">
                  {contributions.map((contribution) => (
                    <div key={contribution.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-start space-x-3">
                        <div className="text-2xl">{getActivityIcon(contribution.type)}</div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{contribution.title}</h4>
                          <p className="text-gray-600 text-sm mt-1">{contribution.description}</p>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                            <span>{new Date(contribution.date).toLocaleDateString()}</span>
                            <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(contribution.status)} text-white`}>
                              {contribution.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Quick Stats */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Connections</span>
                    <span className="font-medium text-blue-600">{user.connections}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Reviews</span>
                    <span className="font-medium text-yellow-600">{user.reviews}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Response Time</span>
                    <span className="font-medium text-green-600">{user.responseTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Success Rate</span>
                    <span className="font-medium text-purple-600">{user.successRate}%</span>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Status</h3>
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full ${getUserStatusColor(user.status)}`}></div>
                  <span className="font-medium capitalize">{user.status}</span>
                </div>
                <p className="text-gray-600 text-sm mt-2">
                  {user.status === 'online' ? 'Available for coordination and support' :
                   user.status === 'busy' ? 'Currently in meetings or handling cases' :
                   'Away - will respond when available'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}