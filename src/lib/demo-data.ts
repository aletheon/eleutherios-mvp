// src/lib/demo-data.ts
import type { Policy, Rule, Service, User } from '@/types';

// Public Policies that homeless persons can consume

export const emergencyHousingPolicy: Policy = {
  id: 'policy-emergency-housing',
  title: 'Emergency Social Housing Framework',
  description: 'Unified policy ensuring immediate access to emergency housing for people experiencing homelessness. Coordinates MSD financial support, KO housing placement, and support services.',
  category: 'housing',
  version: '1.0',
  status: 'active',
  visibility: 'public', // Anyone can consume this policy
  rules: [
    {
      id: 'rule-housing-eligibility',
      kind: 'service',
      description: 'Immediate eligibility assessment for emergency housing',
      config: {
        name: 'Housing Eligibility Assessment',
        type: 'assessment',
        provider: 'MSD',
        autoApprove: true, // Automatic approval for homeless persons
        turnaroundTime: '24 hours'
      }
    },
    {
      id: 'rule-financial-support',
      kind: 'service',
      description: 'MSD financial support for accommodation costs',
      config: {
        name: 'Emergency Housing Special Needs Grant',
        type: 'financial',
        provider: 'MSD',
        amount: 'As needed',
        currency: 'NZD'
      }
    },
    {
      id: 'rule-housing-placement',
      kind: 'service',
      description: 'KO emergency housing placement',
      config: {
        name: 'Emergency Housing Placement',
        type: 'housing',
        provider: 'Kāinga Ora',
        priority: 'immediate'
      }
    },
    {
      id: 'rule-coordination-forum',
      kind: 'forum',
      description: 'Create coordination forum for all stakeholders',
      config: {
        title: 'Emergency Housing Coordination',
        defaultStakeholders: ['person', 'msd-caseworker', 'ko-representative'],
        permissions: {
          person: ['view', 'post', 'upload'],
          'msd-caseworker': ['view', 'post', 'approve', 'upload'],
          'ko-representative': ['view', 'post', 'approve', 'upload']
        }
      }
    },
    {
      id: 'rule-tenancy-agreement',
      kind: 'service',
      description: 'Digital tenancy agreement service',
      config: {
        name: 'Emergency Tenancy Agreement',
        type: 'legal',
        provider: 'Kāinga Ora',
        requiresSignature: true
      }
    },
    {
      id: 'rule-support-services',
      kind: 'service',
      description: 'Wraparound support services connection',
      config: {
        name: 'Support Services Connection',
        type: 'support',
        provider: 'Multiple',
        services: ['healthcare', 'food', 'mental-health', 'employment']
      }
    }
  ],
  tags: ['emergency', 'housing', 'social-services', 'kainga-ora', 'msd'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  createdBy: 'kainga-ora-admin',
  updatedBy: 'kainga-ora-admin'
};

export const healthcarePolicy: Policy = {
  id: 'policy-emergency-healthcare',
  title: 'Emergency Healthcare Access Framework',
  description: 'Ensures immediate access to primary healthcare, dental care, mental health services, and prescriptions for people experiencing homelessness.',
  category: 'healthcare',
  version: '1.0',
  status: 'active',
  visibility: 'public',
  rules: [
    {
      id: 'rule-primary-healthcare',
      kind: 'service',
      description: 'Free primary healthcare enrollment',
      config: {
        name: 'Primary Healthcare Enrollment',
        type: 'healthcare',
        provider: 'DHB',
        cost: 'Free',
        includes: ['GP visits', 'Nurse consultations', 'Basic treatments']
      }
    },
    {
      id: 'rule-dental-care',
      kind: 'service',
      description: 'Emergency dental care access',
      config: {
        name: 'Emergency Dental Care',
        type: 'dental',
        provider: 'Community Dental',
        cost: 'Free',
        includes: ['Emergency extractions', 'Pain relief', 'Basic repairs']
      }
    },
    {
      id: 'rule-mental-health',
      kind: 'service',
      description: 'Mental health support services',
      config: {
        name: 'Mental Health Support',
        type: 'mental-health',
        provider: 'Community Mental Health',
        cost: 'Free',
        includes: ['Counseling', 'Crisis support', 'Addiction services']
      }
    },
    {
      id: 'rule-prescriptions',
      kind: 'service',
      description: 'Subsidized prescription access',
      config: {
        name: 'Prescription Subsidy',
        type: 'pharmaceutical',
        provider: 'Pharmac',
        cost: '$5 per item',
        maxCost: '$20 per family per year'
      }
    },
    {
      id: 'rule-healthcare-coordination',
      kind: 'forum',
      description: 'Healthcare coordination forum',
      config: {
        title: 'Healthcare Coordination',
        defaultStakeholders: ['person', 'gp', 'nurse', 'social-worker'],
        permissions: {
          person: ['view', 'post'],
          gp: ['view', 'post', 'prescribe'],
          nurse: ['view', 'post'],
          'social-worker': ['view', 'post']
        }
      }
    }
  ],
  tags: ['emergency', 'healthcare', 'dental', 'mental-health', 'dhb'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  createdBy: 'dhb-admin',
  updatedBy: 'dhb-admin'
};

export const foodSecurityPolicy: Policy = {
  id: 'policy-food-security',
  title: 'Food Security & Nutrition Framework',
  description: 'Ensures access to nutritious food through food banks, meal programs, and food grants for people experiencing hardship.',
  category: 'food-security',
  version: '1.0',
  status: 'active',
  visibility: 'public',
  rules: [
    {
      id: 'rule-food-bank-access',
      kind: 'service',
      description: 'Immediate food bank registration',
      config: {
        name: 'Food Bank Access',
        type: 'food',
        provider: 'Local Food Banks',
        cost: 'Free',
        frequency: 'Weekly',
        includes: ['Fresh produce', 'Dry goods', 'Protein', 'Dairy']
      }
    },
    {
      id: 'rule-meal-programs',
      kind: 'service',
      description: 'Community meal program access',
      config: {
        name: 'Community Meals',
        type: 'food',
        provider: 'Community Organizations',
        cost: 'Free',
        frequency: 'Daily',
        mealsPerDay: 2
      }
    },
    {
      id: 'rule-food-grants',
      kind: 'service',
      description: 'MSD food grants for purchasing food',
      config: {
        name: 'Food Grant',
        type: 'financial',
        provider: 'MSD',
        amount: 'Up to $200',
        frequency: 'As needed',
        currency: 'NZD'
      }
    },
    {
      id: 'rule-nutrition-support',
      kind: 'forum',
      description: 'Nutrition and dietary support coordination',
      config: {
        title: 'Nutrition Support',
        defaultStakeholders: ['person', 'nutritionist', 'social-worker'],
        permissions: {
          person: ['view', 'post'],
          nutritionist: ['view', 'post', 'advise'],
          'social-worker': ['view', 'post']
        }
      }
    }
  ],
  tags: ['food-security', 'nutrition', 'food-bank', 'msd'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  createdBy: 'msd-admin',
  updatedBy: 'msd-admin'
};

// Demo Users
export const demoUsers: User[] = [
  {
    id: 'user-john-smith',
    email: 'john.smith@example.com',
    name: 'John Smith',
    role: 'person',
    status: 'experiencing-homelessness',
    certScore: {
      cooperation: 0,
      engagement: 0,
      retention: 0,
      trust: 0
    },
    createdAt: new Date().toISOString(),
    activities: {
      policies: [],
      forums: [],
      services: []
    }
  },
  {
    id: 'user-sarah-jones',
    email: 'sarah.jones@msd.govt.nz',
    name: 'Sarah Jones',
    role: 'caseworker',
    organization: 'Ministry of Social Development',
    certScore: {
      cooperation: 85,
      engagement: 92,
      retention: 88,
      trust: 90
    },
    createdAt: new Date().toISOString(),
    activities: {
      policies: ['policy-emergency-housing', 'policy-food-security'],
      forums: [],
      services: []
    }
  },
  {
    id: 'user-mike-wilson',
    email: 'mike.wilson@kaingaora.govt.nz',
    name: 'Mike Wilson',
    role: 'housing-officer',
    organization: 'Kāinga Ora',
    certScore: {
      cooperation: 88,
      engagement: 90,
      retention: 85,
      trust: 92
    },
    createdAt: new Date().toISOString(),
    activities: {
      policies: ['policy-emergency-housing'],
      forums: [],
      services: []
    }
  },
  {
    id: 'user-dr-patel',
    email: 'dr.patel@dhb.govt.nz',
    name: 'Dr. Anjali Patel',
    role: 'healthcare-provider',
    organization: 'District Health Board',
    certScore: {
      cooperation: 90,
      engagement: 88,
      retention: 92,
      trust: 95
    },
    createdAt: new Date().toISOString(),
    activities: {
      policies: ['policy-emergency-healthcare'],
      forums: [],
      services: []
    }
  }
];

// Service template for homeless person to create
export const homelessPersonServiceTemplate = {
  name: 'Homeless Person Service Request',
  type: 'person',
  description: 'Service representing a person seeking emergency housing, healthcare, and food security',
  status: 'active',
  attributes: {
    needsHousing: true,
    needsHealthcare: true,
    needsFood: true,
    urgency: 'immediate'
  }
};