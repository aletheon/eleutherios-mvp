// src/app/services/[serviceId]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Navigation } from '@/components/Navigation';

interface Service {
  id: string;
  name: string;
  type: 'person' | 'assessment' | 'financial' | 'housing' | 'healthcare' | 'dental' | 'mental-health' | 'pharmaceutical' | 'food' | 'support' | 'legal' | 'product';
  description: string;
  status: 'active' | 'inactive';
  provider?: string;
  providerId?: string;
  cost?: string;
  attributes?: {
    needsHousing?: boolean;
    needsHealthcare?: boolean;
    needsFood?: boolean;
    urgency?: string;
    price?: number;
    size?: string;
    color?: string;
    quantity?: number;
    currency?: string;
    availability?: string;
    location?: string;
  };
  reviews?: {
    rating: number;
    totalReviews: number;
    averageResponseTime?: string;
  };
  certScore?: {
    cooperation: number;
    engagement: number;
    retention: number;
    trust: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

interface User {
  id: string;
  name: string;
  organization?: string;
  certScore: {
    cooperation: number;
    engagement: number;
    retention: number;
    trust: number;
  };
}

// Mock service data - replace with actual API call
const mockServices: Service[] = [
  {
    id: 'service-emergency-housing',
    name: 'Emergency Housing Assessment',
    type: 'housing',
    description: 'Immediate housing assessment and placement service for people experiencing homelessness. Provides rapid access to emergency accommodation and support services.',
    status: 'active',
    provider: 'Housing New Zealand',
    providerId: 'user-housing-nz',
    cost: 'Free',
    attributes: {
      urgency: 'immediate',
      availability: '24/7',
      location: 'Auckland Central',
      needsHousing: true
    },
    reviews: {
      rating: 4.5,
      totalReviews: 127,
      averageResponseTime: '2 hours'
    },
    certScore: {
      cooperation: 85,
      engagement: 92,
      retention: 78,
      trust: 89
    },
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-03-20T14:45:00Z'
  },
  {
    id: 'service-healthcare-enrollment',
    name: 'Primary Healthcare Enrollment',
    type: 'healthcare',
    description: 'Fast-track enrollment into primary healthcare services. Includes GP registration, health assessments, and connection to ongoing medical support.',
    status: 'active',
    provider: 'Auckland DHB',
    providerId: 'user-dhb-auckland',
    cost: 'Free',
    attributes: {
      urgency: 'standard',
      availability: 'Business hours',
      location: 'Multiple locations',
      needsHealthcare: true
    },
    reviews: {
      rating: 4.2,
      totalReviews: 89,
      averageResponseTime: '1 day'
    },
    certScore: {
      cooperation: 78,
      engagement: 85,
      retention: 92,
      trust: 88
    },
    createdAt: '2024-02-01T09:00:00Z',
    updatedAt: '2024-03-15T11:20:00Z'
  },
  {
    id: 'service-food-bank-access',
    name: 'Food Bank Access & Registration',
    type: 'food',
    description: 'Connect people with local food banks and nutritional support services. Includes weekly food parcels and meal planning assistance.',
    status: 'active',
    provider: 'Auckland City Mission',
    providerId: 'user-city-mission',
    cost: 'Free',
    attributes: {
      urgency: 'immediate',
      availability: 'Mon-Fri 9am-5pm',
      location: 'Auckland CBD',
      needsFood: true,
      quantity: 52
    },
    reviews: {
      rating: 4.7,
      totalReviews: 156,
      averageResponseTime: '30 minutes'
    },
    certScore: {
      cooperation: 95,
      engagement: 88,
      retention: 85,
      trust: 93
    },
    createdAt: '2024-01-20T08:15:00Z',
    updatedAt: '2024-03-18T16:30:00Z'
  },
  {
    id: 'service-stripe-payment',
    name: 'Digital Payment Processing',
    type: 'financial',
    description: 'Secure payment processing for rent, bills, and service fees. Supports multiple payment methods and automated recurring payments.',
    status: 'active',
    provider: 'Stripe Inc.',
    providerId: 'user-stripe',
    cost: '2.9% + 30¢ per transaction',
    attributes: {
      price: 0.029,
      currency: 'NZD',
      availability: '24/7',
      location: 'Online'
    },
    reviews: {
      rating: 4.8,
      totalReviews: 2341,
      averageResponseTime: 'Instant'
    },
    certScore: {
      cooperation: 72,
      engagement: 96,
      retention: 98,
      trust: 94
    },
    createdAt: '2024-01-10T12:00:00Z',
    updatedAt: '2024-03-22T10:15:00Z'
  }
];

// Mock users for provider lookup
const mockUsers: User[] = [
  {
    id: 'user-housing-nz',
    name: 'Housing New Zealand',
    organization: 'Housing New Zealand Corporation',
    certScore: { cooperation: 85, engagement: 92, retention: 78, trust: 89 }
  },
  {
    id: 'user-dhb-auckland',
    name: 'Auckland DHB',
    organization: 'Auckland District Health Board',
    certScore: { cooperation: 78, engagement: 85, retention: 92, trust: 88 }
  },
  {
    id: 'user-city-mission',
    name: 'Auckland City Mission',
    organization: 'Auckland City Mission',
    certScore: { cooperation: 95, engagement: 88, retention: 85, trust: 93 }
  },
  {
    id: 'user-stripe',
    name: 'Stripe Inc.',
    organization: 'Stripe Payment Processing',
    certScore: { cooperation: 72, engagement: 96, retention: 98, trust: 94 }
  }
];

const formatCurrency = (amount: number, currency: string = 'NZD') => {
  return new Intl.NumberFormat('en-NZ', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-NZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const getServiceTypeColor = (type: string) => {
  const colors = {
    housing: 'bg-blue-100 text-blue-800',
    healthcare: 'bg-green-100 text-green-800',
    food: 'bg-orange-100 text-orange-800',
    financial: 'bg-purple-100 text-purple-800',
    legal: 'bg-red-100 text-red-800',
    support: 'bg-yellow-100 text-yellow-800',
    assessment: 'bg-gray-100 text-gray-800',
    'mental-health': 'bg-pink-100 text-pink-800',
    dental: 'bg-teal-100 text-teal-800',
    pharmaceutical: 'bg-indigo-100 text-indigo-800',
    product: 'bg-emerald-100 text-emerald-800',
    person: 'bg-cyan-100 text-cyan-800'
  };
  return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
};

const CERTScoreCircle = ({ score, label, color }: { score: number, label: string, color: string }) => (
  <div className="flex flex-col items-center">
    <div className={`w-16 h-16 rounded-full ${color} flex items-center justify-center text-white font-bold text-lg`}>
      {score}
    </div>
    <span className="text-sm text-gray-600 mt-1">{label}</span>
  </div>
);

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-5 h-5 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-sm text-gray-600 ml-2">{rating.toFixed(1)}</span>
    </div>
  );
};

export default function ServiceDetailPage() {
  const params = useParams();
  const serviceId = params?.serviceId as string;
  const [service, setService] = useState<Service | null>(null);
  const [provider, setProvider] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchService = async () => {
      try {
        // In real app, this would be: const response = await fetch(`/api/services/${serviceId}`);
        const foundService = mockServices.find(s => s.id === serviceId);
        setService(foundService || null);
        
        if (foundService?.providerId) {
          const foundProvider = mockUsers.find(u => u.id === foundService.providerId);
          setProvider(foundProvider || null);
        }
      } catch (error) {
        console.error('Error fetching service:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [serviceId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-8"></div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Service Not Found</h1>
            <p className="text-gray-600 mb-8">The service you're looking for doesn't exist or has been removed.</p>
            <Link href="/users" className="text-blue-600 hover:text-blue-800 underline">
              ← Back to Users
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
            <Link href="/users" className="hover:text-blue-600">Users</Link>
            <span>→</span>
            <span className={`px-2 py-1 rounded-full text-xs ${getServiceTypeColor(service.type)}`}>
              {service.type.replace('-', ' ')}
            </span>
            <span>→</span>
            <span className="text-gray-900 font-medium">{service.name}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{service.name}</h1>
              <p className="text-lg text-gray-600">{service.description}</p>
            </div>
            
            <div className="flex space-x-3">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Request Service
              </button>
              <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                Share
              </button>
              <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                Save
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Service Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Service Information</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Type</label>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm mt-1 ${getServiceTypeColor(service.type)}`}>
                    {service.type.replace('-', ' ')}
                  </span>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm mt-1 ${
                    service.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {service.status}
                  </span>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Cost</label>
                  <p className="text-gray-900 mt-1">{service.cost}</p>
                </div>
                
                {service.attributes?.availability && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Availability</label>
                    <p className="text-gray-900 mt-1">{service.attributes.availability}</p>
                  </div>
                )}
                
                {service.attributes?.location && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Location</label>
                    <p className="text-gray-900 mt-1">{service.attributes.location}</p>
                  </div>
                )}
                
                {service.attributes?.urgency && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Urgency</label>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm mt-1 ${
                      service.attributes.urgency === 'immediate' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {service.attributes.urgency}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Reviews & Ratings */}
            {service.reviews && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Reviews & Performance</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <StarRating rating={service.reviews.rating} />
                    <p className="text-sm text-gray-600 mt-1">
                      {service.reviews.totalReviews} reviews
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {service.reviews.averageResponseTime}
                    </div>
                    <p className="text-sm text-gray-600">Average response time</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {Math.round((service.reviews.rating / 5) * 100)}%
                    </div>
                    <p className="text-sm text-gray-600">Satisfaction rate</p>
                  </div>
                </div>
              </div>
            )}

            {/* Service Attributes */}
            {service.attributes && Object.keys(service.attributes).length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Service Attributes</h2>
                
                <div className="grid grid-cols-2 gap-4">
                  {service.attributes.price && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Price</label>
                      <p className="text-gray-900 mt-1">
                        {typeof service.attributes.price === 'number' 
                          ? formatCurrency(service.attributes.price, service.attributes.currency)
                          : service.attributes.price
                        }
                      </p>
                    </div>
                  )}
                  
                  {service.attributes.size && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Size</label>
                      <p className="text-gray-900 mt-1">{service.attributes.size}</p>
                    </div>
                  )}
                  
                  {service.attributes.color && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Color</label>
                      <p className="text-gray-900 mt-1">{service.attributes.color}</p>
                    </div>
                  )}
                  
                  {service.attributes.quantity && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Quantity Available</label>
                      <p className="text-gray-900 mt-1">{service.attributes.quantity}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Provider Information */}
            {provider && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Service Provider</h2>
                
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-lg">
                      {provider.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      <Link href={`/users/${provider.id}`} className="hover:text-blue-600">
                        {provider.name}
                      </Link>
                    </h3>
                    {provider.organization && (
                      <p className="text-gray-600 text-sm">{provider.organization}</p>
                    )}
                  </div>
                </div>

                {/* Provider CERT Score */}
                <div className="border-t pt-4">
                  <h4 className="font-medium text-gray-900 mb-3">Provider CERT Score</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <CERTScoreCircle 
                      score={provider.certScore.cooperation} 
                      label="Cooperation" 
                      color="bg-blue-500" 
                    />
                    <CERTScoreCircle 
                      score={provider.certScore.engagement} 
                      label="Engagement" 
                      color="bg-green-500" 
                    />
                    <CERTScoreCircle 
                      score={provider.certScore.retention} 
                      label="Retention" 
                      color="bg-yellow-500" 
                    />
                    <CERTScoreCircle 
                      score={provider.certScore.trust} 
                      label="Trust" 
                      color="bg-purple-500" 
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Service Metadata */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Service Details</h2>
              
              <div className="space-y-3">
                {service.createdAt && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Created</label>
                    <p className="text-gray-900">{formatDate(service.createdAt)}</p>
                  </div>
                )}
                
                {service.updatedAt && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Updated</label>
                    <p className="text-gray-900">{formatDate(service.updatedAt)}</p>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Service ID</label>
                  <p className="text-gray-600 font-mono text-sm">{service.id}</p>
                </div>
              </div>
            </div>

            {/* Service CERT Score */}
            {service.certScore && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Service CERT Score</h2>
                
                <div className="grid grid-cols-2 gap-4">
                  <CERTScoreCircle 
                    score={service.certScore.cooperation} 
                    label="Cooperation" 
                    color="bg-blue-500" 
                  />
                  <CERTScoreCircle 
                    score={service.certScore.engagement} 
                    label="Engagement" 
                    color="bg-green-500" 
                  />
                  <CERTScoreCircle 
                    score={service.certScore.retention} 
                    label="Retention" 
                    color="bg-yellow-500" 
                  />
                  <CERTScoreCircle 
                    score={service.certScore.trust} 
                    label="Trust" 
                    color="bg-purple-500" 
                  />
                </div>
                
                <div className="mt-4 text-sm text-gray-600">
                  <p>Service quality metrics based on user interactions and feedback.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}