# UX Design Brief: Add Service

**Screen:** Add Service  
**Example:** Add "Community Shelter" to Housing Policy  

---

## Purpose
The **Add Service** screen allows a policymaker or stakeholder to attach a new service to an existing policy or forum.  
Services can be analogue (person, org) or digital (API, IoT, AI).  

---

## Key Components

1. **Service Details**
   - Service Name (text field).  
   - Description (long text).  
   - Category dropdown (Housing, Food, Healthcare, Identity, etc).  

2. **Policy Link**
   - Search + select an existing Policy.  
   - Services must be linked to at least one Policy.  

3. **Forum Link (Optional)**
   - Attach to a Forum where the rule is instantiated.  

4. **Ownership**
   - Define who owns/operates the service (person, org, or digital agent).  

5. **Pricing**
   - Free or Paid.  
   - Paid → integrates with Stripe Connect (default) or other providers (e.g., PayPal).  

---

## User Flow
1. Policymaker clicks **Add Service**.  
2. Enters details, links service to Policy (mandatory), Forum (optional).  
3. Defines ownership + pricing.  
4. Clicks **Save Service** → service becomes discoverable in **Service Search**.  

---

## Backend Considerations
- **Firestore Document Type:** `Service`  
- **Schema Reference:** See `schema.md > Services`  
- **Relationships:**  
  - `Service -> Policy` (one-to-many).  
  - `Service -> Forum` (optional).  
- **Payments:** Store payment provider + terms if applicable.  

---

## Future Extensions
- Allow multiple pricing tiers (e.g., subscription, one-off).  
- Federation: Services from other platforms (via APIs) can be imported.  
- Automatic AI-assistance to suggest links (Policy ↔ Service).  

---

**Status:** MVP essential.  
Adding services is the bridge between **Policy rules** and real-world provisioning.
