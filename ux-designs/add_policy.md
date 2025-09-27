# UX Design Brief: Add Policy Screen

**Screen:** Add Policy  
**Example:** Add Housing Policy Rule  

---

## Purpose
The **Add Policy** screen allows a policymaker or stakeholder to attach a new **Policy** or **Rule** into the Eleutherios system.  
Policies form the root governance layer, and this screen is how new domains or subdomains are created and linked to services or forums.

---

## Key Components

1. **Policy Details**
   - Policy Name: e.g., "Housing → Tenancy"
   - Description: What this policy governs.
   - Optional metadata: tags, owner, jurisdiction.

2. **Rule Definition**
   - Add rule name (e.g., "No. of bedrooms requirement").
   - Define rule type: Attribute, Reference (to another Policy), Service Link, Forum Link.
   - Attach supporting documents.

3. **Visual Tree**
   - Display how the new policy/rule will sit inside the infinite governance tree.

4. **Linked Entities**
   - **Services:** Services consuming this policy.  
   - **Forums:** Forums instantiated by this rule.  
   - **Data:** Inputs/outputs linked to this policy.

---

## User Flow
1. User selects **Add Policy** from the system.  
2. Enters policy name, description, metadata.  
3. Adds one or more rules under the policy.  
4. Optionally links services or forums.  
5. Publishes → policy becomes visible in tree and searchable.

---

## Backend Considerations
- **Firestore Document Type:** `Policy`
- **Schema Reference:** See `schema.md > Policy`
- **Relationships:**
  - `Policy -> Rule` (1-to-many)
  - `Rule -> Forum` (optional)
  - `Rule -> Service` (optional)
- Policies must store:
  - Hierarchical parent/child relationships.
  - Links to services, forums, and data sources.
  - Status (Active, Archived).

---

## Future Extensions
- Smart templates for common domains (Housing, Healthcare, Food).  
- AI assistance in drafting policy text.  
- Community voting/endorsement on new policies.  
- API endpoints to import/export policies.

---

**Status:** MVP priority.  
This is how stakeholders bring **new governance rules** into Eleutherios, anchoring the Policy layer.
