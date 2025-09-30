// src/app/services/page.tsx
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useDashboard } from '@/contexts/DashboardContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Service {
  id: string;
  name: string;
  description?: string;
  type: string;
  category?: string;
  price?: number;
  status: string;
  createdAt: string;
  ownerId?: string;
}

export default function ServicesPage() {
  const { user, loading } = useAuth();
  const { addActivity } = useDashboard();
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchServices();
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
          const servicesList: Service[] = Object.entries(data).map(([id, service]: [string, any]) => ({
            id,
            name: String(service.name || 'Untitled Service'),
            description: service.description ? String(service.description) : undefined,
            type: String(service.type || 'service'),
            category: service.category ? String(service.category) : undefined,
            price: service.price ? Number(service.price) : undefined,
            status: String(service.status || 'active'),
            createdAt: service.createdAt || new Date().toISOString(),
            ownerId: service.ownerId ? String(service.ownerId) : undefined,
          }));
          setServices(servicesList);
        }
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoadingServices(false);
    }
  };

  const handleCreateService = () => {
    // Add activity for creating service
    addActivity({
      type: 'service_update',
      title: 'Started creating new service',
      description: 'Began service creation process',
      priority: 'medium',
    });
    
    // Navigate to service creation (you'll need to create this route)
    router.push('/services/create');
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <div className="text-lg">Loading...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (!user) return null;

  const headerActions = (
    <button
      onClick={handleCreateService}
      className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 5v14m-7-7h14"/>
      </svg>
      Add Service
    </button>
  );

  return (
    <DashboardLayout 
      title="Services" 
      subtitle="Services represent the functional components that deliver value within the PFSD model. They can be connected to policies and integrated into forums."
      headerActions={headerActions}
    >
      <div className="space-y-6">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button className="border-b-2 border-purple-500 text-purple-600 whitespace-nowrap py-2 px-1 text-sm font-medium">
              All Services ({services.length})
            </button>
            <button className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-2 px-1 text-sm font-medium">
              Create Service
            </button>
          </nav>
        </div>

        {loadingServices ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-lg shadow p-6">
                <div className="animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : services.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="w-12 h-12 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-purple-600">
                <circle cx="12" cy="12" r="3"/>
                <path d="m12 1 4 4-4 4-4-4 4-4"/>
                <path d="m12 23-4-4 4-4 4 4-4 4"/>
                <path d="m1 12 4-4 4 4-4 4-4-4"/>
                <path d="m23 12-4 4-4-4 4-4 4 4"/>
              </svg>
            </div>
            <p className="text-gray-500 mb-4">No services created yet</p>
            <button 
              onClick={handleCreateService}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
            >
              Create First Service
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {services.map((service) => (
              <Link
                key={service.id}
                href={`/services/${service.id}`}
                className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {service.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {service.type}
                    </span>
                    {service.category && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {service.category}
                      </span>
                    )}
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {service.status}
                    </span>
                  </div>
                </div>
                
                {service.description && (
                  <p className="text-gray-600 mb-4">{service.description}</p>
                )}
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Created {new Date(service.createdAt).toLocaleDateString()}</span>
                  {service.price && (
                    <span className="font-semibold text-green-600">${service.price}</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}