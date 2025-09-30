// src/app/services/create/page.tsx
'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/Navigation';

type ServiceType = 'personal' | 'organization' | 'government' | 'subscription' | 'product' | 'api' | 'iot' | 'ai';

interface ServiceAttributes {
  // Product attributes
  weight?: string;
  size?: string;
  color?: string;
  materials?: string;
  purpose?: string;
  warranty?: string;
  guarantee?: string;
  
  // API attributes
  username?: string;
  password?: string;
  apiUrl?: string;
  parameters?: string[];
  
  // Subscription attributes
  startDate?: string;
  endDate?: string;
  isOngoing?: boolean;
  
  // Pricing
  price?: number;
  currency?: string;
  billingCycle?: 'one-time' | 'daily' | 'weekly' | 'monthly' | 'yearly';
}

export default function CreateServicePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<ServiceType>('personal');
  const [attributes, setAttributes] = useState<ServiceAttributes>({});
  const [creating, setCreating] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string>('details');

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? '' : section);
  };

  const updateAttribute = (key: keyof ServiceAttributes, value: any) => {
    setAttributes(prev => ({ ...prev, [key]: value }));
  };

  const requiresPricing = () => {
    return ['subscription', 'product', 'api'].includes(type);
  };

  const createService = async () => {
    if (!name.trim() || !user) return;

    setCreating(true);
    try {
      const token = await user.getIdToken();
      const serviceId = Date.now().toString();
      const service = {
        id: serviceId,
        name,
        description,
        type,
        attributes,
        ownerId: user.uid,
        createdAt: new Date().toISOString(),
      };

      const response = await fetch(
        `https://eleutherios-mvp-3c717-default-rtdb.asia-southeast1.firebasedatabase.app/services/${serviceId}.json?auth=${token}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(service),
        }
      );

      if (response.ok) {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error creating service:', error);
      alert('Failed to create service');
    } finally {
      setCreating(false);
    }
  };

  const renderTypeSpecificFields = () => {
    switch (type) {
      case 'product':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Weight</label>
                <input
                  type="text"
                  value={attributes.weight || ''}
                  onChange={(e) => updateAttribute('weight', e.target.value)}
                  placeholder="e.g., 1000kg"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
                <input
                  type="text"
                  value={attributes.size || ''}
                  onChange={(e) => updateAttribute('size', e.target.value)}
                  placeholder="e.g., 10x20x30cm"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
              <input
                type="text"
                value={attributes.color || ''}
                onChange={(e) => updateAttribute('color', e.target.value)}
                placeholder="e.g., Red"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Materials</label>
              <input
                type="text"
                value={attributes.materials || ''}
                onChange={(e) => updateAttribute('materials', e.target.value)}
                placeholder="e.g., Organic cotton"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Purpose</label>
              <input
                type="text"
                value={attributes.purpose || ''}
                onChange={(e) => updateAttribute('purpose', e.target.value)}
                placeholder="What is this product for?"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Warranty</label>
              <input
                type="text"
                value={attributes.warranty || ''}
                onChange={(e) => updateAttribute('warranty', e.target.value)}
                placeholder="e.g., 2 years"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Guarantee</label>
              <input
                type="text"
                value={attributes.guarantee || ''}
                onChange={(e) => updateAttribute('guarantee', e.target.value)}
                placeholder="Money-back guarantee details"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        );

      case 'api':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">API URL</label>
              <input
                type="text"
                value={attributes.apiUrl || ''}
                onChange={(e) => updateAttribute('apiUrl', e.target.value)}
                placeholder="https://api.example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
              <input
                type="text"
                value={attributes.username || ''}
                onChange={(e) => updateAttribute('username', e.target.value)}
                placeholder="API username"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={attributes.password || ''}
                onChange={(e) => updateAttribute('password', e.target.value)}
                placeholder="API password or key"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Parameters (one per line)</label>
              <textarea
                value={attributes.parameters?.join('\n') || ''}
                onChange={(e) => updateAttribute('parameters', e.target.value.split('\n').filter(p => p.trim()))}
                placeholder="param1&#10;param2&#10;param3"
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        );

      case 'subscription':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <input
                type="date"
                value={attributes.startDate || ''}
                onChange={(e) => updateAttribute('startDate', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={attributes.isOngoing || false}
                  onChange={(e) => updateAttribute('isOngoing', e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm font-medium text-gray-700">Ongoing (no end date)</span>
              </label>
            </div>
            {!attributes.isOngoing && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                <input
                  type="date"
                  value={attributes.endDate || ''}
                  onChange={(e) => updateAttribute('endDate', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation onMenuClick={() => {}} onActivitiesClick={() => {}} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Create Service</h2>
          <button
            onClick={() => router.push('/dashboard')}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Cancel
          </button>
        </div>

        {/* Details Section */}
        <div className="bg-white rounded-lg shadow mb-4">
          <button
            onClick={() => toggleSection('details')}
            className="w-full px-6 py-4 flex justify-between items-center text-left hover:bg-gray-50"
          >
            <span className="font-semibold text-lg">Details</span>
            <svg
              className={`w-5 h-5 transform transition-transform ${
                expandedSection === 'details' ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {expandedSection === 'details' && (
            <div className="px-6 pb-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Service Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter service name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as ServiceType)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="personal">Personal</option>
                  <option value="organization">Organization</option>
                  <option value="government">Government</option>
                  <option value="subscription">Subscription</option>
                  <option value="product">Product</option>
                  <option value="api">API</option>
                  <option value="iot">IoT</option>
                  <option value="ai">AI</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your service"
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Type-specific fields */}
              {renderTypeSpecificFields()}
            </div>
          )}
        </div>

        {/* Pricing Section - only for certain types */}
        {requiresPricing() && (
          <div className="bg-white rounded-lg shadow mb-4">
            <button
              onClick={() => toggleSection('pricing')}
              className="w-full px-6 py-4 flex justify-between items-center text-left hover:bg-gray-50"
            >
              <span className="font-semibold text-lg">Pricing</span>
              <svg
                className={`w-5 h-5 transform transition-transform ${
                  expandedSection === 'pricing' ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {expandedSection === 'pricing' && (
              <div className="px-6 pb-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                    <input
                      type="number"
                      value={attributes.price || ''}
                      onChange={(e) => updateAttribute('price', parseFloat(e.target.value))}
                      placeholder="0.00"
                      step="0.01"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                    <select
                      value={attributes.currency || 'USD'}
                      onChange={(e) => updateAttribute('currency', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="USD">USD</option>
                      <option value="NZD">NZD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Billing Cycle</label>
                  <select
                    value={attributes.billingCycle || 'one-time'}
                    onChange={(e) => updateAttribute('billingCycle', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="one-time">One-time</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Photo Section */}
        <div className="bg-white rounded-lg shadow mb-4">
          <button
            onClick={() => toggleSection('photo')}
            className="w-full px-6 py-4 flex justify-between items-center text-left hover:bg-gray-50"
          >
            <span className="font-semibold text-lg">Photo</span>
            <svg
              className={`w-5 h-5 transform transition-transform ${
                expandedSection === 'photo' ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {expandedSection === 'photo' && (
            <div className="px-6 pb-6">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="mt-2 text-sm text-gray-600">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>
          )}
        </div>

        {/* Policies Section */}
        <div className="bg-white rounded-lg shadow mb-4">
          <button
            onClick={() => toggleSection('policies')}
            className="w-full px-6 py-4 flex justify-between items-center text-left hover:bg-gray-50"
          >
            <span className="font-semibold text-lg">Policies (0)</span>
            <svg
              className={`w-5 h-5 transform transition-transform ${
                expandedSection === 'policies' ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {expandedSection === 'policies' && (
            <div className="px-6 pb-6">
              <p className="text-sm text-gray-600">No policies linked yet</p>
            </div>
          )}
        </div>

        {/* Forums Section */}
        <div className="bg-white rounded-lg shadow mb-6">
          <button
            onClick={() => toggleSection('forums')}
            className="w-full px-6 py-4 flex justify-between items-center text-left hover:bg-gray-50"
          >
            <span className="font-semibold text-lg">Forums (0)</span>
            <svg
              className={`w-5 h-5 transform transition-transform ${
                expandedSection === 'forums' ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {expandedSection === 'forums' && (
            <div className="px-6 pb-6">
              <p className="text-sm text-gray-600">No forums joined yet</p>
            </div>
          )}
        </div>

        {/* Create Button */}
        <button
          onClick={createService}
          disabled={creating || !name.trim()}
          className="w-full px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 font-medium"
        >
          {creating ? 'Creating...' : 'Create Service'}
        </button>
      </main>
    </div>
  );
}