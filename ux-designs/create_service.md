# UX Design Brief: Create Service Screen

**Screen:** Create Service  
**Example:** Housing Application Service  

---

## Purpose
The **Create Service** screen enables users to design a **Service** that delivers real-world actions based on Policy rules.  
Services are the execution layer, consuming Forums and Data to perform outcomes.  

---

## Key Components
1. **Service Name** – e.g., "Housing Application Service".  
2. **Description** – clear purpose statement.  
3. **Inputs** – required data or linked forums.  
4. **Outputs** – expected outcomes, documents, or actions.  
5. **Tags & Attachments** – for categorisation.  

---

## User Flow
1. User names/describes the service.  
2. Defines inputs and outputs.  
3. Links forums/data.  
4. Publishes service, making it discoverable and usable.  

---

## Backend Considerations
- **Firestore Document Type:** `Service`  
- **Schema Reference:** See `schema.md > Services`  
- **Relationships:**  
  - `Service -> Policy` (rule-driven)  
  - `Service -> Forum` (consumes)  
  - `Service -> Data` (consumes)  

---

## Future Extensions
- Service marketplaces.  
- AI-augmented service orchestration.  
- Integration with APIs and IoT devices.  

---

**Status:** MVP priority.
