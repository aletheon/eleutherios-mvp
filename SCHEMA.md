# Eleutherios Schema Specification

This schema describes the core entities of the Eleutherios PFSD (Policy–Forum–Service–Data) model, aligned with EleuScript and supporting economic, social, and technical interoperability.

---

## Entities

### 1. Policy
- **Fields:**
  - `policyId` (UUID)
  - `title` (string)
  - `description` (string)
  - `rules` (array of Rule objects)
  - `createdBy` (UserRef)
  - `createdAt` (timestamp)
- **Behavior:**
  - A Policy defines rules.
  - Rules can point to:
    - Forum
    - Service
    - Policy (existing or runtime-generated)
- **Consumption:** Rules are instantiated *only when a Policy is consumed by a Service*.

---

### 2. Rule
- **Fields:**
  - `ruleId` (UUID)
  - `name` (string)
  - `type` (enum: Forum | Service | Policy)
  - `target` (ForumRef | ServiceRef | PolicyRef)
  - `defaultStakeholders` (array of UserRefs, if type = Forum)
- **Notes:**
  - Policy rules describe behavior but remain inert until consumed.

---

### 3. Forum
- **Fields:**
  - `forumId` (UUID)
  - `name` (string)
  - `description` (string)
  - `linkedServices` (array of ServiceRefs)
  - `linkedPolicies` (array of PolicyRefs)
  - `messages` (array of Message objects)
  - `permissions` (map of UserRef → PermissionSet)
- **Permissions:** Default set for any stakeholder:
  - Add stakeholder [Y/N]
  - Remove stakeholder [Y/N]
  - Create sub-forum [Y/N]
  - Create message [Y/N]
  - Remove own message [Y/N]
  - Remove others’ messages [Y/N]
  - Add file [Y/N]
  - Remove own file [Y/N]
  - Remove others’ files [Y/N]

---

### 4. Service
- **Fields:**
  - `serviceId` (UUID)
  - `name` (string)
  - `description` (string)
  - `owner` (UserRef)
  - `policyRefs` (array of PolicyRefs consumed)
  - `serviceAttributes` (see below)
  - `status` (enum: Active | Pending | Archived)
- **Behavior:**
  - A Service expresses behavior by consuming Policies.
  - Services may be:
    - Analogue (human stakeholder)
    - Digital (IoT, API, AI, SaaS, etc.)
- **Attributes (ServiceAttributes):**
  - `price` (currency value | null if free)
  - `size` (string, e.g., “M”, “Large”)
  - `color` (string, e.g., “Blue”)
  - `quantity` (int, inventory count)
- **Example:** T-shirt as Service with attributes (Price, Size, Color, Quantity).

---

### 5. Data
- **Fields:**
  - `dataId` (UUID)
  - `type` (enum: File | Record | Event | Stream)
  - `source` (ServiceRef | ForumRef)
  - `payload` (structured data / file reference)
  - `timestamp` (datetime)
- **Notes:**
  - Data persists the outcome of Services and Forums.
  - Used for analytics, history, and reporting.

---

### 6. User
- **Fields:**
  - `userId` (UUID)
  - `name` (string)
  - `email` (string)
  - `certScore` (float 0–100)
  - `activities` (array of ForumRefs, PolicyRefs, ServiceRefs)
- **CERT Scoring:**
  - **Cooperation:** Number of services (other than own) added to forums/policies + frequency.
  - **Engagement:** Response time to notifications + positive ratings/reviews.
  - **Retention:**  
    - Free service → how many people use it + repeat usage.  
    - Paid service → how many people buy it + repeat sales.  
  - **Trust:** Number of followers or subscribers to updates.
- **Notes:**
  - User’s overall CERT = average of their Service CERTs.

---

### 7. Activity
- **Fields:**
  - `activityId` (UUID)
  - `userRef` (User)
  - `context` (Forum | Policy | Service)
  - `role` (enum: Creator | Stakeholder | Consumer)
  - `timestamp` (datetime)
- **Notes:**
  - Activities provide quick navigation to all active contexts for a user.

---

## Relationships
- **Policy → Rule → (Forum | Service | Policy)**  
- **Forum ↔ Service** (many-to-many)  
- **Service ↔ Policy** (consumption)  
- **User ↔ Activity** (participation log)  
- **User ↔ CERT** (reputation/legitimacy metric)

---

## Extensions
- Payments: Stripe Connect, PayPal, others.  
- Shopping cart supports multi-provider checkout.  
- Future: Hardware-level EleuChip to embed PFSD protocol.

---
