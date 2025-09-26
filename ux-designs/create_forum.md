# UX Design Brief: Create Forum Screen

**Screen:** Create Forum  
**Example:** Wholesale Veges  

---

## Purpose
The **Create Forum** screen allows a user to establish a new space for discussion, collaboration, and action around a specific governance rule or service need.  
Forums are the *instantiated expression* of a rule within a **Policy**, enabling conversation and coordination.  

---

## Key Components
1. **Details Section** – name, description.  
2. **Photo** – representative image.  
3. **Tags** – categorisation.  
4. **Linked Entities** – Services, Forums, Files.  

---

## User Flow
1. User enters details.  
2. Uploads photo.  
3. Adds tags.  
4. Links services/forums/files.  
5. Forum is published.  

---

## Backend Considerations
- **Firestore Document Type:** `Forum`  
- **Schema Reference:** See `schema.md > Forums`  
- **Relationships:**  
  - `Forum -> Service` (many-to-many)  
  - `Forum -> Policy` (one-to-one via rule)  
  - `Forum -> File` (many-to-many)  

---

## Future Extensions
- Rich media, video, AI summaries.  
- Forum templates.  

---

**Status:** MVP priority.
