# UX Design Brief: Create Data Screen

**Screen:** Create Data  
**Example:** Housing Plans Dataset  

---

## Purpose
The **Create Data** screen allows users to upload, define, or reference data assets.  
Data underpins all **Policies**, **Forums**, and **Services**, providing the factual basis for governance.  

---

## Key Components

1. **Details Section**
   - Data name: "Housing Plans Dataset"
   - Description: "Blueprints and plans for social housing."
   - Editable fields for metadata.  

2. **Data Type**
   - File upload (PDF, CSV, Image, etc.)  
   - API endpoint (external dataset)  
   - Structured dataset (Firestore or Postgres schema)  

3. **Tags**
   - Categorisation for discoverability.  
   - Example tags: `Housing`, `Blueprints`, `Construction`.  

4. **Linked Entities**
   - **Policies:** Rules this data informs.  
   - **Forums:** Discussions where this data is shared.  
   - **Services:** Services consuming this dataset.  

5. **Access & Permissions**
   - Public, private, or restricted (invite-only).  
   - Controls who can view or update the dataset.  

---

## User Flow
1. User names and describes the dataset.  
2. Uploads file or enters API/data source reference.  
3. Adds tags and metadata.  
4. Links to relevant **Policies**, **Forums**, or **Services**.  
5. Sets access permissions.  
6. Publishes dataset, available to authorised users or services.  

---

## Backend Considerations
- **Firestore Document Type:** `Data`
- **Schema Reference:** See `schema.md > Data`
- **Relationships:**
  - `Data -> Policy` (many-to-many)  
  - `Data -> Forum` (many-to-many)  
  - `Data -> Service` (many-to-many)  
- Must store:
  - File storage reference (cloud link)  
  - Metadata (format, size, type, owner)  
  - Linked entity IDs  
  - Permissions  

---

## Future Extensions
- Versioning and dataset history.  
- Integration with open data portals.  
- AI summarisation of datasets.  
- Data provenance and trust scoring.  

---

**Status:** MVP priority.  
Data is the *knowledge layer* of Eleutherios, informing and sustaining the **Policy–Forum–Service** cycle.  
