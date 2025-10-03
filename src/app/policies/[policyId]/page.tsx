'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

interface Policy {
  id: string;
  title: string;
  description?: string;
  category: string;
  status: string;
  createdAt: string;
  authorId?: string;
  content?: string;
  stakeholders?: string[];
  connectedServices?: string[];
  connectedForums?: string[];
}

interface User {
  id: string;
  name: string;
  role: string;
  avatar?: string;
}

export default function PolicyDetailPage() {
  const params = useParams();
  const policyId = params?.policyId as string;
  const [isActivitiesExpanded, setIsActivitiesExpanded] = useState(false);
  const [policy, setPolicy] = useState<Policy | null>(null);
  const [author, setAuthor] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    fetchPolicy();
  }, [policyId]);

  const fetchPolicy = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch policy from Firebase Realtime Database
      const response = await fetch(
        `https://eleutherios-mvp-3c717-default-rtdb.asia-southeast1.firebasedatabase.app/policies/${policyId}.json`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch policy');
      }

      const policyData = await response.json();
      
      if (!policyData) {
        throw new Error('Policy not found');
      }

      const fetchedPolicy: Policy = {
        id: policyId,
        title: policyData.title ? String(policyData.title) : 'Untitled Policy',
        category: policyData.category ? String(policyData.category) : 'General',
        status: policyData.status ? String(policyData.status) : 'draft',
        createdAt: policyData.createdAt ? String(policyData.createdAt) : new Date().toISOString(),
        ...(policyData.description && { description: String(policyData.description) }),
        ...(policyData.authorId && { authorId: String(policyData.authorId) }),
        ...(policyData.content && { content: String(policyData.content) }),
        ...(policyData.stakeholders && Array.isArray(policyData.stakeholders) && { 
          stakeholders: policyData.stakeholders.map((s: any) => String(s)) 
        }),
        ...(policyData.connectedServices && Array.isArray(policyData.connectedServices) && { 
          connectedServices: policyData.connectedServices.map((s: any) => String(s)) 
        }),
        ...(policyData.connectedForums && Array.isArray(policyData.connectedForums) && { 
          connectedForums: policyData.connectedForums.map((f: any) => String(f)) 
        })
      };

      setPolicy(fetchedPolicy);

      // Fetch author information if available
      if (fetchedPolicy.authorId) {
        await fetchAuthor(fetchedPolicy.authorId);
      }

    } catch (error) {
      console.error('Error fetching policy:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchAuthor = async (authorId: string) => {
    try {
      // Try Firestore first (for user profiles)
      const firestoreResponse = await fetch(
        `https://firestore.googleapis.com/v1/projects/eleutherios-mvp-3c717/databases/(default)/documents/users/${authorId}`
      );

      if (firestoreResponse.ok) {
        const userData = await firestoreResponse.json();
        if (userData.fields) {
          setAuthor({
            id: authorId,
            name: userData.fields.displayName?.stringValue || userData.fields.name?.stringValue || 'Unknown User',
            role: userData.fields.role?.stringValue || 'user',
            avatar: userData.fields.avatar?.stringValue
          });
          return;
        }
      }

      // Fallback to Realtime Database
      const rtdbResponse = await fetch(
        `https://eleutherios-mvp-3c717-default-rtdb.asia-southeast1.firebasedatabase.app/users/${authorId}.json`
      );

      if (rtdbResponse.ok) {
        const userData = await rtdbResponse.json();
        if (userData) {
          setAuthor({
            id: authorId,
            name: userData.displayName || userData.name || 'Unknown User',
            role: userData.role || 'user',
            avatar: userData.avatar
          });
        }
      }
    } catch (error) {
      console.error('Error fetching author:', error);
    }
  };

  const handleLogoClick = () => {
    setIsActivitiesExpanded(!isActivitiesExpanded);
  };

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
      default: return 'bg-blue-100 text-blue-800';
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

  if (loading) {
    return (
      <>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading policy...</p>
          </div>
        </div>
      </>
    );
  }

  if (error || !policy) {
    return (
      <>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">❌</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Policy Not Found</h1>
            <p className="text-gray-600 mb-4">{error || 'The policy you are looking for does not exist.'}</p>
            <Link href="/policies" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Back to Policies
            </Link>
          </div>
        </div>
      </>
    );
  }

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

          <div className="flex items-center space-x-4">
            <button className="text-white/80 hover:text-white p-2 rounded-lg hover:bg-white/10">
              <span className="material-icons text-2xl">shopping_cart</span>
            </button>

            <div className="flex items-center space-x-2 text-white/80 hover:text-white p-2 rounded-lg hover:bg-white/10">
              <span className="material-icons text-2xl">account_circle</span>
              <span className="text-sm font-medium">RK</span>
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
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <div className="mb-6 mt-8">
            <Link href="/policies" className="text-blue-600 hover:text-blue-800">
              ← Back to Policies
            </Link>
          </div>

          {/* Policy Header */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">{policy.title}</h1>
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${getCategoryColor(policy.category)}`}>
                    {policy.category}
                  </span>
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusBadgeColor(policy.status)}`}>
                    {policy.status}
                  </span>
                </div>
                
                {policy.description && (
                  <p className="text-gray-600 mb-4">{policy.description}</p>
                )}
                
                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  <span>📅 Created {new Date(policy.createdAt).toLocaleDateString()}</span>
                  {author && (
                    <span>👤 By {author.name}</span>
                  )}
                  <span>🆔 ID: {policy.id}</span>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm">
                  Follow
                </button>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm">
                  Share
                </button>
                <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 text-sm">
                  Export
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Policy Content */}
              <div className="bg-white rounded-lg shadow p-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Policy Content</h3>
                <div className="prose max-w-none">
                  {policy.content ? (
                    <div className="whitespace-pre-wrap text-gray-700">
                      {policy.content}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">No detailed content available for this policy.</p>
                  )}
                </div>
              </div>

              {/* Connected Elements */}
              {(policy.connectedForums?.length || policy.connectedServices?.length) && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Connected Elements</h3>
                  
                  {policy.connectedForums?.length && (
                    <div className="mb-6">
                      <h4 className="font-medium text-gray-900 mb-2">Connected Forums</h4>
                      <div className="space-y-2">
                        {policy.connectedForums.map((forumId) => (
                          <Link
                            key={forumId}
                            href={`/forums/${forumId}`}
                            className="block p-3 border rounded-lg hover:bg-gray-50"
                          >
                            <div className="flex items-center space-x-2">
                              <span className="text-lg">💬</span>
                              <span className="text-blue-600 hover:text-blue-800">Forum: {forumId}</span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {policy.connectedServices?.length && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Connected Services</h4>
                      <div className="space-y-2">
                        {policy.connectedServices.map((serviceId) => (
                          <Link
                            key={serviceId}
                            href={`/services/${serviceId}`}
                            className="block p-3 border rounded-lg hover:bg-gray-50"
                          >
                            <div className="flex items-center space-x-2">
                              <span className="text-lg">🔧</span>
                              <span className="text-blue-600 hover:text-blue-800">Service: {serviceId}</span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Author Info */}
              {author && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Author</h3>
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{author.avatar || '👤'}</div>
                    <div>
                      <Link href={`/users/${author.id}`} className="font-medium text-blue-600 hover:text-blue-800">
                        {author.name}
                      </Link>
                      <p className="text-sm text-gray-500 capitalize">{author.role}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Stakeholders */}
              {policy.stakeholders?.length && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Stakeholders</h3>
                  <div className="space-y-2">
                    {policy.stakeholders.map((stakeholder, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <span className="text-lg">👥</span>
                        <span className="text-gray-700">{stakeholder}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Policy Actions */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
                <div className="space-y-3">
                  <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 text-sm">
                    Create Forum from Policy
                  </button>
                  <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 text-sm">
                    Connect Service
                  </button>
                  <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 text-sm">
                    Reference in New Policy
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}