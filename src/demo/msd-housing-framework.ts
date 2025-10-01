import type { Policy, Rule, Forum, Service, Event, User, ForumMembership } from '@/lib/types';

// ============= STAKEHOLDER DEFINITIONS =============

export const stakeholders: User[] = [
  {
    id: 'user-msd-case-worker',
    orgId: 'org-msd',
    handle: 'sarah.msd',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@msd.govt.nz',
    bio: 'MSD Housing Case Worker specializing in emergency housing placement',
    cert: { c: 85, e: 92, r: 88, t: 90, score: 89 },
    location: 'Wellington, NZ',
    lastActive: new Date().toISOString(),
    createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'system',
    updatedBy: 'user-msd-case-worker'
  },
  {
    id: 'user-homeless-person',
    orgId: 'org-community',
    handle: 'james.applicant',
    name: 'James Wilson',
    email: 'james.wilson@gmail.com',
    bio: 'Seeking stable housing after job loss and relationship breakdown',
    cert: { c: 45, e: 60, r: 55, t: 50, score: 53 },
    location: 'Auckland, NZ',
    lastActive: new Date().toISOString(),
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'user-homeless-person',
    updatedBy: 'user-homeless-person'
  },
  {
    id: 'user-kainga-ora-liaison',
    orgId: 'org-kainga-ora',
    handle: 'maria.kainga',
    name: 'Maria Rodriguez',
    email: 'maria.rodriguez@kaingaora.govt.nz',
    bio: 'Kāinga Ora Housing Specialist - Emergency Housing Liaison',
    cert: { c: 78, e: 85, r: 82, t: 88, score: 83 },
    location: 'Auckland, NZ',
    lastActive: new Date().toISOString(),
    createdAt: new Date(Date.now() - 730 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'system',
    updatedBy: 'user-kainga-ora-liaison'
  },
  {
    id: 'user-support-coordinator',
    orgId: 'org-community',
    handle: 'alex.support',
    name: 'Alex Chen',
    email: 'alex.chen@communitylink.org.nz',
    bio: 'Community Support Coordinator - Housing navigation and wraparound services',
    cert: { c: 90, e: 88, r: 85, t: 92, score: 89 },
    location: 'Auckland, NZ',
    lastActive: new Date().toISOString(),
    createdAt: new Date(Date.now() - 1095 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'system',
    updatedBy: 'user-support-coordinator'
  }
];

// ============= MSD HOUSING REGISTER POLICY =============

export const msdHousingRegisterPolicy: Policy = {
  id: 'policy-msd-housing-register',
  orgId: 'org-msd',
  title: 'MSD Housing Register and Assessment Framework',
  description: 'Comprehensive policy for managing housing register applications, assessments, and priority allocation',
  visibility: 'public',
  ownerId: 'user-msd-case-worker',
  version: 1,
  effectiveFrom: new Date().toISOString(),
  depth: 0,
  status: 'active',
  rules: [
    {
      id: 'rule-initial-assessment',
      kind: 'forum',
      name: 'Initial Housing Needs Assessment',
      action: 'create',
      config: {
        title: 'Housing Needs Assessment Interview',
        description: 'Structured interview to assess housing needs, eligibility, and priority level',
        visibility: 'restricted',
        defaultRoles: ['applicant', 'case-worker', 'supervisor'],
        settings: {
          interviewRequired: true,
          documentationRequired: ['identity', 'income', 'accommodation-history'],
          assessmentCriteria: ['housing-need', 'income-threshold', 'residency-status']
        }
      },
      guard: {
        roles: ['case-worker', 'supervisor'],
        minCertScore: 70
      },
      orderIndex: 1
    },
    {
      id: 'rule-identity-verification',
      kind: 'policy',
      name: 'Applicant Identity and Eligibility Verification',
      reference: { policyId: 'eleutherios-identity-verification', version: 1 },
      orderIndex: 2
    },
    {
      id: 'rule-priority-assessment',
      kind: 'service',
      name: 'Housing Priority Assessment Tool',
      action: 'bind',
      serviceRef: 'service-priority-calculator',
      config: {
        attributes: {
          assessmentType: 'housing-priority',
          factors: ['urgent-need', 'vulnerability', 'time-on-register', 'local-connections'],
          scoringMethod: 'weighted-criteria'
        }
      },
      orderIndex: 3
    },
    {
      id: 'rule-register-placement',
      kind: 'service',
      name: 'Housing Register Database',
      action: 'bind',
      serviceRef: 'service-housing-register',
      config: {
        attributes: {
          registerType: 'social-housing',
          priorityLevels: ['A-urgent', 'B-serious', 'C-moderate', 'D-low'],
          reviewFrequency: '6-months'
        }
      },
      orderIndex: 4
    },
    {
      id: 'rule-inter-agency-coordination',
      kind: 'forum',
      name: 'Inter-Agency Housing Coordination',
      action: 'create',
      config: {
        title: 'MSD-Kāinga Ora Coordination Forum',
        description: 'Multi-agency forum for coordinating housing placements and support services',
        visibility: 'restricted',
        defaultRoles: ['msd-case-worker', 'kainga-ora-liaison', 'support-coordinator']
      },
      orderIndex: 5
    }
  ],
  tags: ['msd', 'housing-register', 'assessment', 'inter-agency'],
  createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  updatedAt: new Date().toISOString(),
  createdBy: 'user-msd-case-worker',
  updatedBy: 'user-msd-case-worker'
};

// ============= HOMELESS PERSON SUPPORT POLICY =============

export const homelessPersonSupportPolicy: Policy = {
  id: 'policy-homeless-support-pathway',
  orgId: 'org-community',
  title: 'Homeless Person Support and Housing Pathway',
  description: 'Comprehensive support framework for individuals experiencing homelessness to access housing and wraparound services',
  visibility: 'public',
  ownerId: 'user-support-coordinator',
  version: 1,
  effectiveFrom: new Date().toISOString(),
  parentPolicyId: 'policy-msd-housing-register',
  depth: 1,
  status: 'active',
  rules: [
    {
      id: 'rule-initial-contact',
      kind: 'forum',
      name: 'First Contact and Triage',
      action: 'create',
      config: {
        title: 'Housing Support Initial Contact',
        description: 'First point of contact for housing support - triage and immediate needs assessment',
        visibility: 'public',
        defaultRoles: ['applicant', 'support-coordinator'],
        settings: {
          accessMethod: 'walk-in-or-phone',
          urgencyTriage: true,
          immediateNeeds: ['emergency-accommodation', 'safety-assessment', 'basic-needs']
        }
      },
      orderIndex: 1
    },
    {
      id: 'rule-crisis-accommodation',
      kind: 'service',
      name: 'Emergency Accommodation Placement',
      action: 'bind',
      serviceRef: 'service-emergency-housing',
      config: {
        attributes: {
          accommodationType: 'emergency',
          maxDuration: '7-days',
          extensionCriteria: 'ongoing-assessment',
          supportServices: 'included'
        }
      },
      guard: {
        attributes: { urgentNeed: true },
        limitPerActorPerDay: 1
      },
      orderIndex: 2
    },
    {
      id: 'rule-msd-application',
      kind: 'policy',
      name: 'MSD Housing Register Application',
      reference: { policyId: 'policy-msd-housing-register', version: 1 },
      importRules: true,
      orderIndex: 3
    },
    {
      id: 'rule-support-coordination',
      kind: 'forum',
      name: 'Wraparound Support Coordination',
      action: 'create',
      config: {
        title: 'Holistic Support Planning',
        description: 'Coordination of wraparound services including health, employment, and social support',
        visibility: 'restricted',
        defaultRoles: ['applicant', 'support-coordinator', 'case-worker'],
        settings: {
          serviceTypes: ['mental-health', 'addiction', 'employment', 'family-services'],
          reviewFrequency: 'weekly',
          outcomeTracking: true
        }
      },
      orderIndex: 4
    },
    {
      id: 'rule-advocacy-support',
      kind: 'service',
      name: 'Housing Application Advocacy',
      action: 'bind',
      serviceRef: 'service-housing-advocate',
      config: {
        attributes: {
          advocacyType: 'housing-application',
          supportLevel: 'intensive',
          languages: ['english', 'te-reo-maori'],
          culturalSupport: 'available'
        }
      },
      orderIndex: 5
    }
  ],
  tags: ['homelessness', 'support-services', 'advocacy', 'wraparound'],
  createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  updatedAt: new Date().toISOString(),
  createdBy: 'user-support-coordinator',
  updatedBy: 'user-support-coordinator'
};

// ============= KAINGA ORA INTEGRATION POLICY =============

export const kainaOraIntegrationPolicy: Policy = {
  id: 'policy-kainga-ora-integration',
  orgId: 'org-kainga-ora',
  title: 'Kāinga Ora Multi-Agency Housing Integration',
  description: 'Framework for integrating Kāinga Ora housing provision with MSD assessments and community support services',
  visibility: 'public',
  ownerId: 'user-kainga-ora-liaison',
  version: 1,
  effectiveFrom: new Date().toISOString(),
  depth: 0,
  status: 'active',
  rules: [
    {
      id: 'rule-msd-register-integration',
      kind: 'policy',
      name: 'MSD Housing Register Integration',
      reference: { policyId: 'policy-msd-housing-register', version: 1 },
      orderIndex: 1
    },
    {
      id: 'rule-allocation-committee',
      kind: 'forum',
      name: 'Housing Allocation Committee',
      action: 'create',
      config: {
        title: 'Multi-Agency Housing Allocation Review',
        description: 'Weekly committee meeting to review high-priority housing applications and coordinate placements',
        visibility: 'restricted',
        defaultRoles: ['kainga-ora-liaison', 'msd-case-worker', 'support-coordinator'],
        settings: {
          meetingFrequency: 'weekly',
          decisionMaking: 'consensus',
          priorityReview: 'A-and-B-categories',
          documentationRequired: true
        }
      },
      guard: {
        roles: ['admin', 'moderator'],
        schedule: { cron: '0 10 * * 1' } // Monday 10am
      },
      orderIndex: 2
    },
    {
      id: 'rule-property-matching',
      kind: 'service',
      name: 'Automated Property Matching',
      action: 'bind',
      serviceRef: 'service-property-matcher',
      config: {
        attributes: {
          matchingCriteria: ['location-preference', 'property-size', 'accessibility-needs', 'pets'],
          automationLevel: 'assisted',
          humanReview: 'required'
        }
      },
      orderIndex: 3
    },
    {
      id: 'rule-tenancy-preparation',
      kind: 'forum',
      name: 'Tenancy Readiness Support',
      action: 'create',
      config: {
        title: 'Pre-Tenancy Support Forum',
        description: 'Support forum for tenancy preparation including furniture, utilities, and orientation',
        visibility: 'restricted',
        defaultRoles: ['incoming-tenant', 'kainga-ora-liaison', 'support-coordinator'],
        settings: {
          preparationServices: ['furniture-provision', 'utility-connection', 'orientation', 'neighbor-introduction'],
          timeframe: '2-weeks-pre-move'
        }
      },
      orderIndex: 4
    },
    {
      id: 'rule-ongoing-tenancy-support',
      kind: 'policy',
      name: 'Ongoing Tenancy Support Framework',
      reference: { policyId: 'policy-kainga-ora-social-housing', version: 1 },
      orderIndex: 5
    }
  ],
  tags: ['kainga-ora', 'integration', 'allocation', 'multi-agency'],
  createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  updatedAt: new Date().toISOString(),
  createdBy: 'user-kainga-ora-liaison',
  updatedBy: 'user-kainga-ora-liaison'
};

// ============= DEMO ACTIVITY STREAM =============

export const multiStakeholderActivities: Event[] = [
  {
    id: 'event-initial-contact',
    eventType: 'forum.joined',
    actorId: 'user-homeless-person',
    orgId: 'org-community',
    targetId: 'forum-housing-support-initial',
    targetType: 'forum',
    payload: {
      applicantName: 'James Wilson',
      contactMethod: 'walk-in',
      urgencyLevel: 'high',
      immediateNeeds: ['emergency-accommodation', 'safety-assessment']
    },
    metadata: {
      source: 'web',
      location: 'Auckland Community Centre'
    },
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'event-emergency-housing',
    eventType: 'service.bound',
    actorId: 'user-support-coordinator',
    orgId: 'org-community',
    targetId: 'service-emergency-housing',
    targetType: 'service',
    payload: {
      applicantName: 'James Wilson',
      accommodationType: 'emergency',
      duration: '7-days',
      location: 'Auckland CBD Motel'
    },
    timestamp: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'event-msd-assessment-scheduled',
    eventType: 'forum.created',
    actorId: 'user-msd-case-worker',
    orgId: 'org-msd',
    targetId: 'forum-housing-assessment-james',
    targetType: 'forum',
    payload: {
      applicantName: 'James Wilson',
      assessmentType: 'housing-needs-interview',
      scheduledDate: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
      caseWorker: 'Sarah Johnson'
    },
    timestamp: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'event-priority-assessment',
    eventType: 'service.activated',
    actorId: 'user-msd-case-worker',
    orgId: 'org-msd',
    targetId: 'service-priority-calculator',
    targetType: 'service',
    payload: {
      applicantName: 'James Wilson',
      priorityScore: 87,
      priorityLevel: 'A-urgent',
      factors: {
        'urgent-need': 9,
        'vulnerability': 8,
        'time-on-register': 2,
        'local-connections': 7
      }
    },
    timestamp: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'event-register-placement',
    eventType: 'service.bound',
    actorId: 'user-msd-case-worker',
    orgId: 'org-msd',
    targetId: 'service-housing-register',
    targetType: 'service',
    payload: {
      applicantName: 'James Wilson',
      registerPosition: 47,
      priorityLevel: 'A-urgent',
      location: 'Auckland',
      housingType: 'social-housing'
    },
    timestamp: new Date(Date.now() - 19 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'event-allocation-committee',
    eventType: 'forum.posted',
    actorId: 'user-kainga-ora-liaison',
    orgId: 'org-kainga-ora',
    targetId: 'forum-allocation-committee',
    targetType: 'forum',
    payload: {
      meeting: 'Weekly Allocation Committee',
      applicant: 'James Wilson',
      decision: 'property-match-identified',
      property: '3-bedroom unit, Mt Wellington',
      expectedMoveDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    },
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'event-tenancy-prep',
    eventType: 'forum.created',
    actorId: 'user-kainga-ora-liaison',
    orgId: 'org-kainga-ora',
    targetId: 'forum-tenancy-prep-james',
    targetType: 'forum',
    payload: {
      applicantName: 'James Wilson',
      property: '3-bedroom unit, Mt Wellington',
      preparationServices: ['furniture-provision', 'utility-connection', 'orientation'],
      timeline: '2-weeks'
    },
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
  }
];

// ============= FORUM MEMBERSHIPS =============

export const forumMemberships: ForumMembership[] = [
  {
    id: 'membership-james-initial-contact',
    forumId: 'forum-housing-support-initial',
    userId: 'user-homeless-person',
    orgId: 'org-community',
    role: 'member',
    attrs: { applicantStatus: 'active', urgencyLevel: 'high' },
    joinedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    status: 'active'
  },
  {
    id: 'membership-alex-coordinator',
    forumId: 'forum-housing-support-initial',
    userId: 'user-support-coordinator',
    orgId: 'org-community',
    role: 'moderator',
    attrs: { specialization: 'housing-navigation' },
    joinedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    status: 'active'
  },
  {
    id: 'membership-sarah-msd-assessment',
    forumId: 'forum-housing-assessment-james',
    userId: 'user-msd-case-worker',
    orgId: 'org-msd',
    role: 'moderator',
    attrs: { caseWorkerType: 'housing-specialist' },
    joinedAt: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString(),
    status: 'active'
  },
  {
    id: 'membership-james-msd-assessment',
    forumId: 'forum-housing-assessment-james',
    userId: 'user-homeless-person',
    orgId: 'org-msd',
    role: 'member',
    attrs: { applicantStatus: 'under-assessment' },
    joinedAt: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString(),
    status: 'active'
  },
  {
    id: 'membership-maria-allocation',
    forumId: 'forum-allocation-committee',
    userId: 'user-kainga-ora-liaison',
    orgId: 'org-kainga-ora',
    role: 'admin',
    attrs: { committeRole: 'housing-specialist' },
    joinedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active'
  },
  {
    id: 'membership-sarah-allocation',
    forumId: 'forum-allocation-committee',
    userId: 'user-msd-case-worker',
    orgId: 'org-kainga-ora',
    role: 'member',
    attrs: { committeeRole: 'msd-representative' },
    joinedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active'
  }
];

// ============= POLICY RELATIONSHIPS =============

export const policyRelationships = {
  // Shows how policies reference each other
  'policy-homeless-support-pathway': {
    references: ['policy-msd-housing-register'],
    referencedBy: []
  },
  'policy-kainga-ora-integration': {
    references: ['policy-msd-housing-register', 'policy-kainga-ora-social-housing'],
    referencedBy: []
  },
  'policy-msd-housing-register': {
    references: ['eleutherios-identity-verification'],
    referencedBy: ['policy-homeless-support-pathway', 'policy-kainga-ora-integration']
  }
};