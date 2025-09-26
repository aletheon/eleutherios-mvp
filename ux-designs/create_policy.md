# Create Policy – Defining the Root of Governance

## Purpose
The **Create Policy** screen lets stakeholders design a new **Policy** node.  
Policies are the core building blocks of Eleutherios: they define rules, contexts, and relationships that can then instantiate forums or link to services.  

---

## Layout & Sections

### Header
- Title: **Create a New Policy**  
- Short explainer: *“A policy is the root object that holds rules, forums, and services. Everything in Eleutherios starts with a policy.”*

---

### Input Fields
1. **Policy Title** (text, required)  
   - Example: “Social Housing Access 2025”  

2. **Description** (long text, optional)  
   - Outline the intent, scope, or kaupapa of this policy.  

3. **Parent Policy** (search + select, optional)  
   - Allows nesting: *Policy-in-Policy*.  
   - Example: Parent = “Housing” → New Policy = “Tenancy Support”.  

4. **Category / Kind** (dropdown)  
   - Domain (e.g., Housing, Healthcare, Food).  
   - Subdomain (e.g., Rooms, Allergies).  
   - Attribute Rule (e.g., No. of bedrooms).  
   - Service Link (points to an existing Service).  

5. **Ruleset** (list builder, optional)  
   - Each rule may:  
     - Become a Forum (for discussion).  
     - Reference another Policy (policy-in-policy).  
     - Reference a Service (service consumes this rule).  

6. **Start / End Date** (optional)  
   - Define temporal validity of the policy or rule.  

7. **Trigger (optional)**  
   - Cron job, IoT signal, or external API event.  

---

## Actions
- **Save Policy** → creates a new policy node.  
- **Cancel** → returns to Policy Explorer.  

---

## Flow Example
1. MSD policymaker logs in.  
2. Clicks *“Create Policy”*.  
3. Names it: *“Youth Housing Access Pilot 2026”*.  
4. Selects Parent = *Housing*.  
5. Adds rule: *“If applicant under 25, route to Youth Services Forum”*.  
6. Saves.  
7. New policy appears in the **Policy Tree**, with breadcrumb path back to *Housing*.  

---

## Data Model Links
- **Policy Table**: `policyId`, `parentPolicyId`, `title`, `description`, `kind`, `status`, `createdBy`.  
- **Rule Table**: Rules are nested, each with `ruleId`, `policyId`, `type`, `referenceId`.  
- **Forum Table**: A rule of type “forum” auto-creates a forum instance.  
- **Service Table**: A rule of type “service” references an existing serviceId.  

---

## Notes for Developers
- Validation: Require policy title.  
- Enforce no **circular parent references** (policy cannot point to itself).  
- Breadcrumb generation: recursively climb parentId to root.  
- Forum auto-creation on save when ruleset includes forum-type rule.  
- Support both **human authors** and **API imports**.  

---

## Example Use
- KO policymaker drafts “Housing Tenancy 2026” as parent.  
- Adds child policy “Emergency Housing”.  
- Adds service reference “Marae Accommodation Rotorua”.  
- Adds rule → auto-creates forum for stakeholders to debate the rule.  
