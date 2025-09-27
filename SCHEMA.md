# Eleutherios Schema (PFSD)

## Core Entities

### Policy
- **Definition:** Container of governance rules.  
- **Fields:**
  - `id`: Unique identifier  
  - `name`: String  
  - `description`: String  
  - `rules[]`: Array of RuleRefs  
  - `owner`: ServiceRef  
  - `createdAt`, `updatedAt`

### Rule
- **Definition:** Binding between Policy and execution target.  
- **Types:** Forum | Service | Policy  
- **Fields:**
  - `id`  
  - `policyId`  
  - `type`: enum("Forum","Service","Policy")  
  - `parameters`: JSON (target args)  
  - `defaultStakeholders[]`  

### Forum
- **Definition:** Instantiated discussion space.  
- **Fields:**
  - `id`  
  - `name`  
  - `description`  
  - `tags[]`  
  - `linkedServices[]`  
  - `linkedPolicies[]`  
  - `linkedFiles[]`  
  - `messages[]`  

### Service
- **Definition:** Actor (human, org, IoT, API, AI).  
- **Fields:**
  - `id`  
  - `name`  
  - `description`  
  - `type`: enum("Human","Org","IoT","API","AI")  
  - `consumedPolicies[]`  
  - `status`  
  - `location`  
  - `metadata`  

### Data
- **Definition:** Storage + state of interactions.  
- **Fields:**
  - `id`  
  - `ownerId`  
  - `policyRefs[]`  
  - `serviceRefs[]`  
  - `payload`: JSON  
  - `timestamp`  

---

## Relationships

- **Policy → Rule** (1-to-many)  
- **Rule → Forum | Service | Policy** (1-to-1 by type)  
- **Service → Policy** (many-to-many via consumption)  
- **Forum → Service** (many-to-many stakeholders)  
- **Data → Service / Policy** (state tracking)  

---

## Notes
- Services can consume multiple Policies simultaneously.  
- Forums are always contextual to Policies.  
- Rules are dormant until instantiated by a consuming Service.  
- Data logs ensure traceability, analytics, and compliance.

📌 **Status:** Draft schema for Eleutherios MVP.
