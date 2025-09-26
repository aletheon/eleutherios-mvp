# UX Design Brief: Create Forum Screen

**Screen:** Create Forum  
**Example:** Wholesale Veges  

---

## Purpose
The **Create Forum** screen allows a user to establish a new space for discussion, collaboration, and action around a specific governance rule or service need.  
Forums are the *instantiated expression* of a rule within a **Policy**, enabling conversation and coordination.  

---

## Key Components

1. **Details Section**
   - Forum name: "Wholesale Veges"
   - Description: "Seeking wholesale fruit + veges."
   - Editable text fields for user-defined context.

2. **Photo**
   - Visual representation of the forum topic (e.g., image of vegetables).

3. **Tags**
   - Forum categorisation for discoverability.
   - Example tags: `Veges`, `Wholesale`.

4. **Linked Entities**
   - **Services:** Connections to services this forum interacts with (e.g., buyers, sellers).  
     Example shows 2 linked services.  
   - **Forums:** Sub-forums or related discussions.  
     Example shows 1 linked forum.  
   - **Files:** Documents, plans, or other attachments for sharing context.  
     Example shows 2 attached files.  

---

## User Flow
1. User enters the forum name and description.  
2. User uploads a representative photo.  
3. User adds tags for categorisation.  
4. User attaches relevant **Services**, **Forums**, or **Files**.  
5. Forum is published, visible to linked participants, and ready for real-time discussion.

---

## Backend Considerations
- **Firestore Document Type:** `Forum`
- **Schema Reference:** See `schema.md > Forums`
- **Relationships:**
  - `Forum -> Service` (many-to-many)
  - `Forum -> Policy` (one-to-one, via rule instantiation)
  - `Forum -> File` (many-to-many)
- Forums must store:
  - Linked services/IDs
  - Linked files (cloud storage references)
  - Tags for indexing and search
  - Chat history / message threads

---

## Lifecycle Rules
- Forums must always trace back to a **Policy Rule**.  
- Deleting a Forum does not delete the Policy or Service; only the instantiated discussion.  
- Archived Forums remain read-only but searchable.  
- Versioning: If a linked Policy updates, Forum displays a banner prompting participants to review changes.  

---

## Future Extensions
- Rich text / multimedia support inside forum threads.  
- Integration with video conferencing (Zoom, Meet).  
- Permission settings (open, invite-only, private).  
- AI-assisted summarisation of forum discussions.  
- Forum templates for common governance needs (housing walkthroughs, eligibility checks, resource sharing).

---

**Status:** MVP priority.  
Forums are the *action layer* of Eleutherios and essential for connecting **Policies** to **Services** in practice.
