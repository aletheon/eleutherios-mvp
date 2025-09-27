# Eleutherios Schema (Updated)

This schema defines the backend model for Policies, Forums, Services, and Data in Eleutherios.  
It aligns with **EleuScript** execution.

---

## Core Entities

### Policy
- `id`: string (UUID)
- `name`: string
- `description`: string
- `rules`: array of Rule objects
- `owner`: reference (Service/Stakeholder)

### Rule
- `id`: string
- `type`: enum {Forum, Service, Policy}
- `target`: reference (Forum, Service, Policy)
- `parameters`: JSON object (config e.g., Stripe currency, default stakeholders)
- `status`: {declared, instantiated}

### Forum
- `id`: string
- `name`: string
- `description`: string
- `stakeholders`: array of references (Services)
- `permissions`: JSON object per stakeholder
- `linkedServices`: array of Service IDs
- `linkedPolicies`: array of Policy IDs
- `messages`: collection (threaded)

### Service
- `id`: string
- `name`: string
- `type`: enum {Human, API, IoT, AI, PaaS, IaaS}
- `description`: string
- `policiesConsumed`: array of Policy IDs
- `owner`: stakeholder reference
- `status`: {active, inactive}
- `integration`: JSON (Stripe, PayPal, API keys, etc.)

### Data
- `id`: string
- `name`: string
- `type`: enum {file, record, transaction}
- `location`: string (URL or storage ref)
- `owner`: stakeholder reference
- `created`: timestamp

---

## Forum Permissions (Default)

- Add stakeholder/service → default = No  
- Remove stakeholder/service → default = No  
- Create sub-forum → default = No  
- Post message → default = Yes  
- Remove own message → default = Yes  
- Remove others’ messages → default = No  
- Upload file → default = Yes  
- Remove own file → default = Yes  
- Remove others’ files → default = No  

Superusers can override. Policies can enforce stricter/more open defaults.

---

## Relationships

- Policy → has many Rules.  
- Rule → instantiates Forum/Service/Policy when consumed.  
- Forum → links to Policies + Services + Data.  
- Service → consumes Policies, interacts in Forums.  
- Data → belongs to Forums/Services, referenced by Policies.

---

## Notes for Developers

- Store in Firestore as hierarchical collections (Policy > Rule, Forum > Stakeholders).  
- Consider Postgres for relational queries (many-to-many mapping).  
- Permissions should be enforced at query layer (Firestore Security Rules).  
