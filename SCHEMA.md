# Schema v2 – Eleutherios Data & Execution Model

This version codifies **Policies, Forums, Services, Data**, plus extended rules for **public/private policies, CERT scoring, service attributes, following/favouriting, and newsfeed**.

---

## Core Entities

### Policy
- **Fields**
  - `id` (UUID)
  - `name`
  - `description`
  - `ownerId` (User / Service)
  - `visibility` → `public | private`
  - `rules[]` (Rule objects)
  - `createdAt`, `updatedAt`
- **Notes**
  - Public policies can be consumed by anyone.
  - Private policies only visible to creator or designated consumers.

---

### Rule
- **Fields**
  - `id` (UUID)
  - `name`
  - `type` → `forum | service | policy`
  - `targetRef` → points to Forum, Service, or Policy
  - `defaultStakeholders[]` (auto-added to Forums at instantiation)
  - `params` (key–value metadata)
- **Notes**
  - Rules **instantiate** only when a Policy is consumed.

---

### Forum
- **Fields**
  - `id` (UUID)
  - `policyId`
  - `name`
  - `stakeholders[]` (users/services with permissions)
  - `permissions[]` (matrix of stakeholder rights)
  - `messages[]`
  - `files[]`
  - `createdAt`, `updatedAt`
- **Permissions Matrix (default)**
  - Add/remove stakeholders
  - Create sub-forum
  - Add/remove messages
  - Add/remove files
- **Notes**
  - Forums = **network layer**, discussion + coordination.

---

### Service
- **Fields**
  - `id` (UUID)
  - `name`
  - `description`
  - `ownerId`
  - `attributes`
    - `price` (numeric, 0 = free)
    - `size` (string, e.g. “L”, “XL” or dimensions)
    - `color`
    - `quantity` (available units)
  - `status` → active | inactive | archived
  - `policyRefs[]`
  - `forumRefs[]`
  - `transactions[]`
- **Notes**
  - A Service can be analogue (human, org) or digital (IoT, API, AI).
  - May be free or priced (Stripe/PayPal/etc integration).
  - Services are the **information layer**.

---

### Data
- **Fields**
  - `id` (UUID)
  - `serviceId | forumId | policyId`
  - `type` → transaction | log | file | cert
  - `payload` (JSON)
  - `createdAt`
- **Notes**
  - Data = **storage layer** (state of interactions).
  - Used for CERT metrics, logs, analytics.

---

### User
- **Fields**
  - `id` (UUID)
  - `name`
  - `profile`
  - `certScore`
  - `followers[]`
  - `following[]`
  - `favourites[]` (services, policies, forums)
- **CERT Calculation**
  - **C**ooperation: adding others’ services to policies/forums
  - **E**ngagement: response time + ratings/reviews
  - **R**etention: (profit) # follow-up sales; (free) # repeat uses
  - **T**rust: followers + subscribers
  - User.certScore = aggregate of their Services’ CERT

---

### Newsfeed
- **Fields**
  - `id` (UUID)
  - `userId`
  - `items[]`
    - `sourceType` → service | forum | policy | user
    - `eventType` → update | newMessage | newFile | statusChange
    - `createdAt`
- **Notes**
  - Feeds aggregate updates from favourites, follows, subscriptions.
  - Default landing dashboard for active users.

---

## Relationships
- `Policy -> Rule -> Forum/Service/Policy`
- `Forum -> Stakeholders (Users/Services)`
- `Service -> PolicyRefs (consumed policies)`
- `Data -> Any entity`
- `User -> CERT (derived from Service performance)`
- `Newsfeed -> User follows/favourites`

---

## Execution Flow
1. **Policy defined** (with rules).  
2. **Service consumes Policy** → rules instantiated.  
3. Forums, Services, or linked Policies activated.  
4. Stakeholders engage in Forums or use Services.  
5. Data captured (transactions, logs, CERT).  
6. Users notified via Newsfeed.
