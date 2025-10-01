import type { Policy, Event } from '@/lib/types';

// Kāinga Ora Social Housing Policy
export const socialHousingPolicy: Policy = {
  id: 'policy-kainga-ora-social-housing',
  orgId: 'org-kainga-ora',
  title: 'Kāinga Ora Social Housing Framework',
  description: 'Comprehensive policy framework for social housing allocation, tenancy management, and community support',
  visibility: 'public',
  ownerId: 'user-kainga-ora-admin',
  version: 1,
  effectiveFrom: new Date().toISOString(),
  depth: 0,
  status: 'active',
  rules: [
    {
      id: 'rule-identity-verification',
      kind: 'policy',
      name: 'Applicant Identity Verification',
      reference: { policyId: 'eleutherios-identity-verification', version: 1 },
      orderIndex: 1
    },
    {
      id: 'rule-tenancy-agreement',
      kind: 'service',
      name: 'Digital Tenancy Agreement',
      action: 'bind',
      serviceRef: 'service-tenancy-docs',
      config: {
        attributes: {
          documentType: 'tenancy-agreement',
          requiresSignature: true,
          legallyBinding: true
        }
      },
      orderIndex: 2
    },
    {
      id: 'rule-rent-payment',
      kind: 'service', 
      name: 'Automated Rent Collection',
      action: 'bind',
      serviceRef: 'service-payment-processor',
      config: {
        attributes: {
          frequency: 'weekly',
          paymentMethods: ['bank-transfer', 'automatic-payment'],
          currency: 'NZD'
        }
      },
      orderIndex: 3
    }
  ],
  tags: ['housing', 'social-services', 'kainga-ora'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  createdBy: 'user-kainga-ora-admin',
  updatedBy: 'user-kainga-ora-admin'
};

// Demo activities for the social housing policy
export const demoActivities: Event[] = [
  {
    id: 'event-1',
    eventType: 'policy.created',
    actorId: 'user-kainga-ora-admin',
    orgId: 'org-kainga-ora',
    targetId: 'policy-kainga-ora-social-housing',
    targetType: 'policy',
    payload: {
      policyTitle: 'Kāinga Ora Social Housing Framework',
      rulesCount: 3
    },
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'event-2',
    eventType: 'service.bound',
    actorId: 'user-tenant-smith',
    orgId: 'org-kainga-ora',
    targetId: 'service-tenancy-docs',
    targetType: 'service',
    payload: {
      tenantName: 'John Smith',
      serviceType: 'Digital Tenancy Agreement',
      policyId: 'policy-kainga-ora-social-housing'
    },
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  }
];