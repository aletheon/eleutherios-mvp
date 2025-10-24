'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { collection, getDocs, query, where, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { CheckCircle, Briefcase, FileText, Search } from 'lucide-react';

interface Policy {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  visibility: string;
}

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [step, setStep] = useState<'choice' | 'policies' | 'service'>('choice');
  const [availablePolicies, setAvailablePolicies] = useState<Policy[]>([]);
  const [selectedPolicies, setSelectedPolicies] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAvailablePolicies();
  }, []);

  const loadAvailablePolicies = async () => {
    try {
      const policiesRef = collection(db, 'policies');
      const q = query(policiesRef, where('visibility', '==', 'public'), where('status', '==', 'active'));
      const snapshot = await getDocs(q);

      const policies: Policy[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Policy));

      setAvailablePolicies(policies);
    } catch (error) {
      console.error('Error loading policies:', error);
    }
  };

  const handleConsumePolicies = async () => {
    if (!user || selectedPolicies.length === 0) {
      alert('Please select at least one policy');
      return;
    }

    setLoading(true);
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        consumedPolicies: arrayUnion(...selectedPolicies),
        'activities.policies': arrayUnion(...selectedPolicies),
        updatedAt: new Date().toISOString()
      });

      // Redirect to home
      router.push('/');
    } catch (error) {
      console.error('Error consuming policies:', error);
      alert('Failed to consume policies. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    router.push('/');
  };

  const filteredPolicies = availablePolicies.filter(policy =>
    policy.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    policy.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    policy.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    policy.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const togglePolicySelection = (policyId: string) => {
    setSelectedPolicies(prev =>
      prev.includes(policyId)
        ? prev.filter(id => id !== policyId)
        : [...prev, policyId]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Welcome to Eleutherios!
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Let's get you started
          </p>
        </div>

        {/* Choice Step */}
        {step === 'choice' && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                How would you like to get started?
              </h2>
              <p className="text-gray-600">
                You can select policies to consume or create a service to represent yourself or your business
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Select/Consume Policies */}
              <button
                onClick={() => setStep('policies')}
                className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all border-2 border-transparent hover:border-purple-500 text-left group"
              >
                <div className="flex items-start space-x-4">
                  <div className="bg-purple-100 p-3 rounded-lg group-hover:bg-purple-200 transition">
                    <FileText className="w-8 h-8 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Browse & Consume Policies
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Select from existing policies like orthopaedic policy, orthodontist policy, and more.
                      If none exist, you can create your own.
                    </p>
                    <ul className="text-sm text-gray-500 space-y-1">
                      <li>• Access existing policies</li>
                      <li>• Create custom policies</li>
                      <li>• Participate in governance</li>
                    </ul>
                  </div>
                </div>
              </button>

              {/* Create Service */}
              <button
                onClick={() => router.push('/services/create')}
                className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all border-2 border-transparent hover:border-blue-500 text-left group"
              >
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-3 rounded-lg group-hover:bg-blue-200 transition">
                    <Briefcase className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Create a Service
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Create a service to represent yourself or your business. You can consume policies and charge fees.
                    </p>
                    <ul className="text-sm text-gray-500 space-y-1">
                      <li>• Represent your business</li>
                      <li>• Consume policies</li>
                      <li>• Charge fees for services</li>
                    </ul>
                  </div>
                </div>
              </button>
            </div>

            <div className="text-center mt-8">
              <button
                onClick={handleSkip}
                className="text-gray-500 hover:text-gray-700 text-sm font-medium"
              >
                Skip for now
              </button>
            </div>
          </div>
        )}

        {/* Policies Step */}
        {step === 'policies' && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="mb-6">
              <button
                onClick={() => setStep('choice')}
                className="text-purple-600 hover:text-purple-700 text-sm font-medium mb-4"
              >
                ← Back to choices
              </button>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Browse Available Policies
              </h2>
              <p className="text-gray-600">
                Select one or more policies that best suit your needs
              </p>
            </div>

            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search policies by name, category, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Policies List */}
            <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
              {filteredPolicies.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">
                    {searchQuery ? 'No policies found matching your search.' : 'No policies available yet.'}
                  </p>
                  <button
                    onClick={() => router.push('/policies/create')}
                    className="text-purple-600 hover:text-purple-700 font-medium"
                  >
                    Create your own policy →
                  </button>
                </div>
              ) : (
                filteredPolicies.map((policy) => (
                  <div
                    key={policy.id}
                    onClick={() => togglePolicySelection(policy.id)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition ${
                      selectedPolicies.includes(policy.id)
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {policy.title}
                          </h3>
                          {selectedPolicies.includes(policy.id) && (
                            <CheckCircle className="w-5 h-5 text-purple-600" />
                          )}
                        </div>
                        <p className="text-gray-600 mt-1 text-sm">
                          {policy.description}
                        </p>
                        {policy.tags && policy.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {policy.tags.map((tag, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-6 border-t">
              <div className="text-sm text-gray-600">
                {selectedPolicies.length > 0 && (
                  <span>{selectedPolicies.length} policy/policies selected</span>
                )}
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => router.push('/policies/create')}
                  className="px-6 py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition"
                >
                  Create New Policy
                </button>
                <button
                  onClick={handleConsumePolicies}
                  disabled={selectedPolicies.length === 0 || loading}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processing...' : 'Consume Selected'}
                </button>
              </div>
            </div>

            <div className="text-center mt-4">
              <button
                onClick={handleSkip}
                className="text-gray-500 hover:text-gray-700 text-sm font-medium"
              >
                Skip for now
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
