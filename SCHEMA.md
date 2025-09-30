# Eleutherios Data Model Specification

## Overview

Eleutherios implements the Policy–Forum–Service–Data (PFSD) model as a governance operating system. This document defines the core data structures and relationships.

## Core Entities

### Policy
Root governance objects containing rules that define system behavior.

```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "visibility": "public|private",
  "ownerId": "string",
  "rules": ["RuleObject"],
  "parentPolicyId": "string|null",
  "depth": "number",
  "createdAt": "timestamp",
  "updatedAt": "timestamp",
  "status": "draft|active|archived"
}
```

### Rule
Defines instantiation behavior within policies.

```json
{
  "id": "string",
  "name": "string",
  "type": "forum|service|policy",
  "target": "string",
  "parameters": "object",
  "conditions": "object|null"
}
```

### Forum
Instantiated spaces for dialogue and decision-making.

```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "stakeholders": ["UserId"],
  "permissions": "object",
  "policyId": "string",
  "messages": ["MessageObject"],
  "createdAt": "timestamp",
  "status": "active|closed|archived"
}
```

### Service
Analogue or digital agents that consume policies and provide functionality.

```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "type": "product|ai|api|human",
  "ownerId": "string",
  "price": "number",
  "currency": "string",
  "attributes": "object",
  "consumedPolicies": ["PolicyId"],
  "certScore": "number",
  "status": "active|inactive|maintenance"
}
```

### User
Community members and stakeholders.

```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "bio": "string",
  "avatar": "string",
  "certScore": "number",
  "stats": {
    "followers": "number",
    "following": "number",
    "services": "number",
    "activities": "number",
    "favourites": "number"
  },
  "location": "string",
  "lastActive": "timestamp"
}
```

### Activity
User interactions across the platform.

```json
{
  "id": "string",
  "userId": "string",
  "type": "policy_update|forum_post|service_created|etc",
  "targetId": "string",
  "targetType": "policy|forum|service",
  "content": "string",
  "timestamp": "timestamp",
  "metadata": "object"
}
```

## Policy Hierarchies and Validation

### Depth Limitations
- Maximum policy nesting depth: 12 levels
- Validation occurs at policy creation/save time
- Prevents circular references through dependency graph validation

### Breadcrumb Navigation
- Shows logical hierarchy, not instantiation path
- Private policies in breadcrumbs appear grayed/disabled but remain visible for context
- Format: `Parent Policy > Child Policy > Grandchild Policy`

### Standard Library Policies
Eleutherios provides foundational policies that services can consume:
- IdentityVerification
- PaymentProcessing
- ConflictResolution
- DataPrivacy
- ServiceRating

### Policy Reference Types
```
rule ExistingResource -> Forum("existing:forum-id")
rule NewResource -> Forum("create:forum-name", stakeholders=["role1", "role2"])
```

## Service Attributes

### Core Attributes
All services have these base attributes:
- Price: monetary cost
- Type: service category (product|ai|api|human)
- Availability: current status

### Type-Specific Attributes
Attributes that appear based on service category:

**Product Services:**
- Size, Color, Weight, Dimensions, Material

**AI Services:**
- Model type, Response time, Accuracy rating, Training data

**API Services:**
- Rate limits, Uptime SLA, Response format, Authentication method

**Human Services:**
- Qualifications, Availability hours, Languages, Location

### Search and Filtering
- Search filters adapt to service types present in results
- Custom attributes can be defined by service creators
- Faceted search based on attribute combinations

## CERT Scoring System

Cooperation, Engagement, Retention, Trust metrics for users and services.

### Calculation
- **C** – Cooperation: frequency of adding services to policies/forums
- **E** – Engagement: responsiveness + quality of ratings/reviews
- **R** – Retention: repeat usage (free) or sales (paid services)
- **T** – Trust: followers, subscriptions, endorsements

### Score Range
0-100, calculated weekly, influences platform recommendations and visibility.

## Data Relationships

### Policy Hierarchy
- Policies can reference other policies (parent-child relationships)
- Circular references prevented at design time
- Maximum depth of 12 levels enforced

### Service-Policy Consumption
- Services declare which policies they consume
- Many-to-many relationship
- Consumption creates dependency tracking

### Forum-Policy Instantiation
- Forums created through policy rule instantiation
- One-to-many relationship (policy can create multiple forums)
- Stakeholder membership defined by policy rules

### User Activities
- All user actions tracked as activities
- Activities feed the newsfeed system
- Used for CERT score calculations

## Validation Rules

### Policy Creation
1. Check circular reference prevention
2. Validate depth limits
3. Verify referenced policies exist and are accessible
4. Confirm rule syntax correctness

### Service Registration
1. Validate service type and attributes
2. Check policy consumption permissions
3. Verify owner permissions
4. Validate pricing and currency

### Forum Instantiation
1. Confirm policy rule authorization
2. Validate stakeholder list
3. Check naming conflicts
4. Verify permissions structure

## Storage Considerations

### Data Consistency
- Policy hierarchies maintained through foreign key constraints
- Activity logs immutable for audit trail
- CERT scores cached but recalculated periodically

### Performance
- Policy dependency graphs cached for quick validation
- Search indexes on service attributes and types
- Activity feeds pre-computed for active users

### Privacy
- User data encrypted at rest
- Activity logs anonymized after retention period
- Private policy content access controlled