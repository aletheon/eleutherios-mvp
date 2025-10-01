# Eleutherios Data Model Specification v2

## Overview

Eleutherios implements the Policy–Forum–Service–Data (PFSD) model as a governance operating system. This document defines the production-ready data structures, validation rules, and implementation considerations.

## Core Type Definitions

### Common Types
```typescript
type Id = string;            // ULID/UUIDv7
type ISOTime = string;       // ISO-8601
type Currency = string;      // ISO-4217, e.g. "NZD"

type Visibility = 'public' | 'restricted' | 'private';
type LifecycleStatus = 'draft' | 'active' | 'closed' | 'archived';
```

### Users
```typescript
interface User {
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
}
```

### Policies (Declarative, Versioned)
```typescript
interface Policy {
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
}
```

### Rule Guards (Access Control)
```typescript
interface RuleGuard {
  roles?: ('owner'|'admin'|'moderator'|'member'|'guest')[];
  minCertScore?: number;               // e.g., >= 50
  attributes?: Record<string, unknown>; // ABAC (e.g., iwi/rohe, verified flags)
  schedule?: { cron?: string; start?: ISOTime; end?: ISOTime };
  limitPerActorPerDay?: number;
}
```

### Rules (Discriminated Union)
```typescript
type Rule = ForumRule | ServiceRule | PolicyRefRule;

interface ForumRule {
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

interface ServiceRule {
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

interface PolicyRefRule {
  id: Id;
  kind: 'policy';
  name: string;
  reference: { policyId: Id; version?: number };
  importRules?: boolean;               // whether to inherit child rules
  guard?: RuleGuard;
  orderIndex?: number;
}
```

### Forums (Runtime Instantiation)
```typescript
interface Forum {
  id: Id;
  orgId: Id;
  policyId: Id;
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
```

### Forum Membership (RBAC/ABAC)
```typescript
interface ForumMembership {
  forumId: Id;
  userId: Id;
  role: 'owner'|'admin'|'moderator'|'member'|'guest';
  attrs?: Record<string, unknown>;     // e.g., iwi, rohe, credentials
  joinedAt: ISOTime;
  leftAt?: ISOTime;
}
```

### Messages (Normalized Collection)
```typescript
interface Message {
  id: Id;
  forumId: Id;
  authorId: Id;
  content: string;                     // markdown/plain
  createdAt: ISOTime;
  editedAt?: ISOTime;
  replyToId?: Id;
  reactions?: Record<string, Id[]>;    // emoji -> userIds
}
```

### Services
```typescript
type ServiceType = 'product' | 'ai' | 'api' | 'human';

interface Service {
  id: Id;
  orgId: Id;
  ownerId: Id;                         // User
  type: ServiceType;
  title: string;
  description?: string;
  attributes?: Record<string, unknown>;
  price?: { amountCents: number; currency: Currency };
  availability?: 'active' | 'inactive' | 'maintenance';
  cert: { c: number; e: number; r: number; t: number; score: number };
  rating?: { average: number; count: number };
  createdAt: ISOTime;
  updatedAt: ISOTime;
}
```

### Service Binding (Policy-Service Relationship)
```typescript
interface ServiceBinding {
  id: Id;
  serviceId: Id;
  policyId: Id;
  policyVersion: number;               // bind to specific version
  boundBy: Id;                         // User
  config?: Record<string, unknown>;
  createdAt: ISOTime;
}
```

### Events (Immutable Audit Log)
```typescript
type EventTopic = 'policy' | 'forum' | 'service' | 'user';
type EventAction =
  | 'created' | 'updated' | 'deleted' | 'archived'
  | 'posted' | 'joined' | 'left' | 'rated' | 'bound' | 'instantiated'
  | 'activated' | 'deactivated';

interface Event {
  id: Id;
  orgId: Id;
  occurredAt: ISOTime;
  actorId?: Id;                        // User who performed action
  topic: { kind: EventTopic; id: Id };
  action: EventAction;
  payload?: Record<string, unknown>;
  idempotencyKey?: string;
}
```

### Standard Library Registry
```typescript
interface StdPolicy {
  slug: 'identity-verification'|'payment-processing'|'conflict-resolution'|'data-privacy'|'service-rating';
  policyId: Id;
  version: number;
}
```

## Validation Rules and Invariants

### Policy Validation
1. **Depth & Cycles**: On Policy save, enforce depth ≤ 12 and DAG check across `parentPolicyId` and `PolicyRefRule.reference`
2. **Version Monotonicity**: Policy versions must increment monotonically within organization
3. **Effective Windows**: `effectiveFrom` must be ≤ `effectiveTo` when both are specified
4. **Supersession Chain**: `supersedesPolicyId` must not create cycles

### Rule Instantiation
1. **Deterministic IDs**: Generate stable IDs for rule-created resources:
   ```typescript
   const forumId = ulid(hash(policyId, rule.id, rule.kind, JSON.stringify(rule.config)))
   ```
2. **Access Control**: `visibility='restricted'|'private'` requires role/guard validation
3. **Order Execution**: Rules execute in `orderIndex` order (ascending, nulls last)

### Service Binding
1. **Version Stability**: ServiceBinding must reference concrete policy version
2. **Policy Updates**: When policy is updated, existing bindings remain stable until explicitly migrated
3. **Circular Dependencies**: Prevent circular service-policy binding chains

### Event Immutability
1. **Append-Only**: Events are never modified after creation
2. **Idempotency**: Duplicate `idempotencyKey` within 24h window rejected
3. **Derivation**: Feeds, stats, and CERT scores derived from event stream

## CERT Scoring System

### Components
- **C (Cooperation)**: Cross-referencing policies/services, collaboration frequency
- **E (Engagement)**: Response quality, ratings participation, community involvement
- **R (Retention)**: Repeat usage patterns, service loyalty, long-term participation
- **T (Trust)**: Network endorsements, verified credentials, reputation signals

### Calculation Rules
```typescript
interface CERTCalculation {
  weights: { c: number; e: number; r: number; t: number }; // sum to 1.0
  timeDecay: { halfLife: number };                         // days
  rateLimits: {
    maxRatingsPerActor: number;                           // per day
    cooldownPeriod: number;                               // hours
  };
  antiGaming: {
    raterWeights: Record<string, number>;                 // verified=1.0, new=0.5, etc.
    minimumAge: number;                                   // days before score counts
  };
}
```

### Recalculation
- Store components `{c,e,r,t}` + final `score`
- Recalculate weekly via background job
- Rate-limit rating/review events per actor

## Access Control and Privacy

### Breadcrumb Privacy Policy
1. **Authorized Viewers**: Show full breadcrumb path with clickable links
2. **Unauthorized Viewers**: Display "Private policy" placeholder without revealing titles/owners
3. **Restricted Policies**: Show titles but disable navigation for non-members

### Visibility Rules
- **Public**: Accessible to all organization members
- **Restricted**: Requires explicit membership or invitation
- **Private**: Only visible to owner and explicitly granted users

### Data Protection
- Never leak private policy titles in breadcrumbs to unauthorized users
- Audit all access attempts through Event system
- Implement field-level encryption for sensitive attributes

## Database Schema and Indexing

### Required Indexes
```sql
-- Core entity queries
CREATE INDEX idx_policies_org_visibility_status ON policies (orgId, visibility, status, updatedAt DESC);
CREATE INDEX idx_forums_policy_activity ON forums (policyId, lastActivityAt DESC);
CREATE INDEX idx_memberships_forum ON forum_memberships (forumId, role);
CREATE INDEX idx_memberships_user ON forum_memberships (userId, joinedAt DESC);

-- Service discovery
CREATE INDEX idx_services_org_type ON services (orgId, type, availability);
CREATE GIN INDEX idx_services_attributes ON services USING gin (attributes);

-- Policy versioning
CREATE INDEX idx_service_bindings_policy_version ON service_bindings (policyId, policyVersion);

-- Event sourcing
CREATE INDEX idx_events_topic_time ON events (topic.kind, topic.id, occurredAt DESC);
CREATE INDEX idx_events_actor_time ON events (actorId, occurredAt DESC);

-- Message pagination
CREATE INDEX idx_messages_forum_time ON messages (forumId, createdAt DESC);
```

### Storage Recommendations
- **Messages**: Separate collection for efficient pagination
- **Soft Delete**: Use `deletedAt` field with partial indexes (`WHERE deletedAt IS NULL`)
- **Search**: Index `title`/`description`/`content` in external search service for full-text
- **Archival**: Move old events to cold storage after retention period

## Migration from Current Schema

### Phase 1: Multi-tenancy
1. Add `orgId` to all entities
2. Add `createdBy`, `updatedBy` tracking fields
3. Migrate existing data to default organization

### Phase 2: Normalization
1. Split `Forum.stakeholders` → `ForumMembership` collection
2. Move `Forum.messages` → separate `Message` collection
3. Add foreign key constraints

### Phase 3: Versioning
1. Add Policy versioning fields (`version`, `effectiveFrom`, etc.)
2. Introduce `ServiceBinding` with version references
3. Migrate existing service-policy relationships

### Phase 4: Type Safety
1. Replace current Rule schema with discriminated union
2. Add `RuleGuard` access control
3. Validate existing rules against new schema

### Phase 5: Event Sourcing
1. Introduce immutable `Event` collection
2. Migrate activity generation to event-driven model
3. Derive existing stats from historical events

### Phase 6: Enhanced Scoring
1. Replace single `certScore` with component vector
2. Implement time-decay and anti-gaming measures
3. Backfill historical CERT calculations

## Standard Library Policies

### Core Governance Policies
```typescript
const STANDARD_POLICIES = [
  {
    slug: 'identity-verification',
    title: 'Identity Verification Framework',
    description: 'Standard identity verification with RealMe integration'
  },
  {
    slug: 'payment-processing', 
    title: 'Payment Processing Framework',
    description: 'Secure payment handling with multiple providers'
  },
  {
    slug: 'conflict-resolution',
    title: 'Conflict Resolution Framework', 
    description: 'Structured mediation and dispute resolution'
  },
  {
    slug: 'data-privacy',
    title: 'Data Privacy Framework',
    description: 'GDPR-compliant data handling and consent management'
  },
  {
    slug: 'service-rating',
    title: 'Service Rating Framework',
    description: 'Standardized rating and review system'
  }
] as const;
```

### Usage in EleuScript
```eleuscript
policy SocialHousing {
  rule VerifyIdentity -> Policy("eleutherios/identity-verification", version=1)
  rule ProcessPayments -> Policy("eleutherios/payment-processing", version=2)
  rule HandleDisputes -> Policy("eleutherios/conflict-resolution", version=1)
}
```

This production-ready schema provides a solid foundation for implementing the full Eleutherios governance platform with proper multi-tenancy, security, and scalability considerations.