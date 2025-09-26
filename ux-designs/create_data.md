# UX Design Brief: Create Data Screen

**Screen:** Create Data  
**Example:** Housing Plans Dataset  

---

## Purpose
The **Create Data** screen allows users to define and expose datasets used across Forums and Services.  
Data objects are evidence and knowledge sources within the Eleutherios architecture.  

---

## Key Components
1. **Data Name** – e.g., "Housing Plans".  
2. **Description** – context and purpose.  
3. **Source** – uploaded file, API link, or external DB.  
4. **Tags** – for categorisation.  
5. **Permissions** – access rules.  

---

## User Flow
1. User names/describes dataset.  
2. Uploads or links source.  
3. Tags dataset.  
4. Sets access permissions.  
5. Publishes data, making it queryable.  

---

## Backend Considerations
- **Firestore Document Type:** `Data`  
- **Schema Reference:** See `schema.md > Data`  
- **Relationships:**  
  - `Data -> Service` (consumed by services)  
  - `Data -> Forum` (referenced in discussions)  

---

## Future Extensions
- Real-time streaming data.  
- AI-enriched semantic search.  
- Data provenance & lineage tracking.  

---

**Status:** MVP priority.
