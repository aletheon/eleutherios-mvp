/** Common Types */
export type Id = string;            // ULID/UUIDv7
export type ISOTime = string;       // ISO-8601
export type Currency = string;      // ISO-4217, e.g. "NZD"

export type Visibility = 'public' | 'restricted' | 'private';
export type LifecycleStatus = 'draft' | 'active' | 'closed' | 'archived';

/** Users */
export interface User {
  id: Id;
  orgId: Id;
  handle?: string;           // user-friendly URL slug
  name: string;
  email: string;
  bio?: string;
  avatar?: string;          // URL
  cert: { c: number; e: number; r: number; t: number; score: number }; // 0..100
  location?: string;
  lastActive: ISOTime;
  createdAt: ISOTime;
  updatedAt: ISOTime;
  createdBy: Id;
  updatedBy: Id;
}

/** Organizations (Multi-tenancy) */
export interface Organization {
  id: Id;
  slug: string;
  name: string;
  description?: string;
  type: 'platform' | 'government' | 'enterprise' | 'community';
  settings: {
    visibility: Visibility;
    policyDepthLimit: number;
    allowExternalServices: boolean;
  };
  createdBy: Id;
  updatedBy: Id;
  createdAt: ISOTime;
  updatedAt: ISOTime;
  status: 'active' | 'suspended' | 'archived';
}

/** Policies (Declarative, Versioned) */
export interface Policy {
  id: Id;
  orgId: Id;
  slug?: string;
  title: string;
  description?: string;
  visibility: Visibility;
  ownerId: Id;                         // User id
  version: number;                     // starts at 1, monotonic
  effectiveFrom: ISOTime;
  effectiveTo?: ISOTime;
  supersedesPolicyId?: Id;
  parentPolicyId?: Id;
  depth: number;                       // enforced max 12
  status: LifecycleStatus;             // draft|active|archived
  rules: Rule[];                       // typed discriminated union
  tags?: string[];
  createdAt: ISOTime;
  updatedAt: ISOTime;
  createdBy: Id;
  updatedBy: Id;
}

/** Rule Guards (Access Control) */
export interface RuleGuard {
  roles?: ('owner'|'admin'|'moderator'|'member'|'guest')[];
  minCertScore?: number;               // e.g., >= 50
  attributes?: Record<string, unknown>; // ABAC (e.g., iwi/rohe, verified flags)
  schedule?: { cron?: string; start?: ISOTime; end?: ISOTime };
  limitPerActorPerDay?: number;
}

/** Rules (Discriminated Union) */
export type Rule = ForumRule | ServiceRule | PolicyRefRule;

export interface ForumRule {
  id: Id;
  kind: 'forum';
  name: string;
  action: 'create' | 'bind' | 'reference';
  forumRef?: Id;                       // when action='bind'|'reference'
  config?: {
    title?: string;
    description?: string;
    visibility?: Visibility;
    defaultRoles?: string[];           // role templates
    settings?: Record<string, unknown>;
  };
  guard?: RuleGuard;
  orderIndex?: number;
}

export interface ServiceRule {
  id: Id;
  kind: 'service';
  name: string;
  action: 'bind' | 'require';
  serviceRef?: Id;                     // when binding existing service
  config?: {
    requiredPolicies?: { policyId: Id; version?: number }[];
    attributes?: Record<string, unknown>;
  };
  guard?: RuleGuard;
  orderIndex?: number;
}

export interface PolicyRefRule {
  id: Id;
  kind: 'policy';
  name: string;
  reference: { policyId: Id; version?: number };
  importRules?: boolean;               // whether to inherit child rules
  guard?: RuleGuard;
  orderIndex?: number;
}

/** Forums (Runtime Instantiation) */
export interface Forum {
  id: Id;
  orgId: Id;
  policyId: Id;
  policyVersion: number;
  ruleId: Id;
  parentForumId?: Id;
  title: string;
  description?: string;
  visibility: Visibility;
  settings?: Record<string, unknown>;
  lastActivityAt?: ISOTime;
  status: Exclude<LifecycleStatus, 'draft'>; // active|closed|archived
  createdBy: Id;                       // User
  createdAt: ISOTime;
  updatedAt: ISOTime;
}

/** Forum Membership (RBAC/ABAC) */
export interface ForumMembership {
  id: Id;
  forumId: Id;
  userId: Id;
  orgId: Id;
  role: 'owner'|'admin'|'moderator'|'member'|'guest';
  attrs?: Record<string, unknown>;     // e.g., iwi, rohe, credentials
  joinedAt: ISOTime;
  leftAt?: ISOTime;
  invitedBy?: Id;
  status: 'active' | 'suspended' | 'left';
}

/** Messages (Normalized Collection) */
export interface Message {
  id: Id;
  forumId: Id;
  authorId: Id;
  orgId: Id;
  content: string;                     // markdown/plain
  contentType: 'text' | 'markdown' | 'html';
  createdAt: ISOTime;
  updatedAt: ISOTime;
  editedAt?: ISOTime;
  replyToId?: Id;
  reactions?: Record<string, Id[]>;    // emoji -> userIds
  status: 'active' | 'edited' | 'deleted' | 'moderated';
}

/** Services */
export type ServiceType = 'product' | 'ai' | 'api' | 'human';

export interface Service {
  id: Id;
  orgId: Id;
  slug?: string;
  ownerId: Id;                         // User
  type: ServiceType;
  title: string;
  description?: string;
  visibility: Visibility;
  attributes?: Record<string, unknown>;
  pricing?: {
    amountCents: number;
    currency: Currency;
    model: 'one-time' | 'subscription' | 'usage' | 'free';
  };
  availability: 'active' | 'inactive' | 'maintenance' | 'suspended';
  cert: { c: number; e: number; r: number; t: number; score: number };
  rating?: { average: number; count: number };
  createdAt: ISOTime;
  updatedAt: ISOTime;
  createdBy: Id;
  updatedBy: Id;
}

/** Service Binding (Policy-Service Relationship) */
export interface ServiceBinding {
  id: Id;
  serviceId: Id;
  policyId: Id;
  policyVersion: number;               // bind to specific version
  boundBy: Id;                         // User
  config?: Record<string, unknown>;
  createdAt: ISOTime;
}

/** Events (Immutable Audit Log) */
export type EventTopic = 'policy' | 'forum' | 'service' | 'user' | 'message';
export type EventAction =
  | 'created' | 'updated' | 'deleted' | 'archived'
  | 'posted' | 'joined' | 'left' | 'rated' | 'bound' | 'instantiated'
  | 'activated' | 'deactivated' | 'followed' | 'unfollowed'
  | 'invited' | 'approved' | 'rejected';

export interface Event {
  id: Id;
  idempotencyKey?: string;
  eventType: string;                   // structured as "topic.action"
  actorId?: Id;                        // User who performed action
  orgId: Id;
  targetId: Id;
  targetType: EventTopic;
  payload?: Record<string, unknown>;
  metadata?: {
    ipAddress?: string;
    userAgent?: string;
    source: 'web' | 'api' | 'system';
  };
  timestamp: ISOTime;
}

/** Activity (Derived from Events for Newsfeed) */
export interface Activity {
  id: Id;
  userId: Id;
  orgId: Id;
  type: EventAction;
  targetId: Id;
  targetType: EventTopic;
  content: string;
  timestamp: ISOTime;
  metadata?: Record<string, unknown>;
}

/** Standard Library Registry */
export interface StdPolicy {
  slug: 'identity-verification' | 'payment-processing' | 'conflict-resolution' | 'data-privacy' | 'service-rating';
  policyId: Id;
  version: number;
}

/** API Response Types */
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

/** Form/UI Types */
export interface PolicyForm {
  title: string;
  description?: string;
  visibility: Visibility;
  parentPolicyId?: Id;
  rules: Rule[];
  tags?: string[];
}

export interface ForumForm {
  title: string;
  description?: string;
  visibility: Visibility;
  parentForumId?: Id;
}

export interface ServiceForm {
  title: string;
  description?: string;
  type: ServiceType;
  visibility: Visibility;
  attributes?: Record<string, unknown>;
  pricing?: {
    amountCents: number;
    currency: Currency;
    model: 'one-time' | 'subscription' | 'usage' | 'free';
  };
}

/** Search and Filter Types */
export interface SearchFilters {
  query?: string;
  type?: ServiceType;
  visibility?: Visibility;
  priceRange?: { min: number; max: number };
  certScore?: { min: number; max: number };
  tags?: string[];
  location?: string;
}

export interface BreadcrumbItem {
  id: Id;
  title: string;
  type: 'policy' | 'forum' | 'service';
  accessible: boolean;
  url?: string;
}