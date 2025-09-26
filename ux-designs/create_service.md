# UX Design Brief: Create Service Screen

**Screen:** Create Service  
**Example:** Housing Support Service  

---

## Purpose
The **Create Service** screen allows a user (organisation or individual) to define a new service offering.  
Services represent *practical actions* that can be delivered to meet needs expressed in **Policies** and **Forums**.  

---

## Key Components

1. **Details Section**
   - Service name: "Housing Support Service"
   - Description: "Temporary housing for displaced whānau."
   - Editable text fields for user-defined context.

2. **Service Provider**
   - Organisation or individual responsible for service delivery.
   - May integrate with existing government or NGO identifiers.

3. **Inputs / Requirements**
   - Fields that must be completed to access service.  
     Example: proof of ID, eligibility form, or consent.  

4. **Outputs / Outcomes**
   - What the service provides when executed.  
     Example: housing placement, financial support.

5. **Tags**
   - Categorisation for discoverability.  
   - Example tags: `Housing`, `Emergency`, `Whānau`.  

6. **Linked Entities**
   - **Policies:** Policy rules this service fulfills.  
   - **Forums:** Forums where this service is discussed or requested.  
   - **Files:** Supporting documents or resources.  

---

## User Flow
1. User names and describes the service.  
2. Defines provider and service requirements.  
3. Lists expected outputs.  
4. Adds tags and linked entities (Policies, Forums, Files).  
5. Publishes the service, making it discoverable and consumable by others.  

---

## Backend Considerations
- **Firestore Document Type:** `Service`
- **Schema Reference:** See `schema.md > Services`
- **Relationships:**
  - `Service -> Policy` (one-to-many)  
  - `Service -> Forum` (many-to-many)  
  - `Service -> File` (many-to-many)  
- Must store:
  - Provider details
  - Input requirements (structured schema)  
  - Outputs/outcomes
  - Linked entity IDs
  - Tags for indexing/search  

---

## Future Extensions
- Service rating and feedback.  
- Payment integration (for commercial services).  
- API endpoint linking external service providers.  
- Service templates (housing, healthcare, food distribution).  

---

**Status:** MVP priority.  
Services are the *execution layer* of Eleutherios, bridging **Policies** and **Forums** with real-world outcomes.  
