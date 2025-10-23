'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface Policy {
  id: string;
  title: string;
  description?: string;
  category: string;
  status: string;
  createdAt: string;
  authorId?: string;
  rules?: Array<{
    ruleName: string;
    forumTitle: string;
    stakeholders: string[];
    description?: string;
  }>;
  eleuscript?: string;
}

export default function PoliciesPage() {
  const [isActivitiesExpanded, setIsActivitiesExpanded] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loadingPolicies, setLoadingPolicies] = useState(true);
  const { user, logout } = useAuth();
  const router = useRouter();

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

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    try {
      setLoadingPolicies(true);
      // Fetch all policies from Firebase Realtime Database
      const response = await fetch(
        'https://eleutherios-mvp-3c717-default-rtdb.asia-southeast1.firebasedatabase.app/policies.json'
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data) {
          const policiesArray: Policy[] = Object.keys(data).map(key => ({
            id: key,
            title: data[key].title || 'Untitled Policy',
            description: data[key].description || '',
            category: data[key].category || 'General',
            status: data[key].status || 'draft',
            createdAt: data[key].createdAt || new Date().toISOString(),
            authorId: data[key].creatorId || data[key].authorId,
            rules: data[key].rules || [],
            eleuscript: data[key].eleuscript || ''
          }));
          
          // Sort by creation date (newest first)
          policiesArray.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setPolicies(policiesArray);
        } else {
          setPolicies([]);
        }
      } else {
        console.error('Failed to fetch policies');
        setPolicies([]);
      }
    } catch (error) {
      console.error('Error fetching policies:', error);
      setPolicies([]);
    } finally {
      setLoadingPolicies(false);
    }
  };

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

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'housing': return 'bg-green-100 text-green-800';
      case 'healthcare': return 'bg-red-100 text-red-800';
      case 'food security': return 'bg-yellow-100 text-yellow-800';
      case 'tenancy': return 'bg-blue-100 text-blue-800';
      case 'support': return 'bg-purple-100 text-purple-800';
      case 'health': return 'bg-pink-100 text-pink-800';
      case 'employment': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Helper function to get unique stakeholders from all rules
  const getUniqueStakeholders = (rules: Policy['rules']) => {
    if (!rules || rules.length === 0) return [];
    return Array.from(new Set(rules.flatMap(rule => rule.stakeholders || [])));
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
        {/* Toggle Area - Just for clicking */}
        <div 
          className="h-16 flex items-center justify-center cursor-pointer hover:bg-gray-50 border-b border-gray-200"
          onClick={handleLogoClick}
        >
          {/* Empty click area - no logo needed */}
        </div>

        {/* Activities Content */}
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
          {/* Center Navigation Icons - Forums, Services, Policies, Users */}
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

              <Link href="/policies" className="flex flex-col items-center space-y-1 px-3 py-2 rounded-lg bg-white/20 text-white">
                <span className="material-icons text-2xl">account_balance</span>
                <span className="text-xs font-medium">Policies</span>
              </Link>

              <Link href="/users" className="flex flex-col items-center space-y-1 px-3 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10">
                <span className="material-icons text-2xl">people_alt</span>
                <span className="text-xs font-medium">Users</span>
              </Link>
            </div>
          </div>

          {/* Right Side - Shopping Cart and User Menu */}
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
                    <p className="text-xs text-purple-600 mt-1 capitalize">
                      Role: {user?.profile?.role || 'unknown'}
                    </p>
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
              <h1 className="text-3xl font-bold text-gray-900">Policies</h1>
              <p className="text-gray-600 mt-2">
                Governance policies with EleuScript rules that can be instantiated into Forums, connected to Services, or reference other Policies.
              </p>
            </div>
            <Link 
              href="/policies/create"
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 flex items-center space-x-2"
            >
              <span className="material-icons text-lg">add</span>
              <span>Create Policy</span>
            </Link>
          </div>

          {/* Policies List */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                All Policies ({policies.length})
              </h2>
            </div>

            {loadingPolicies ? (
              <div className="p-6">
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="border-b border-gray-200 pb-4">
                      <div className="animate-pulse">
                        <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : policies.length === 0 ? (
              <div className="p-12 text-center">
                <div className="text-6xl mb-4">📋</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No policies found</h3>
                <p className="text-gray-600 mb-6">
                  Get started by creating your first policy with EleuScript rules to define governance coordination.
                </p>
                <Link 
                  href="/policies/create"
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
                >
                  Create Your First Policy
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {policies.map((policy) => (
                  <Link
                    key={policy.id}
                    href={`/policies/${policy.id}`}
                    className="block p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-medium text-gray-900">
                            {policy.title}
                          </h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(policy.category)}`}>
                            {policy.category}
                          </span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeColor(policy.status)}`}>
                            {policy.status}
                          </span>
                          
                          {/* EleuScript indicator */}
                          {policy.rules && policy.rules.length > 0 && (
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                              {policy.rules.length} rule{policy.rules.length !== 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                        
                        {policy.description && (
                          <p className="text-gray-600 mb-3">{policy.description}</p>
                        )}

                        {/* EleuScript Rules Summary */}
                        {policy.rules && policy.rules.length > 0 && (
                          (() => {
                            // Filter out empty rules
                            const validRules = policy.rules.filter(rule => 
                              rule.ruleName && rule.ruleName.trim() !== '' && 
                              rule.forumTitle && rule.forumTitle.trim() !== ''
                            );
                            
                            return validRules.length > 0 ? (
                              <div className="mb-3">
                                <h4 className="text-sm font-medium text-gray-700 mb-2">Forum Rules:</h4>
                                <div className="space-y-1">
                                  {validRules.slice(0, 2).map((rule, index) => (
                                    <div key={index} className="text-sm text-gray-600">
                                      <span className="font-medium text-purple-600">{rule.ruleName}</span>
                                      <span className="mx-2">→</span>
                                      <span>"{rule.forumTitle}"</span>
                                      {rule.stakeholders && rule.stakeholders.length > 0 && (
                                        <span className="ml-2 text-gray-500">
                                          ({rule.stakeholders.length} stakeholder{rule.stakeholders.length !== 1 ? 's' : ''})
                                        </span>
                                      )}
                                    </div>
                                  ))}
                                  {validRules.length > 2 && (
                                    <div className="text-sm text-gray-500">
                                      ... and {validRules.length - 2} more rule{validRules.length - 2 !== 1 ? 's' : ''}
                                    </div>
                                  )}
                                </div>
                              </div>
                            ) : null;
                          })()
                        )}

                        {/* Stakeholder Summary */}
                        {policy.rules && getUniqueStakeholders(policy.rules).length > 0 && (
                          <div className="mb-3">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Stakeholder Types:</h4>
                            <div className="flex flex-wrap gap-1">
                              {getUniqueStakeholders(policy.rules).slice(0, 6).map((stakeholder, index) => (
                                <span
                                  key={index}
                                  className="inline-block px-2 py-1 rounded text-xs bg-blue-50 text-blue-700"
                                >
                                  {stakeholder}
                                </span>
                              ))}
                              {getUniqueStakeholders(policy.rules).length > 6 && (
                                <span className="inline-block px-2 py-1 rounded text-xs bg-gray-50 text-gray-700">
                                  +{getUniqueStakeholders(policy.rules).length - 6} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                        
                        <div className="flex items-center text-sm text-gray-500 space-x-4">
                          <span>Created {new Date(policy.createdAt).toLocaleDateString()}</span>
                          <span>•</span>
                          <span>ID: {policy.id}</span>
                          {policy.eleuscript && (
                            <>
                              <span>•</span>
                              <span className="text-purple-600">EleuScript Ready</span>
                            </>
                          )}
                        </div>
                      </div>
                      
                      <div className="ml-4 flex items-center space-x-2">
                        {/* Quick action buttons */}
                        {policy.eleuscript && (
                          <div className="text-purple-600" title="Has EleuScript rules">
                            <span className="material-icons text-lg">code</span>
                          </div>
                        )}
                        <span className="material-icons text-gray-400">chevron_right</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}