'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Navigation from '@/components/Navigation';

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);

  // Fetch services from Firestore
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const servicesRef = collection(db, 'services');
        const q = query(servicesRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);

        const fetchedServices = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setServices(fetchedServices);
        console.log('✓ Loaded services:', fetchedServices.length);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoadingServices(false);
      }
    };

    fetchServices();
  }, []);

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'payment': return 'bg-blue-100 text-blue-800';
      case 'housing': return 'bg-green-100 text-green-800';
      case 'healthcare': return 'bg-red-100 text-red-800';
      case 'food security': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'payment': return '💳';
      case 'housing': return '🏠';
      case 'healthcare': return '🏥';
      case 'food security': return '🍽️';
      default: return '🔧';
    }
  };

  return (
    <>
      <Navigation />
      <main className="ml-16 pt-16 p-6 min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8 mt-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Services</h1>
              <p className="text-gray-600 mt-2">
                Services represent the functional components that deliver value within the PFSD model. They can be connected to Policies and instantiate behavior.
              </p>
            </div>
            <Link href="/services/create" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
              <span className="material-icons text-lg">add</span>
              <span>Create Service</span>
            </Link>
          </div>

          {/* Services Grid */}
          {loadingServices ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-gray-500">Loading services...</div>
            </div>
          ) : services.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <div className="text-6xl mb-4">🔧</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No services available yet</h3>
              <p className="text-gray-600 mb-6">
                Be the first to create a service! Authorized providers can create services for stakeholders.
              </p>
              <Link
                href="/services/create"
                className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
              >
                <span className="material-icons">add</span>
                <span>Create First Service</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {services.map((service) => (
                <div key={service.id} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-3xl">{getCategoryIcon(service.category)}</div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(service.category)}`}>
                      {service.category}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.serviceName || service.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{service.description}</p>

                  <div className="space-y-2 text-sm text-gray-500 mb-4">
                    <div className="flex justify-between">
                      <span>Provider:</span>
                      <span className="font-medium">{service.provider}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Price:</span>
                      <span className="font-medium text-green-600">
                        {typeof service.price === 'number'
                          ? `$${service.price.toFixed(2)} ${service.currency || 'NZD'}`
                          : service.price}
                      </span>
                    </div>
                    {service.stock !== undefined && (
                      <div className="flex justify-between">
                        <span>Stock:</span>
                        <span className="font-medium">{service.stock} {service.unit}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <Link
                      href={`/services/${service.id}`}
                      className="flex-1 bg-blue-600 text-white text-center py-2 rounded-lg hover:bg-blue-700 text-sm"
                    >
                      View Details
                    </Link>
                    <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm">
                      Request
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Service Categories */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Categories</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 border rounded-lg hover:bg-gray-50">
                <div className="text-2xl mb-2">💳</div>
                <h4 className="font-medium text-gray-900">Payment</h4>
                <p className="text-xs text-gray-500">Secure transactions</p>
              </div>
              <div className="text-center p-4 border rounded-lg hover:bg-gray-50">
                <div className="text-2xl mb-2">🏠</div>
                <h4 className="font-medium text-gray-900">Housing</h4>
                <p className="text-xs text-gray-500">Accommodation support</p>
              </div>
              <div className="text-center p-4 border rounded-lg hover:bg-gray-50">
                <div className="text-2xl mb-2">🏥</div>
                <h4 className="font-medium text-gray-900">Healthcare</h4>
                <p className="text-xs text-gray-500">Medical services</p>
              </div>
              <div className="text-center p-4 border rounded-lg hover:bg-gray-50">
                <div className="text-2xl mb-2">🍽️</div>
                <h4 className="font-medium text-gray-900">Food Security</h4>
                <p className="text-xs text-gray-500">Nutrition support</p>
              </div>
            </div>
          </div>

          {/* Service Info */}
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">About Services</h3>
            <p className="text-blue-800 text-sm">
              Services are analogue or digital agents (human, API, IoT, AI) that can be consumed by 
              Policies. They may be free or paid, and include attributes like Price, Size, Color, and 
              Quantity. Services connect to Policies and instantiate behavior when activated.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}