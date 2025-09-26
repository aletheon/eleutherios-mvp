# Service Detail – Braeburn Apples

## Purpose
The **Service Detail** screen shows the full description and metadata of a selected service.  
In this demo: **Braeburn Apples** is a community food provisioning service that consumes policies around **Food Access** and **Distribution**.

This screen allows the user (stakeholder, service, or policy participant) to:
- View the service name, description, and key metadata.
- See linked policies (e.g., Food Provision, Housing, Healthcare).
- Interact with associated forums (discussions on rules).
- Connect or subscribe their own participation (stakeholder join).

---

## Layout & Sections

### Header
- Service Title: **Braeburn Apples**
- Category: **Food Provision Service**
- Owner: [Org/Community Name]
- Created: [Creation Date]

### Core Details
- **Description**:  
  A food access service enabling local communities to distribute Braeburn apples (and similar produce) through shared provisioning policies.  
- **Status**: Active / Pending / Archived  
- **Policy Link(s)**: Points to `Food Policy` → `Provision` → `Community Pantry`.

### Metadata
- Location (geo-tag or address).  
- Capacity (units, kg, or participants).  
- Contact / Maintainer.

### Forums
- Auto-generated from rules (e.g., “Fair Distribution Rule”, “Expiry Rule”).  
- Each rule becomes a clickable forum where stakeholders debate or manage the specifics.

### Actions
- **Join as Stakeholder** → adds user/service to forum + policy.  
- **Consume Policy** → service pulls live policy rules (real-time).  
- **Trigger Service** → run process or event (IoT, cron job, etc.).  

---

## Data Model Links
- **PolicyRef**: `Food > Provision` (policy → service relationship).  
- **ForumRef**: Generated forums from rules.  
- **ServiceRef**: This screen = service instance.  
- **Data Layer**: Logs interactions (who joined, what rules were invoked, etc.).

---

## Visual (See Image)
- **Left Panel**: Service logo + metadata.  
- **Right Panel**: Description, linked policies, and rules → forums.  
- **Bottom**: Call-to-action buttons.

---

## Notes for Developers
- Ensure **services dynamically pull current rules** at runtime (no static copies).  
- Build with extendable schema so any service type (food, housing, health) follows this same pattern.  
- Permissions: Only **Owner** can edit; **Stakeholders** can comment in forums; **Participants** can view.  
