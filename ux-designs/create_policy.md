# UX Design Brief: Create Policy Screen

**Screen:** Create Policy  
**Example:** Social Housing Policy  

---

## Purpose
The **Create Policy** screen allows authorised users to define a new **Policy**, the highest-level governance object.  
A policy encapsulates one or more **Rules**, which can instantiate Forums, Services, or Data calls.

---

## Key Components
1. **Policy Name** – descriptive, e.g., "Social Housing Policy".  
2. **Description** – plain language outline of scope/purpose.  
3. **Rules** – structured rules (JSON/YAML-like editor).  
4. **Tags** – for categorisation and discovery.  
5. **Attachments** – documents, links, or files supporting the policy.  

---

## User Flow
1. User names and describes the policy.  
2. User creates initial rules via the editor.  
3. User tags and attaches supporting docs.  
4. Policy is published, triggering materialisation into Forums, Services, or Data.  

---

## Backend Considerations
- **Firestore Document Type:** `Policy`  
- **Schema Reference:** See `schema.md > Policies`  
- **Relationships:**  
  - `Policy -> Rule` (one-to-many)  
  - `Rule -> Forum|Service|Data` (one-to-many instantiation)  

---

## Future Extensions
- Version control of policies.  
- AI-assisted rule drafting.  
- Policy templates for common use cases (housing, healthcare, education).  

---

**Status:** MVP priority.  
Policies are the root governance objects; they must exist to instantiate the other three layers.
