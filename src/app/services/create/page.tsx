'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { doc, setDoc, updateDoc, arrayUnion, collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Navigation from '@/components/Navigation';

interface ServiceFormData {
  serviceName: string;
  description: string;
  serviceType: 'api' | 'data' | 'product' | 'service';
  category: string;
  selectedPolicies: string[];

  // Product-specific fields
  price?: string;
  currency?: string;
  stock?: string;
  unit?: string;
  productType?: 'physical' | 'subscription';
  subscriptionFrequency?: string;

  // API-specific fields
  apiEndpoint?: string;
  apiMethods?: string[];
  authenticationType?: string;
  requestSchema?: string;
  responseSchema?: string;

  // Data-specific fields
  dataSourceType?: string;
  dataEndpoint?: string;
  dataFormat?: string;
  updateFrequency?: string;

  // Service (professional)-specific fields
  hourlyRate?: string;
  availability?: string;
  qualifications?: string;

  metadata: {
    dosageForm?: string;
    strength?: string;
    manufacturer?: string;
    requiresPrescription?: boolean;
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
    serviceType: 'product',
    category: 'general',
    selectedPolicies: [],
    price: '',
    currency: 'NZD',
    stock: '',
    unit: 'units',
    productType: 'physical',
    apiMethods: [],
    metadata: {
      requiresPrescription: false
    }
  });

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    try {
      setLoadingPolicies(true);
      setPolicyError(null);

      // Fetch policies from Firestore
      const policiesRef = collection(db, 'policies');
      const policiesQuery = query(policiesRef, orderBy('created_at', 'desc'));
      const snapshot = await getDocs(policiesQuery);

      const policiesArray: Policy[] = snapshot.docs.map(doc => ({
        id: doc.id,
        title: doc.data().name || doc.data().title || 'Untitled Policy',
        description: doc.data().description || '',
        category: doc.data().category || 'General',
        status: doc.data().status || 'draft',
        createdAt: doc.data().created_at?.toDate?.()?.toISOString() || doc.data().createdAt || new Date().toISOString()
      }));

      setPolicies(policiesArray);
    } catch (error) {
      const errorMsg = 'Unable to fetch policies. Please check your connection.';
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
      const metadataKey = name.split('.')[1] as string;
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

  const handleMethodToggle = (method: string) => {
    setFormData(prev => ({
      ...prev,
      apiMethods: prev.apiMethods?.includes(method)
        ? prev.apiMethods.filter(m => m !== method)
        : [...(prev.apiMethods || []), method]
    }));
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

    // Service type-specific validation
    if (formData.serviceType === 'product') {
      if (!formData.price || parseFloat(formData.price) < 0) {
        setError('Valid price is required for products');
        return false;
      }
      if (!formData.stock || parseInt(formData.stock) < 0) {
        setError('Valid stock quantity is required for products');
        return false;
      }
    } else if (formData.serviceType === 'api') {
      if (!formData.apiEndpoint?.trim()) {
        setError('API endpoint is required');
        return false;
      }
      if (!formData.apiMethods || formData.apiMethods.length === 0) {
        setError('At least one HTTP method is required');
        return false;
      }
    } else if (formData.serviceType === 'data') {
      if (!formData.dataEndpoint?.trim()) {
        setError('Data endpoint is required');
        return false;
      }
      if (!formData.dataFormat?.trim()) {
        setError('Data format is required');
        return false;
      }
    } else if (formData.serviceType === 'service') {
      if (!formData.hourlyRate || parseFloat(formData.hourlyRate) < 0) {
        setError('Valid hourly rate is required');
        return false;
      }
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

      const serviceData: any = {
        id: serviceId,
        serviceName: formData.serviceName,
        description: formData.description,
        serviceType: formData.serviceType,
        category: formData.category,
        provider: user.profile?.name || 'Unknown',
        providerId: user.uid,
        providerRole: user.profile?.role || 'service-provider',
        providerOrganization: user.profile?.organization || '',
        policies: formData.selectedPolicies,
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: user.uid
      };

      // Add service type-specific fields
      if (formData.serviceType === 'product') {
        serviceData.price = parseFloat(formData.price!);
        serviceData.currency = formData.currency;
        serviceData.stock = parseInt(formData.stock!);
        serviceData.unit = formData.unit;
        serviceData.productType = formData.productType;
        if (formData.productType === 'subscription') {
          serviceData.subscriptionFrequency = formData.subscriptionFrequency;
        }
        serviceData.metadata = formData.metadata;
      } else if (formData.serviceType === 'api') {
        serviceData.apiEndpoint = formData.apiEndpoint;
        serviceData.apiMethods = formData.apiMethods;
        serviceData.authenticationType = formData.authenticationType;
        serviceData.requestSchema = formData.requestSchema;
        serviceData.responseSchema = formData.responseSchema;
      } else if (formData.serviceType === 'data') {
        serviceData.dataSourceType = formData.dataSourceType;
        serviceData.dataEndpoint = formData.dataEndpoint;
        serviceData.dataFormat = formData.dataFormat;
        serviceData.updateFrequency = formData.updateFrequency;
      } else if (formData.serviceType === 'service') {
        serviceData.hourlyRate = parseFloat(formData.hourlyRate!);
        serviceData.currency = formData.currency;
        serviceData.availability = formData.availability;
        serviceData.qualifications = formData.qualifications;
      }

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

  const serviceTypes = [
    {
      value: 'api',
      label: 'API',
      icon: '⚡',
      description: 'Function or process stream endpoint'
    },
    {
      value: 'data',
      label: 'Data',
      icon: '📊',
      description: 'Data stream or dataset'
    },
    {
      value: 'product',
      label: 'Product',
      icon: '📦',
      description: 'Physical or subscription product'
    },
    {
      value: 'service',
      label: 'Service',
      icon: '👨‍💼',
      description: 'Professional service (e.g., Doctor, Plumber, Consultant)'
    }
  ];

  const productCategories = [
    { value: 'general', label: 'General Product' },
    { value: 'medication', label: 'Medication' },
    { value: 'food', label: 'Food & Beverage' },
    { value: 'equipment', label: 'Equipment' },
    { value: 'supplies', label: 'Supplies' }
  ];

  const serviceCategories = [
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'dental', label: 'Dental' },
    { value: 'mental-health', label: 'Mental Health' },
    { value: 'consultation', label: 'Consultation' },
    { value: 'technical', label: 'Technical' },
    { value: 'trade', label: 'Trade' }
  ];

  const units = [
    'units', 'tablets', 'capsules', 'ml', 'mg', 'g', 'kg', 'doses', 'sessions', 'tests', 'scans'
  ];

  const httpMethods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

  const authTypes = [
    { value: 'none', label: 'None (Public)' },
    { value: 'api-key', label: 'API Key' },
    { value: 'oauth', label: 'OAuth 2.0' },
    { value: 'jwt', label: 'JWT Bearer Token' },
    { value: 'basic', label: 'Basic Auth' }
  ];

  const dataFormats = [
    { value: 'json', label: 'JSON' },
    { value: 'csv', label: 'CSV' },
    { value: 'xml', label: 'XML' },
    { value: 'parquet', label: 'Parquet' },
    { value: 'avro', label: 'Avro' }
  ];

  const updateFrequencies = [
    { value: 'realtime', label: 'Real-time' },
    { value: 'minute', label: 'Every Minute' },
    { value: 'hourly', label: 'Hourly' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'static', label: 'Static (No Updates)' }
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
              Create a new service that can be made available to stakeholders through forums and policy workflows.
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
            {/* Service Type Selection */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Service Type</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {serviceTypes.map((type) => (
                  <div
                    key={type.value}
                    onClick={() => setFormData(prev => ({ ...prev, serviceType: type.value as any }))}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      formData.serviceType === type.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="text-3xl mb-2">{type.icon}</div>
                    <h3 className="font-semibold text-gray-900 mb-1">{type.label}</h3>
                    <p className="text-xs text-gray-600">{type.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Basic Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {formData.serviceType === 'api' ? 'API Name' :
                     formData.serviceType === 'data' ? 'Data Source Name' :
                     formData.serviceType === 'product' ? 'Product Name' : 'Service Name'} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="serviceName"
                    value={formData.serviceName}
                    onChange={handleInputChange}
                    placeholder={
                      formData.serviceType === 'api' ? 'e.g., Payment Processing API' :
                      formData.serviceType === 'data' ? 'e.g., Customer Analytics Dataset' :
                      formData.serviceType === 'product' ? 'e.g., Amoxicillin 500mg' :
                      'e.g., Medical Consultation'
                    }
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
                    placeholder={
                      formData.serviceType === 'api' ? 'Describe the API functionality, endpoints, and use cases...' :
                      formData.serviceType === 'data' ? 'Describe the data source, contents, and update schedule...' :
                      formData.serviceType === 'product' ? 'Describe the product, its uses, and important information...' :
                      'Describe the professional service, expertise, and deliverables...'
                    }
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                {(formData.serviceType === 'product' || formData.serviceType === 'service') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {(formData.serviceType === 'product' ? productCategories : serviceCategories).map(cat => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* API-Specific Fields */}
            {formData.serviceType === 'api' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">API Details</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      API Endpoint URL <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="url"
                      name="apiEndpoint"
                      value={formData.apiEndpoint || ''}
                      onChange={handleInputChange}
                      placeholder="https://api.example.com/v1/endpoint"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      HTTP Methods <span className="text-red-500">*</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {httpMethods.map((method) => (
                        <button
                          key={method}
                          type="button"
                          onClick={() => handleMethodToggle(method)}
                          className={`px-4 py-2 rounded-lg border-2 transition-all ${
                            formData.apiMethods?.includes(method)
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {method}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Authentication Type
                    </label>
                    <select
                      name="authenticationType"
                      value={formData.authenticationType || 'none'}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {authTypes.map((auth) => (
                        <option key={auth.value} value={auth.value}>
                          {auth.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Request Schema (JSON)
                    </label>
                    <textarea
                      name="requestSchema"
                      value={formData.requestSchema || ''}
                      onChange={handleInputChange}
                      placeholder='{"field": "type", ...}'
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Response Schema (JSON)
                    </label>
                    <textarea
                      name="responseSchema"
                      value={formData.responseSchema || ''}
                      onChange={handleInputChange}
                      placeholder='{"result": "type", ...}'
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Data-Specific Fields */}
            {formData.serviceType === 'data' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Data Source Details</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Data Source Type
                    </label>
                    <input
                      type="text"
                      name="dataSourceType"
                      value={formData.dataSourceType || ''}
                      onChange={handleInputChange}
                      placeholder="e.g., Database, API, File Storage, Stream"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Data Endpoint URL <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="url"
                      name="dataEndpoint"
                      value={formData.dataEndpoint || ''}
                      onChange={handleInputChange}
                      placeholder="https://data.example.com/dataset"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Data Format <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="dataFormat"
                        value={formData.dataFormat || 'json'}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        {dataFormats.map((format) => (
                          <option key={format.value} value={format.value}>
                            {format.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Update Frequency
                      </label>
                      <select
                        name="updateFrequency"
                        value={formData.updateFrequency || 'daily'}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {updateFrequencies.map((freq) => (
                          <option key={freq.value} value={freq.value}>
                            {freq.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Product-Specific Fields */}
            {formData.serviceType === 'product' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Product Details</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Type
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, productType: 'physical' }))}
                        className={`py-3 px-4 rounded-lg border-2 transition-all ${
                          formData.productType === 'physical'
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-2xl mb-1">📦</div>
                        <div className="font-medium">Physical</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, productType: 'subscription' }))}
                        className={`py-3 px-4 rounded-lg border-2 transition-all ${
                          formData.productType === 'subscription'
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-2xl mb-1">🔄</div>
                        <div className="font-medium">Subscription</div>
                      </button>
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
                        value={formData.price || ''}
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
                        value={formData.currency || 'NZD'}
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
                        Stock <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="stock"
                        value={formData.stock || ''}
                        onChange={handleInputChange}
                        placeholder="0"
                        min="0"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Unit Type
                    </label>
                    <select
                      name="unit"
                      value={formData.unit || 'units'}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {units.map(unit => (
                        <option key={unit} value={unit}>{unit}</option>
                      ))}
                    </select>
                  </div>

                  {formData.productType === 'subscription' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subscription Frequency
                      </label>
                      <select
                        name="subscriptionFrequency"
                        value={formData.subscriptionFrequency || 'monthly'}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="quarterly">Quarterly</option>
                        <option value="yearly">Yearly</option>
                      </select>
                    </div>
                  )}

                  {formData.category === 'medication' && (
                    <div className="border-t pt-4 mt-4">
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Medication Information</h3>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Dosage Form
                            </label>
                            <input
                              type="text"
                              name="metadata.dosageForm"
                              value={formData.metadata.dosageForm || ''}
                              onChange={handleInputChange}
                              placeholder="e.g., Tablet, Capsule"
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
                              value={formData.metadata.strength || ''}
                              onChange={handleInputChange}
                              placeholder="e.g., 500mg"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Service (Professional)-Specific Fields */}
            {formData.serviceType === 'service' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Professional Service Details</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Hourly Rate <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="hourlyRate"
                        value={formData.hourlyRate || ''}
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
                        value={formData.currency || 'NZD'}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="NZD">NZD</option>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Availability
                    </label>
                    <input
                      type="text"
                      name="availability"
                      value={formData.availability || ''}
                      onChange={handleInputChange}
                      placeholder="e.g., Mon-Fri 9am-5pm, Weekends by appointment"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Qualifications & Certifications
                    </label>
                    <textarea
                      name="qualifications"
                      value={formData.qualifications || ''}
                      onChange={handleInputChange}
                      placeholder="List relevant qualifications, certifications, and experience..."
                      rows={4}
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
              Services you create can be made available to stakeholders through forums. Once added to a forum,
              authorized users can add services with appropriate delivery instructions and requirements.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-white p-3 rounded border">
                <div className="font-medium text-blue-800 mb-1">📋 Policy-Linked</div>
                <div className="text-gray-600">Services respect policy governance rules</div>
              </div>
              <div className="bg-white p-3 rounded border">
                <div className="font-medium text-blue-800 mb-1">💬 Forum-Integrated</div>
                <div className="text-gray-600">Available through forums and workflows</div>
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
