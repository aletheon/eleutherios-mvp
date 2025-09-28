# Eleutherios Schema Specification

## Core Entities

### Policy
- **Attributes:**
  - `id`: unique identifier
  - `name`: string
  - `description`: string
  - `visibility`: enum (`public` | `private`)
  - `owner`: userRef
  - `rules`: list of Rule objects
  - `followers`: list of userRefs (users who follow this policy)
  - `createdAt` / `updatedAt`: timestamps

- **Behavior:**
  - Public policies are visible and consumable by all stakeholders.
  - Private policies are visible only to their creator and designated consumers.

### Rule
- **Attributes:**
  - `id`: unique identifier
  - `type`: enum (`Forum` | `Service` | `Policy`)
  - `targetRef`: reference to forum/service/policy
  - `parameters`: optional config (e.g., default stakeholders for forum)

- **Instantiation:**
  - Rules are not instantiated until a Policy is consumed by a Service.

### Forum
- **Attributes:**
  - `id`, `name`, `description`
  - `policyRef`: policy that spawned this forum
  - `members`: list of stakeholders/services
  - `messages`: collection of message objects
  - `permissions`: map of stakeholder → permission set

- **Permissions (defaults):**
  - Add stakeholder/service [Yes|No]
  - Remove stakeholder/service [Yes|No]
  - Create sub-forum (becoming superuser) [Yes|No]
  - Create message [Yes|No]
  - Remove own message [Yes|No]
  - Remove others' messages [Yes|No]
  - Upload file [Yes|No]
  - Remove own file [Yes|No]
  - Remove others' files [Yes|No]

### Service
- **Attributes:**
  - `id`, `name`, `description`
  - `owner`: userRef
  - `policyRefs`: list of policies consumed
  - `type`: enum (`digital`, `analogue`)
  - `attributes`: ServiceAttributes (see below)
  - `forums`: list of forums linked to this service
  - `status`: Active / Pending / Archived

- **ServiceAttributes (examples):**
  - `price`: numeric, currency, free flag
  - `size`: string or enum (S, M, L, etc.)
  - `color`: string
  - `quantity`: integer (remaining stock/capacity)
  - Flexible: services may define arbitrary attributes, but all must point to a Service/Forum/Policy to do useful work.

### Data
- **Attributes:**
  - `id`, `owner`, `policyRef`
  - `type`: file, record, API result, etc.
  - `storageRef`: pointer to storage layer
  - Used by services and forums for persistence and exchange.

### User
- **Attributes:**
  - `id`, `name`, `email`, `photo`
  - `followers`: list of userRefs
  - `following`: list of userRefs
  - `favourites`: list of serviceRefs
  - `activities`: list of active policies/forums/services
  - `CERT`: aggregated score across services
  - `newsfeed`: dynamic list of updates from followed/favourited services/users

- **CERT Dimensions:**
  - Cooperation: frequency of adding others’ services to policies/forums
  - Engagement: responsiveness + positive ratings
  - Retention: 
    - For paid services: how many people buy and return
    - For free/non-profit services: how many people use and return
  - Trust: followers + subscribers

---

## Relationships

- Policy → Rule → (Forum | Service | Policy)
- Forum ↔ Members (services/stakeholders)
- Service ↔ Policies (consumed)
- User ↔ Services (owned, favourited)
- User ↔ Policies/Forums (activities, participation)
- Newsfeed aggregates events across services, forums, and policies.

---

## Extensions

- Notifications for service updates, new posts, status changes.
- Newsfeed is central hub for engagement.
- Following/favouriting system ties into CERT (Trust & Engagement).
