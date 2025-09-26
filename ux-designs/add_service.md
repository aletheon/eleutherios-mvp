# UX Design Brief: Add Service

**Screen:** Add Service  
**Example:** Linking *Braeburn Apples* service into a policy or forum.  

---

## Purpose
The **Add Service** screen lets users (including policymakers, managers, or forum members) attach an existing service to a **Policy** or **Forum**.  

This enables:
- Policymakers to include services in their policy domain.  
- Forum participants to suggest relevant services.  
- Multi-modal services (human, organisation, IoT, API, AI) to join as stakeholders.  

---

## Key Components

1. **Search Filters**
   - Range filter (price, capacity, etc.).  
   - Service owner filter (e.g., “Farmer LLC: Braeburn”).  
   - Tag filter (policy-aware tags like `Apples`, `Housing`).  

2. **Results List**
   - Thumbnail, title, and tags.  
   - Service metadata (e.g., quantity, unit).  
   - “Add” button to attach this service to the current forum or policy.  

3. **Confirmation**
   - Selected services become linked to the policy/forum.  
   - Permissions flow is inherited from the parent policy.  

---

## Data Model Links
- **ServiceRef**: The service instance being attached.  
- **PolicyRef / ForumRef**: Destination for the service link.  
- **StakeholderRef**: Any attached service automatically registers as a stakeholder.  

---

## User Flow
1. Search for an existing service.  
2. Select service(s).  
3. Confirm → service appears inside the **Policy** or **Forum** context.  

---

## Developer Notes
- A **service = stakeholder** (analogue or digital).  
- Attaching service updates both `Policy` and `Service` documents with bidirectional links.  
- Audit trail: log *who attached which service where*.  

---
