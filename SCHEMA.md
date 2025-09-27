# Eleutherios Schema Specification (Updated)

This schema describes the data model for Eleutherios, including **Policies, Forums, Services, Data, and ServiceAttributes**.  
It aligns with the EleuScript specification, Forum permissions, and the Policy–Forum–Service–Data (PFSD) model.

---

## 1. Core Entities

### Policy
- **Definition:** A governance object that contains rules.  
- **Fields:**
  - `policyId` (string, unique)  
  - `name` (string)  
  - `description` (text)  
  - `rules[]` (array of Rule objects)  
  - `createdBy` (user/service ID)  
  - `createdAt` (timestamp)  
  - `updatedAt` (timestamp)  

### Rule
- **Definition:** A unit of behavior inside a Policy.  
- **Fields:**
  - `ruleId` (string, unique)  
  - `name` (string)  
  - `type` (enum: `Forum`, `Service`, `Policy`)  
  - `targetId` (reference → Forum/Service/Policy)  
  - `parameters` (map of key-value pairs for configuration)  
  - `defaultStakeholders[]` (user/service IDs auto-added when instantiated)  

Rules only instantiate **at runtime** when consumed by a Service.

### Forum
- **Definition:** A discussion/action space instantiated from a Rule.  
- **Fields:**
  - `forumId` (string, unique)  
  - `name` (string)  
  - `description` (text)  
  - `policyRef` (Policy ID that generated it)  
  - `stakeholders[]` (array of user/service IDs)  
  - `messages[]` (array of message objects)  
  - `files[]` (storage references)  
  - `permissions` (map per stakeholder, see below)  

#### Forum Permissions
Each stakeholder has a default permission set:  
- Add stakeholder [Yes|No]  
- Remove stakeholder [Yes|No]  
- Create sub-forum [Yes|No]  
- Post message [Yes|No]  
- Remove own message [Yes|No]  
- Remove others’ message [Yes|No]  
- Upload file [Yes|No]  
- Remove own file [Yes|No]  
- Remove others’ files [Yes|No]  

Permissions can be updated by the forum superuser.

### Service
- **Definition:** An executable function (analogue or digital).  
- **Types:** Human, IoT, API, AI, SaaS, etc.  
- **Fields:**
  - `serviceId` (string, unique)  
  - `name` (string)  
  - `description` (text)  
  - `policyRefs[]` (policies this service consumes)  
  - `attributes` (ServiceAttributes, see below)  
  - `owner` (user/service ID)  
  - `status` (enum: Active/Pending/Archived)  
  - `location` (geo)  
  - `createdAt`, `updatedAt`  

---

## 2. ServiceAttributes

Services may expose structured attributes for commercial or operational use.

### Example Attributes (T-shirt Service)
1. **Price** → Service that captures/returns the price.  
   - Can be free, fixed, subscription, or usage-based.  
2. **Size** → Service capturing available sizes (S, M, L, XL).  
3. **Color** → Service capturing available colors.  
4. **Quantity** → Service capturing stock/availability.  

**Note:** Any attribute = a Rule → which must point to a Service, Forum, or Policy.  
This ensures all attributes remain policy-aware and dynamic.

---

## 3. Data

- **Definition:** Persistent storage of interactions, logs, and state.  
- **Fields:**
  - `dataId` (string, unique)  
  - `owner` (user/service ID)  
  - `type` (enum: message, transaction, document, analytic)  
  - `content` (JSON blob or storage reference)  
  - `createdAt` (timestamp)  
  - `linkedPolicy`, `linkedForum`, `linkedService`  

---

## 4. Activities

Each end-user has an `activities` collection tracking:  
- Policies they are serving in.  
- Forums they are members of.  
- Services they own or consume.  

Activities enable **quick navigation** to a user’s current contributions.

---

## 5. Relationships

- **Policy → Rule → Forum/Service/Policy** (instantiated only at consumption).  
- **Service → PolicyRefs[]** (services consume policies).  
- **Forum → Stakeholders** (each is a Service).  
- **Attributes → always mapped to Service/Policy/Forum.**  

---

## 6. Extensibility

- Future attributes: subscription tiers, legal contracts, environmental metrics.  
- Future rule types: event triggers, AI inference services.  
- Future data links: blockchain notarisation, external registries.

---

**Status:** Living specification.  
Updates tracked in Git under `/docs/schema.md`.  

