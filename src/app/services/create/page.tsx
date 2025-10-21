'use client';

import React, { useState } from 'react';

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
      </div>
    </div>
  );
}