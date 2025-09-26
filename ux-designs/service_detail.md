# UX Design Brief: Service Detail

**Screen:** Service Detail  
**Example:** Braeburn Apples (Food Provision Service).  

---

## Purpose
The **Service Detail** screen provides full metadata about a specific service.  
It connects the service to its governing policies and forums, and allows stakeholders to engage.  

---

## Key Components

1. **Header**
   - Service title.  
   - Category/domain (e.g., Food, Housing).  
   - Owner (organisation or individual).  

2. **Core Details**
   - Description of service.  
   - Status (Active / Pending / Archived).  
   - Policy link(s).  

3. **Metadata**
   - Location.  
   - Capacity (units, kg, or participants).  
   - Contact or maintainer.  

4. **Forums**
   - Auto-generated from rules in linked policies.  
   - Stakeholders can join discussions or debate rules.  

5. **Actions**
   - **Join as Stakeholder** (service, person, IoT, API, AI).  
   - **Consume Policy** (inherit rules live).  
   - **Trigger Service** (e.g., API call, scheduled job).  

---

## Data Model Links
- **ServiceRef**: This is the active service instance.  
- **PolicyRef**: Shows which policies this service consumes.  
- **ForumRef**: Derived forums for each rule.  
- **StakeholderRef**: Service is itself a stakeholder.  

---

## Notes for Developers
- Services must **pull current rules dynamically** (not copy static versions).  
- Schema must allow any type of service: human, organisation, IoT, API, AI.  
- Permissions:
  - Owner edits.  
  - Stakeholders can comment in linked forums.  
  - Public can view.  

---
