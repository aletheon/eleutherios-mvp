'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface ServiceAttribute {
  name: string;
  value: string | number;
  type: 'price' | 'size' | 'color' | 'quantity' | 'text' | 'date' | 'location';
}

interface Service {
  id: string;
  orgId: string;
  ownerId: string;
  type: 'product' | 'ai' | 'api' | 'human';
  title: string;
  description?: string;
  attributes?: Record<string, unknown>;
  price?: { amountCents: number; currency: string };
  availability?: 'active' | 'inactive' | 'maintenance';
  cert: { c: number; e: number; r: number; t: number; score: number };
  rating?: { average: number; count: number };
  createdAt: string;
  updatedAt: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  bio?: string;
  avatar?: string;
  role?: string;
}

interface ActivityItem {
  id: string;
  type: 'forum' | 'policy' | 'service';
  title: string;
  status: string;
}

export default function ServiceDetailPage({ params }: { params: Promise<{ serviceId: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [isActivitiesExpanded, setIsActivitiesExpanded] = useState(false);
  const [service, setService] = useState<Service | null>(null);
  const [owner, setOwner] = useState<User | null>(null);
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
  }, [resolvedParams.serviceId]);

  const fetchService = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch service from Firebase Realtime Database
      const response = await fetch(
        `https://eleutherios-mvp-3c717-default-rtdb.asia-southeast1.firebasedatabase.app/services/${resolvedParams.serviceId}.json`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch service');
      }

      const serviceData = await response.json();
      
      if (!serviceData) {
        // Demo data fallback
        const demoService: Service = {
          id: resolvedParams.serviceId,
          orgId: 'org-1',
          ownerId: 'user-ko-1',
          type: 'human',
          title: 'Emergency Housing Support',
          description: 'Immediate housing assistance for individuals in crisis situations. We provide temporary accommodation, support services, and pathways to permanent housing solutions.',
          attributes: {
            price: 'Free',
            availability: '24/7',
            location: 'Auckland Central',
            capacity: 50
          },
          price: { amountCents: 0, currency: 'NZD' },
          availability: 'active',
          cert: { c: 85, e: 92, r: 78, t: 88, score: 86 },
          rating: { average: 4.2, count: 127 },
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-09-30T14:30:00Z'
        };
        setService(demoService);
        
        // Set demo owner
        setOwner({
          id: 'user-ko-1',
          name: 'Kāinga Ora',
          email: 'support@kaingaora.govt.nz',
          bio: 'Government housing provider',
          avatar: '🏠',
          role: 'Housing Provider'
        });
      } else {
        const fetchedService: Service = {
          id: resolvedParams.serviceId,
          orgId: serviceData.orgId || 'org-1',
          ownerId: serviceData.ownerId || 'unknown',
          type: serviceData.type || 'human',
          title: serviceData.title || 'Untitled Service',
          description: serviceData.description,
          attributes: serviceData.attributes || {},
          price: serviceData.price,
          availability: serviceData.availability || 'active',
          cert: serviceData.cert || { c: 0, e: 0, r: 0, t: 0, score: 0 },
          rating: serviceData.rating,
          createdAt: serviceData.createdAt || new Date().toISOString(),
          updatedAt: serviceData.updatedAt || new Date().toISOString()
        };
        setService(fetchedService);

        // Fetch owner information
        if (fetchedService.ownerId) {
          await fetchOwner(fetchedService.ownerId);
        }
      }

    } catch (error) {
      console.error('Error fetching service:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchOwner = async (ownerId: string) => {
    try {
      // Try Firestore first
      const firestoreResponse = await fetch(
        `https://firestore.googleapis.com/v1/projects/eleutherios-mvp-3c717/databases/(default)/documents/users/${ownerId}`
      );

      if (firestoreResponse.ok) {
        const userData = await firestoreResponse.json();
        if (userData.fields) {
          setOwner({
            id: ownerId,
            name: userData.fields.name?.stringValue || 'Unknown User',
            email: userData.fields.email?.stringValue || '',
            bio: userData.fields.bio?.stringValue,
            avatar: userData.fields.avatar?.stringValue,
            role: userData.fields.role?.stringValue || 'user'
          });
          return;
        }
      }

      // Fallback to Realtime Database
      const rtdbResponse = await fetch(
        `https://eleutherios-mvp-3c717-default-rtdb.asia-southeast1.firebasedatabase.app/users/${ownerId}.json`
      );

      if (rtdbResponse.ok) {
        const userData = await rtdbResponse.json();
        if (userData) {
          setOwner({
            id: ownerId,
            name: userData.name || 'Unknown User',
            email: userData.email || '',
            bio: userData.bio,
            avatar: userData.avatar,
            role: userData.role || 'user'
          });
        }
      }
    } catch (error) {
      console.error('Error fetching owner:', error);
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

  const getServiceTypeColor = (type: string) => {
    switch (type) {
      case 'human': return 'bg-green-100 text-green-800';
      case 'api': return 'bg-blue-100 text-blue-800';
      case 'ai': return 'bg-purple-100 text-purple-800';
      case 'product': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-lg ${
          i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'
        }`}
      >
        ★
      </span>
    ));
  };

  const formatPrice = (price?: { amountCents: number; currency: string }) => {
    if (!price || price.amountCents === 0) return 'Free';
    return `${price.currency} $${(price.amountCents / 100).toFixed(2)}`;
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
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">{service.title}</h1>
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${getServiceTypeColor(service.type)}`}>
                    {service.type.toUpperCase()}
                  </span>
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${getAvailabilityColor(service.availability || 'active')}`}>
                    {service.availability || 'Active'}
                  </span>
                </div>
                
                {service.description && (
                  <p className="text-gray-600 mb-4">{service.description}</p>
                )}
                
                <div className="flex items-center space-x-6 text-sm text-gray-500 mb-4">
                  <span>📅 Created {new Date(service.createdAt).toLocaleDateString()}</span>
                  {owner && (
                    <span>👤 By {owner.name}</span>
                  )}
                  <span>💰 {formatPrice(service.price)}</span>
                </div>

                {/* Rating */}
                {service.rating && (
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="flex">{renderStars(service.rating.average)}</div>
                    <span className="text-sm font-medium">{service.rating.average}</span>
                    <span className="text-sm text-gray-500">({service.rating.count} reviews)</span>
                  </div>
                )}

                {/* CERT Score */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">CERT Score: {service.cert.score}/100</h4>
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div className="text-center">
                      <div className="font-medium text-blue-600">{service.cert.c}</div>
                      <div className="text-gray-600">Cooperation</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-green-600">{service.cert.e}</div>
                      <div className="text-gray-600">Engagement</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-yellow-600">{service.cert.r}</div>
                      <div className="text-gray-600">Retention</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-purple-600">{service.cert.t}</div>
                      <div className="text-gray-600">Trust</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm">
                  Contact
                </button>
                {service.type === 'product' && (
                  <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm">
                    Add to Cart
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Service Attributes */}
              {service.attributes && Object.keys(service.attributes).length > 0 && (
                <div className="bg-white rounded-lg shadow p-6 mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(service.attributes).map(([key, value]) => (
                      <div key={key} className="bg-gray-50 rounded-lg p-3">
                        <div className="text-sm font-medium text-gray-700 capitalize">{key}</div>
                        <div className="text-sm text-gray-900">{String(value)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Owner Info */}
              {owner && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Provider</h3>
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="text-2xl">{owner.avatar || '👤'}</div>
                    <div>
                      <Link href={`/users/${owner.id}`} className="font-medium text-blue-600 hover:text-blue-800">
                        {owner.name}
                      </Link>
                      <p className="text-sm text-gray-500">{owner.role}</p>
                    </div>
                  </div>
                  {owner.bio && (
                    <p className="text-sm text-gray-600 mb-3">{owner.bio}</p>
                  )}
                  {owner.email && (
                    <div className="text-sm text-gray-500">
                      📧 {owner.email}
                    </div>
                  )}
                </div>
              )}

              {/* Service Actions */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
                <div className="space-y-3">
                  <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 text-sm">
                    Add to Forum
                  </button>
                  <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 text-sm">
                    Bind to Policy
                  </button>
                  <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 text-sm">
                    Rate & Review
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