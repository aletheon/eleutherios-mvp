# Eleutherios Schema (v2)

This schema defines the core data model for Eleutherios, aligned with the PFSD (Policy–Forum–Service–Data) architecture and EleuScript specification.

---

## Core Entities

### Policy
- **id**: string (UUID)
- **name**: string
- **description**: text
- **rules**: array of Rule objects
- **createdBy**: UserRef
- **createdAt**: timestamp
- **updatedAt**: timestamp

**Notes:**
- Policies are the top-level objects in EleuScript (`policy { ... }`).
- A Policy contains **rules**, each of which can reference a Forum, Service, or another Policy.

---

### Rule
- **id**: string (UUID)
- **name**: string (e.g., `RentPayment`)
- **type**: enum [Forum, Service, Policy]
- **targetRef**: ForumRef | ServiceRef | PolicyRef
- **parameters**: key/value map (optional)
- **defaultStakeholders**: array of UserRef (only if type = Forum)

**Instantiation:**  
Rules are **not executed** until the Policy is *consumed* by a Service.

---

### Forum
- **id**: string (UUID)
- **name**: string
- **description**: text
- **policyRef**: PolicyRef (from rule instantiation)
- **members**: array of StakeholderRef
- **messages**: array of Message objects
- **permissions**: map<UserRef, PermissionSet>
- **createdAt**: timestamp

#### Forum Permissions
Each stakeholder has a **PermissionSet** with defaults:  
- Add stakeholder/service: Yes/No  
- Remove stakeholder/service: Yes/No  
- Create sub-forum (superuser of it): Yes/No  
- Create message: Yes/No  
- Remove own message: Yes/No  
- Remove others' messages: Yes/No  
- Upload file: Yes/No  
- Remove own file: Yes/No  
- Remove others’ files: Yes/No  

---

### Service
- **id**: string (UUID)
- **name**: string
- **description**: text
- **owner**: UserRef
- **policyRefs**: array of PolicyRef (services consume policies)
- **attributes**: ServiceAttributes
- **status**: enum [Active, Pending, Archived]
- **location**: geo/string
- **createdAt**: timestamp

#### ServiceAttributes
- **price**: number (nullable, if free)
- **currency**: string (e.g., "NZD", "USD")
- **size**: string (e.g., "S", "M", "L", or arbitrary)
- **color**: string
- **quantity**: integer (remaining stock/capacity)

**Examples:**  
- A doctor’s consultation service (`price=120, currency=NZD`).  
- A free food distribution service (`price=null`).  
- A T-shirt sale service (`price=25, size=M, color=red, quantity=10`).  

---

### User
- **id**: string (UUID)
- **name**: string
- **email**: string
- **services**: array of ServiceRef
- **activities**: array of ActivityRef
- **certScore**: CERT object
- **createdAt**: timestamp

#### CERT (Ranking System)
- **cooperation**: int  
  (How many other services you add into policies/forums + frequency)  
- **engagement**: int  
  (Response speed to notifications, + good ratings/reviews)  
- **retention**: int  
  - If free service: number of follow-up *uses*  
  - If paid service: number of follow-up *sales*  
- **trust**: int  
  (Number of followers/subscribers to your service)  

User’s **CERT Number** = average of all service-level CERTs.

---

### Activity
Tracks what each user is actively serving in.  
- **id**: string
- **userRef**: UserRef
- **entityType**: enum [Policy, Forum, Service]
- **entityRef**: PolicyRef | ForumRef | ServiceRef
- **joinedAt**: timestamp

Appears in user’s *Activities collection* for quick navigation.

---

### Data
- **id**: string (UUID)
- **owner**: UserRef
- **type**: enum [File, Record, Stream]
- **storageRef**: URI (cloud, IPFS, etc.)
- **linkedTo**: PolicyRef | ServiceRef | ForumRef
- **createdAt**: timestamp

---

## Relationships

- Policy → Rule(s)
- Rule → Forum | Service | Policy
- Forum → Members (Stakeholders = Users or Services)
- Service → Consumes Policies
- User → Provides Services
- User → Has Activities
- User/Service → CERT Ranking
- Data → Linked to Policy/Service/Forum

---

## Notes for Developers
- All entities should be Firestore collections (NoSQL) or mapped relationally (Postgres).  
- Ensure **referential integrity** (refs must resolve to existing entities).  
- CERT scores should be recalculated asynchronously (e.g., Cloud Functions).  
- ServiceAttributes must be flexible — new attributes may be added by schema extension.  
- Forum permissions should be configurable per-member, but always with sensible defaults.

---

**Status:** Stable v2 (aligned with EleuScript + UX designs)
