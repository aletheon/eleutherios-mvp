'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { doc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface ServiceFormData {
  serviceName: string;
  description: string;
  category: string;
  price: string;
  currency: string;
  stock: string;
  unit: string;
  metadata: {
    dosageForm?: string;
    strength?: string;
    manufacturer?: string;
    requiresPrescription: boolean;
    activeIngredient?: string;
    sideEffects?: string;
    contraindications?: string;
  };
}

export default function CreateServicePage() {
  const [isActivitiesExpanded, setIsActivitiesExpanded] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState<ServiceFormData>({
    serviceName: '',
    description: '',
    category: 'medication',
    price: '',
    currency: 'NZD',
    stock: '',
    unit: 'tablets',
    metadata: {
      dosageForm: '',
      strength: '',
      manufacturer: '',
      requiresPrescription: true,
      activeIngredient: '',
      sideEffects: '',
      contraindications: ''
    }
  });

  // Check authorization
  useEffect(() => {
    if (user && !['doctor', 'pharmacist', 'healthcare-provider'].includes(user.profile?.role || '')) {
      router.push('/services');
    }
  }, [user, router]);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (name.startsWith('metadata.')) {
      const metadataKey = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        metadata: {
          ...prev.metadata,
          [metadataKey]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const validateForm = (): boolean => {
    if (!formData.serviceName.trim()) {
      setError('Service name is required');
      return false;
    }
    if (!formData.description.trim()) {
      setError('Description is required');
      return false;
    }
    if (!formData.price || parseFloat(formData.price) < 0) {
      setError('Valid price is required');
      return false;
    }
    if (!formData.stock || parseInt(formData.stock) < 0) {
      setError('Valid stock quantity is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;
    if (!user) {
      setError('You must be logged in to create a service');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const serviceId = `service-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      const serviceData = {
        id: serviceId,
        serviceName: formData.serviceName,
        description: formData.description,
        category: formData.category,
        price: parseFloat(formData.price),
        currency: formData.currency,
        stock: parseInt(formData.stock),
        unit: formData.unit,
        provider: user.profile?.name || 'Unknown',
        providerId: user.uid,
        providerRole: user.profile?.role || 'healthcare-provider',
        providerOrganization: user.profile?.organization || '',
        metadata: formData.metadata,
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: user.uid
      };

      // Save service to Firestore
      const serviceRef = doc(db, 'services', serviceId);
      await setDoc(serviceRef, serviceData);

      // Update user's activities to include this service
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        'activities.services': arrayUnion(serviceId),
        updatedAt: new Date().toISOString()
      });

      console.log('✓ Service created:', serviceId);
      console.log('✓ Added to user activities');
      setSuccess(true);

      // Redirect after success
      setTimeout(() => {
        router.push('/services');
      }, 2000);

    } catch (error: any) {
      console.error('Service creation error:', error);
      setError(error.message || 'Failed to create service');
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = [
    { value: 'medication', label: 'Medication', icon: '💊' },
    { value: 'healthcare', label: 'Healthcare Service', icon: '🏥' },
    { value: 'dental', label: 'Dental Service', icon: '🦷' },
    { value: 'mental-health', label: 'Mental Health', icon: '🧠' },
    { value: 'laboratory', label: 'Laboratory Test', icon: '🔬' },
    { value: 'imaging', label: 'Medical Imaging', icon: '📷' },
    { value: 'therapy', label: 'Therapy Service', icon: '💆' },
    { value: 'consultation', label: 'Consultation', icon: '👨‍⚕️' }
  ];

  const units = [
    'tablets', 'capsules', 'ml', 'mg', 'g', 'units', 'doses', 'sessions', 'tests', 'scans'
  ];

  const cartItems = user?.profile?.shoppingCart || [];

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <>
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
                    <p className="text-xs text-purple-600 mt-1 capitalize">Role: {user?.profile?.role || 'unknown'}</p>
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
          {/* Header */}
          <div className="mb-8 mt-8">
            <div className="flex items-center space-x-4 mb-4">
              <Link href="/services" className="text-blue-600 hover:text-blue-700 flex items-center">
                <span className="material-icons mr-1">arrow_back</span>
                Back to Services
              </Link>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Create New Service</h1>
            <p className="text-gray-600 mt-2">
              Create a new medication or healthcare service that can be prescribed to patients through consultation forums.
            </p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <span className="material-icons text-green-600">check_circle</span>
                <div>
                  <p className="text-green-800 font-medium">Service created successfully!</p>
                  <p className="text-green-600 text-sm">Redirecting to services page...</p>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <span className="material-icons text-red-600">error</span>
                <p className="text-red-800">{error}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
            {/* Basic Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="serviceName"
                    value={formData.serviceName}
                    onChange={handleInputChange}
                    placeholder="e.g., Amoxicillin 500mg"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe the service, its uses, and important information..."
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      {categories.map(cat => (
                        <option key={cat.value} value={cat.value}>
                          {cat.icon} {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Unit Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="unit"
                      value={formData.unit}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      {units.map(unit => (
                        <option key={unit} value={unit}>{unit}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Currency
                    </label>
                    <select
                      name="currency"
                      value={formData.currency}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="NZD">NZD</option>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stock Quantity <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      placeholder="0"
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Medication Details */}
            {formData.category === 'medication' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Medication Details</h2>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Dosage Form
                      </label>
                      <input
                        type="text"
                        name="metadata.dosageForm"
                        value={formData.metadata.dosageForm}
                        onChange={handleInputChange}
                        placeholder="e.g., Tablet, Capsule, Liquid"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Strength
                      </label>
                      <input
                        type="text"
                        name="metadata.strength"
                        value={formData.metadata.strength}
                        onChange={handleInputChange}
                        placeholder="e.g., 500mg, 10ml"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Active Ingredient
                      </label>
                      <input
                        type="text"
                        name="metadata.activeIngredient"
                        value={formData.metadata.activeIngredient}
                        onChange={handleInputChange}
                        placeholder="e.g., Amoxicillin"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Manufacturer
                      </label>
                      <input
                        type="text"
                        name="metadata.manufacturer"
                        value={formData.metadata.manufacturer}
                        onChange={handleInputChange}
                        placeholder="e.g., Pfizer"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Side Effects
                    </label>
                    <textarea
                      name="metadata.sideEffects"
                      value={formData.metadata.sideEffects}
                      onChange={handleInputChange}
                      placeholder="List common side effects..."
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contraindications
                    </label>
                    <textarea
                      name="metadata.contraindications"
                      value={formData.metadata.contraindications}
                      onChange={handleInputChange}
                      placeholder="List contraindications and warnings..."
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      name="metadata.requiresPrescription"
                      checked={formData.metadata.requiresPrescription}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label className="text-sm font-medium text-gray-700">
                      Requires Prescription
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Provider Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Provider Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Provider:</span> {user?.profile?.name}
                </div>
                <div>
                  <span className="font-medium">Role:</span> {user?.profile?.role}
                </div>
                {user?.profile?.organization && (
                  <div>
                    <span className="font-medium">Organization:</span> {user.profile.organization}
                  </div>
                )}
                {user?.profile?.licenseNumber && (
                  <div>
                    <span className="font-medium">License:</span> {user.profile.licenseNumber}
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end space-x-4">
              <Link
                href="/services"
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <span className="material-icons text-lg">add</span>
                <span>{isSubmitting ? 'Creating...' : 'Create Service'}</span>
              </button>
            </div>
          </form>

          {/* Info Panel */}
          <div className="mt-6 bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">About Service Creation</h3>
            <p className="text-blue-800 text-sm mb-3">
              Services you create can be prescribed to patients through consultation forums. Once added to a forum,
              doctors can add services to patient carts with proper dosage and frequency instructions.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-white p-3 rounded border">
                <div className="font-medium text-blue-800 mb-1">📋 Policy-Linked</div>
                <div className="text-gray-600">Services respect policy governance rules</div>
              </div>
              <div className="bg-white p-3 rounded border">
                <div className="font-medium text-blue-800 mb-1">💬 Forum-Integrated</div>
                <div className="text-gray-600">Prescribe through consultation forums</div>
              </div>
              <div className="bg-white p-3 rounded border">
                <div className="font-medium text-blue-800 mb-1">🔒 Permission-Based</div>
                <div className="text-gray-600">Only authorized providers can add</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
