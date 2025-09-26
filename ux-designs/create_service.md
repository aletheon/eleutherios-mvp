# Create Service – Link Services to Policies

## Purpose
The **Create Service** screen lets users define a new service instance that consumes a policy.  
Services can be human (e.g., social worker, housing provider) or non-human (IoT sensor, API, AI agent).  

This is how stakeholders extend Eleutherios into the world.

---

## Layout & Sections

### Header
- Title: **Create a New Service**.  
- Short explainer: *“A service is how you or your organisation bring a policy to life.”*  

### Input Fields
1. **Service Name** (text, required).  
   - Example: “Temporary Housing Support Christchurch”.  

2. **Description** (long text).  
   - Purpose of the service and how it links to the policy.  

3. **Policy Reference** (search + select).  
   - Attach to existing policy node (e.g., Housing → Tenancy).  
   - If none exists, propose a new policy.  

4. **Type** (dropdown).  
   - Human / Organisation.  
   - IoT Device.  
   - API.  
   - AI Agent.  

5. **Location / Coverage** (geotag or text).  
   - Single address, region, or nationwide.  

6. **Contact or Endpoint**  
   - For humans: email/phone.  
   - For IoT/API/AI: endpoint URL or token.  

7. **Status**  
   - Active / Pending / Archived.  

---

## Actions
- **Save Service** → creates a new service instance linked to selected policy.  
- **Cancel** → returns to previous screen.  

---

## Flow Example
1. KO staff logs in.  
2. Clicks *“Create Service”*.  
3. Names service: *“Ngāi Tahu Housing Advisory – South Island”*.  
4. Chooses Policy Reference: *Housing → Tenancy*.  
5. Marks type: *Organisation*.  
6. Sets region: *South Island*.  
7. Saves.  
8. Service is visible in **Service Search** and **Policy Detail**.  

---

## Data Model Links
- **Service Table**: `serviceId`, `name`, `description`, `policyRefId`, `type`, `location`, `contact`, `status`.  
- **Policy Table**: Service must store a foreign key to the referenced policy.  
- **Forum Link**: Optional forum auto-generated for stakeholder discussion.  

---

## Notes for Developers
- Validation: Require service name + policyRef.  
- Auto-generate `serviceId` (UUID).  
- Inherit breadcrumbs from policy tree for navigation.  
- Support both **manual creation** and **API-based onboarding** (for partner systems like MSD/KO).  

