# UX Design Brief: Policy Detail Screen

**Screen:** Policy Detail  
**Example:** Housing → Tenancy Policy  

---

## Purpose
The **Policy Detail** screen shows the structure, rules, and linked services of a specific policy.  
This is the *anchor view* where stakeholders, services, and forums meet around a policy.  

---

## Key Components

1. **Header**
   - Policy Title (e.g., *Housing: Tenancy*)  
   - Description of the policy’s purpose.  
   - Owner / guardian of the policy.  
   - Creation + update dates.  

2. **Rules**
   - List of rules defined inside the policy.  
   - Each rule can instantiate:
     - Another Policy (policy-in-policy).
     - A Forum (discussion space).
     - A Service (digital/analogue process).  

3. **Linked Services**
   - Shows services consuming or referencing this policy.  
   - Services may be:
     - **Paid** (via Stripe / subscription).  
     - **Free** (if stakeholder chooses to offer at no cost).  
   - Metadata: provider, category, cost/free label, status.  

4. **Forums**
   - Rule-driven forums automatically linked.  
   - Each clickable → open real-time discussion.  

5. **Attributes**
   - Static metadata like geolocation, tags, or categories.  
   - Links to other policies.  

---

## User Flow
1. User searches or clicks into a policy.  
2. Reads overview + description.  
3. Expands rules to see how they branch into services/forums.  
4. Chooses an action:  
   - Join a forum.  
   - Connect a new service (paid or free).  
   - Subscribe as a stakeholder.  

---

## Backend Considerations
- **Firestore Document Type:** `Policy`  
- **Schema Reference:** See `schema.md > Policies`  
- **Relationships:**  
  - `Policy -> Rule` (nested tree).  
  - `Policy -> Service` (many-to-many).  
  - `Policy -> Forum` (rules → forum instantiation).  

- Services must carry a **cost flag**:
  - `costType: "free" | "one-time" | "subscription"`.  

- Future extension: smart contract references for Stripe, PayPal, or blockchain settlement.  

---

## Visual (see UX mockup)
- **Top:** Policy title + description.  
- **Middle:** Rules + linked services.  
- **Right panel:** Forums + participants.  
- **Bottom:** Call-to-action buttons.  

---

**Status:** MVP must-have.  
The Policy Detail screen embodies the **Policy–Forum–Service–Data** stack in one place.  
