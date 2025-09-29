// src/app/dashboard/page.tsx
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Logo } from '@/components/Logo';

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

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [loadingPolicies, setLoadingPolicies] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showActivities, setShowActivities] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchServices();
      fetchPolicies();
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
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-4">
              {/* Activities Menu Button (Left) */}
              <button
                onClick={() => setShowActivities(!showActivities)}
                className="p-2 hover:bg-gray-100 rounded-md"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              {/* Logo and Title */}
              <div className="flex items-center gap-1">
              <Logo className="w-8 h-8 text-gray-800" />
              <h1 className="text-xl font-bold">Eleutherios</h1>
            </div>
            </div>

            {/* User Menu Button (Right) */}
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded-md"
            >
              <span className="text-sm text-gray-700">{user.email}</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Activities Sidebar (Left) */}
      {showActivities && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setShowActivities(false)}
        >
          <div
            className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b">
              <h2 className="text-lg font-bold">Activities</h2>
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-600">Recent activity will appear here</p>
            </div>
          </div>
        </div>
      )}

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
              <p className="font-semibold">{user.email}</p>
            </div>
            <nav className="p-2">
              <button className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-md">
                Activities
              </button>
              <button className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-md">
                Policies ({policies.length})
              </button>
              <button className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-md">
                Forums (0)
              </button>
              <button className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-md">
                Services ({services.length})
              </button>
              <button className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-md">
                Data (0)
              </button>
              <button className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-md">
                Payments
              </button>
              <button className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-md">
                Receipts
              </button>
              <button className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-md">
                Favorites
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold mb-6">Dashboard</h2>

        {/* Services List */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">My Services ({services.length})</h3>
            <button
              onClick={() => router.push('/services/create')}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              + Create Service
            </button>
          </div>

          {loadingServices ? (
            <p className="text-gray-600">Loading services...</p>
          ) : services.length === 0 ? (
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <p className="text-gray-600 mb-4">No services created yet</p>
              <button
                onClick={() => router.push('/services/create')}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Create Your First Service
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map((service) => (
                <div key={service.id} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
                  <h4 className="font-semibold text-lg mb-2">{service.name}</h4>
                  <p className="text-sm text-gray-600 mb-2">{service.description || 'No description'}</p>
                  <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                    {service.type}
                  </span>
                  <p className="text-xs text-gray-500 mt-3">
                    Created {new Date(service.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Policies List */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">My Policies ({policies.length})</h3>
            <button
              onClick={() => router.push('/policies/create')}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              + Create Policy
            </button>
          </div>

          {loadingPolicies ? (
            <p className="text-gray-600">Loading policies...</p>
          ) : policies.length === 0 ? (
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <p className="text-gray-600 mb-4">No policies created yet</p>
              <button
                onClick={() => router.push('/policies/create')}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Create Your First Policy
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {policies.map((policy) => (
                <div key={policy.id} onClick={() => router.push(`/policies/${policy.id}`)} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
                  <h4 className="font-semibold text-lg mb-2">{policy.title}</h4>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{policy.description}</p>
                  <div className="flex gap-2 mb-3">
                    <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                      {policy.category}
                    </span>
                    <span className="inline-block px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">
                      {policy.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Created {new Date(policy.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}