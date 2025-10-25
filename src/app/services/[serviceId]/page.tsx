'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

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
  const [isActivitiesExpanded, setIsActivitiesExpanded] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, logout } = useAuth();

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

  const handleLogoClick = () => {
    setIsActivitiesExpanded(!isActivitiesExpanded);
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getUserInitials = () => {
    if (!user?.profile?.name) return '?';
    const names = user.profile.name.split(' ');
    if (names.length >= 2) {
      return names[0][0] + names[names.length - 1][0];
    }
    return names[0][0];
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isUserMenuOpen && !target.closest('.user-menu-container')) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isUserMenuOpen]);

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
      <div className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 z-50 transition-all duration-300 ${isActivitiesExpanded ? 'w-80' : 'w-16'}`}>
        <div className="h-16 flex items-center justify-center cursor-pointer hover:bg-gray-50 border-b border-gray-200" onClick={handleLogoClick}></div>
      </div>

      {/* Navigation Background */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-gradient-to-r from-purple-600 to-blue-600 z-30"></div>

      {/* Home Icon */}
      <div className={`fixed top-0 h-16 z-40 transition-all duration-300 flex items-center ${isActivitiesExpanded ? 'left-80 w-20' : 'left-16 w-20'}`}>
        <Link href="/" className="flex flex-col items-center space-y-1 px-3 py-2 mx-auto rounded-lg text-white/80 hover:text-white hover:bg-white/10">
          <span className="material-icons text-2xl">home</span>
          <span className="text-xs font-medium">Home</span>
        </Link>
      </div>

      {/* Main Navigation */}
      <nav className={`fixed top-0 right-0 h-16 z-40 transition-all duration-300 ${isActivitiesExpanded ? 'left-96' : 'left-36'}`}>
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
            <Link href="/cart" className="text-white/80 hover:text-white p-2 rounded-lg hover:bg-white/10 relative">
              <span className="material-icons text-2xl">shopping_cart</span>
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </Link>

            <div className="relative user-menu-container">
              <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="flex items-center space-x-2 text-white/80 hover:text-white p-2 rounded-lg hover:bg-white/10">
                <span className="material-icons text-2xl">account_circle</span>
                <span className="text-sm font-medium uppercase">{getUserInitials()}</span>
                <span className="material-icons text-lg">{isUserMenuOpen ? 'expand_less' : 'expand_more'}</span>
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-2xl border border-gray-200 py-2 z-[200]">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <p className="text-sm font-semibold text-gray-900">{user?.profile?.name || 'User'}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  <div className="py-1">
                    <Link href="/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsUserMenuOpen(false)}>
                      <span className="material-icons text-lg mr-3">person</span>Profile
                    </Link>
                    <Link href="/policies" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsUserMenuOpen(false)}>
                      <span className="material-icons text-lg mr-3">account_balance</span>My Policies ({user?.profile?.activities?.policies?.length || 0})
                    </Link>
                    <Link href="/services" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsUserMenuOpen(false)}>
                      <span className="material-icons text-lg mr-3">build</span>My Services ({user?.profile?.activities?.services?.length || 0})
                    </Link>
                    <Link href="/forums" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsUserMenuOpen(false)}>
                      <span className="material-icons text-lg mr-3">forum</span>My Forums ({user?.profile?.activities?.forums?.length || 0})
                    </Link>
                    <Link href="/cart" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsUserMenuOpen(false)}>
                      <span className="material-icons text-lg mr-3">shopping_cart</span>Shopping Cart ({cartItems.length})
                    </Link>
                    <div className="border-t border-gray-200 my-1"></div>
                    <button onClick={handleLogout} className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                      <span className="material-icons text-lg mr-3">logout</span>Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className={`transition-all duration-300 ${isActivitiesExpanded ? 'ml-80' : 'ml-16'} pt-16 p-6 min-h-screen bg-gray-50`}>
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
                          <p className="text-red-800 font-medium">Prescription Required</p>
                        </div>
                        <p className="text-red-700 text-sm mt-1">
                          This medication requires a valid prescription from a licensed healthcare provider.
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
