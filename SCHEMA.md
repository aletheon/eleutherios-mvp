# schema.md

## Overview
This schema defines the data structures for Eleutherios MVP, aligning with the PFSD (Policy–Forum–Service–Data) model and EleuScript execution.

---

## Core Entities

### Policy
- **id**: string (UUID)  
- **name**: string  
- **description**: text  
- **rules**: array of `Rule`  
- **ownerId**: reference to `User`  
- **createdAt / updatedAt**: timestamps  

---

### Rule
- **id**: string  
- **name**: string  
- **type**: enum (`PolicyRef | ForumRef | ServiceRef`)  
- **targetId**: string (points to referenced Policy, Forum, or Service)  
- **parameters**: JSON object (rule-specific configs, e.g., defaultStakeholders)  

---

### Forum
- **id**: string  
- **name**: string  
- **description**: text  
- **linkedServices**: array of Service IDs  
- **linkedPolicies**: array of Policy IDs  
- **files**: array of File IDs  
- **tags**: array of strings  
- **members**: array of `ForumMember`  
- **permissions**: managed at member level  
- **messages**: collection (threaded discussion, rich text)  

---

### ForumMember
- **userId / serviceId**: reference  
- **role**: enum (`superuser | participant | viewer`)  
- **permissions**: object with flags:
  - canAddStakeholder (Yes/No)  
  - canRemoveStakeholder (Yes/No)  
  - canCreateSubForum (Yes/No)  
  - canPostMessage (Yes/No)  
  - canRemoveOwnMessage (Yes/No)  
  - canRemoveOthersMessage (Yes/No)  
  - canUploadFile (Yes/No)  
  - canRemoveOwnFile (Yes/No)  
  - canRemoveOthersFile (Yes/No)  

---

### Service
- **id**: string  
- **name**: string  
- **description**: text  
- **ownerId**: reference to `User`  
- **status**: enum (`Active | Pending | Archived`)  
- **linkedPolicies**: array of Policy IDs  
- **linkedForums**: array of Forum IDs  
- **serviceAttributes**: see below  
- **CERT**: object { cooperation, engagement, retention, trust, overallScore }  
- **createdAt / updatedAt**: timestamps  

---

### ServiceAttributes
Flexible attributes to describe the behavior or offering of a service.  
- **price**: number (currency handled by payment service, e.g., Stripe)  
- **size**: enum (S, M, L, XL, custom strings)  
- **color**: string  
- **quantity**: integer (available stock or units)  
- **otherAttributes**: JSON (extensible key-value store)  

Examples:  
- T-Shirt service: `{ price: 25.0, size: "M", color: "Blue", quantity: 10 }`  
- Doctor service: `{ price: 80.0, appointmentLength: "30min", subscription: true }`  
- Free community service: `{ price: 0, availability: "daily", quantity: "unlimited" }`  

---

### User
- **id**: string  
- **name**: string  
- **email**: string  
- **profilePhoto**: string (URL)  
- **activities**: array of Forum/Policy IDs (where they’re participating)  
- **servicesOwned**: array of Service IDs  
- **CERT**: object { cooperation, engagement, retention, trust, overallScore }  
- **createdAt / updatedAt**: timestamps  

---

### Data
- **id**: string  
- **type**: enum (`File | API | IoT | DBRecord`)  
- **location**: URI / reference  
- **metadata**: JSON  
- **linkedService**: Service ID  

---

### CERT Metric
Each CERT metric is calculated for both `User` and `Service`.  

- **Cooperation**: # of external services/policies added into shared forums.  
- **Engagement**: responsiveness + ratings.  
- **Retention**:  
  - For-profit: repeat purchases.  
  - Non-profit: repeat uses.  
- **Trust**: followers, subscriptions, endorsements.  

**Overall Score** = weighted average.  
