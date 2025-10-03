// app/forums/[forumId]/components/ServiceStatus.tsx
'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

interface ServiceStatus {
  serviceName: string;
  status: 'available' | 'activated' | 'completed' | 'pending' | 'failed';
  activatedBy?: string;
  activatedAt?: any;
  addedViaPolicy?: string;
  parameters?: any;
}

interface PolicyInfo {
  id: string;
  name: string;
  parent_policy_id?: string;
  stakeholders: string[];
  created_by: string;
  created_at: any;
}

interface ForumExpansion {
  new_stakeholders: string[];
  new_services: string[];
  new_policies: string[];
  expansion_triggered_by: string;
  expansion_timestamp: any;
}

interface ServiceStatusProps {
  forumId: string;
}

export default function ServiceStatus({ forumId }: ServiceStatusProps) {
  const [services, setServices] = useState<ServiceStatus[]>([]);
  const [connectedPolicies, setConnectedPolicies] = useState<PolicyInfo[]>([]);
  const [expansionHistory, setExpansionHistory] = useState<ForumExpansion[]>([]);
  const [participants, setParticipants] = useState<any[]>([]);
  const [dynamicallyExpanded, setDynamicallyExpanded] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    const forumRef = doc(db, 'forums', forumId);
    
    const unsubscribe = onSnapshot(forumRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        
        // Update service status
        setServices(data.serviceStatus || []);
        
        // Update participants
        setParticipants(data.participants || []);
        
        // Update expansion tracking
        setExpansionHistory(data.expansionHistory || []);
        setDynamicallyExpanded(data.dynamicallyExpanded || false);
        
        // Load connected policies
        if (data.connectedPolicies) {
          loadConnectedPolicies(data.connectedPolicies);
        }
      }
    });

    return () => unsubscribe();
  }, [forumId]);

  const loadConnectedPolicies = async (policyIds: string[]) => {
    try {
      const policies: PolicyInfo[] = [];
      
      for (const policyId of policyIds) {
        const policyDoc = await import('firebase/firestore').then(({ getDoc, doc }) => 
          getDoc(doc(db, 'policies', policyId))
        );
        
        if (policyDoc.exists()) {
          policies.push({
            id: policyDoc.id,
            ...policyDoc.data()
          } as PolicyInfo);
        }
      }
      
      setConnectedPolicies(policies);
    } catch (error) {
      console.error('Failed to load connected policies:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return '✅';
      case 'activated': return '⚡';
      case 'available': return '🔵';
      case 'pending': return '⏳';
      case 'failed': return '❌';
      default: return '⭕';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'activated': return 'text-blue-600';
      case 'available': return 'text-gray-600';
      case 'pending': return 'text-yellow-600';
      case 'failed': return 'text-red-600';
      default: return 'text-gray-400';
    }
  };

  const formatTimestamp = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Governance Status
        </h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-500 hover:text-gray-700"
        >
          {isExpanded ? '▼' : '▶'}
        </button>
      </div>

      {isExpanded && (
        <>
          {/* Dynamic Expansion Indicator */}
          {dynamicallyExpanded && (
            <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded">
              <div className="flex items-center mb-2">
                <span className="text-purple-600 mr-2">🔄</span>
                <span className="text-sm font-medium text-purple-800">
                  Forum Dynamically Expanded
                </span>
              </div>
              <p className="text-xs text-purple-600">
                This forum's capabilities have been extended through sub-policy creation.
              </p>
            </div>
          )}

          {/* Service Status */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              Active Services ({services.length})
            </h4>
            
            {services.length === 0 ? (
              <p className="text-sm text-gray-500 italic">
                No services activated yet
              </p>
            ) : (
              <div className="space-y-2">
                {services.map((service, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center">
                      <span className="mr-2">{getStatusIcon(service.status)}</span>
                      <span className="text-sm font-medium">{service.serviceName}</span>
                      {service.addedViaPolicy && (
                        <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                          via policy
                        </span>
                      )}
                    </div>
                    <span className={`text-xs ${getStatusColor(service.status)}`}>
                      {service.status.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Connected Policies */}
          {connectedPolicies.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                Connected Policies ({connectedPolicies.length})
              </h4>
              
              <div className="space-y-2">
                {connectedPolicies.map((policy) => (
                  <div key={policy.id} className="p-2 bg-blue-50 rounded border border-blue-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-blue-800">
                        {policy.name}
                      </span>
                      <span className="text-xs text-blue-600">
                        {policy.parent_policy_id ? 'Sub-Policy' : 'Root Policy'}
                      </span>
                    </div>
                    {policy.stakeholders.length > 0 && (
                      <p className="text-xs text-blue-600 mt-1">
                        Stakeholders: {policy.stakeholders.join(', ')}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stakeholders */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              Participants ({participants.length})
            </h4>
            
            <div className="space-y-1">
              {participants.map((participant, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span>{participant.userId}</span>
                  <div className="flex items-center text-xs text-gray-500">
                    <span className="mr-2">{participant.role}</span>
                    {participant.addedViaPolicy && (
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded">
                        via policy
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Expansion History */}
          {expansionHistory.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                Expansion History ({expansionHistory.length})
              </h4>
              
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {expansionHistory.map((expansion, index) => (
                  <div key={index} className="p-2 bg-yellow-50 rounded border border-yellow-200">
                    <div className="text-xs text-yellow-800">
                      <div className="font-medium mb-1">
                        Expanded by {expansion.expansion_triggered_by}
                      </div>
                      <div className="text-yellow-600">
                        {formatTimestamp(expansion.expansion_timestamp)}
                      </div>
                      
                      {expansion.new_stakeholders.length > 0 && (
                        <div className="mt-1">
                          <span className="font-medium">+Stakeholders:</span> {expansion.new_stakeholders.join(', ')}
                        </div>
                      )}
                      
                      {expansion.new_services.length > 0 && (
                        <div className="mt-1">
                          <span className="font-medium">+Services:</span> {expansion.new_services.join(', ')}
                        </div>
                      )}
                      
                      {expansion.new_policies.length > 0 && (
                        <div className="mt-1">
                          <span className="font-medium">+Policies:</span> {expansion.new_policies.length}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* EleuScript Capabilities Hint */}
          <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded">
            <p className="text-xs text-gray-600">
              💡 <strong>Expand capabilities:</strong> Type EleuScript rules in chat to add stakeholders, activate services, or create sub-policies.
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Example: <code>rule AddHealthcare → Policy("HealthcareAccess")</code>
            </p>
          </div>
        </>
      )}
    </div>
  );
}