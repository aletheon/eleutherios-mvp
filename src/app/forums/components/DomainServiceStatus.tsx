// app/forums/components/DomainServiceStatus.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface DomainService {
  name: string;
  domain: string;
  status: 'inactive' | 'pending' | 'active' | 'completed' | 'failed';
  lastUpdated: any;
  metadata?: {
    amount?: number;
    currency?: string;
    providerId?: string;
    paymentStatus?: string;
    serviceParams?: Record<string, any>;
    [key: string]: any;
  };
}

interface DomainPolicy {
  id: string;
  domain: string;
  policyType: string;
  status: 'active' | 'completed' | 'cancelled';
  stakeholders: string[];
  services: string[];
  createdAt: any;
  createdBy: string;
}

interface DomainServiceStatusProps {
  forumId: string;
  activeDomains?: string[];
}

export default function DomainServiceStatus({ forumId, activeDomains = [] }: DomainServiceStatusProps) {
  const [services, setServices] = useState<Record<string, DomainService>>({});
  const [policies, setPolicies] = useState<DomainPolicy[]>([]);
  const [expansionHistory, setExpansionHistory] = useState<any[]>([]);
  const [detectedDomains, setDetectedDomains] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  // Real-time forum updates listener
  useEffect(() => {
    const forumRef = doc(db, 'forums', forumId);
    
    const unsubscribe = onSnapshot(forumRef, (doc) => {
      if (doc.exists()) {
        const forumData = doc.data();
        
        // Extract all services with domain information
        const serviceStatus = forumData.serviceStatus || {};
        const allServices: Record<string, DomainService> = {};
        const domains = new Set<string>();
        
        Object.entries(serviceStatus).forEach(([serviceName, serviceData]: [string, any]) => {
          const domain = serviceData?.metadata?.domain || detectServiceDomain(serviceName);
          domains.add(domain);
          
          allServices[serviceName] = {
            name: serviceName,
            domain,
            ...serviceData
          };
        });
        
        setServices(allServices);
        setDetectedDomains(domains);
        setExpansionHistory(forumData.expansionHistory || []);
        setPolicies(forumData.connectedPolicies || []);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [forumId]);

  const detectServiceDomain = (serviceName: string): string => {
    const domainPatterns: Record<string, RegExp> = {
      healthcare: /health|medical|doctor|gp|consultation|prescription|pharmacy|nurse/i,
      housing: /housing|rent|landlord|property|accommodation|kainga/i,
      food: /food|grocery|meal|nutrition|pantry|restaurant/i,
      education: /education|school|learning|student|teacher|tuition/i,
      utilities: /electricity|power|water|gas|internet|utility/i,
      transport: /transport|travel|bus|train|taxi|mobility/i,
      employment: /job|work|employment|career|interview/i,
      finance: /payment|money|bank|budget|financial|stripe/i
    };

    for (const [domain, pattern] of Object.entries(domainPatterns)) {
      if (pattern.test(serviceName)) {
        return domain;
      }
    }
    return 'general';
  };

  const getDomainIcon = (domain: string): string => {
    const icons: Record<string, string> = {
      healthcare: '🏥',
      housing: '🏠', 
      food: '🍽️',
      education: '📚',
      utilities: '⚡',
      transport: '🚌',
      employment: '💼',
      finance: '💰',
      general: '🔧'
    };
    return icons[domain] || icons['general'];
  };

  const getServiceIcon = (serviceName: string, domain: string): string => {
    // Service-specific icons within domains
    const serviceIcons: Record<string, Record<string, string>> = {
      healthcare: {
        'GPBooking': '📅', 'Consultation': '👩‍⚕️', 'Prescription': '💊',
        'SpecialistReferral': '🔬', 'Payment': '💳'
      },
      housing: {
        'HousingSearch': '🔍', 'RentPayment': '💰', 'Maintenance': '🔧',
        'Application': '📋', 'Viewing': '👁️'
      },
      food: {
        'GroceryDelivery': '🚚', 'MealPlan': '📝', 'FoodPantry': '🥫',
        'Payment': '💳', 'Distribution': '📦'
      },
      education: {
        'Enrollment': '✍️', 'Materials': '📖', 'Assessment': '📊',
        'Payment': '💳', 'Instruction': '👨‍🏫'
      },
      utilities: {
        'PowerConnection': '⚡', 'WaterSupply': '💧', 'InternetSetup': '🌐',
        'Billing': '💵', 'Maintenance': '🔧'
      },
      transport: {
        'PublicTransport': '🚌', 'TaxiVoucher': '🚕', 'RouteOptimization': '🗺️',
        'Payment': '💳', 'Mobility': '♿'
      }
    };

    return serviceIcons[domain]?.[serviceName] || 
           (serviceName.includes('Payment') ? '💳' : '⚙️');
  };

  const getStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
      'inactive': 'text-gray-400 bg-gray-100',
      'pending': 'text-yellow-600 bg-yellow-100', 
      'active': 'text-green-600 bg-green-100',
      'completed': 'text-blue-600 bg-blue-100',
      'failed': 'text-red-600 bg-red-100'
    };
    return colors[status] || 'text-gray-400 bg-gray-100';
  };

  const formatCurrency = (amount: number, currency: string = 'NZD'): string => {
    return new Intl.NumberFormat('en-NZ', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const renderServiceDetails = (service: DomainService) => {
    const { metadata } = service;
    if (!metadata) return null;

    return (
      <div className="text-xs text-gray-600 mt-1 space-y-1">
        {metadata.amount && metadata.currency && (
          <p>Amount: {formatCurrency(metadata.amount, metadata.currency)}</p>
        )}
        {metadata.paymentStatus && (
          <p className="capitalize">Payment: {metadata.paymentStatus.replace('_', ' ')}</p>
        )}
        {metadata.providerId && (
          <p className="font-mono">Provider: {metadata.providerId.slice(-8)}</p>
        )}
        {metadata.serviceParams && Object.keys(metadata.serviceParams).length > 0 && (
          <div className="text-xs">
            {Object.entries(metadata.serviceParams).slice(0, 2).map(([key, value]) => (
              <p key={key} className="capitalize">
                {key.replace('_', ' ')}: {String(value)}
              </p>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderDomainPolicies = () => {
    if (policies.length === 0) return null;

    const policiesByDomain = policies.reduce((acc, policy) => {
      const domain = policy.domain || 'general';
      if (!acc[domain]) acc[domain] = [];
      acc[domain].push(policy);
      return acc;
    }, {} as Record<string, DomainPolicy[]>);

    return (
      <div className="space-y-3 mb-4">
        {Object.entries(policiesByDomain).map(([domain, domainPolicies]) => (
          <div key={domain} className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <h4 className="text-sm font-medium text-blue-800 mb-2 flex items-center gap-2">
              <span>{getDomainIcon(domain)}</span>
              {domain.charAt(0).toUpperCase() + domain.slice(1)} Policies
            </h4>
            <div className="space-y-2">
              {domainPolicies.map((policy, index) => (
                <div key={index} className="flex items-center justify-between text-xs">
                  <span className="text-blue-700 font-medium">
                    {policy.policyType.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <span className={`px-2 py-1 rounded ${getStatusColor(policy.status)} text-xs`}>
                    {policy.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderExpansionHistory = () => {
    if (expansionHistory.length === 0) return null;

    const recentExpansions = expansionHistory.slice(-5);

    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
        <h4 className="text-sm font-medium text-green-800 mb-2">Forum Evolution</h4>
        <div className="space-y-2">
          {recentExpansions.map((expansion, index) => (
            <div key={index} className="text-xs text-green-700">
              <p className="font-medium">
                {expansion.addedStakeholders?.join(', ') || 'Services'} added
                {expansion.metadata?.domain && ` (${expansion.metadata.domain})`}
              </p>
              <p className="text-green-600">
                {new Date(expansion.timestamp?.toDate?.() || expansion.timestamp).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderServicesByDomain = () => {
    const servicesByDomain = Object.values(services).reduce((acc, service) => {
      const domain = service.domain;
      if (!acc[domain]) acc[domain] = [];
      acc[domain].push(service);
      return acc;
    }, {} as Record<string, DomainService[]>);

    if (Object.keys(servicesByDomain).length === 0) {
      return (
        <div className="text-center py-6">
          <div className="text-4xl mb-2">🔧</div>
          <p className="text-sm text-gray-600 mb-2">
            Forum ready for coordination
          </p>
          <p className="text-xs text-gray-500">
            Type EleuScript rules to activate domain services
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {Object.entries(servicesByDomain).map(([domain, domainServices]) => (
          <div key={domain} className="border border-gray-200 rounded-lg p-3">
            <h4 className="text-sm font-medium text-gray-800 mb-3 flex items-center gap-2">
              <span className="text-lg">{getDomainIcon(domain)}</span>
              {domain.charAt(0).toUpperCase() + domain.slice(1)} Services
              <span className="text-xs text-gray-500">({domainServices.length})</span>
            </h4>
            
            <div className="space-y-2">
              {domainServices.map((service, index) => (
                <div key={index} className="border border-gray-100 rounded p-2">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span>{getServiceIcon(service.name, domain)}</span>
                      <span className="text-sm font-medium text-gray-700">
                        {service.name.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(service.status)}`}>
                      {service.status}
                    </span>
                  </div>
                  
                  {renderServiceDetails(service)}
                  
                  <div className="text-xs text-gray-400 mt-1">
                    {service.lastUpdated?.toDate?.()?.toLocaleTimeString() || 'Unknown'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderDomainExamples = () => {
    const examples = Array.from(detectedDomains).length > 0 
      ? Array.from(detectedDomains) 
      : ['healthcare', 'housing', 'food'];

    const exampleRules: Record<string, string[]> = {
      healthcare: [
        'rule BookConsultation → Service("GPBooking")',
        'rule AddHealthcare → Policy("HealthcareAccess")',
        'rule ProcessPayment → Service("StripePayment", amount=75)'
      ],
      housing: [
        'rule FindHousing → Service("HousingSearch")',
        'rule PayRent → Service("StripePayment", amount=400)',
        'rule RequestMaintenance → Service("Maintenance")'
      ],
      food: [
        'rule OrderGroceries → Service("GroceryDelivery")',
        'rule CreateMealPlan → Policy("MealPlan")',
        'rule PayForFood → Service("StripePayment", amount=100)'
      ],
      education: [
        'rule Enroll → Service("Enrollment")',
        'rule PayTuition → Service("StripePayment", amount=200)',
        'rule AccessMaterials → Service("Materials")'
      ],
      utilities: [
        'rule ConnectPower → Service("PowerConnection")',
        'rule PayBill → Service("StripePayment", amount=150)',
        'rule ReportOutage → Service("Maintenance")'
      ]
    };

    return (
      <div className="mt-4 pt-3 border-t border-gray-100">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Available Domain Rules</h4>
        <div className="space-y-2">
          {examples.slice(0, 3).map(domain => (
            <div key={domain} className="border border-gray-100 rounded p-2">
              <h5 className="text-xs font-medium text-gray-600 mb-1 flex items-center gap-1">
                {getDomainIcon(domain)} {domain.charAt(0).toUpperCase() + domain.slice(1)}
              </h5>
              <div className="space-y-1">
                {exampleRules[domain]?.slice(0, 2).map((rule, index) => (
                  <code key={index} className="block bg-gray-50 p-1 rounded text-xs">
                    {rule}
                  </code>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Domain Services</h3>
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-4 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  const hasActiveServices = Object.keys(services).length > 0;
  const hasActiveDomains = detectedDomains.size > 0;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Domain Services</h3>
        {hasActiveDomains && (
          <div className="flex gap-1">
            {Array.from(detectedDomains).slice(0, 3).map(domain => (
              <span key={domain} className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                {getDomainIcon(domain)} {domain}
              </span>
            ))}
            {detectedDomains.size > 3 && (
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                +{detectedDomains.size - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {renderDomainPolicies()}
      {renderExpansionHistory()}
      {renderServicesByDomain()}
      {renderDomainExamples()}
    </div>
  );
}