"use client"

import React, { useState } from 'react';

export default function HousingCoordinationAuditTrail() {
  const [auditEvents] = useState([
    {
      id: 'event-001',
      timestamp: '2025-10-07 09:15:12',
      type: 'policy_created',
      action: 'Housing Application Forum Created',
      actor: 'Sarah Mitchell',
      actorRole: 'MSD Case Worker',
      description: 'BasicHousingApplication policy instantiated - Housing application forum created for Jordan Williams',
      details: {
        policyId: 'basic-housing-app-001',
        policyVersion: '1.0',
        stakeholders: ['Housing Applicant', 'MSD Case Worker'],
        services: ['Application Processing', 'Document Upload', 'Eligibility Assessment'],
        applicantId: 'jordan-williams-ha-2025'
      },
      status: 'completed',
      icon: '🏠'
    },
    {
      id: 'event-002',
      timestamp: '2025-10-07 09:15:18',
      type: 'stakeholder_joined',
      action: 'Housing Applicant Joined',
      actor: 'Jordan Williams',
      actorRole: 'Housing Applicant',
      description: 'Jordan Williams joined housing application forum',
      details: {
        stakeholderId: 'jordan-williams-applicant',
        householdSize: 2,
        dependents: ['Child (6 years)'],
        currentHousingStatus: 'temporary_accommodation',
        permissions: ['join', 'message', 'upload_documents', 'view_status']
      },
      status: 'completed',
      icon: '👤'
    },
    {
      id: 'event-003',
      timestamp: '2025-10-07 09:24:45',
      type: 'assessment_completed',
      action: 'Priority Assessment Completed',
      actor: 'Sarah Mitchell',
      actorRole: 'MSD Case Worker',
      description: 'Housing priority assessment completed - Priority B qualification confirmed',
      details: {
        priorityLevel: 'Priority B',
        assessmentFactors: ['Single parent household', 'Temporary accommodation', 'School-age child'],
        eligibilityStatus: 'Qualified',
        recommendedAction: 'Immediate housing registry registration'
      },
      status: 'completed',
      icon: '📋'
    },
    {
      id: 'event-004',
      timestamp: '2025-10-07 09:25:02',
      type: 'eleuscript_rule_executed',
      action: 'EleuScript Rule Executed',
      actor: 'Sarah Mitchell',
      actorRole: 'MSD Case Worker',
      description: 'Rule: add housing_provider → Policy("HousingCoordination")',
      details: {
        ruleText: 'rule add housing_provider -> Policy("HousingCoordination", stakeholders=["Applicant", "MSD_CaseWorker", "KO_HousingOfficer"])',
        ruleType: 'policy_creation',
        executionTime: '267ms',
        validationPassed: true,
        triggerReason: 'Priority B assessment completion'
      },
      status: 'completed',
      icon: '⚡'
    },
    {
      id: 'event-005',
      timestamp: '2025-10-07 09:25:03',
      type: 'sub_policy_created',
      action: 'Housing Coordination Sub-Policy Created',
      actor: 'System',
      actorRole: 'PolicyExecutor',
      description: 'HousingCoordination sub-policy created successfully',
      details: {
        parentPolicyId: 'basic-housing-app-001',
        subPolicyId: 'housing-coordination-001',
        subPolicyVersion: '1.0',
        inheritedCapabilities: ['housing_registry', 'property_matching', 'tenancy_support'],
        newStakeholders: ['KO_HousingOfficer']
      },
      status: 'completed',
      icon: '📋'
    },
    {
      id: 'event-006',
      timestamp: '2025-10-07 09:25:08',
      type: 'forum_expanded',
      action: 'Forum Capabilities Expanded',
      actor: 'System',
      actorRole: 'ForumManager',
      description: 'Forum capabilities expanded with housing coordination services',
      details: {
        forumId: 'housing-forum-ha-2025-1007',
        newServices: ['Housing Registry', 'Property Matching', 'Tenancy Support'],
        expandedPermissions: {
          'KO_HousingOfficer': ['join', 'message', 'register_applicant', 'match_properties', 'coordinate_tenancy']
        },
        serviceEndpoints: ['housing-api.kaingaora.govt.nz']
      },
      status: 'completed',
      icon: '🔧'
    },
    {
      id: 'event-007',
      timestamp: '2025-10-07 09:26:15',
      type: 'stakeholder_joined',
      action: 'Kāinga Ora Housing Officer Joined',
      actor: 'Michael Chen',
      actorRole: 'KO Housing Officer',
      description: 'Kāinga Ora housing officer joined coordination forum',
      details: {
        stakeholderId: 'michael-chen-ko-officer',
        organizationId: 'kainga-ora-wellington',
        credentials: ['NZ Housing Officer Registration #KO-5847'],
        permissions: ['join', 'message', 'register_applicant', 'match_properties', 'coordinate_tenancy'],
        regionalCoverage: 'Wellington'
      },
      status: 'completed',
      icon: '🏠'
    },
    {
      id: 'event-008',
      timestamp: '2025-10-07 09:26:22',
      type: 'housing_registry_activated',
      action: 'Housing Registry Registration',
      actor: 'Michael Chen',
      actorRole: 'KO Housing Officer',
      description: 'Jordan Williams successfully registered on Housing Registry with Priority B status',
      details: {
        registryId: 'HR-WLG-2025-1007-JW',
        priorityLevel: 'Priority B',
        propertyRequirements: {
          bedrooms: 2,
          location: 'Wellington area, near Newtown',
          accessibility: 'Public transport access required',
          petPolicy: 'No specific requirements'
        },
        estimatedWaitTime: '3-6 months'
      },
      status: 'completed',
      icon: '📝'
    },
    {
      id: 'event-009',
      timestamp: '2025-10-07 09:32:18',
      type: 'eleuscript_rule_executed',
      action: 'Support Services Activation',
      actor: 'Sarah Mitchell',
      actorRole: 'MSD Case Worker',
      description: 'Rule: activate support → Service("TransitionalSupport")',
      details: {
        ruleText: 'rule activate support -> Service("TransitionalSupport", services=["bond_assistance", "transport_support", "emergency_payment"])',
        ruleType: 'service_activation',
        executionTime: '203ms',
        validationPassed: true,
        triggerReason: 'Applicant financial hardship identified'
      },
      status: 'completed',
      icon: '⚡'
    },
    {
      id: 'event-010',
      timestamp: '2025-10-07 09:32:19',
      type: 'support_services_activated',
      action: 'Transitional Support Services Activated',
      actor: 'System',
      actorRole: 'ServiceActivator',
      description: 'Multiple support services activated for housing transition assistance',
      details: {
        servicePackageId: 'transitional-support-001',
        bondAssistance: {
          maxAmount: 2400.00,
          currency: 'NZD',
          eligibilityConfirmed: true,
          processingTime: '2-3 business days'
        },
        transportSupport: {
          weeklyBusPass: 50.00,
          duration: '4 weeks',
          schoolZoneIncluded: true
        },
        emergencyPayment: {
          immediateAmount: 200.00,
          type: 'Special Needs Grant',
          purpose: 'immediate_necessities'
        }
      },
      status: 'completed',
      icon: '💰'
    },
    {
      id: 'event-011',
      timestamp: '2025-10-07 09:32:20',
      type: 'governance_event_logged',
      action: 'Housing Coordination Audit Trail Updated',
      actor: 'System',
      actorRole: 'AuditLogger',
      description: 'All housing coordination events successfully logged to audit trail',
      details: {
        totalEvents: 11,
        policiesCreated: 2,
        stakeholdersAdded: 3,
        servicesActivated: 6,
        supportServicesValue: 2600.00,
        complianceStatus: 'fully_compliant',
        dataRetention: '7_years',
        privacyCompliance: 'Privacy Act 2020'
      },
      status: 'completed',
      icon: '📊'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
        case 'completed': return 'text-green-600 bg-green-50';
        case 'pending': return 'text-yellow-600 bg-yellow-50';
        case 'failed': return 'text-red-600 bg-red-50';
        default: return 'text-gray-600 bg-gray-50';
    }
    };

    const getEventTypeColor = (type: string) => {
    switch (type) {
        case 'policy_created': return 'bg-blue-100 text-blue-800';
        case 'sub_policy_created': return 'bg-purple-100 text-purple-800';
        case 'stakeholder_joined': return 'bg-green-100 text-green-800';
        // ... rest of cases
        default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg">
      {/* Header */}
      <div className="bg-green-800 text-white p-6 rounded-t-lg">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold">Housing Coordination Audit Trail</h1>
            <p className="text-green-100">Complete policy evolution history for Application #HA-2025-1007</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-green-200">Case: Social Housing Application</div>
            <div className="text-sm text-green-200">Duration: 17 minutes 8 seconds</div>
            <div className="text-sm text-green-200">Events: {auditEvents.length}</div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="bg-gray-50 border-b p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Housing Coordination Summary</h3>
        <div className="grid grid-cols-5 gap-4">
          <div className="bg-white p-4 rounded-lg border text-center">
            <div className="text-2xl font-bold text-blue-600">2</div>
            <div className="text-sm text-gray-600">Policies Created</div>
          </div>
          <div className="bg-white p-4 rounded-lg border text-center">
            <div className="text-2xl font-bold text-green-600">3</div>
            <div className="text-sm text-gray-600">Stakeholders Added</div>
          </div>
          <div className="bg-white p-4 rounded-lg border text-center">
            <div className="text-2xl font-bold text-purple-600">8</div>
            <div className="text-sm text-gray-600">Services Activated</div>
          </div>
          <div className="bg-white p-4 rounded-lg border text-center">
            <div className="text-2xl font-bold text-orange-600">B</div>
            <div className="text-sm text-gray-600">Priority Level</div>
          </div>
          <div className="bg-white p-4 rounded-lg border text-center">
            <div className="text-2xl font-bold text-emerald-600">$2,600</div>
            <div className="text-sm text-gray-600">Support Activated</div>
          </div>
        </div>
      </div>

      {/* Policy Hierarchy Visualization */}
      <div className="bg-gray-50 border-b p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Policy Hierarchy</h3>
        <div className="flex items-center gap-4">
          <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg border-2 border-blue-200">
            <div className="font-semibold">BasicHousingApplication</div>
            <div className="text-sm">v1.0 • Created 09:15</div>
          </div>
          <div className="text-gray-400 text-xl">→</div>
          <div className="bg-purple-100 text-purple-800 px-4 py-2 rounded-lg border-2 border-purple-200">
            <div className="font-semibold">HousingCoordination</div>
            <div className="text-sm">v1.0 • Created 09:25</div>
          </div>
          <div className="text-gray-400 text-xl">→</div>
          <div className="bg-emerald-100 text-emerald-800 px-4 py-2 rounded-lg border-2 border-emerald-200">
            <div className="font-semibold">TransitionalSupport</div>
            <div className="text-sm">Activated 09:32</div>
          </div>
        </div>
      </div>

      {/* Event Timeline */}
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Event Timeline</h3>
        <div className="space-y-4">
          {auditEvents.map((event, index) => (
            <div key={event.id} className="flex gap-4">
              {/* Timeline connector */}
              <div className="flex flex-col items-center">
                <div className="text-2xl">{event.icon}</div>
                {index < auditEvents.length - 1 && (
                  <div className="w-0.5 h-16 bg-gray-200 mt-2"></div>
                )}
              </div>
              
              {/* Event content */}
              <div className="flex-1 bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                    <h4 className="font-semibold text-gray-900">{event.action}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full ${getEventTypeColor(event.type)}`}>
                      {event.type.replace('_', ' ').toUpperCase()}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(event.status)}`}>
                      {event.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 font-mono">
                    {event.timestamp}
                  </div>
                </div>
                
                <p className="text-gray-700 mb-3">{event.description}</p>
                
                <div className="text-sm text-gray-600 mb-3">
                  <strong>Actor:</strong> {event.actor} ({event.actorRole})
                </div>
                
                {/* Event details */}
                <div className="bg-white rounded border p-3">
                  <div className="text-xs font-semibold text-gray-700 mb-2">EVENT DETAILS</div>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    {Object.entries(event.details).map(([key, value]) => (
                      <div key={key}>
                        <div className="text-gray-500 uppercase tracking-wide">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </div>
                        <div className="font-medium text-gray-900 font-mono">
                          {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Compliance Footer */}
      <div className="bg-gray-100 border-t p-6 rounded-b-lg">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="font-semibold text-gray-800">Compliance Status</h4>
            <p className="text-sm text-gray-600">All housing coordination events logged and verified</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">✓</div>
              <div className="text-xs text-gray-600">Privacy Act 2020</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">✓</div>
              <div className="text-xs text-gray-600">Social Security Act</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">✓</div>
              <div className="text-xs text-gray-600">Public Housing Act</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">✓</div>
              <div className="text-xs text-gray-600">Human Rights Act</div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 text-xs text-gray-500">
          <strong>Data Retention:</strong> 7 years as per Public Records Act 2005 •
          <strong>Audit ID:</strong> audit-ha-2025-1007-20251007-091512 •
          <strong>Verification Hash:</strong> 0x8a4b7c9d2e5f6a8b1c3d4e7f8a9b2c5d6e9f1a3b
        </div>
      </div>
    </div>
  );
}

export { HousingCoordinationAuditTrail as HousingDemoStep5 };