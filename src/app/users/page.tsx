'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function UsersPage() {
  const [isActivitiesExpanded, setIsActivitiesExpanded] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

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

  // Mock activities data
  const activities = [
    { id: '1', type: 'forum', title: 'Emergency Housing', status: 'active' },
    { id: '2', type: 'policy', title: 'Healthcare Policy', status: 'pending' },
    { id: '3', type: 'service', title: 'Food Bank', status: 'completed' }
  ];

  // Mock users for activities panel
  const users = [
    { id: '1', name: 'Sarah Chen', avatar: '👩‍💼', status: 'online' },
    { id: '2', name: 'Marcus Johnson', avatar: '👨‍⚕️', status: 'busy' },
    { id: '3', name: 'Elena Rodriguez', avatar: '👩‍🏫', status: 'away' }
  ];

  const handleLogoClick = () => {
    setIsActivitiesExpanded(!isActivitiesExpanded);
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getUserInitials = () => {
    if (!user?.profile?.name) return '?';
    const names = user.profile.name.split(' ');
    if (names.length >= 2) {
      return names[0][0] + names[names.length - 1][0];
    }
    return names[0][0];
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isUserMenuOpen && !target.closest('.user-menu-container')) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isUserMenuOpen]);

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
      {/* Material Icons Font */}
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
      
      {/* Activities Panel */}
      <div 
        className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 z-50 transition-all duration-300 ${
          isActivitiesExpanded ? 'w-80' : 'w-16'
        }`}
      >
        <div 
          className="h-16 flex items-center justify-center cursor-pointer hover:bg-gray-50 border-b border-gray-200"
          onClick={handleLogoClick}
        >
        </div>

        <div className="flex-1 overflow-y-auto">
          {isActivitiesExpanded ? (
            <div className="p-4">
              <h3 className="text-sm font-semibold text-gray-600 mb-3">Recent Activities</h3>
              <div className="space-y-3">
                {activities.map((activity) => (
                  <div key={activity.id} className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 cursor-pointer">
                    <div className="flex items-start space-x-3">
                      <div className="text-lg">{getActivityIcon(activity.type)}</div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-medium text-gray-900">{activity.title}</h4>
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(activity.status)}`}></div>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          {activity.type === 'forum' ? 'Active discussion' : 
                           activity.type === 'policy' ? 'Review pending' : 'Completed successfully'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <h3 className="text-sm font-semibold text-gray-600 mb-3 mt-6">Active Users</h3>
              <div className="space-y-2">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                    <div className="text-2xl">{user.avatar}</div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="py-4">
              {users.slice(0, 3).map((user, index) => (
                <div key={user.id} className="flex justify-center py-2">
                  <div className="text-2xl">{user.avatar}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Full Width Navigation Background */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-gradient-to-r from-purple-600 to-blue-600 z-30"></div>

      {/* Home Icon - Left Edge */}
      <div 
        className={`fixed top-0 h-16 z-40 transition-all duration-300 flex items-center ${
          isActivitiesExpanded ? 'left-80 w-20' : 'left-16 w-20'
        }`}
      >
        <Link href="/" className="flex flex-col items-center space-y-1 px-3 py-2 mx-auto rounded-lg text-white/80 hover:text-white hover:bg-white/10">
          <span className="material-icons text-2xl">home</span>
          <span className="text-xs font-medium">Home</span>
        </Link>
      </div>

      {/* Main Navigation Bar */}
      <nav 
        className={`fixed top-0 right-0 h-16 z-40 transition-all duration-300 ${
          isActivitiesExpanded ? 'left-96' : 'left-36'
        }`}
      >
        <div className="h-full flex items-center justify-between px-6">
          <div className="flex-1 flex justify-center">
            <div className="flex items-center space-x-8">
              <Link href="/forums" className="flex flex-col items-center space-y-1 px-3 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10">
                <span className="material-icons text-2xl">forum</span>
                <span className="text-xs font-medium">Forums</span>
              </Link>

              <Link href="/services" className="flex flex-col items-center space-y-1 px-3 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10">
                <span className="material-icons text-2xl">build</span>
                <span className="text-xs font-medium">Services</span>
              </Link>

              <Link href="/policies" className="flex flex-col items-center space-y-1 px-3 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10">
                <span className="material-icons text-2xl">account_balance</span>
                <span className="text-xs font-medium">Policies</span>
              </Link>

              <Link href="/users" className="flex flex-col items-center space-y-1 px-3 py-2 rounded-lg bg-white/20 text-white">
                <span className="material-icons text-2xl">people_alt</span>
                <span className="text-xs font-medium">Users</span>
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/cart" className="text-white/80 hover:text-white p-2 rounded-lg hover:bg-white/10">
              <span className="material-icons text-2xl">shopping_cart</span>
            </Link>

            {/* User Dropdown Menu */}
            <div className="relative user-menu-container">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 text-white/80 hover:text-white p-2 rounded-lg hover:bg-white/10"
              >
                <span className="material-icons text-2xl">account_circle</span>
                <span className="text-sm font-medium uppercase">{getUserInitials()}</span>
                <span className="material-icons text-lg">
                  {isUserMenuOpen ? 'expand_less' : 'expand_more'}
                </span>
              </button>

              {/* Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-2xl border border-gray-200 py-2 z-[200]" style={{ boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)' }}>
                  {/* User Info Header */}
                  <div className="px-4 py-3 border-b border-gray-200">
                    <p className="text-sm font-semibold text-gray-900">
                      {user?.profile?.name || 'User'}
                    </p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>

                  {/* Menu Items */}
                  <div className="py-1">
                    <Link
                      href="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <span className="material-icons text-lg mr-3">person</span>
                      Profile
                    </Link>

                    <Link
                      href="/policies"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <span className="material-icons text-lg mr-3">account_balance</span>
                      My Policies ({user?.profile?.activities?.policies?.length || 0})
                    </Link>

                    <Link
                      href="/services"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <span className="material-icons text-lg mr-3">build</span>
                      My Services ({user?.profile?.activities?.services?.length || 0})
                    </Link>

                    <Link
                      href="/forums"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <span className="material-icons text-lg mr-3">forum</span>
                      My Forums ({user?.profile?.activities?.forums?.length || 0})
                    </Link>

                    <Link
                      href="/cart"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <span className="material-icons text-lg mr-3">shopping_cart</span>
                      Shopping Cart ({user?.profile?.shoppingCart?.length || 0})
                    </Link>

                    <div className="border-t border-gray-200 my-1"></div>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <span className="material-icons text-lg mr-3">logout</span>
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main 
        className={`transition-all duration-300 ${
          isActivitiesExpanded ? 'ml-80' : 'ml-16'
        } pt-16 p-6 min-h-screen bg-gray-50`}
      >
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