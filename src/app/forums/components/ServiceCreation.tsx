// app/forums/components/ServiceCreation.tsx
'use client';

import React, { useState } from 'react';
import { MarketplaceServiceEngine } from '@/lib/marketplace/serviceEngine';
import { useAuth } from '@/lib/auth';

interface ServiceCreationProps {
  forumId: string;
  onServiceCreated?: (service: any) => void;
}

export default function ServiceCreation({ forumId, onServiceCreated }: ServiceCreationProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const { user } = useAuth();

  // Basic service details
  const [serviceName, setServiceName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState('NZD');
  const [category, setCategory] = useState('general');

  // Location settings
  const [hasLocation, setHasLocation] = useState(false);
  const [serviceAddress, setServiceAddress] = useState('');
  const [serviceRadius, setServiceRadius] = useState('');
  const [serviceRegions, setServiceRegions] = useState('');

  // Validation rules
  const [validationRules, setValidationRules] = useState<string[]>([]);
  const [newRule, setNewRule] = useState('');

  // Availability settings
  const [isPublic, setIsPublic] = useState(true);
  const [maxOrders, setMaxOrders] = useState('');

  const handleCreateService = async () => {
    if (!serviceName || !price) return;

    setIsCreating(true);
    try {
      const serviceConfig = {
        category,
        providerName: user?.displayName || 'Service Provider',
        location: hasLocation ? {
          address: serviceAddress,
          serviceRadius: serviceRadius ? parseFloat(serviceRadius) : undefined,
          regions: serviceRegions ? serviceRegions.split(',').map(r => r.trim()) : undefined
        } : undefined,
        availability: {
          maxOrders: maxOrders ? parseInt(maxOrders) : undefined
        },
        isPublic
      };

      const service = await MarketplaceServiceEngine.createService(
        serviceName,
        description,
        parseFloat(price),
        currency,
        user!.uid,
        forumId,
        validationRules,
        serviceConfig
      );

      onServiceCreated?.(service);
      setShowForm(false);
      resetForm();
    } catch (error) {
      console.error('Service creation failed:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const resetForm = () => {
    setServiceName('');
    setDescription('');
    setPrice('');
    setValidationRules([]);
    setServiceAddress('');
    setServiceRadius('');
    setServiceRegions('');
    setMaxOrders('');
  };

  const addValidationRule = () => {
    if (newRule.trim()) {
      setValidationRules([...validationRules, newRule.trim()]);
      setNewRule('');
    }
  };

  const removeValidationRule = (index: number) => {
    setValidationRules(validationRules.filter((_, i) => i !== index));
  };

  const addPredefinedRule = (rule: string) => {
    if (!validationRules.includes(rule)) {
      setValidationRules([...validationRules, rule]);
    }
  };

  if (!showForm) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">Create Marketplace Service</h3>
        <p className="text-sm text-blue-600 mb-3">
          Offer goods or services that others can purchase through EleuScript rules
        </p>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create Service
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Create New Service</h3>
        <button
          onClick={() => setShowForm(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      <div className="space-y-4">
        {/* Basic Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Service Name *
            </label>
            <input
              type="text"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              placeholder="e.g., Milkman, Coffee Delivery, Lawn Mowing"
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            >
              <option value="general">General</option>
              <option value="food">Food & Beverages</option>
              <option value="transport">Transport</option>
              <option value="utilities">Utilities</option>
              <option value="healthcare">Healthcare</option>
              <option value="education">Education</option>
              <option value="housing">Housing</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your service..."
            rows={3}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Pricing */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price *
            </label>
            <input
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="1.00"
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Currency
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            >
              <option value="NZD">NZD</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
          </div>
        </div>

        {/* Location Settings */}
        <div>
          <label className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              checked={hasLocation}
              onChange={(e) => setHasLocation(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm font-medium text-gray-700">
              Location-based service
            </span>
          </label>

          {hasLocation && (
            <div className="ml-6 space-y-3 border-l border-gray-200 pl-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Service Address
                </label>
                <input
                  type="text"
                  value={serviceAddress}
                  onChange={(e) => setServiceAddress(e.target.value)}
                  placeholder="Your business address"
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Service Radius (km)
                  </label>
                  <input
                    type="number"
                    value={serviceRadius}
                    onChange={(e) => setServiceRadius(e.target.value)}
                    placeholder="10"
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Service Regions
                  </label>
                  <input
                    type="text"
                    value={serviceRegions}
                    onChange={(e) => setServiceRegions(e.target.value)}
                    placeholder="Auckland, Wellington"
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Validation Rules */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Purchase Validation Rules
          </label>
          
          {/* Predefined Rules */}
          <div className="mb-3">
            <p className="text-xs text-gray-600 mb-2">Quick add common rules:</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => addPredefinedRule('rule acceptable_location -> Service("isLocationValid", $customer.location)')}
                className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded"
              >
                Location Check
              </button>
              <button
                onClick={() => addPredefinedRule('rule price_check -> Service("validatePrice", $customer.offer)')}
                className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded"
              >
                Price Validation
              </button>
              <button
                onClick={() => addPredefinedRule('rule availability_check -> Service("checkAvailability")')}
                className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded"
              >
                Availability Check
              </button>
            </div>
          </div>

          {/* Custom Rule Input */}
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newRule}
              onChange={(e) => setNewRule(e.target.value)}
              placeholder="rule custom_validation -> Service('MyValidator', $customer.data)"
              className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            />
            <button
              onClick={addValidationRule}
              className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700"
            >
              Add
            </button>
          </div>

          {/* Current Rules */}
          {validationRules.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-gray-600">Current validation rules:</p>
              {validationRules.map((rule, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <code className="text-xs font-mono flex-1">{rule}</code>
                  <button
                    onClick={() => removeValidationRule(index)}
                    className="text-red-600 hover:text-red-800 ml-2"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Availability Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Concurrent Orders
            </label>
            <input
              type="number"
              value={maxOrders}
              onChange={(e) => setMaxOrders(e.target.value)}
              placeholder="Leave empty for unlimited"
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm font-medium text-gray-700">
                Public service (discoverable outside this forum)
              </span>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            onClick={() => setShowForm(false)}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateService}
            disabled={isCreating || !serviceName || !price}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isCreating ? 'Creating...' : 'Create Service'}
          </button>
        </div>
      </div>

      {/* Preview */}
      {serviceName && price && (
        <div className="mt-6 p-4 bg-gray-50 rounded border">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Purchase Preview</h4>
          <p className="text-xs text-gray-600 mb-2">
            Customers will type rules like this to purchase your service:
          </p>
          <code className="block bg-white p-2 rounded border text-sm font-mono">
            rule pay -&gt; Service("{serviceName}", ${price})
          </code>
        </div>
      )}
    </div>
  );
}