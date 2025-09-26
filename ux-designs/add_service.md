# UX Design Brief: Add Service Screen

**Screen:** Add Service  
**Example:** Link a doctor’s clinic to a healthcare policy  

---

## Purpose
The **Add Service** screen allows a policymaker, forum manager, or stakeholder to attach an existing or new **Service** into the Eleutherios ecosystem.  

This is essential for:
- Expanding what a **Policy** can instantiate.  
- Letting stakeholders (e.g., KO, MSD, or an individual doctor) formally register their service.  
- Allowing analogue (human) or digital (IoT, API, AI) services to coexist under the same framework.  

---

## Key Components

1. **Service Information**  
   - Service Name  
   - Short Description  
   - Category (Food, Housing, Healthcare, Identity, etc.)  
   - Type: Analogue (human, organisation) / Digital (API, IoT, AI).  

2. **Policy Links**  
   - Attach to one or more **Policies**.  
   - Policies determine the rules that service must follow.  

3. **Forum Association**  
   - Choose which forums this service interacts with.  
   - Example: Doctor service joins “Community Health Forum.”  

4. **Metadata**  
   - Location / Geotag  
   - Contact info / Maintainer  
   - Capacity (patients, kg of food, housing units, etc.)  

5. **Payments Integration**  
   - Stripe (or equivalent).  
   - Options: one-off fee (doctor visit), subscription (weekly veges), donation model.  

6. **Attachments**  
   - Documents (plans, eligibility criteria).  
   - Images (logos, ID docs, photos).  

---

## User Flow
1. User clicks **Add Service**.  
2. Enters basic service details.  
3. Links the service to **Policies** (required) and optionally **Forums**.  
4. Configures metadata (location, capacity, payment options).  
5. Submits → service appears in **Service Search** and **Policy Detail**.  

---

## Backend Considerations
- **Firestore Document Type:** `Service`  
- **Schema Reference:** See `schema.md > Services`  
- **Relationships:**  
  - `Service -> Policy` (many-to-many)  
  - `Service -> Forum` (many-to-many)  
  - `Service -> Data` (logs, analytics, receipts)  
- Must store payment configuration (Stripe keys, pricing models).  

---

## Future Extensions
- Federated integration with KO/MSD/RealMe identity systems.  
- Automated service validation (e.g., health license check).  
- Service reputation scores from user reviews.  
- AI-assisted service discovery (recommendations).  

---

**Status:** MVP priority.  
Adds the ability to operationalise Eleutherios by connecting **Services** to **Policies** and making them available in **Forums**.
