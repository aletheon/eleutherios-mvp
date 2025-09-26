# UX Design Brief: Create Policy Screen

**Screen:** Create Policy  
**Example:** Carbon Emission  

---

## Purpose
The **Create Policy** screen enables users to establish governance rules that define how related services, forums, and consumers interact.  
A **Policy** is the backbone of governance — containing rules that instantiate into **Forums** and guide **Services**.  

---

## Key Components

1. **Details Section**
   - Policy name: "Carbon Emission"
   - Description: Defines rules or standards around carbon emissions.

2. **Photo**
   - Visual representation (e.g., carbon emission icon/illustration).

3. **Tags**
   - Metadata for search and categorisation.  
   - Example tags: `Carbon`, `Emission`.

4. **Linked Entities**
   - **Managers:** Users responsible for policy oversight (e.g., regulators, administrators).  
   - **Consumers:** Users impacted by or consuming the policy (e.g., citizens, businesses).  
   - **Forums:** Instantiated discussions derived from rules in the policy.  
   - **Services:** Applications or offerings that consume or enforce the policy.  

---

## User Flow
1. User specifies policy name and description.  
2. User uploads a photo/icon.  
3. User adds relevant tags.  
4. User links **Managers**, **Consumers**, **Forums**, and **Services**.  
5. Once saved, the policy is available for instantiation (rules → forums/services).  

---

## Backend Considerations
- **Firestore Document Type:** `Policy`
- **Schema Reference:** See `schema.md > Policies`
- **Relationships:**
  - `Policy -> Forum` (one-to-many, via rule instantiation)  
  - `Policy -> Service` (many-to-many)  
  - `Policy -> Manager` (many-to-many)  
  - `Policy -> Consumer` (many-to-many)  
- Policies must store:
  - Rule set (structured data, possibly JSON)
  - Linked entities (IDs of users, services, forums)
  - Metadata for governance (creation date, owner, versioning)

---

## Future Extensions
- Support **nested policies** (policy-in-policy inheritance).  
- Rule versioning and rollback.  
- Policy templates for common use cases (e.g., housing eligibility, emissions reporting).  
- Integration with external APIs (government registries, compliance systems).  
- AI-assisted policy drafting and rule-checking.  

---

**Status:** MVP priority.  
Policies are the *governance layer* of Eleutherios — they define the rules that instantiate into forums and guide services.
