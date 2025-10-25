'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Navigation from '@/components/Navigation';

interface Policy {
  id: string;
  title: string;
  description?: string;
  category: string;
  status: string;
  createdAt: string;
  authorId?: string;
  content?: string;
  rules?: Array<{
    ruleName: string;
    forumTitle: string;
    stakeholders: string[];
    description?: string;
  }>;
  eleuscript?: string;
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
  const [policy, setPolicy] = useState<Policy | null>(null);
  const [author, setAuthor] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEleuScript, setShowEleuScript] = useState(false);
  const [copiedEleuScript, setCopiedEleuScript] = useState(false);

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
        ...(policyData.creatorId && { authorId: String(policyData.creatorId) }), // Handle both field names
        ...(policyData.content && { content: String(policyData.content) }),
        ...(policyData.rules && Array.isArray(policyData.rules) && { rules: policyData.rules }),
        ...(policyData.eleuscript && { eleuscript: String(policyData.eleuscript) }),
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

  const copyEleuScript = () => {
    if (policy?.eleuscript) {
      navigator.clipboard.writeText(policy.eleuscript).then(() => {
        setCopiedEleuScript(true);
        setTimeout(() => setCopiedEleuScript(false), 2000);
      });
    }
  };

  const exportPolicy = () => {
    if (!policy) return;

    const exportData = {
      policy: {
        id: policy.id,
        title: policy.title,
        description: policy.description,
        category: policy.category,
        status: policy.status,
        createdAt: policy.createdAt,
        authorId: policy.authorId,
        rules: policy.rules || [],
        eleuscript: policy.eleuscript || '',
        stakeholders: getUniqueStakeholders(),
        connectedServices: policy.connectedServices || [],
        connectedForums: policy.connectedForums || []
      },
      exportedAt: new Date().toISOString(),
      exportVersion: "1.0"
    };

    // Create and download JSON file
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `policy-${policy.title.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const exportEleuScript = () => {
    if (!policy?.eleuscript) return;

    const scriptContent = `# Policy: ${policy.title}
# Description: ${policy.description || 'No description'}
# Created: ${new Date(policy.createdAt).toLocaleDateString()}
# Rules: ${policy.rules?.length || 0}

${policy.eleuscript}

# Stakeholders involved: ${getUniqueStakeholders().join(', ')}
`;

    const dataUri = 'data:text/plain;charset=utf-8,'+ encodeURIComponent(scriptContent);
    const exportFileDefaultName = `policy-${policy.title.replace(/\s+/g, '-').toLowerCase()}.eleuscript`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
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

  // Get unique stakeholders from all rules
  const getUniqueStakeholders = () => {
    if (!policy?.rules || policy.rules.length === 0) return [];
    return Array.from(new Set(policy.rules.flatMap(rule => rule.stakeholders || [])));
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
      <Navigation />

      {/* Main Content */}
      <main className="pt-16 p-6 min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto">
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
                  {policy.rules && policy.rules.length > 0 && (
                    <span className="px-3 py-1 text-sm font-medium rounded-full bg-purple-100 text-purple-800">
                      {policy.rules.length} EleuScript Rule{policy.rules.length !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                
                {policy.description && (
                  <p className="text-gray-600 mb-4 text-lg">{policy.description}</p>
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
                <div className="relative">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      const menu = e.currentTarget.nextElementSibling as HTMLElement;
                      menu.classList.toggle('hidden');
                    }}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 text-sm"
                  >
                    Export
                  </button>
                  <div className="hidden absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border">
                    <button 
                      onClick={exportPolicy}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Export Policy (JSON)
                    </button>
                    {policy.eleuscript && (
                      <button 
                        onClick={exportEleuScript}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Export EleuScript
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Policy Description */}
              {policy.description && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Policy Overview</h3>
                  <div className="prose max-w-none">
                    <p className="text-gray-700">{policy.description}</p>
                  </div>
                </div>
              )}

              {/* EleuScript Rules */}
              {policy.rules && policy.rules.length > 0 && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Forum Rules ({policy.rules.length})
                  </h3>
                  
                  <div className="space-y-4">
                    {policy.rules.map((rule, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="text-lg font-medium text-gray-900">{rule.ruleName}</h4>
                          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            Rule #{index + 1}
                          </span>
                        </div>
                        
                        <div className="mb-3">
                          <span className="text-sm text-gray-500">Creates Forum:</span>
                          <p className="text-gray-900 font-medium">"{rule.forumTitle}"</p>
                        </div>
                        
                        {rule.stakeholders && rule.stakeholders.length > 0 && (
                          <div className="mb-3">
                            <span className="text-sm text-gray-500 block mb-2">Stakeholders ({rule.stakeholders.length}):</span>
                            <div className="flex flex-wrap gap-2">
                              {rule.stakeholders.map((stakeholder, sIndex) => (
                                <span
                                  key={sIndex}
                                  className="inline-block px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-700 border border-blue-200"
                                >
                                  {stakeholder}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {rule.description && (
                          <div className="border-t border-gray-100 pt-3">
                            <span className="text-sm text-gray-500">Description:</span>
                            <p className="text-gray-700">{rule.description}</p>
                          </div>
                        )}

                        {/* Generated Rule Syntax */}
                        <div className="border-t border-gray-100 pt-3 mt-3">
                          <span className="text-sm text-gray-500 block mb-2">EleuScript Syntax:</span>
                          <code className="text-sm text-purple-600 bg-gray-50 px-2 py-1 rounded">
                            rule {rule.ruleName} → Forum("{rule.forumTitle}"
                            {rule.stakeholders && rule.stakeholders.length > 0 && 
                              `, stakeholders=[${rule.stakeholders.map(s => `"${s}"`).join(', ')}]`
                            })
                          </code>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Generated EleuScript */}
              {policy.eleuscript && (
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Complete EleuScript</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={copyEleuScript}
                        className={`px-3 py-1 text-sm rounded transition-colors ${
                          copiedEleuScript 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {copiedEleuScript ? 'Copied!' : 'Copy Code'}
                      </button>
                      <button
                        onClick={() => setShowEleuScript(!showEleuScript)}
                        className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                      >
                        {showEleuScript ? 'Hide' : 'Show'} Code
                      </button>
                    </div>
                  </div>
                  
                  {showEleuScript && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 overflow-x-auto">
                      <pre className="text-sm">
                        <code className="text-purple-600 whitespace-pre-wrap">{policy.eleuscript}</code>
                      </pre>
                    </div>
                  )}
                  
                  {!showEleuScript && (
                    <div className="text-gray-500 text-sm">
                      Click "Show Code" to view the complete EleuScript policy definition
                    </div>
                  )}
                </div>
              )}

              {/* Usage Instructions */}
              {policy.rules && policy.rules.length > 0 && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">How to Use This Policy</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">1. In Forum Chat</h4>
                      <p className="text-gray-600 text-sm mb-2">
                        Stakeholders can type these rules directly in forum chat to execute them:
                      </p>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        {policy.rules.slice(0, 3).map((rule, index) => (
                          <div key={index} className="mb-2 last:mb-0">
                            <code className="text-purple-600 text-sm">
                              rule {rule.ruleName} → Forum("{rule.forumTitle}")
                            </code>
                          </div>
                        ))}
                        {policy.rules.length > 3 && (
                          <div className="text-gray-500 text-sm">
                            ... and {policy.rules.length - 3} more rule{policy.rules.length - 3 !== 1 ? 's' : ''}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">2. Policy Integration</h4>
                      <p className="text-gray-600 text-sm">
                        This policy can be referenced by other policies or activated through service integrations
                        to create coordinated governance workflows.
                      </p>
                    </div>
                  </div>
                </div>
              )}

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
              {/* Policy Stats */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Policy Statistics</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Forum Rules</span>
                    <span className="text-2xl font-bold text-purple-600">{policy.rules?.length || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Stakeholder Types</span>
                    <span className="text-2xl font-bold text-blue-600">{getUniqueStakeholders().length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Status</span>
                    <span className={`px-2 py-1 text-sm font-medium rounded-full ${getStatusBadgeColor(policy.status)}`}>
                      {policy.status}
                    </span>
                  </div>
                </div>
              </div>

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
              {getUniqueStakeholders().length > 0 && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Stakeholder Types ({getUniqueStakeholders().length})
                  </h3>
                  <div className="space-y-2">
                    {getUniqueStakeholders().map((stakeholder, index) => (
                      <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                        <span className="text-lg">👥</span>
                        <span className="text-gray-700 font-medium">{stakeholder}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Policy Actions */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
                <div className="space-y-3">
                  <Link 
                    href={`/policies/${policy.id}/add-rule`}
                    className="block w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 text-sm text-center"
                  >
                    Add EleuScript Rule
                  </Link>
                  {policy.rules && policy.rules.length > 0 && (
                    <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 text-sm">
                      Execute Policy Rules
                    </button>
                  )}
                  <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 text-sm">
                    Create Forum from Policy
                  </button>
                  <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 text-sm">
                    Connect Service
                  </button>
                  <button className="w-full bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 text-sm">
                    Reference in New Policy
                  </button>
                  <Link 
                    href={`/policies/${policy.id}/edit`}
                    className="block w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 text-sm text-center"
                  >
                    Edit Policy
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}