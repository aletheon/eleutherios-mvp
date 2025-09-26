# UX Design Brief: Service Search

**Screen:** Search for Services  
**Example:** Homeless person searching for housing support services.  

---

## Purpose
The **Service Search** screen allows discovery of existing services linked to policies.  
It helps users (citizens, policymakers, forum members, or agencies like KO/MSD) quickly find available services.

---

## Key Components

1. **Search Bar**
   - Full-text search.  
   - Autocomplete from tags (e.g., `Housing`, `Healthcare`).  

2. **Filters**
   - Category (Housing, Food, Healthcare, Identity).  
   - Policy domain (e.g., Housing → Tenancy).  
   - Location (geo-radius search).  
   - Status (Active, Pending, Archived).  

3. **Results List**
   - Service name + description.  
   - Linked policy domain.  
   - Status indicator.  
   - Location metadata.  
   - Click → opens **Service Detail**.  

4. **Calls to Action**
   - **Create Service** (for logged-in users).  
   - **Propose Policy** (if no relevant service exists).  

---

## User Flow
1. User types query (e.g., *“housing near Christchurch”*).  
2. Filters refine results.  
3. Results show live services linked to housing policies.  
4. Selecting a service → **Service Detail** view.  

---

## Data Model Links
- **ServiceRef**: Services reference policies and forums.  
- **PolicyRef**: Shows domain/subdomain link.  
- **ForumRef**: Forums available from rules linked to the service.  
- **Search logs**: Store for analytics (e.g., unmet needs).  

---

## Notes for Developers
- Search must be **policy-aware** (always show which policy governs the service).  
- Public can search; only logged-in users can create/attach services.  
- Must support **federated search** in future (e.g., KO, MSD, RealMe).  

---
