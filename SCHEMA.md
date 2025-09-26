# Eleutherios Firestore Schema

This document describes the initial Firestore schema for the **Eleutherios MVP**.  
The architecture is based on the **Policy → Forum → Service → Data** model, where all entities are policies or derived from policies.

---

## Collections Overview

- **Users**  
  Each human or non-human actor with a root policy.  
  `/users/{userId}`  

- **Policies**  
  Atomic governance unit. Can nest other policies, or instantiate rules into forums.  
  `/users/{userId}/policies/{policyId}`  

- **Forums**  
  Instantiated discussions or rule containers. May point back to a policy.  
  `/users/{userId}/policies/{policyId}/forums/{forumId}`  

- **Services**  
  APIs, IoT, AI, or business processes attached to policies.  
  `/services/{serviceId}`  

- **Data**  
  Underlying information streams exposed by services.  
  `/services/{serviceId}/data/{dataId}`  

---

## Visual Diagrams

### 1. Core Layers
```mermaid
flowchart TD
    Policy["Policy Layer"]
    Forum["Forum Layer"]
    Service["Service Layer"]
    Data["Data Layer"]

    Policy --> Forum
    Forum --> Service
    Service --> Data
    Data --> Policy
```

---

### 2. Nested Policy Example
```mermaid
flowchart TD
    A["User Root Policy (Healthcare)"]
    B["Allergies (Subdomain)"]
    C["DNA (Attribute Rule)"]
    D["Forum (instantiated from DNA rule)"]

    A --> B --> C --> D
```

---

### 3. Service Consumption
```mermaid
flowchart TD
    P["Housing Policy"]
    R["Rule: No. of Bedrooms"]
    F["Forum: Housing Stakeholders"]
    S["Service: Local Housing API"]
    D["Data: Housing Plans"]

    P --> R --> F
    F --> S --> D
```

---

### 4. Overall Firestore Shape
```mermaid
erDiagram
    USERS ||--o{ POLICIES : owns
    POLICIES ||--o{ FORUMS : instantiates
    POLICIES ||--o{ POLICIES : nests
    FORUMS ||--o{ MESSAGES : contains
    SERVICES ||--o{ DATA : streams
    POLICIES }o--o{ SERVICES : "references"
```

---

## Notes

- **Circular references** are prevented (policy cannot reference itself).  
- **Breadcrumbs** are materialised for navigation and auditing.  
- **Triggers** allow rules to instantiate dynamically from events (IoT, cron, AI).  
- All entities resolve back to **Policy** as the atomic unit.
