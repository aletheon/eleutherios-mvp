'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

interface Service {
  id: string;
  title: string;
  description?: string;
  category: string;
  price: string;
  provider: string;
  status: string;
  createdAt: string;
  providerId?: string;
  attributes?: {
    size?: string;
    color?: string;
    quantity?: number;
  };
  connectedPolicies?: string[];
  reviews?: Array<{
    id: string;
    userId: string;
    rating: number;
    comment: string;
    date: string;
  }>;
}

interface User {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  certScore?: number;
}

export default function ServiceDetailPage() {
  const params = useParams();
  const serviceId = params?.serviceId as string;
  const [isActivitiesExpanded, setIsActivitiesExpanded] = useState(false);
  const [service, setService] = useState<Service | null>(null);
  const [provider, setProvider] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock activities data
  const activities = [
    { id: '1', type: 'forum', title: 'Emergency Housing', status: 'active' },
    { id: '2', type: 'policy', title: 'Healthcare Policy', status: 'pending' },
    { id: '3', type: 'service', title: 'Food Bank', status: 'completed' }
  ];

  // Mock users for activities panel
  const users = [
    { id: '1', name: 'Sarah Chen', avatar: '👩‍💼', status: 'online' },
    { id: '2', name: 'Marcus Johnson', avatar: '👨‍⚕️', status: 'busy' },
    { id: '3', name: 'Elena Rodriguez', avatar: '👩‍🏫', status: 'away' }
  ];

  useEffect(() => {
    fetchService();
  }, [serviceId]);

  const fetchService = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch service from Firebase Realtime Database
      const response = await fetch(
        `https://eleutherios-mvp-3c717-default-rtdb.asia-southeast1.firebasedatabase.app/services/${serviceId}.json`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch service');
      }

      const serviceData = await response.json();
      
      if (!serviceData) {
        throw new Error('Service not found');
      }

      const fetchedService: Service = {
        id: serviceId,
        title: serviceData.title ? String(serviceData.title) : 'Untitled Service',
        category: serviceData.category ? String(serviceData.category) : 'General',
        price: serviceData.price ? String(serviceData.price) : 'Contact for pricing',
        provider: serviceData.provider ? String(serviceData.provider) : 'Unknown Provider',
        status: serviceData.status ? String(serviceData.status) : 'available',
        createdAt: serviceData.createdAt ? String(serviceData.createdAt) : new Date().toISOString(),
        ...(serviceData.description && { description: String(serviceData.description) }),
        ...(serviceData.providerId && { providerId: String(serviceData.providerId) }),
        ...(serviceData.attributes && { attributes: serviceData.attributes }),
        ...(serviceData.connectedPolicies && Array.isArray(serviceData.connectedPolicies) && { 
          connectedPolicies: serviceData.connectedPolicies.map((p: any) => String(p)) 
        }),
        ...(serviceData.reviews && Array.isArray(serviceData.reviews) && { 
          reviews: serviceData.reviews 
        })
      };

      setService(fetchedService);

      // Fetch provider information if available
      if (fetchedService.providerId) {
        await fetchProvider(fetchedService.providerId);
      }

    } catch (error) {
      console.error('Error fetching service:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchProvider = async (providerId: string) => {
    try {
      // Try Firestore first (for user profiles)
      const firestoreResponse = await fetch(
        `https://firestore.googleapis.com/v1/projects/eleutherios-mvp-3c717/databases/(default)/documents/users/${providerId}`
      );

      if (firestoreResponse.ok) {
        const userData = await firestoreResponse.json();
        if (userData.fields) {
          setProvider({
            id: providerId,
            name: userData.fields.displayName?.stringValue || userData.fields.name?.stringValue || 'Unknown Provider',
            role: userData.fields.role?.stringValue || 'provider',
            avatar: userData.fields.avatar?.stringValue,
            certScore: userData.fields.certScore?.integerValue || userData.fields.certScore?.doubleValue
          });
          return;
        }
      }

      // Fallback to Realtime Database
      const rtdbResponse = await fetch(
        `https://eleutherios-mvp-3c717-default-rtdb.asia-southeast1.firebasedatabase.app/users/${providerId}.json`
      );

      if (rtdbResponse.ok) {
        const userData = await rtdbResponse.json();
        if (userData) {
          setProvider({
            id: providerId,
            name: userData.displayName || userData.name || 'Unknown Provider',
            role: userData.role || 'provider',
            avatar: userData.avatar,
            certScore: userData.certScore
          });
        }
      }
    } catch (error) {
      console.error('Error fetching provider:', error);
    }
  };

  const handleLogoClick = () => {
    setIsActivitiesExpanded(!isActivitiesExpanded);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'forum': return '💬';
      case 'policy': return '📋';
      case 'service': return '🔧';
      default: return '📄';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'completed': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

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

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'unavailable': return 'bg-red-100 text-red-800';
      case 'limited': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-300'}>
        ★
      </span>
    ));
  };

  const calculateAverageRating = (reviews: any[]) => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  if (loading) {
    return (
      <>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
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
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
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
      {/* Material Icons Font */}
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
      
      {/* Activities Panel */}
      <div 
        className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 z-50 transition-all duration-300 ${
          isActivitiesExpanded ? 'w-80' : 'w-16'
        }`}
      >
        <div 
          className="h-16 flex items-center justify-center cursor-pointer hover:bg-gray-50 border-b border-gray-200"
          onClick={handleLogoClick}
        >
        </div>

        <div className="flex-1 overflow-y-auto">
          {isActivitiesExpanded ? (
            <div className="p-4">
              <h3 className="text-sm font-semibold text-gray-600 mb-3">Recent Activities</h3>
              <div className="space-y-3">
                {activities.map((activity) => (
                  <div key={activity.id} className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 cursor-pointer">
                    <div className="flex items-start space-x-3">
                      <div className="text-lg">{getActivityIcon(activity.type)}</div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-medium text-gray-900">{activity.title}</h4>
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(activity.status)}`}></div>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          {activity.type === 'forum' ? 'Active discussion' : 
                           activity.type === 'policy' ? 'Review pending' : 'Completed successfully'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <h3 className="text-sm font-semibold text-gray-600 mb-3 mt-6">Active Users</h3>
              <div className="space-y-2">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                    <div className="text-2xl">{user.avatar}</div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="py-4">
              {users.slice(0, 3).map((user, index) => (
                <div key={user.id} className="flex justify-center py-2">
                  <div className="text-2xl">{user.avatar}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Full Width Navigation Background */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-gradient-to-r from-purple-600 to-blue-600 z-30"></div>

      {/* Home Icon - Left Edge */}
      <div 
        className={`fixed top-0 h-16 z-40 transition-all duration-300 flex items-center ${
          isActivitiesExpanded ? 'left-80 w-20' : 'left-16 w-20'
        }`}
      >
        <Link href="/" className="flex flex-col items-center space-y-1 px-3 py-2 mx-auto rounded-lg text-white/80 hover:text-white hover:bg-white/10">
          <span className="material-icons text-2xl">home</span>
          <span className="text-xs font-medium">Home</span>
        </Link>
      </div>

      {/* Main Navigation Bar */}
      <nav 
        className={`fixed top-0 right-0 h-16 z-40 transition-all duration-300 ${
          isActivitiesExpanded ? 'left-96' : 'left-36'
        }`}
      >
        <div className="h-full flex items-center justify-between px-6">
          <div className="flex-1 flex justify-center">
            <div className="flex items-center space-x-8">
              <Link href="/forums" className="flex flex-col items-center space-y-1 px-3 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10">
                <span className="material-icons text-2xl">forum</span>
                <span className="text-xs font-medium">Forums</span>
              </Link>

              <Link href="/services" className="flex flex-col items-center space-y-1 px-3 py-2 rounded-lg bg-white/20 text-white">
                <span className="material-icons text-2xl">build</span>
                <span className="text-xs font-medium">Services</span>
              </Link>

              <Link href="/policies" className="flex flex-col items-center space-y-1 px-3 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10">
                <span className="material-icons text-2xl">account_balance</span>
                <span className="text-xs font-medium">Policies</span>
              </Link>

              <Link href="/users" className="flex flex-col items-center space-y-1 px-3 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10">
                <span className="material-icons text-2xl">people_alt</span>
                <span className="text-xs font-medium">Users</span>
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="text-white/80 hover:text-white p-2 rounded-lg hover:bg-white/10">
              <span className="material-icons text-2xl">shopping_cart</span>
            </button>

            <div className="flex items-center space-x-2 text-white/80 hover:text-white p-2 rounded-lg hover:bg-white/10">
              <span className="material-icons text-2xl">account_circle</span>
              <span className="text-sm font-medium">RK</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main 
        className={`transition-all duration-300 ${
          isActivitiesExpanded ? 'ml-80' : 'ml-16'
        } pt-16 p-6 min-h-screen bg-gray-50`}
      >
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <div className="mb-6 mt-8">
            <Link href="/services" className="text-blue-600 hover:text-blue-800">
              ← Back to Services
            </Link>
          </div>

          {/* Service Header */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-4">
                <div className="text-6xl">{getCategoryIcon(service.category)}</div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900">{service.title}</h1>
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${getCategoryColor(service.category)}`}>
                      {service.category}
                    </span>
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusBadgeColor(service.status)}`}>
                      {service.status}
                    </span>
                  </div>
                  
                  {service.description && (
                    <p className="text-gray-600 mb-4">{service.description}</p>
                  )}
                  
                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <span>💰 {service.price}</span>
                    <span>🏢 {service.provider}</span>
                    <span>📅 Available since {new Date(service.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col space-y-2">
                <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-medium">
                  Request Service
                </button>
                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Service Attributes */}
              {service.attributes && Object.keys(service.attributes).length > 0 && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Attributes</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {service.attributes.size && (
                      <div>
                        <span className="text-gray-600">Size:</span>
                        <span className="ml-2 font-medium">{service.attributes.size}</span>
                      </div>
                    )}
                    {service.attributes.color && (
                      <div>
                        <span className="text-gray-600">Color:</span>
                        <span className="ml-2 font-medium">{service.attributes.color}</span>
                      </div>
                    )}
                    {service.attributes.quantity && (
                      <div>
                        <span className="text-gray-600">Quantity:</span>
                        <span className="ml-2 font-medium">{service.attributes.quantity}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Reviews */}
              {service.reviews && service.reviews.length > 0 && (
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Reviews</h3>
                    <div className="flex items-center space-x-2">
                      <div className="flex">{renderStars(Math.round(Number(calculateAverageRating(service.reviews))))}</div>
                      <span className="text-gray-600">({calculateAverageRating(service.reviews)} avg)</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {service.reviews.map((review) => (
                      <div key={review.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="flex">{renderStars(review.rating)}</div>
                          <span className="text-sm text-gray-500">by User {review.userId}</span>
                          <span className="text-sm text-gray-500">•</span>
                          <span className="text-sm text-gray-500">{new Date(review.date).toLocaleDateString()}</span>
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Connected Policies */}
              {service.connectedPolicies && service.connectedPolicies.length > 0 && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Connected Policies</h3>
                  <div className="space-y-2">
                    {service.connectedPolicies.map((policyId) => (
                      <Link
                        key={policyId}
                        href={`/policies/${policyId}`}
                        className="block p-3 border rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">📋</span>
                          <span className="text-blue-600 hover:text-blue-800">Policy: {policyId}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Provider Info */}
              {provider && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Provider</h3>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="text-3xl">{provider.avatar || '👤'}</div>
                    <div>
                      <Link href={`/users/${provider.id}`} className="font-medium text-blue-600 hover:text-blue-800">
                        {provider.name}
                      </Link>
                      <p className="text-sm text-gray-500 capitalize">{provider.role}</p>
                      {provider.certScore && (
                        <p className="text-sm text-gray-500">CERT Score: {provider.certScore}</p>
                      )}
                    </div>
                  </div>
                  <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 text-sm">
                    Contact Provider
                  </button>
                </div>
              )}

              {/* Service Info */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Details</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-gray-600">Price:</span>
                    <span className="ml-2 font-medium text-green-600">{service.price}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Category:</span>
                    <span className="ml-2 font-medium">{service.category}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Status:</span>
                    <span className="ml-2 font-medium capitalize">{service.status}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Provider:</span>
                    <span className="ml-2 font-medium">{service.provider}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Service ID:</span>
                    <span className="ml-2 font-mono text-sm">{service.id}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
                <div className="space-y-3">
                  <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 text-sm">
                    Connect to Policy
                  </button>
                  <button className="w-full bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 text-sm">
                    Leave Review
                  </button>
                  <button className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 text-sm">
                    Report Issue
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