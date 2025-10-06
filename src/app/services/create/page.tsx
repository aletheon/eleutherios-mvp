'use client';

import React, { useState } from 'react';

interface ServiceCreationProps {
  forumId: string;
  onServiceCreated?: (service: MarketplaceService) => void;
}

interface ServiceLocation {
  address?: string;
  coordinates?: { lat: number; lng: number };
}

interface ServiceAvailability {
  maxOrders?: number;
}

interface ServiceConfig {
  category: string;
  providerName: string;
  location?: ServiceLocation;
  serviceRadius: number;
  availability?: ServiceAvailability;
  isPublic: boolean;
}

interface MarketplaceService {
  name: string;
  category: string;
  providerName: string;
  location?: ServiceLocation;
  serviceRadius: number;
  regions?: string[];
  availability?: ServiceAvailability;
  isPublic: boolean;
}

export default function ServiceCreation({ forumId, onServiceCreated }: ServiceCreationProps) {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [serviceConfig, setServiceConfig] = useState<ServiceConfig>({
    category: '',
    providerName: '',
    serviceRadius: 10,
    isPublic: false
  });

  const handleCreateService = async (): Promise<void> => {
    if (!serviceConfig.category || !serviceConfig.providerName) {
      console.log('Missing required fields');
      return;
    }

    setIsCreating(true);

    try {
      const service: MarketplaceService = {
        name: serviceConfig.providerName,
        category: serviceConfig.category,
        providerName: serviceConfig.providerName,
        location: serviceConfig.location || undefined,
        serviceRadius: serviceConfig.serviceRadius,
        regions: serviceConfig.location?.address ? [serviceConfig.location.address] : undefined,
        availability: serviceConfig.availability || undefined,
        isPublic: serviceConfig.isPublic
      };

      console.log('Service creation:', service);
      if (onServiceCreated) {
        onServiceCreated(service);
      }
      setShowForm(false);
      
      // Reset form
      setServiceConfig({
        category: '',
        providerName: '',
        serviceRadius: 10,
        isPublic: false
      });

    } catch (error) {
      console.error('Service creation failed:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleInputChange = (field: keyof ServiceConfig, value: string | number | boolean | ServiceLocation | ServiceAvailability): void => {
    setServiceConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
      >
        + Add New Service
      </button>
    );
  }

  return (
    <div className="bg-white border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Create Service</h3>
        <button
          onClick={() => setShowForm(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Service Category
          </label>
          <select
            value={serviceConfig.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select category</option>
            <option value="healthcare">Healthcare</option>
            <option value="housing">Housing</option>
            <option value="food">Food</option>
            <option value="transport">Transport</option>
            <option value="education">Education</option>
            <option value="utilities">Utilities</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Provider Name
          </label>
          <input
            type="text"
            value={serviceConfig.providerName}
            onChange={(e) => handleInputChange('providerName', e.target.value)}
            placeholder="e.g. Local GP Practice"
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Service Radius (km)
          </label>
          <input
            type="number"
            value={serviceConfig.serviceRadius}
            onChange={(e) => handleInputChange('serviceRadius', parseInt(e.target.value) || 10)}
            min="1"
            max="100"
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={serviceConfig.isPublic}
              onChange={(e) => handleInputChange('isPublic', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Make service publicly discoverable</span>
          </label>
        </div>

        <div className="flex space-x-3 pt-4">
          <button
            onClick={handleCreateService}
            disabled={isCreating || !serviceConfig.category || !serviceConfig.providerName}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isCreating ? 'Creating...' : 'Create Service'}
          </button>
          <button
            onClick={() => setShowForm(false)}
            className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}