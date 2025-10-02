'use client';

import { DashboardLayout } from '@/components/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface Policy {
  id: string;
  title: string;
  description: string;
  category: string;
  isPublic: boolean;
  createdDate: string;
  stakeholders: number;
  status: 'draft' | 'active' | 'archived';
  content?: string;
  author: {
    id: string;
    name: string;
    email: string;
  };
}

export default function PolicyDetailPage() {
  const { user } = useAuth();
  const params = useParams();
  const policyId = params?.policyId as string;
  const [policy, setPolicy] = useState<Policy | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchPolicy = useCallback(async () => {
    if (!policyId) {
      setLoading(false);
      return;
    }

    try {
      // Mock data - replace with your API call
      const mockPolicies: Record<string, Policy> = {
        'p1': {
          id: 'p1',
          title: 'Consultation Protocol',
          description: 'Standardized approach to telehealth consultations ensuring quality care',
          category: 'healthcare',
          isPublic: true,
          createdDate: '2024-01-12',
          stakeholders: 45,
          status: 'active',
          content: 'This policy outlines the standardized procedures for conducting telehealth consultations...',
          author: {
            id: '2',
            name: 'Dr. Sarah Johnson',
            email: 'dr.johnson@clinic.com'
          }
        },
        'p2': {
          id: 'p2',
          title: 'Prescription Guidelines',
          description: 'Evidence-based prescribing protocols for common conditions',
          category: 'healthcare',
          isPublic: true,
          createdDate: '2024-01-20',
          stakeholders: 28,
          status: 'active',
          content: 'These guidelines provide evidence-based recommendations for prescribing medications...',
          author: {
            id: '2',
            name: 'Dr. Sarah Johnson',
            email: 'dr.johnson@clinic.com'
          }
        },
        'p3': {
          id: 'p3',
          title: 'Prescription Fulfillment Protocol',
          description: 'Quality assurance process for prescription verification and dispensing',
          category: 'pharmacy',
          isPublic: true,
          createdDate: '2024-01-15',
          stakeholders: 12,
          status: 'active',
          content: 'This protocol ensures accurate prescription verification and safe dispensing practices...',
          author: {
            id: '3',
            name: 'PharmaCorp Staff',
            email: 'pharmacy@local.com'
          }
        }
      };

      const policyData = mockPolicies[policyId];
      if (policyData) {
        setPolicy(policyData);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching policy:', error);
      setLoading(false);
    }
  }, [policyId]);

  useEffect(() => {
    if (user && policyId) {
      fetchPolicy();
    }
  }, [user, policyId, fetchPolicy]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Please log in</h2>
          <p className="text-gray-600">You need to be logged in to view policies.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <DashboardLayout title="Policy">
        <div className="flex items-center justify-center py-12">
          <div className="text-lg">Loading policy...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (!policy) {
    return (
      <DashboardLayout title="Policy Not Found">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">Policy not found</h2>
          <p className="text-gray-600 mb-4">The policy you're looking for doesn't exist.</p>
          <Link href="/policies" className="text-blue-600 hover:text-blue-800">
            Back to Policies
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title={policy.title}
      subtitle="Policy Details"
    >
      <div className="space-y-6">
        {/* Policy Header */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{policy.title}</h1>
              <p className="text-gray-600 mb-4">{policy.description}</p>
              
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>Created {new Date(policy.createdDate).toLocaleDateString()}</span>
                <span>• {policy.stakeholders} stakeholders</span>
                <span>• {policy.category}</span>
                <span className={`px-2 py-1 rounded-full ${
                  policy.status === 'active' ? 'bg-green-100 text-green-800' :
                  policy.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {policy.status}
                </span>
              </div>
            </div>
          </div>

          {/* Author Info */}
          <div className="border-t border-gray-100 pt-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">
                  {policy.author.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-900">{policy.author.name}</p>
                <p className="text-sm text-gray-600">{policy.author.email}</p>
              </div>
              <Link 
                href={`/users/${policy.author.id}`}
                className="ml-auto text-blue-600 hover:text-blue-800 text-sm"
              >
                View Profile
              </Link>
            </div>
          </div>
        </div>

        {/* Policy Content */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Policy Content</h3>
          <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed">
              {policy.content}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
          <div className="flex space-x-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Follow Policy
            </button>
            <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200">
              Share
            </button>
            <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200">
              Export
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}