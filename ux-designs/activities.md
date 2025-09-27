# UX Design Brief: Activities Screen

**Screen:** Activities  
**Example:** A logged-in user (homeless person, KO staff, policymaker) sees all active policies, forums, and services they are participating in.  

---

## Purpose
The **Activities** screen gives end-users a **single navigation hub** for all their current engagements.  
It lists:
- Forums they are a member of.  
- Policies they are consuming.  
- Services they are connected to.  

This ensures users don’t lose track of where they are serving, collaborating, or consuming resources.  

---

## Key Components

1. **Header**
   - Title: **My Activities**  
   - User profile summary (photo, name, role).  

2. **Activities List**
   - Each item = a **Forum**, **Policy**, or **Service**.  
   - Shows:
     - Icon (Forum = speech bubble, Policy = scroll, Service = cog/hand).  
     - Title (e.g., “Tenancy Forum”).  
     - Linked Policy/Service context.  
     - Last activity timestamp.  

3. **Quick Actions**
   - **Enter Forum** → go directly to discussions.  
   - **View Policy** → open policy details.  
   - **Open Service** → show service detail screen.  

4. **Filters**
   - By type: Forum / Policy / Service.  
   - By recency: Last 7 days, last 30 days, all.  

---

## User Flow
1. User logs in.  
2. System queries their `activities` collection (forums, policies, services linked to their identity).  
3. Activities list is displayed with most recent at top.  
4. User taps any activity to open its detail screen.  

---

## Backend Considerations
- **Firestore Collection:** `Activities` (per user).  
- **Schema Fields:**
  - `userId` → reference to User.  
  - `activityType` → Enum: `Forum | Policy | Service`.  
  - `refId` → reference to Forum/Policy/Service document.  
  - `lastUpdated` → timestamp of last activity.  
- **Indexing:**  
  - By `userId` for quick lookup.  
  - By `lastUpdated` for sorting.  

---

## Permissions
- Each user sees only activities they are a stakeholder of.  
- Forums inherit default permissions (add/remove stakeholder, post, file upload, etc).  
- Policies and Services follow their own schema rules.  

---

## Future Extensions
- Notifications when activity updates (new message, rule change, service trigger).  
- AI summarisation of recent activity across all forums.  
- Export activity history for reporting.  

---

**Status:** MVP priority.  
Activities screen ensures stakeholders can navigate efficiently between their ongoing governance roles.
