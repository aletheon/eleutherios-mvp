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
  selectedPolicies: string[];
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

interface Policy {
  id: string;
  title: string;
  description?: string;
  category: string;
  status: string;
  createdAt: string;
}

export default function CreateServicePage() {
  const [isActivitiesExpanded, setIsActivitiesExpanded] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loadingPolicies, setLoadingPolicies] = useState(true);
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
    selectedPolicies: [],
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
    fetchPolicies();
  }, []);

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

  const fetchPolicies = async () => {
    try {
      setLoadingPolicies(true);
      const response = await fetch(
        'https://eleutherios-mvp-3c717-default-rtdb.asia-southeast1.firebasedatabase.app/policies.json'
      );

      if (response.ok) {
        const data = await response.json();
        if (data) {
          const policiesArray: Policy[] = Object.keys(data).map(key => ({
            id: key,
            title: data[key].title || 'Untitled Policy',
            description: data[key].description || '',
            category: data[key].category || 'General',
            status: data[key].status || 'draft',
            createdAt: data[key].createdAt || new Date().toISOString()
          }));

          // Sort by creation date (newest first)
          policiesArray.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setPolicies(policiesArray);
        } else {
          setPolicies([]);
        }
      } else {
        console.error('Failed to fetch policies');
        setPolicies([]);
      }
    } catch (error) {
      console.error('Error fetching policies:', error);
      setPolicies([]);
    } finally {
      setLoadingPolicies(false);
    }
  };

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

  const handlePolicyToggle = (policyId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedPolicies: prev.selectedPolicies.includes(policyId)
        ? prev.selectedPolicies.filter(id => id !== policyId)
        : [...prev.selectedPolicies, policyId]
    }));
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
        policies: formData.selectedPolicies,
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

                </div>
              </div>
            )}

            {/* Policy Consumption */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Policy Consumption</h2>
              <p className="text-sm text-gray-600 mb-4">
                Select one or more policies that stakeholders or end users can consume through this service.
              </p>

              {loadingPolicies ? (
                <div className="space-y-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="border border-gray-200 rounded-lg p-4 animate-pulse">
                      <div className="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  ))}
                </div>
              ) : policies.length === 0 ? (
                <div className="border border-gray-200 rounded-lg p-6 text-center">
                  <span className="material-icons text-gray-400 text-4xl mb-2">account_balance</span>
                  <p className="text-gray-600">No policies available. Create a policy first to link it to this service.</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-80 overflow-y-auto border border-gray-200 rounded-lg p-4">
                  {policies.map((policy) => (
                    <div
                      key={policy.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        formData.selectedPolicies.includes(policy.id)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                      onClick={() => handlePolicyToggle(policy.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          checked={formData.selectedPolicies.includes(policy.id)}
                          onChange={() => handlePolicyToggle(policy.id)}
                          className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-medium text-gray-900">{policy.title}</h3>
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                              {policy.category}
                            </span>
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                              {policy.status}
                            </span>
                          </div>
                          {policy.description && (
                            <p className="text-sm text-gray-600">{policy.description}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {formData.selectedPolicies.length > 0 && (
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <span className="font-medium">{formData.selectedPolicies.length}</span> {formData.selectedPolicies.length === 1 ? 'policy' : 'policies'} selected
                  </p>
                </div>
              )}
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
// Service type definitions
type ServiceType = 'human' | 'ai' | 'api' | 'product';
type VisibilityType = 'public' | 'private' | 'restricted';
type BillingModel = 'one_time' | 'subscription' | 'per_use' | 'per_prescription' | 'free';

interface ServiceLocation {
  address?: string;
  coordinates?: { lat: number; lng: number };
  serviceRadius?: number;
  regions?: string[];
}

interface ServicePricing {
  basePrice: number;
  currency: string;
  billingModel: BillingModel;
  revenueShare?: {
    provider: number;
    platform: number;
    regulation_compliance?: number;
  };
}

interface VisibilityConfig {
  searchableBy: string[];
  viewableBy: string[];
  orderableBy: string[];
  approvableBy?: string[];
}

interface GovernanceRule {
  rule: string;
  condition: string;
  enforced_by: string;
}

interface ComplianceRequirements {
  requiresPrescription?: boolean;
  requiresLicense?: string[];
  ageRestrictions?: string;
  regulatoryApprovals?: string[];
}

interface ServiceFormData {
  // Basic info
  title: string;
  description: string;
  category: string;
  type: ServiceType;
  
  // Visibility & Access
  visibility: VisibilityType;
  visibilityConfig: VisibilityConfig;
  
  // Pricing
  pricing: ServicePricing;
  
  // Type-specific attributes
  attributes: Record<string, any>;
  
  // Location (for human/product services)
  location?: ServiceLocation;
  
  // Governance
  governanceRules: GovernanceRule[];
  complianceRequirements: ComplianceRequirements;
  
  // Provider info
  provider: {
    name: string;
    licenseNumber?: string;
    verified: boolean;
  };
}

interface ServiceCreationProps {
  onServiceCreated?: (service: ServiceFormData) => void;
  onCancel?: () => void;
}

export default function EnhancedServiceCreation({ onServiceCreated, onCancel }: ServiceCreationProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isCreating, setIsCreating] = useState(false);
  
  const [formData, setFormData] = useState<ServiceFormData>({
    title: '',
    description: '',
    category: '',
    type: 'human',
    visibility: 'public',
    visibilityConfig: {
      searchableBy: ['any'],
      viewableBy: ['any'],
      orderableBy: ['any']
    },
    pricing: {
      basePrice: 0,
      currency: 'NZD',
      billingModel: 'free',
      revenueShare: {
        provider: 80,
        platform: 15,
        regulation_compliance: 5
      }
    },
    attributes: {},
    location: {
      address: '',
      serviceRadius: 10
    },
    governanceRules: [],
    complianceRequirements: {},
    provider: {
      name: '',
      verified: false
    }
  });

  // Available roles for visibility configuration
  const availableRoles = [
    'any', 'patient', 'doctor', 'pharmacist', 'nurse', 'caseworker', 
    'housing_officer', 'admin', 'healthcare_provider'
  ];

  // Categories by service type
  const categoriesByType = {
    human: ['healthcare', 'social_services', 'education', 'consulting', 'legal'],
    ai: ['analysis', 'prediction', 'translation', 'generation', 'classification'],
    api: ['payment', 'notification', 'integration', 'data_processing', 'authentication'],
    product: ['medication', 'equipment', 'supplies', 'food', 'housing_materials']
  };

  const updateFormData = (updates: Partial<ServiceFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const updateNestedField = (path: string, value: any) => {
    setFormData(prev => {
      const newData = { ...prev };
      const keys = path.split('.');
      let current: any = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!(keys[i] in current)) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  // Step 1: Basic Information
  const renderBasicInfo = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Service Type *
          </label>
          <select
            value={formData.type}
            onChange={(e) => updateFormData({ 
              type: e.target.value as ServiceType,
              category: '', // Reset category when type changes
              attributes: {} // Reset type-specific attributes
            })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="human">👤 Human Service</option>
            <option value="ai">🤖 AI Service</option>
            <option value="api">🔌 API Service</option>
            <option value="product">📦 Product Service</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">
            {formData.type === 'human' && 'Services provided by people (doctors, consultants, etc.)'}
            {formData.type === 'ai' && 'AI-powered services and analysis tools'}
            {formData.type === 'api' && 'Automated services and integrations'}
            {formData.type === 'product' && 'Physical products and materials'}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <select
            value={formData.category}
            onChange={(e) => updateFormData({ category: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select category</option>
            {categoriesByType[formData.type].map(cat => (
              <option key={cat} value={cat}>{cat.replace('_', ' ').toUpperCase()}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Service Title *
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => updateFormData({ title: e.target.value })}
          placeholder="e.g., Emergency Healthcare Consultation"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description *
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => updateFormData({ description: e.target.value })}
          placeholder="Describe what this service provides and how it works..."
          rows={4}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Provider Name *
        </label>
        <input
          type="text"
          value={formData.provider.name}
          onChange={(e) => updateNestedField('provider.name', e.target.value)}
          placeholder="Your name or organization"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>
  );

  // Step 2: Visibility & Access Control
  const renderVisibilityConfig = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Visibility & Access Control</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Service Visibility *
        </label>
        <div className="space-y-3">
          <label className="flex items-center space-x-3">
            <input
              type="radio"
              value="public"
              checked={formData.visibility === 'public'}
              onChange={(e) => updateFormData({ 
                visibility: e.target.value as VisibilityType,
                visibilityConfig: {
                  searchableBy: ['any'],
                  viewableBy: ['any'],
                  orderableBy: ['any']
                }
              })}
              className="text-blue-600"
            />
            <div>
              <div className="font-medium">Public</div>
              <div className="text-sm text-gray-500">Anyone can find and order this service</div>
            </div>
          </label>
          
          <label className="flex items-center space-x-3">
            <input
              type="radio"
              value="private"
              checked={formData.visibility === 'private'}
              onChange={(e) => updateFormData({ 
                visibility: e.target.value as VisibilityType,
                visibilityConfig: {
                  searchableBy: [],
                  viewableBy: [],
                  orderableBy: []
                }
              })}
              className="text-blue-600"
            />
            <div>
              <div className="font-medium">Private</div>
              <div className="text-sm text-gray-500">Only specific roles can access this service</div>
            </div>
          </label>
          
          <label className="flex items-center space-x-3">
            <input
              type="radio"
              value="restricted"
              checked={formData.visibility === 'restricted'}
              onChange={(e) => updateFormData({ 
                visibility: e.target.value as VisibilityType,
                visibilityConfig: {
                  searchableBy: [],
                  viewableBy: [],
                  orderableBy: []
                }
              })}
              className="text-blue-600"
            />
            <div>
              <div className="font-medium">Restricted</div>
              <div className="text-sm text-gray-500">Role-based access plus additional requirements</div>
            </div>
          </label>
        </div>
      </div>

      {(formData.visibility === 'private' || formData.visibility === 'restricted') && (
        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Who can search for this service?
            </label>
            <div className="grid grid-cols-3 gap-2">
              {availableRoles.map(role => (
                <label key={role} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.visibilityConfig.searchableBy.includes(role)}
                    onChange={(e) => {
                      const current = formData.visibilityConfig.searchableBy;
                      const updated = e.target.checked 
                        ? [...current, role]
                        : current.filter(r => r !== role);
                      updateNestedField('visibilityConfig.searchableBy', updated);
                    }}
                    className="text-blue-600"
                  />
                  <span className="text-sm capitalize">{role.replace('_', ' ')}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Who can order this service?
            </label>
            <div className="grid grid-cols-3 gap-2">
              {availableRoles.map(role => (
                <label key={role} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.visibilityConfig.orderableBy.includes(role)}
                    onChange={(e) => {
                      const current = formData.visibilityConfig.orderableBy;
                      const updated = e.target.checked 
                        ? [...current, role]
                        : current.filter(r => r !== role);
                      updateNestedField('visibilityConfig.orderableBy', updated);
                    }}
                    className="text-blue-600"
                  />
                  <span className="text-sm capitalize">{role.replace('_', ' ')}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Step 3: Pricing & Billing
  const renderPricingConfig = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Pricing & Billing</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Billing Model *
          </label>
          <select
            value={formData.pricing.billingModel}
            onChange={(e) => updateNestedField('pricing.billingModel', e.target.value as BillingModel)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="free">Free</option>
            <option value="one_time">One-time Payment</option>
            <option value="subscription">Subscription</option>
            <option value="per_use">Per Use</option>
            <option value="per_prescription">Per Prescription</option>
          </select>
        </div>

        {formData.pricing.billingModel !== 'free' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price *
            </label>
            <div className="flex">
              <select
                value={formData.pricing.currency}
                onChange={(e) => updateNestedField('pricing.currency', e.target.value)}
                className="w-20 p-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="NZD">NZD</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
              <input
                type="number"
                step="0.01"
                value={formData.pricing.basePrice}
                onChange={(e) => updateNestedField('pricing.basePrice', parseFloat(e.target.value))}
                placeholder="0.00"
                className="flex-1 p-3 border border-l-0 border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        )}
      </div>

      {formData.pricing.billingModel !== 'free' && (
        <div className="p-4 bg-blue-50 rounded-lg">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Revenue Sharing</h4>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <label className="block text-blue-700 mb-1">Provider %</label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.pricing.revenueShare?.provider || 80}
                onChange={(e) => updateNestedField('pricing.revenueShare.provider', parseInt(e.target.value))}
                className="w-full p-2 border border-blue-200 rounded"
              />
            </div>
            <div>
              <label className="block text-blue-700 mb-1">Platform %</label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.pricing.revenueShare?.platform || 15}
                onChange={(e) => updateNestedField('pricing.revenueShare.platform', parseInt(e.target.value))}
                className="w-full p-2 border border-blue-200 rounded"
              />
            </div>
            <div>
              <label className="block text-blue-700 mb-1">Compliance %</label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.pricing.revenueShare?.regulation_compliance || 5}
                onChange={(e) => updateNestedField('pricing.revenueShare.regulation_compliance', parseInt(e.target.value))}
                className="w-full p-2 border border-blue-200 rounded"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Step 4: Type-specific Configuration
  const renderTypeSpecificConfig = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">
        {formData.type.charAt(0).toUpperCase() + formData.type.slice(1)} Service Configuration
      </h3>
      
      {formData.type === 'human' && renderHumanServiceConfig()}
      {formData.type === 'ai' && renderAIServiceConfig()}
      {formData.type === 'api' && renderAPIServiceConfig()}
      {formData.type === 'product' && renderProductServiceConfig()}
    </div>
  );

  const renderHumanServiceConfig = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Professional License Number
        </label>
        <input
          type="text"
          value={formData.provider.licenseNumber || ''}
          onChange={(e) => updateNestedField('provider.licenseNumber', e.target.value)}
          placeholder="e.g., MD12345, RN67890"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Service Location
        </label>
        <input
          type="text"
          value={formData.location?.address || ''}
          onChange={(e) => updateNestedField('location.address', e.target.value)}
          placeholder="Address or general area"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Service Radius (km)
        </label>
        <input
          type="number"
          value={formData.location?.serviceRadius || 10}
          onChange={(e) => updateNestedField('location.serviceRadius', parseInt(e.target.value))}
          min="1"
          max="100"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>
  );

  const renderAIServiceConfig = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          AI Model/Provider
        </label>
        <input
          type="text"
          value={formData.attributes.aiModel || ''}
          onChange={(e) => updateNestedField('attributes.aiModel', e.target.value)}
          placeholder="e.g., GPT-4, Claude, Custom Model"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Processing Time (seconds)
        </label>
        <input
          type="number"
          value={formData.attributes.processingTime || 30}
          onChange={(e) => updateNestedField('attributes.processingTime', parseInt(e.target.value))}
          min="1"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Data Requirements
        </label>
        <textarea
          value={formData.attributes.dataRequirements || ''}
          onChange={(e) => updateNestedField('attributes.dataRequirements', e.target.value)}
          placeholder="What data does this AI service need?"
          rows={3}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>
  );

  const renderAPIServiceConfig = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          API Endpoint
        </label>
        <input
          type="url"
          value={formData.attributes.apiEndpoint || ''}
          onChange={(e) => updateNestedField('attributes.apiEndpoint', e.target.value)}
          placeholder="https://api.example.com/v1/service"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Authentication Method
        </label>
        <select
          value={formData.attributes.authMethod || 'apikey'}
          onChange={(e) => updateNestedField('attributes.authMethod', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="apikey">API Key</option>
          <option value="oauth">OAuth</option>
          <option value="bearer">Bearer Token</option>
          <option value="basic">Basic Auth</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Rate Limit (requests/minute)
        </label>
        <input
          type="number"
          value={formData.attributes.rateLimit || 60}
          onChange={(e) => updateNestedField('attributes.rateLimit', parseInt(e.target.value))}
          min="1"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>
  );

  const renderProductServiceConfig = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            SKU/Product Code
          </label>
          <input
            type="text"
            value={formData.attributes.sku || ''}
            onChange={(e) => updateNestedField('attributes.sku', e.target.value)}
            placeholder="e.g., MED-AMX-500"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quantity Available
          </label>
          <input
            type="number"
            value={formData.attributes.quantity || 1}
            onChange={(e) => updateNestedField('attributes.quantity', parseInt(e.target.value))}
            min="1"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.complianceRequirements.requiresPrescription || false}
            onChange={(e) => updateNestedField('complianceRequirements.requiresPrescription', e.target.checked)}
            className="text-blue-600"
          />
          <span className="text-sm text-gray-700">Requires prescription</span>
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Storage Requirements
        </label>
        <select
          value={formData.attributes.storage || 'room_temperature'}
          onChange={(e) => updateNestedField('attributes.storage', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="room_temperature">Room Temperature</option>
          <option value="refrigerated">Refrigerated (2-8°C)</option>
          <option value="frozen">Frozen (-18°C)</option>
          <option value="controlled_room_temp">Controlled Room Temperature</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Expiry Period (months)
        </label>
        <input
          type="number"
          value={formData.attributes.expiryMonths || 24}
          onChange={(e) => updateNestedField('attributes.expiryMonths', parseInt(e.target.value))}
          min="1"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>
  );

  // Navigation and form submission
  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.title && formData.description && formData.category && formData.provider.name;
      case 2:
        return true; // Visibility config always valid
      case 3:
        return formData.pricing.billingModel === 'free' || formData.pricing.basePrice > 0;
      case 4:
        return true; // Type-specific config can be optional
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    if (!canProceed()) return;
    
    setIsCreating(true);
    try {
      // Here you would save to Firebase/backend
      console.log('Creating service:', formData);
      onServiceCreated?.(formData);
    } catch (error) {
      console.error('Service creation failed:', error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {[1, 2, 3, 4].map(step => (
            <div
              key={step}
              className={`flex items-center ${step < 4 ? 'flex-1' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  ${currentStep >= step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}
              >
                {step}
              </div>
              {step < 4 && (
                <div
                  className={`flex-1 h-1 mx-4 ${
                    currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-4 gap-4 text-xs text-center text-gray-600">
          <div>Basic Info</div>
          <div>Visibility</div>
          <div>Pricing</div>
          <div>Configuration</div>
        </div>
      </div>

      {/* Form content */}
      <div className="min-h-96">
        {currentStep === 1 && renderBasicInfo()}
        {currentStep === 2 && renderVisibilityConfig()}
        {currentStep === 3 && renderPricingConfig()}
        {currentStep === 4 && renderTypeSpecificConfig()}
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between pt-6 border-t">
        <div>
          {currentStep > 1 && (
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Previous
            </button>
          )}
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          
          {currentStep < 4 ? (
            <button
              onClick={() => setCurrentStep(currentStep + 1)}
              disabled={!canProceed()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!canProceed() || isCreating}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isCreating ? 'Creating...' : 'Create Service'}
            </button>
          )}
        </div>
      </main>
    </>
  );
}
