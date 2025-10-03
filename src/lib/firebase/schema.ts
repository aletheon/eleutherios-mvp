// lib/firebase/schema.ts - Updated schema for sub-policy functionality

export interface Policy {
  id: string;
  name: string;
  description?: string;
  
  // Policy hierarchy
  parent_policy_id?: string;        // NULL for root policies
  parent_forum_id?: string;         // Forum where sub-policy was created
  child_policy_ids?: string[];      // Track child policies
  
  // EleuScript content
  rules: string[];                  // Raw EleuScript rules
  parsed_rules?: ParsedRule[];      // Parsed rule objects
  
  // Governance
  stakeholders: string[];           // Authorized participants
  permissions?: Record<string, string[]>; // Role-based permissions
  
  // Metadata
  created_by: string;               // User who created this policy
  created_at: FirebaseTimestamp;
  created_in_forum?: string;        // Forum context for sub-policies
  status: 'draft' | 'active' | 'inactive' | 'archived';
  
  // Execution tracking
  execution_history?: PolicyExecution[];
  last_executed?: FirebaseTimestamp;
}

export interface Forum {
  id: string;
  name: string;
  description?: string;
  
  // Policy connections
  policyId: string;                 // Primary policy
  connectedPolicies?: string[];     // Sub-policies created in this forum
  
  // Participants with role-based access
  participants: ForumMembership[];
  permissions: Record<string, string[]>; // Role → permissions mapping
  
  // Service integration
  serviceStatus: ServiceStatus[];
  connectedServices?: string[];
  
  // Dynamic expansion tracking
  dynamicallyExpanded?: boolean;
  expansionHistory?: ForumExpansion[];
  lastExpansion?: FirebaseTimestamp;
  
  // Original vs current state
  originalStakeholders?: string[];
  originalServices?: string[];
  
  // Metadata
  created_by: string;
  created_at: FirebaseTimestamp;
  updated_at?: FirebaseTimestamp;
  status: 'active' | 'archived';
}

export interface ForumMembership {
  userId: string;
  role: string;                     // 'stakeholder', 'admin', 'observer', etc.
  joinedAt: FirebaseTimestamp;
  addedViaPolicy?: string;          // Policy ID if added through sub-policy
  permissions?: string[];           // Individual permissions override
}

export interface ServiceStatus {
  serviceName: string;
  status: 'available' | 'activated' | 'completed' | 'pending' | 'failed';
  activatedBy?: string;
  activatedAt?: FirebaseTimestamp;
  addedViaPolicy?: string;          // Policy ID if added through sub-policy
  parameters?: Record<string, any>;
  
  // Service-specific data
  serviceType?: 'payment' | 'booking' | 'coordination' | 'notification';
  externalServiceId?: string;       // Stripe, Google Calendar, etc.
  metadata?: Record<string, any>;
}

export interface ForumExpansion {
  new_stakeholders: string[];
  new_services: string[];
  new_policies: string[];
  expansion_triggered_by: string;   // User who triggered expansion
  expansion_timestamp: FirebaseTimestamp;
  rule_executed?: string;           // EleuScript rule that caused expansion
  
  // Detailed changes
  permissions_added?: Record<string, string[]>;
  capabilities_added?: string[];
  services_activated?: string[];
}

export interface ParsedRule {
  ruleName: string;
  ruleTarget: 'Policy' | 'Forum' | 'Service';
  targetName: string;
  parameters?: Record<string, any>;
  isValid: boolean;
  errors?: string[];
  
  // Execution context
  parsed_at?: FirebaseTimestamp;
  parsed_by?: string;
  execution_ready?: boolean;
}

export interface PolicyExecution {
  rule_name: string;
  rule_target: string;
  executed_by: string;
  executed_at: FirebaseTimestamp;
  execution_context: {
    forum_id?: string;
    trigger_event?: string;
    parameters?: Record<string, any>;
  };
  result: {
    success: boolean;
    message: string;
    data?: any;
    error?: string;
  };
}

// New collections for governance tracking

export interface GovernanceEvent {
  id: string;
  type: 'sub_policy_created' | 'service_activated' | 'forum_expanded' | 'stakeholder_added';
  
  // Context
  forumId?: string;
  policyId?: string;
  serviceId?: string;
  
  // Actor
  triggeredBy: string;              // User ID
  timestamp: FirebaseTimestamp;
  
  // Details
  details: {
    ruleName?: string;
    ruleTarget?: string;
    targetName?: string;
    parameters?: Record<string, any>;
    
    // Change tracking
    before?: any;
    after?: any;
    changes?: string[];
  };
  
  // Audit trail
  ipAddress?: string;
  userAgent?: string;
  verified?: boolean;
}

export interface PolicyHierarchy {
  root_policy_id: string;
  parent_policy_id?: string;
  child_policies: {
    policy_id: string;
    created_at: FirebaseTimestamp;
    created_by: string;
    created_in_forum: string;
    active: boolean;
  }[];
  
  // Tracking
  depth: number;                    // How deep in hierarchy
  total_descendants: number;        // Count of all child policies
  updated_at: FirebaseTimestamp;
}

// Firestore collection structure:
/*
/policies/{policyId}              - Policy documents
/forums/{forumId}                 - Forum documents
/forums/{forumId}/messages        - Chat messages subcollection
/governance_events/{eventId}      - Governance audit trail
/policy_hierarchies/{rootId}      - Policy relationship tracking
/users/{userId}                   - User profiles
/services/{serviceId}             - Service definitions

// New indexes needed:
policies: 
  - parent_policy_id, created_at
  - created_by, status
  - parent_forum_id, created_at

forums:
  - policyId, dynamicallyExpanded
  - participants.userId
  - connectedPolicies (array)

governance_events:
  - forumId, timestamp
  - triggeredBy, timestamp
  - type, timestamp

policy_hierarchies:
  - root_policy_id
  - parent_policy_id
*/

// Migration script for existing data:
export const migrateForumsForSubPolicySupport = async () => {
  // Add required fields to existing forums:
  // - connectedPolicies: [original policyId]
  // - dynamicallyExpanded: false
  // - expansionHistory: []
  // - originalStakeholders: current participants
  // - originalServices: current serviceStatus
  
  // Add policy hierarchy tracking for existing policies:
  // - parent_policy_id: null (mark as root)
  // - child_policy_ids: []
  
  console.log('Migration would update existing forums and policies for sub-policy support');
};