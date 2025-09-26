# Service Search – Discover Services

## Purpose
The **Service Search** screen allows users to find existing services linked to policies.  
It supports discovery, filtering, and entry into service detail pages.

This screen is critical for:
- A homeless person looking for housing, food, or healthcare.  
- KO/MSD staff helping clients access policy-driven services.  
- Community stakeholders checking what services already exist.

---

## Layout & Sections

### Header
- Title: **Search for Services**  
- Search bar (full-text + filter chips).

### Search Filters
- **Category**: Food, Housing, Healthcare, Identity, etc.  
- **Policy Link**: Choose by policy domain (e.g., Housing → Tenancy).  
- **Location**: Geotag radius or region.  
- **Status**: Active / Pending / Archived.  

### Results List
Each result shows:
- Service Name.  
- Short Description.  
- Policy Reference (domain/subdomain).  
- Status (Active, etc).  
- Location.  

Clicking a result → opens **Service Detail** screen.

### Call to Action
- **Create a Service** button → opens “Create Service” flow.  
- **Propose Policy** → if no service exists for their need.  

---

## Flow Example
1. Homeless user types: *“housing near Christchurch”*.  
2. System filters available services tagged to `Housing Policy`.  
3. Results list shows **Tenancy Support**, **Temporary Shelter**, etc.  
4. User clicks → **Service Detail: Temporary Shelter**.  

---

## Data Model Links
- **ServiceRef**: Services reference policies.  
- **PolicyRef**: Each result must indicate which policy it consumes.  
- **ForumRef**: Forums are secondary but accessible via Service Detail.  
- **Data Layer**: Search logs stored for analytics (e.g., unmet needs).  

---

## Visual (See UX Image)
- **Top**: Search bar + filters.  
- **Middle**: Results list, scrollable.  
- **Bottom**: Create/Propose CTA buttons.  

---

## Notes for Developers
- Search must be **policy-aware**: results show live links to policies, not static text.  
- Permissions: Public can search; only logged-in users can create.  
- Must support **federated search** in future (e.g., KO/MSD, RealMe integration).  
