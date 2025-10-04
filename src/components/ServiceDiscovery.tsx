// app/components/ServiceDiscovery.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { MarketplaceService } from '@/lib/marketplace/serviceEngine';

interface ServiceDiscoveryProps {
  forumId?: string; // If provided, show forum-specific services first
  onServiceSelect?: (service: MarketplaceService) => void;
}

export default function ServiceDiscovery({ forumId, onServiceSelect }: ServiceDiscoveryProps) {
  const [services, setServices] = useState<MarketplaceService[]>([]);
  const [forumServices, setForumServices] = useState<MarketplaceService[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [maxPrice, setMaxPrice] = useState('');

  // Load services
  useEffect(() => {
    loadServices();
  }, [forumId]);

  const loadServices = async () => {
    try {
      // Load forum-specific services if forumId provided
      if (forumId) {
        const forumQuery = query(
          collection(db, 'marketplaceServices'),
          where('forumId', '==', forumId),
          where('availability.isActive', '==', true)
        );
        const forumSnapshot = await getDocs(forumQuery);
        const forumServicesData = forumSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as MarketplaceService[];
        setForumServices(forumServicesData);
      }

      // Load public services
      const publicQuery = query(
        collection(db, 'marketplaceServices'),
        where('isPublic', '==', true),
        where('availability.isActive', '==', true),
        orderBy('createdAt', 'desc'),
        limit(50)
      );
      const publicSnapshot = await getDocs(publicQuery);
      const publicServicesData = publicSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as MarketplaceService[];
      setServices(publicServicesData);

    } catch (error) {
      console.error('Failed to load services:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = (servicesList: MarketplaceService[]) => {
    return servicesList.filter(service => {
      const matchesSearch = !searchTerm || 
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
      
      const matchesPrice = !maxPrice || service.price <= parseFloat(maxPrice);
      
      return matchesSearch && matchesCategory && matchesPrice;
    });
  };

  const getCategoryIcon = (category: string): string => {
    const icons: Record<string, string> = {
      food: '🍽️',
      transport: '🚌',
      utilities: '⚡',
      healthcare: '🏥',
      education: '📚',
      housing: '🏠',
      general: '🔧'
    };
    return icons[category] || '🔧';
  };

  const getServicePurchaseRule = (service: MarketplaceService): string => {
    return `rule pay -> Service("${service.name}", ${service.price})`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const renderService = (service: MarketplaceService, isForumService = false) => (
    <div 
      key={service.id} 
      className={`border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer ${
        isForumService ? 'border-blue-200 bg-blue-50' : 'border-gray-200 bg-white'
      }`}
      onClick={() => onServiceSelect?.(service)}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">{getCategoryIcon(service.category)}</span>
          <h3 className="text-lg font-semibold text-gray-800">{service.name}</h3>
          {isForumService && (
            <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">
              Forum Service
            </span>
          )}
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-green-600">
            ${service.price} {service.currency}
          </div>
          <div className="text-xs text-gray-500">
            by {service.providerName}
          </div>
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-3">{service.description}</p>

      {/* Service metadata */}
      <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
        <span className="capitalize">{service.category}</span>
        {service.location?.serviceRadius && (
          <span>📍 {service.location.serviceRadius}km radius</span>
        )}
        {service.location?.regions && (
          <span>🗺️ {service.location.regions.join(', ')}</span>
        )}
        {service.availability.maxOrders && (
          <span>
            📦 {service.availability.currentOrders || 0}/{service.availability.maxOrders} orders
          </span>
        )}
      </div>

      {/* Purchase rule */}
      <div className="bg-gray-50 border border-gray-200 rounded p-2 mb-3">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-600 mb-1">Purchase with this rule:</p>
            <code className="text-sm font-mono text-purple-600">
              {getServicePurchaseRule(service)}
            </code>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              copyToClipboard(getServicePurchaseRule(service));
            }}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            Copy
          </button>
        </div>
      </div>

      {/* Validation rules preview */}
      {service.validationPolicy.rules.length > 0 && (
        <div className="border-t pt-2">
          <p className="text-xs text-gray-600 mb-1">
            Service has {service.validationPolicy.rules.length} validation rule(s)
          </p>
          <div className="text-xs text-gray-500">
            {service.validationPolicy.rules.slice(0, 2).map((rule, index) => (
              <div key={index} className="font-mono bg-gray-100 p-1 rounded mb-1">
                {rule.length > 60 ? `${rule.substring(0, 60)}...` : rule}
              </div>
            ))}
            {service.validationPolicy.rules.length > 2 && (
              <p className="text-gray-400">+{service.validationPolicy.rules.length - 2} more rules</p>
            )}
          </div>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Available Services</h2>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Available Services
      </h2>

      {/* Search and filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search services
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or description..."
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Categories</option>
            <option value="food">🍽️ Food & Beverages</option>
            <option value="transport">🚌 Transport</option>
            <option value="utilities">⚡ Utilities</option>
            <option value="healthcare">🏥 Healthcare</option>
            <option value="education">📚 Education</option>
            <option value="housing">🏠 Housing</option>
            <option value="general">🔧 General</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Max Price (NZD)
          </label>
          <input
            type="number"
            step="0.01"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="Any price"
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Forum services (if any) */}
      {forumId && forumServices.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-800 mb-3">
            Services in this Forum ({filteredServices(forumServices).length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredServices(forumServices).map(service => renderService(service, true))}
          </div>
        </div>
      )}

      {/* Public services */}
      <div>
        <h3 className="text-lg font-medium text-gray-800 mb-3">
          Public Marketplace ({filteredServices(services).length})
        </h3>
        
        {filteredServices(services).length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">🛒</div>
            <p className="text-gray-600">No services found matching your criteria</p>
            <p className="text-sm text-gray-500 mt-1">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredServices(services).map(service => renderService(service))}
          </div>
        )}
      </div>

      {/* How to use */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded">
        <h4 className="text-sm font-medium text-blue-800 mb-2">How to Purchase</h4>
        <div className="text-sm text-blue-600 space-y-1">
          <p>1. Find a service you want to purchase</p>
          <p>2. Copy the purchase rule for that service</p>
          <p>3. Go to any forum and paste the rule in chat</p>
          <p>4. The service will validate your request and either accept or reject it</p>
          <p>5. If accepted, complete payment to finalize the purchase</p>
        </div>
      </div>
    </div>
  );
}