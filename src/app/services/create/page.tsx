'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { doc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Navigation from '@/components/Navigation';

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loadingPolicies, setLoadingPolicies] = useState(true);
  const [policyError, setPolicyError] = useState<string | null>(null);
  const { user } = useAuth();
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

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    try {
      setLoadingPolicies(true);
      setPolicyError(null);
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
        const errorMsg = response.status === 403
          ? 'Access denied. Please deploy Firebase database rules to enable policy access.'
          : `Failed to fetch policies (Status: ${response.status})`;
        console.error(errorMsg);
        setPolicyError(errorMsg);
        setPolicies([]);
      }
    } catch (error) {
      const errorMsg = 'Unable to connect to policy database. Please check your connection.';
      console.error('Error fetching policies:', error);
      setPolicyError(errorMsg);
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

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <>
      <Navigation />
      <main className="ml-16 pt-16 p-6 min-h-screen bg-gray-50">
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

              {policyError && (
                <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <span className="material-icons text-yellow-600 mt-0.5">warning</span>
                    <div className="flex-1">
                      <p className="text-yellow-800 font-medium mb-1">Unable to load policies</p>
                      <p className="text-yellow-700 text-sm mb-3">{policyError}</p>
                      <button
                        onClick={fetchPolicies}
                        className="text-sm text-yellow-800 hover:text-yellow-900 font-medium underline"
                      >
                        Try again
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {loadingPolicies ? (
                <div className="space-y-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="border border-gray-200 rounded-lg p-4 animate-pulse">
                      <div className="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  ))}
                </div>
              ) : policies.length === 0 && !policyError ? (
                <div className="border border-gray-200 rounded-lg p-6 text-center">
                  <span className="material-icons text-gray-400 text-4xl mb-2">account_balance</span>
                  <p className="text-gray-600">No policies available. Create a policy first to link it to this service.</p>
                </div>
              ) : policies.length === 0 ? (
                <div className="border border-gray-200 rounded-lg p-6 text-center">
                  <span className="material-icons text-gray-400 text-4xl mb-2">info</span>
                  <p className="text-gray-600 mb-2">You can still create a service without linking policies.</p>
                  <p className="text-gray-500 text-sm">Policies can be added later once they are available.</p>
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
        </div>
      </main>
    </>
  );
}
