// src/app/dashboard/page.tsx
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { List, Plus, Calendar, Edit, Eye, User } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  description: string;
  type: string;
  ownerId: string;
  createdAt: string;
}

interface Policy {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  creatorId: string;
  policymakers?: string[];
  createdAt: string;
}

interface Forum {
  id: string;
  title: string;
  policyId: string;
  ruleId: string;
  status: string;
}

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  
  // Existing state
  const [services, setServices] = useState<Service[]>([]);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [forums, setForums] = useState<Forum[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [following, setFollowing] = useState<any[]>([]);
  const [stripeBalance, setStripeBalance] = useState<number>(0);
  const [loadingServices, setLoadingServices] = useState(true);
  const [loadingPolicies, setLoadingPolicies] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showActivities, setShowActivities] = useState(false);
  
  // New state for view toggles
  const [servicesView, setServicesView] = useState<'list' | 'grid'>('list');
  const [policiesView, setPoliciesView] = useState<'list' | 'grid'>('list');

  // Financial data
  const income = 400;
  const expenses = 100;

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchServices();
      fetchPolicies();
      fetchForums();
      fetchFavorites();
      fetchFollowing();
      fetchStripeBalance();
    }
  }, [user]);

  const fetchServices = async () => {
    try {
      const token = await user?.getIdToken();
      const response = await fetch(
        `https://eleutherios-mvp-3c717-default-rtdb.asia-southeast1.firebasedatabase.app/services.json?auth=${token}`
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data) {
          const servicesList = Object.entries(data)
            .map(([id, service]: [string, any]) => ({
              id,
              ...service,
            }))
            .filter((service: Service) => service.ownerId === user?.uid);
          setServices(servicesList);
        }
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoadingServices(false);
    }
  };

  const fetchPolicies = async () => {
    try {
      const token = await user?.getIdToken();
      const response = await fetch(
        `https://eleutherios-mvp-3c717-default-rtdb.asia-southeast1.firebasedatabase.app/policies.json?auth=${token}`
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data) {
          const policiesList = Object.entries(data)
            .map(([id, policy]: [string, any]) => ({
              id,
              ...policy,
            }))
            .filter((policy: Policy) => 
              policy.creatorId === user?.uid || (user?.uid && policy.policymakers?.includes(user.uid))
            );
          setPolicies(policiesList);
        }
      }
    } catch (error) {
      console.error('Error fetching policies:', error);
    } finally {
      setLoadingPolicies(false);
    }
  };

  const fetchForums = async () => {
    try {
      const token = await user?.getIdToken();
      const response = await fetch(
        `https://eleutherios-mvp-3c717-default-rtdb.asia-southeast1.firebasedatabase.app/forums.json?auth=${token}`
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data) {
          const forumsList = Object.entries(data).map(([id, forum]: [string, any]) => ({
            id,
            ...forum,
          }));
          setForums(forumsList);
        }
      }
    } catch (error) {
      console.error('Error fetching forums:', error);
    }
  };

  const fetchFavorites = async () => {
    setFavorites([]);
  };

  const fetchFollowing = async () => {
    setFollowing([]);
  };

  const fetchStripeBalance = async () => {
    setStripeBalance(1250.75);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation 
        onMenuClick={() => setShowUserMenu(!showUserMenu)} 
        onActivitiesClick={() => setShowActivities(!showActivities)}
      />

      {/* User Menu Sidebar (Right) */}
      {showUserMenu && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setShowUserMenu(false)}
        >
          <div
            className="fixed right-0 top-0 h-full w-64 bg-white shadow-lg z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b">
              <p className="text-sm text-gray-600">Signed in as</p>
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  router.push('/profile');
                }}
                className="font-semibold hover:text-blue-600 cursor-pointer text-left"
              >
                {user.email}
              </button>
            </div>
            <nav className="p-2">
              <button 
                onClick={() => {
                  setShowUserMenu(false);
                  setShowActivities(true);
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-md"
              >
                Dashboard
              </button>
              <button 
                onClick={() => {
                  setShowUserMenu(false);
                  router.push('/dashboard');
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-md"
              >
                Policies ({policies.length})
              </button>
              <button 
                onClick={() => {
                  setShowUserMenu(false);
                  router.push('/forums');
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-md"
              >
                Forums ({forums.length})
              </button>
              <button className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-md">
                Services ({services.length})
              </button>
              <button 
                onClick={() => {
                  setShowUserMenu(false);
                  router.push('/visualization');
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-md"
              >
                Visualization
              </button>
              <button className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-md">
                Favorites ({favorites.length})
              </button>
              <button className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-md">
                Following ({following.length})
              </button>
              <button className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-md">
                Payments
              </button>
              <button className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-md">
                Receipts
              </button>
              <hr className="my-2" />
              <button
                onClick={() => signOut()}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-md text-red-600"
              >
                Logout
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* Main Content Area - Simple Two Column Layout */}
      <div className="flex">
        {/* Activities Panel - 40% when open, 0% when closed */}
        <div className={`${showActivities ? 'w-2/5' : 'w-0'} transition-all duration-300 overflow-hidden bg-white border-r border-gray-200`}>
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-6">Activities</h2>
            <p className="text-sm text-gray-600 mb-4">Your subscriptions and activity feed</p>
            
            {policies.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Subscribed Policies</h3>
                <div className="space-y-2">
                  {policies.map(policy => (
                    <div 
                      key={policy.id}
                      onClick={() => {
                        setShowActivities(false);
                        router.push(`/policies/${policy.id}`);
                      }}
                      className="p-2 hover:bg-gray-100 rounded cursor-pointer"
                    >
                      <div className="font-medium text-sm">{policy.title}</div>
                      <div className="text-xs text-gray-500">{policy.category}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {forums.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Subscribed Forums</h3>
                <div className="space-y-2">
                  {forums.map(forum => (
                    <div 
                      key={forum.id}
                      onClick={() => {
                        setShowActivities(false);
                        router.push(`/forums/${forum.id}`);
                      }}
                      className="p-2 hover:bg-gray-100 rounded cursor-pointer"
                    >
                      <div className="font-medium text-sm">{forum.title}</div>
                      <div className="text-xs text-gray-500">Forum activity</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {policies.length === 0 && forums.length === 0 && (
              <p className="text-sm text-gray-600">No subscriptions yet</p>
            )}
          </div>
        </div>

        {/* Dashboard Panel - 60% when activities open, 100% when closed */}
        <div className={`${showActivities ? 'w-3/5' : 'w-full'} transition-all duration-300 bg-gray-50`}>
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-6">Dashboard</h2>

            {/* Financial Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-600">Stripe Balance</h3>
                <p className="text-2xl font-bold text-green-600">${stripeBalance.toFixed(2)}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-600">Favorites</h3>
                <p className="text-2xl font-bold text-blue-600">{favorites.length}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-600">Following</h3>
                <p className="text-2xl font-bold text-purple-600">{following.length}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-600">Income vs Expenses</h3>
                <div className="mt-2">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span>Income: ${income}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span>Expenses: ${expenses}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Policies Section */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">My Policies ({policies.length})</h3>
                <div className="flex items-center gap-3">
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setPoliciesView('list')}
                      className={`flex items-center gap-2 px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        policiesView === 'list' 
                          ? 'bg-white text-gray-900 shadow-sm' 
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <List size={16} />
                      List
                    </button>
                    <button
                      onClick={() => setPoliciesView('grid')}
                      className={`flex items-center gap-2 px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        policiesView === 'grid' 
                          ? 'bg-white text-gray-900 shadow-sm' 
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="7" height="7"/>
                        <rect x="14" y="3" width="7" height="7"/>
                        <rect x="14" y="14" width="7" height="7"/>
                        <rect x="3" y="14" width="7" height="7"/>
                      </svg>
                      Grid
                    </button>
                  </div>
                  <button
                    onClick={() => router.push('/policies/create')}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Plus size={16} />
                    Create Policy
                  </button>
                </div>
              </div>

              {loadingPolicies ? (
                <p className="text-gray-600">Loading policies...</p>
              ) : policies.length === 0 ? (
                <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <p className="text-gray-500 mb-4">No policies created yet</p>
                  <button
                    onClick={() => router.push('/policies/create')}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    <Plus size={16} />
                    Create Your First Policy
                  </button>
                </div>
              ) : (
                <div className={policiesView === 'list' 
                  ? 'space-y-4' 
                  : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
                }>
                  {policies.map((policy) => {
                    if (policiesView === 'list') {
                      return (
                        <div 
                          key={policy.id}
                          onClick={() => router.push(`/policies/${policy.id}`)}
                          className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="text-lg font-semibold text-gray-900">{policy.title}</h4>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  {policy.category}
                                </span>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                  {policy.status}
                                </span>
                              </div>
                              <p className="text-gray-600 mb-3 line-clamp-2">{policy.description}</p>
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <div className="flex items-center gap-1">
                                  <Calendar size={14} />
                                  Created {new Date(policy.createdAt).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2 ml-4">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                }}
                                className="flex items-center gap-1 px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                              >
                                <Edit size={14} />
                                Edit
                              </button>
                              <button className="flex items-center gap-1 px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700">
                                <Eye size={14} />
                                View
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    } else {
                      return (
                        <div 
                          key={policy.id}
                          onClick={() => router.push(`/policies/${policy.id}`)}
                          className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="text-md font-semibold text-gray-900 truncate flex-1">{policy.title}</h4>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 ml-2">
                              {policy.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mb-3">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {policy.category}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{policy.description}</p>
                          <div className="text-xs text-gray-500 mb-3">
                            Created {new Date(policy.createdAt).toLocaleDateString()}
                          </div>
                          <div className="flex gap-2">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                              className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50"
                            >
                              Edit
                            </button>
                            <button className="flex-1 px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700">
                              View
                            </button>
                          </div>
                        </div>
                      );
                    }
                  })}
                </div>
              )}
            </div>

            {/* Services Section */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">My Services ({services.length})</h3>
                <div className="flex items-center gap-3">
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setServicesView('list')}
                      className={`flex items-center gap-2 px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        servicesView === 'list' 
                          ? 'bg-white text-gray-900 shadow-sm' 
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <List size={16} />
                      List
                    </button>
                    <button
                      onClick={() => setServicesView('grid')}
                      className={`flex items-center gap-2 px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        servicesView === 'grid' 
                          ? 'bg-white text-gray-900 shadow-sm' 
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="7" height="7"/>
                        <rect x="14" y="3" width="7" height="7"/>
                        <rect x="14" y="14" width="7" height="7"/>
                        <rect x="3" y="14" width="7" height="7"/>
                      </svg>
                      Grid
                    </button>
                  </div>
                  <button
                    onClick={() => router.push('/services/create')}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus size={16} />
                    Create Service
                  </button>
                </div>
              </div>

              {loadingServices ? (
                <p className="text-gray-600">Loading services...</p>
              ) : services.length === 0 ? (
                <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <p className="text-gray-500 mb-4">No services created yet</p>
                  <button
                    onClick={() => router.push('/services/create')}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Plus size={16} />
                    Create Your First Service
                  </button>
                </div>
              ) : (
                <div className={servicesView === 'list' 
                  ? 'space-y-4' 
                  : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
                }>
                  {services.map((service) => {
                    if (servicesView === 'list') {
                      return (
                        <div key={service.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="text-lg font-semibold text-gray-900">{service.name}</h4>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  {service.type}
                                </span>
                              </div>
                              <p className="text-gray-600 mb-3">{service.description || 'No description'}</p>
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <div className="flex items-center gap-1">
                                  <Calendar size={14} />
                                  Created {new Date(service.createdAt).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2 ml-4">
                              <button className="flex items-center gap-1 px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
                                <Edit size={14} />
                                Edit
                              </button>
                              <button className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">
                                <Eye size={14} />
                                View
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    } else {
                      return (
                        <div key={service.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="text-md font-semibold text-gray-900 truncate flex-1">{service.name}</h4>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 ml-2">
                              {service.type}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{service.description || 'No description'}</p>
                          <div className="text-xs text-gray-500 mb-3">
                            Created {new Date(service.createdAt).toLocaleDateString()}
                          </div>
                          <div className="flex gap-2">
                            <button className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50">
                              Edit
                            </button>
                            <button className="flex-1 px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700">
                              View
                            </button>
                          </div>
                        </div>
                      );
                    }
                  })}
                </div>
              )}
            </div>

            {/* Forums Section */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">My Forums ({forums.length})</h3>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => router.push('/forums/create')}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <Plus size={16} />
                    Create Forum
                  </button>
                </div>
              </div>

              {forums.length === 0 ? (
                <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <p className="text-gray-500 mb-4">No forums created yet</p>
                  <button
                    onClick={() => router.push('/forums/create')}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    <Plus size={16} />
                    Create Your First Forum
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {forums.map((forum) => (
                    <div 
                      key={forum.id}
                      onClick={() => router.push(`/forums/${forum.id}`)}
                      className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-lg font-semibold text-gray-900">{forum.title}</h4>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              {forum.status}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-3">Related to policy and rule discussions</p>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                            className="flex items-center gap-1 px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                          >
                            <Edit size={14} />
                            Edit
                          </button>
                          <button className="flex items-center gap-1 px-3 py-1 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700">
                            <Eye size={14} />
                            View
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}