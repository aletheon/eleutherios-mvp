// app/forums/components/DomainServiceStatus.tsx

'use client';

import React from 'react';

interface DomainServiceStatusProps {
  forumId: string;
  activeDomains?: string[];
}

const detectServiceDomain = (serviceName: string): string => {
  const domainMap: Record<string, string> = {
    healthcare: '🏥',
    housing: '🏠', 
    food: '🍽️',
    education: '🎓',
    utilities: '⚡',
    transport: '🚌',
  };

  const serviceLower = serviceName.toLowerCase();
  for (const [domain, icon] of Object.entries(domainMap)) {
    if (serviceLower.includes(domain)) {
      return icon;
    }
  }
  return '⚙️'; // general service
};

const getDomainIcon = (domain: string): string => {
  const iconMap: Record<string, string> = {
    healthcare: '🏥',
    housing: '🏠',
    food: '🍽️', 
    education: '🎓',
    utilities: '⚡',
    transport: '🚌',
    general: '⚙️'
  };
  
  return iconMap[domain] || '⚙️';
};

const getServiceIcon = (serviceName: string): string => {
  const serviceIcons: Record<string, string> = {
    'GPBooking': '📅',
    'Consultation': '👩‍⚕️', 
    'Prescription': '💊',
    'Specialist': '🩺',
    'Payment': '💳'
  };
  
  return serviceIcons[serviceName] || detectServiceDomain(serviceName);
};

export default function DomainServiceStatus({ forumId, activeDomains = [] }: DomainServiceStatusProps) {
  const handleCreateService = async () => {
    console.log('Service creation triggered', { forumId });
    // Service creation logic would go here
    try {
      // Placeholder for service creation
      console.log('Service creation modal would open here');
    } catch (error) {
      console.error('Service creation failed:', error);
    } finally {
      // Reset loading state if needed
    }
  };

  const serviceConfig = {
    category: 'healthcare',
    providerName: 'Local GP Practice',
    serviceRadius: 10
  };

  return (
    <div className="bg-white rounded-lg border p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Service Status</h3>
        <button
          onClick={handleCreateService}
          className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
        >
          Add Service
        </button>
      </div>

      <div className="space-y-3">
        {activeDomains.length > 0 ? (
          activeDomains.map((domain) => (
            <div 
              key={domain}
              className="flex items-center justify-between p-2 bg-gray-50 rounded"
            >
              <div className="flex items-center space-x-2">
                <span className="text-lg">{getDomainIcon(domain)}</span>
                <span className="text-sm font-medium text-gray-700 capitalize">
                  {domain}
                </span>
              </div>
              <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                Active
              </span>
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-gray-500">
            <div className="text-2xl mb-2">⚙️</div>
            <p className="text-sm">No active services</p>
            <p className="text-xs text-gray-400 mt-1">
              Services will appear here as they're activated
            </p>
          </div>
        )}
      </div>

      {/* Sample approved services */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Sample Services:</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-2 bg-green-50 rounded">
            <div className="flex items-center space-x-2">
              <span className="text-sm">{getServiceIcon('GPBooking')}</span>
              <span className="text-xs text-gray-700">GP Booking</span>
            </div>
            <span className="text-xs text-green-600">✓ Approved</span>
          </div>
          
          <div className="flex items-center justify-between p-2 bg-green-50 rounded">
            <div className="flex items-center space-x-2">
              <span className="text-sm">{getServiceIcon('Payment')}</span>
              <span className="text-xs text-gray-700">Payment Processing</span>
            </div>
            <span className="text-xs text-green-600">✓ Approved</span>
          </div>
        </div>
      </div>
    </div>
  );
}