'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

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
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loadingPolicies, setLoadingPolicies] = useState(true);

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    try {
      setLoadingPolicies(true);

      // Fetch policies from Firestore
      const policiesRef = collection(db, 'policies');
      const policiesQuery = query(policiesRef, orderBy('created_at', 'desc'));
      const snapshot = await getDocs(policiesQuery);

      const policiesArray: Policy[] = snapshot.docs.map(doc => ({
        id: doc.id,
        title: doc.data().name || doc.data().title || 'Untitled Policy',
        description: doc.data().description || '',
        category: doc.data().category || 'General',
        status: doc.data().status || 'draft',
        createdAt: doc.data().created_at?.toDate?.()?.toISOString() || doc.data().createdAt || new Date().toISOString(),
        authorId: doc.data().created_by || doc.data().creatorId || doc.data().authorId,
        rules: doc.data().rules || [],
        eleuscript: doc.data().eleuscript || ''
      }));

      setPolicies(policiesArray);
    } catch (error) {
      console.error('Error fetching policies:', error);
      setPolicies([]);
    } finally {
      setLoadingPolicies(false);
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
      <Navigation />
      <main className="ml-16 pt-16 p-6 min-h-screen bg-gray-50">
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