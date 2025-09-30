// src/app/visualization/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/Logo';

interface Policy {
  id: string;
  title: string;
  rules?: any[];
}

interface Forum {
  id: string;
  title: string;
  policyId: string;
  ruleId: string;
  assignedServices?: string[];
  postCount: number;
}

interface Service {
  id: string;
  name: string;
  type: string;
}

export default function VisualizationPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [forums, setForums] = useState<Forum[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      const token = await user?.getIdToken();

      // Fetch policies
      const policiesRes = await fetch(
        `https://eleutherios-mvp-3c717-default-rtdb.asia-southeast1.firebasedatabase.app/policies.json?auth=${token}`
      );
      if (policiesRes.ok) {
        const data = await policiesRes.json();
        if (data) {
          setPolicies(Object.entries(data).map(([id, p]: [string, any]) => ({ id, ...p })));
        }
      }

      // Fetch forums
      const forumsRes = await fetch(
        `https://eleutherios-mvp-3c717-default-rtdb.asia-southeast1.firebasedatabase.app/forums.json?auth=${token}`
      );
      if (forumsRes.ok) {
        const data = await forumsRes.json();
        if (data) {
          setForums(Object.entries(data).map(([id, f]: [string, any]) => ({ id, ...f })));
        }
      }

      // Fetch services
      const servicesRes = await fetch(
        `https://eleutherios-mvp-3c717-default-rtdb.asia-southeast1.firebasedatabase.app/services.json?auth=${token}`
      );
      if (servicesRes.ok) {
        const data = await servicesRes.json();
        if (data) {
          setServices(Object.entries(data).map(([id, s]: [string, any]) => ({ id, ...s })));
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-baseline -space-x-1">
              <Logo className="w-8 h-8 text-gray-800" />
              <h1 className="text-xl font-bold">Eleutherios</h1>
            </div>
            <button
              onClick={() => router.push('/dashboard')}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-3xl font-bold mb-2">Governance Flow Visualization</h2>
        <p className="text-gray-600 mb-8">Policy → Forum → Service → Data</p>

        {/* Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-green-600">{policies.length}</div>
            <div className="text-sm text-gray-600">Policies</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-blue-600">{forums.length}</div>
            <div className="text-sm text-gray-600">Forums</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-purple-600">{services.length}</div>
            <div className="text-sm text-gray-600">Services</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-orange-600">
              {forums.reduce((sum, f) => sum + (f.postCount || 0), 0)}
            </div>
            <div className="text-sm text-gray-600">Messages</div>
          </div>
        </div>

        {/* Flow Visualization */}
        <div className="bg-white rounded-lg shadow p-8">
          <h3 className="text-xl font-semibold mb-6">Governance Flow</h3>

          {policies.length === 0 ? (
            <p className="text-gray-600 text-center py-8">No data to visualize yet. Create a policy to get started.</p>
          ) : (
            <div className="space-y-12">
              {policies.map((policy) => {
                const policyForums = forums.filter(f => f.policyId === policy.id);
                
                return (
                  <div key={policy.id} className="border-l-4 border-green-500 pl-6">
                    {/* Policy */}
                    <div 
                      onClick={() => router.push(`/policies/${policy.id}`)}
                      className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4 cursor-pointer hover:shadow-md transition"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">📋</span>
                        <h4 className="font-semibold text-lg">{policy.title}</h4>
                      </div>
                      <div className="text-sm text-gray-600">
                        {policy.rules?.length || 0} rules → {policyForums.length} forums
                      </div>
                    </div>

                    {/* Forums from this policy */}
                    {policyForums.length > 0 && (
                      <div className="ml-8 space-y-6">
                        {policyForums.map((forum) => {
                          const forumServices = services.filter(s => 
                            forum.assignedServices?.includes(s.id)
                          );

                          return (
                            <div key={forum.id} className="border-l-4 border-blue-500 pl-6">
                              {/* Forum */}
                              <div 
                                onClick={() => router.push(`/forums/${forum.id}`)}
                                className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 cursor-pointer hover:shadow-md transition"
                              >
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-2xl">💬</span>
                                  <h5 className="font-semibold">{forum.title}</h5>
                                </div>
                                <div className="text-sm text-gray-600">
                                  {forumServices.length} services → {forum.postCount || 0} messages
                                </div>
                              </div>

                              {/* Services in this forum */}
                              {forumServices.length > 0 && (
                                <div className="ml-8">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {forumServices.map((service) => {
                                      const isDigital = ['api', 'iot', 'ai'].includes(service.type.toLowerCase());
                                      return (
                                        <div 
                                          key={service.id}
                                          className={`rounded-lg p-3 ${
                                            isDigital ? 'bg-gray-100' : 'bg-purple-50'
                                          } border ${
                                            isDigital ? 'border-gray-200' : 'border-purple-200'
                                          }`}
                                        >
                                          <div className="flex items-center gap-2">
                                            <span className="text-lg">{isDigital ? '🤖' : '👤'}</span>
                                            <div>
                                              <div className="font-medium text-sm">{service.name}</div>
                                              <div className="text-xs text-gray-600">{service.type}</div>
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold mb-4">Legend</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span>Policy</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span>Forum</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-purple-500 rounded"></div>
              <span>Analog Service</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-400 rounded"></div>
              <span>Digital Service</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}