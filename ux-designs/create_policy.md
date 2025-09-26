# UX Design Brief: Create Policy Screen

**Screen:** Create Policy  
**Example:** Social Housing Policy  

---

## Purpose
The **Create Policy** screen allows a user (individual, organisation, or institution) to define a new governance **Policy**.  
Policies are the root structure in Eleutherios: they contain **Rules**, which can be instantiated into **Forums**, **Services**, or **Data calls**.  

---

## Key Components

1. **Policy Details**
   - Policy name (e.g., "Social Housing Policy").
   - Description (context, purpose, goals).
   - Optional cover image.

2. **Rules Section**
   - Add individual rules (e.g., "Eligibility criteria for social housing").
   - Each rule can be:
     - **Policy in Policy** (sub-policy reference).
     - **Forum Instantiation** (create discussion around the rule).
     - **Service Call** (invoke a service defined elsewhere).
     - **Data Call** (query an external dataset).

3. **Tags**
   - Used for classification and discoverability (e.g., Housing, Social Impact).

4. **Attachments**
   - Upload supporting files or documents (e.g., government PDFs, legal references).

---

## User Flow
1. User enters policy name and description.  
2. User adds one or more rules.  
3. For each rule, user specifies whether it links to another policy, creates a forum, triggers a service, or queries data.  
4. User saves/publishes the policy.  
5. Published policies are visible to others for linking, instantiation, or adoption.  

---

## Backend Considerations
- **Firestore Document Type:** `Policy`
- **Schema Reference:** See `schema.md > Policies`
- **Relationships:**
  - `Policy -> Rule` (one-to-many).
  - `Rule -> Forum/Service/Data/Policy` (flexible, many-to-one).  
- Must support:
  - Nested policies.
  - Linking to multiple forums or services.  
  - References to external data APIs.

---

## Future Extensions
- Policy versioning (track changes over time).  
- Public vs private policies (visibility controls).  
- AI-assisted policy drafting (suggesting new rules).  
- Policy templates for common use cases (e.g., housing, healthcare, food).  
- Policy analytics (impact tracking, adoption metrics).  

---

**Status:** MVP priority.  
Policies are the *core abstraction* of Eleutherios. All other layers (Forums, Services, Data) derive from them.
