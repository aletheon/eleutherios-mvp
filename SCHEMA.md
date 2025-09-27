# Eleutherios Schema Specification (Updated)

This document defines the **core schema** for Eleutherios MVP, updated with **ServiceAttributes** and **CERT** integration.

---

## 1. Policy
- **id**: string (UUID)
- **name**: string
- **description**: text
- **rules**: list of `Rule` objects
- **createdBy**: UserRef
- **createdAt**: timestamp
- **updatedAt**: timestamp

### Notes
- Policies are the *root objects* in EleuScript.
- Rules may point to **Forum**, **Service**, or another **Policy**.

---

## 2. Rule
- **id**: string
- **name**: string
- **type**: enum { Forum, Service, Policy }
- **targetRef**: ID of Forum/Service/Policy
- **parameters**: key-value map

### Notes
- Rules instantiate only when **consumed** by a Service.

---

## 3. Forum
- **id**: string
- **name**: string
- **description**: text
- **linkedPolicy**: PolicyRef
- **stakeholders**: [UserRef or ServiceRef]
- **messages**: collection of Message
- **permissions**: map<UserRef, PermissionSet>

### Permissions (default when stakeholder joins)
1. Add stakeholder [Yes|No]
2. Remove stakeholder [Yes|No]
3. Create sub-forum [Yes|No]
4. Create message [Yes|No]
5. Remove own message [Yes|No]
6. Remove others’ messages [Yes|No]
7. Upload file [Yes|No]
8. Remove own file [Yes|No]
9. Remove others’ files [Yes|No]

---

## 4. Service
- **id**: string
- **name**: string
- **description**: text
- **owner**: UserRef
- **linkedPolicies**: [PolicyRef]
- **attributes**: ServiceAttributes
- **forums**: [ForumRef]
- **status**: enum { Active, Pending, Archived }

---

## 5. ServiceAttributes
Every service can define attributes (free or paid):

- **Price**:  
  - type: float  
  - currency: string (e.g., "NZD")  
  - optional (null if free)

- **Size**: string (e.g., S, M, L, XL)  

- **Color**: string  

- **Quantity**: integer (available stock or capacity)  

---

## 6. User
- **id**: string
- **name**: string
- **email**: string
- **photo**: URL
- **cert**: CERT object
- **activities**: [ActivityRef] (forums, policies, services)

---

## 7. CERT (User Reputation System)
- **Cooperation**: count (services added to others’ forums/policies)  
- **Engagement**: response speed + average ratings  
- **Retention**:  
  - For free services: number of unique repeat users  
  - For paid services: number of repeat sales  
- **Trust**: followers/subscribers count  

### Calculation
- Service CERT = weighted sum of its metrics  
- User CERT = average of all owned services’ CERTs  

---

## 8. Data
- **id**: string
- **type**: enum { File, APIResponse, IoTSignal, StructuredData }
- **location**: storage reference (URL, bucket path, etc.)
- **owner**: UserRef
- **timestamp**: created/updated time

---

## 9. Activity
- **id**: string
- **userRef**: UserRef
- **entityRef**: Forum/Policy/ServiceRef
- **role**: enum { Participant, Stakeholder, Owner }
- **joinedAt**: timestamp

---

## Relationships Summary
- Policy → Rules → Forum/Service/Policy
- Forum ↔ Stakeholders (Users/Services)
- Service ↔ Policy (consumes)
- Service ↔ Forums (auto-generated from rules)
- User ↔ Activities (forums/policies/services)
- CERT is derived from **User + Services** activity

---

**Status:** Stable draft v2  
This schema aligns with EleuScript and latest UX (Activities, Service pricing, CERT reputation).  
