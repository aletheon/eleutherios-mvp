'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Navigation from '@/components/Navigation';

interface Service {
  id: string;
  serviceName: string;
  description: string;
  category: string;
  price: number;
  currency: string;
  stock: number;
  unit: string;
  provider: string;
  providerId: string;
  providerRole: string;
  providerOrganization: string;
  metadata: {
    dosageForm?: string;
    strength?: string;
    manufacturer?: string;
    requiresPrescription?: boolean;
    activeIngredient?: string;
    sideEffects?: string;
    contraindications?: string;
  };
  status: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export default function ServiceDetailPage({ params }: { params: Promise<{ serviceId: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchService();
  }, [resolvedParams.serviceId]);

  const fetchService = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch service from Firestore
      const serviceRef = doc(db, 'services', resolvedParams.serviceId);
      const serviceSnap = await getDoc(serviceRef);

      if (!serviceSnap.exists()) {
        throw new Error('Service not found');
      }

      const serviceData = serviceSnap.data() as Service;
      setService(serviceData);
      console.log('✓ Loaded service:', serviceData);

    } catch (error) {
      console.error('Error fetching service:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'medication': return '💊';
      case 'healthcare': return '🏥';
      case 'dental': return '🦷';
      case 'mental-health': return '🧠';
      case 'laboratory': return '🔬';
      case 'imaging': return '📷';
      case 'therapy': return '💆';
      case 'consultation': return '👨‍⚕️';
      default: return '🔧';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'medication': return 'bg-red-100 text-red-800';
      case 'healthcare': return 'bg-blue-100 text-blue-800';
      case 'dental': return 'bg-green-100 text-green-800';
      case 'mental-health': return 'bg-purple-100 text-purple-800';
      case 'laboratory': return 'bg-yellow-100 text-yellow-800';
      case 'imaging': return 'bg-pink-100 text-pink-800';
      case 'therapy': return 'bg-indigo-100 text-indigo-800';
      case 'consultation': return 'bg-teal-100 text-teal-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const cartItems = user?.profile?.shoppingCart || [];

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center ml-16 pt-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading service...</p>
          </div>
        </div>
      </>
    );
  }

  if (error || !service) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center ml-16 pt-16">
          <div className="text-center">
            <div className="text-6xl mb-4">❌</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Service Not Found</h1>
            <p className="text-gray-600 mb-4">{error || 'The service you are looking for does not exist.'}</p>
            <Link href="/services" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Back to Services
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <main className="ml-16 pt-16 p-6 min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <div className="mb-6 mt-8">
            <Link href="/services" className="text-blue-600 hover:text-blue-800 flex items-center">
              <span className="material-icons mr-1">arrow_back</span>
              Back to Services
            </Link>
          </div>

          {/* Service Header */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="text-4xl">{getCategoryIcon(service.category)}</div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">{service.serviceName}</h1>
                    <span className={`inline-block mt-1 px-3 py-1 text-sm font-medium rounded-full ${getCategoryColor(service.category)}`}>
                      {service.category}
                    </span>
                  </div>
                </div>

                <p className="text-gray-600 mb-4">{service.description}</p>

                <div className="flex items-center space-x-6 text-sm text-gray-500 mb-4">
                  <span className="flex items-center">
                    <span className="material-icons text-sm mr-1">calendar_today</span>
                    {new Date(service.createdAt).toLocaleDateString()}
                  </span>
                  <span className="flex items-center">
                    <span className="material-icons text-sm mr-1">person</span>
                    {service.provider}
                  </span>
                  <span className="flex items-center">
                    <span className="material-icons text-sm mr-1">attach_money</span>
                    ${service.price.toFixed(2)} {service.currency}
                  </span>
                  <span className="flex items-center">
                    <span className="material-icons text-sm mr-1">inventory_2</span>
                    {service.stock} {service.unit} in stock
                  </span>
                </div>

                {service.status !== 'active' && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                    <p className="text-yellow-800 text-sm">
                      This service is currently {service.status}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex flex-col space-y-2">
                <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 flex items-center space-x-2">
                  <span className="material-icons">add_shopping_cart</span>
                  <span>Add to Cart</span>
                </button>
                <Link href={`/users/${service.providerId}`} className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 text-center">
                  Contact Provider
                </Link>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Medication Details */}
              {service.category === 'medication' && service.metadata && (
                <div className="bg-white rounded-lg shadow p-6 mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Medication Information</h3>

                  <div className="space-y-4">
                    {service.metadata.dosageForm && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700">Dosage Form</h4>
                        <p className="text-gray-900">{service.metadata.dosageForm}</p>
                      </div>
                    )}

                    {service.metadata.strength && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700">Strength</h4>
                        <p className="text-gray-900">{service.metadata.strength}</p>
                      </div>
                    )}

                    {service.metadata.activeIngredient && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700">Active Ingredient</h4>
                        <p className="text-gray-900">{service.metadata.activeIngredient}</p>
                      </div>
                    )}

                    {service.metadata.manufacturer && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700">Manufacturer</h4>
                        <p className="text-gray-900">{service.metadata.manufacturer}</p>
                      </div>
                    )}

                    {service.metadata.requiresPrescription && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-center space-x-2">
                          <span className="material-icons text-red-600">warning</span>
                          <p className="text-red-800 font-medium">Authorization Required</p>
                        </div>
                        <p className="text-red-700 text-sm mt-1">
                          This service requires authorization from a licensed provider.
                        </p>
                      </div>
                    )}

                    {service.metadata.sideEffects && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Side Effects</h4>
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                          <p className="text-gray-900 text-sm whitespace-pre-wrap">{service.metadata.sideEffects}</p>
                        </div>
                      </div>
                    )}

                    {service.metadata.contraindications && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Contraindications</h4>
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                          <p className="text-gray-900 text-sm whitespace-pre-wrap">{service.metadata.contraindications}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Provider Info */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Provider</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <Link href={`/users/${service.providerId}`} className="font-medium text-blue-600 hover:text-blue-800">
                      {service.provider}
                    </Link>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Role</p>
                    <p className="font-medium capitalize">{service.providerRole}</p>
                  </div>
                  {service.providerOrganization && (
                    <div>
                      <p className="text-sm text-gray-500">Organization</p>
                      <p className="font-medium">{service.providerOrganization}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Service Actions */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
                <div className="space-y-3">
                  <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 text-sm flex items-center justify-center space-x-2">
                    <span className="material-icons text-sm">forum</span>
                    <span>Add to Forum</span>
                  </button>
                  <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 text-sm flex items-center justify-center space-x-2">
                    <span className="material-icons text-sm">account_balance</span>
                    <span>Bind to Policy</span>
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
