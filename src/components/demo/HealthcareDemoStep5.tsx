"use client"

import React, { useState } from 'react';

export default function PolicyEvolutionAuditTrail() {
  const [auditEvents] = useState([
    {
      id: 'event-001',
      timestamp: '2025-10-06 14:30:15',
      type: 'policy_created',
      action: 'Forum Created',
      actor: 'Dr. Sarah Chen',
      actorRole: 'Doctor',
      description: 'BasicConsultationPolicy instantiated - Medical consultation forum created',
      details: {
        policyId: 'basic-consultation-001',
        policyVersion: '1.0',
        stakeholders: ['Patient', 'Doctor'],
        services: ['Consultation Chat', 'File Upload', 'Appointment Booking']
      },
      status: 'completed',
      icon: '🏥'
    },
    {
      id: 'event-002',
      timestamp: '2025-10-06 14:30:22',
      type: 'stakeholder_joined',
      action: 'Patient Joined',
      actor: 'Alex Thompson',
      actorRole: 'Patient',
      description: 'Patient Alex Thompson joined consultation forum',
      details: {
        stakeholderId: 'alex-thompson-patient',
        permissions: ['join', 'message', 'upload_files'],
        verificationMethod: 'RealMe Identity'
      },
      status: 'completed',
      icon: '👤'
    },
    {
      id: 'event-003',
      timestamp: '2025-10-06 14:39:08',
      type: 'eleuscript_rule_executed',
      action: 'EleuScript Rule Executed',
      actor: 'Dr. Sarah Chen',
      actorRole: 'Doctor',
      description: 'Rule: add pharmacy → Policy("PrescriptionFulfillment")',
      details: {
        ruleText: 'rule add pharmacy -> Policy("PrescriptionFulfillment", stakeholders=["Patient", "Doctor", "Pharmacist"])',
        ruleType: 'policy_creation',
        executionTime: '245ms',
        validationPassed: true
      },
      status: 'completed',
      icon: '⚡'
    },
    {
      id: 'event-004',
      timestamp: '2025-10-06 14:39:08',
      type: 'sub_policy_created',
      action: 'Sub-Policy Created',
      actor: 'System',
      actorRole: 'PolicyExecutor',
      description: 'PrescriptionFulfillment sub-policy created successfully',
      details: {
        parentPolicyId: 'basic-consultation-001',
        subPolicyId: 'prescription-fulfillment-001',
        subPolicyVersion: '1.0',
        inheritedCapabilities: ['payment_processing', 'prescription_validation', 'pharmacy_coordination'],
        newStakeholders: ['Pharmacist']
      },
      status: 'completed',
      icon: '📋'
    },
    {
      id: 'event-005',
      timestamp: '2025-10-06 14:39:12',
      type: 'forum_expanded',
      action: 'Forum Capabilities Expanded',
      actor: 'System',
      actorRole: 'ForumManager',
      description: 'Forum capabilities expanded with prescription services',
      details: {
        forumId: 'consultation-forum-mc-2025-1006',
        newServices: ['Prescription Processing', 'Pharmacy Delivery'],
        expandedPermissions: {
          'Pharmacist': ['join', 'message', 'process_prescriptions', 'coordinate_delivery']
        },
        serviceEndpoints: ['prescription-api.wellington-pharmacy.nz']
      },
      status: 'completed',
      icon: '🔧'
    },
    {
      id: 'event-006',
      timestamp: '2025-10-06 14:40:01',
      type: 'stakeholder_joined',
      action: 'Pharmacist Joined',
      actor: 'Maria Rodriguez',
      actorRole: 'Pharmacist',
      description: 'Wellington Central Pharmacy pharmacist joined forum',
      details: {
        stakeholderId: 'maria-rodriguez-pharmacist',
        organizationId: 'wellington-central-pharmacy',
        credentials: ['NZ Pharmacy Council Registration #12847'],
        permissions: ['join', 'message', 'process_prescriptions', 'coordinate_delivery']
      },
      status: 'completed',
      icon: '💊'
    },
    {
      id: 'event-007',
      timestamp: '2025-10-06 14:43:15',
      type: 'eleuscript_rule_executed',
      action: 'Payment Service Activation',
      actor: 'Dr. Sarah Chen',
      actorRole: 'Doctor',
      description: 'Rule: activate payment → Service("StripePayment", $75)',
      details: {
        ruleText: 'rule activate payment -> Service("StripePayment", amount=75, currency="NZD", recipients=["doctor", "platform"])',
        ruleType: 'service_activation',
        executionTime: '189ms',
        validationPassed: true
      },
      status: 'completed',
      icon: '⚡'
    },
    {
      id: 'event-008',
      timestamp: '2025-10-06 14:43:16',
      type: 'service_activated',
      action: 'Stripe Payment Service Activated',
      actor: 'System',
      actorRole: 'ServiceActivator',
      description: 'Stripe payment processing service activated for consultation fees',
      details: {
        serviceId: 'stripe-payment-consultation-001',
        amount: 75.00,
        currency: 'NZD',
        paymentIntentId: 'pi_1J5K2L3M4N5O6P7Q',
        recipients: {
          'doctor': { percentage: 80, amount: 60.00 },
          'platform': { percentage: 20, amount: 15.00 }
        },
        stripeAccountId: 'acct_1234567890'
      },
      status: 'completed',
      icon: '💳'
    },
    {
      id: 'event-009',
      timestamp: '2025-10-06 14:43:17',
      type: 'governance_event_logged',
      action: 'Audit Trail Updated',
      actor: 'System',
      actorRole: 'AuditLogger',
      description: 'All governance events successfully logged to audit trail',
      details: {
        totalEvents: 9,
        policiesCreated: 2,
        stakeholdersAdded: 2,
        servicesActivated: 3,
        complianceStatus: 'fully_compliant',
        dataRetention: '7_years'
      },
      status: 'completed',
      icon: '📊'
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50';
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'failed': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getEventTypeColor = (type) => {
    switch (type) {
      case 'policy_created': return 'bg-blue-100 text-blue-800';
      case 'sub_policy_created': return 'bg-purple-100 text-purple-800';
      case 'stakeholder_joined': return 'bg-green-100 text-green-800';
      case 'forum_expanded': return 'bg-indigo-100 text-indigo-800';
      case 'service_activated': return 'bg-emerald-100 text-emerald-800';
      case 'eleuscript_rule_executed': return 'bg-violet-100 text-violet-800';
      case 'governance_event_logged': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg">
      {/* Header */}
      <div className="bg-gray-800 text-white p-6 rounded-t-lg">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold">Governance Audit Trail</h1>
            <p className="text-gray-300">Complete policy evolution history for Forum #MC-2025-1006</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-300">Case: Medical Consultation</div>
            <div className="text-sm text-gray-300">Duration: 13 minutes 2 seconds</div>
            <div className="text-sm text-gray-300">Events: {auditEvents.length}</div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="bg-gray-50 border-b p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Policy Evolution Summary</h3>
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
            <div className="text-2xl font-bold text-purple-600">6</div>
            <div className="text-sm text-gray-600">Services Activated</div>
          </div>
          <div className="bg-white p-4 rounded-lg border text-center">
            <div className="text-2xl font-bold text-indigo-600">2</div>
            <div className="text-sm text-gray-600">EleuScript Rules</div>
          </div>
          <div className="bg-white p-4 rounded-lg border text-center">
            <div className="text-2xl font-bold text-emerald-600">$75</div>
            <div className="text-sm text-gray-600">Payment Activated</div>
          </div>
        </div>
      </div>

      {/* Policy Hierarchy Visualization */}
      <div className="bg-gray-50 border-b p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Policy Hierarchy</h3>
        <div className="flex items-center gap-4">
          <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg border-2 border-blue-200">
            <div className="font-semibold">BasicConsultationPolicy</div>
            <div className="text-sm">v1.0 • Created 14:30</div>
          </div>
          <div className="text-gray-400 text-xl">→</div>
          <div className="bg-purple-100 text-purple-800 px-4 py-2 rounded-lg border-2 border-purple-200">
            <div className="font-semibold">PrescriptionFulfillment</div>
            <div className="text-sm">v1.0 • Created 14:39</div>
          </div>
          <div className="text-gray-400 text-xl">→</div>
          <div className="bg-emerald-100 text-emerald-800 px-4 py-2 rounded-lg border-2 border-emerald-200">
            <div className="font-semibold">PaymentProcessing</div>
            <div className="text-sm">Activated 14:43</div>
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
            <p className="text-sm text-gray-600">All governance events logged and verified</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">✓</div>
              <div className="text-xs text-gray-600">Privacy Act</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">✓</div>
              <div className="text-xs text-gray-600">Health Info Privacy</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">✓</div>
              <div className="text-xs text-gray-600">Consumer Protection</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">✓</div>
              <div className="text-xs text-gray-600">Financial Services</div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 text-xs text-gray-500">
          <strong>Data Retention:</strong> 7 years as per Health Information Privacy Code •
          <strong>Audit ID:</strong> audit-mc-2025-1006-20251006-143017 •
          <strong>Verification Hash:</strong> 0x4f2a9b8c1d3e5f7a9b2c4d6e8f0a1b3c5d7e9f
        </div>
      </div>
    </div>
  );
}