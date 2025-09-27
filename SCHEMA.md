# Eleutherios Schema Specification

This document defines the core schema for the Eleutherios MVP platform, aligned with PFSD (Policy, Forum, Service, Data) and EleuScript conventions.

---

## Core Entities

### Policy
- **id**: string (UUID)
- **name**: string
- **description**: string
- **rules**: array of `RuleRef`
- **createdBy**: `UserRef`
- **createdAt**: timestamp
- **updatedAt**: timestamp

**Notes**:  
Policies contain *rules*. Each rule points to a Forum, Service, or Policy. Policies are only instantiated when *consumed* by a Service.

---

### Rule
- **id**: string
- **policyId**: `PolicyRef`
- **name**: string
- **type**: enum(`forum`, `service`, `policy`)
- **targetRef**: ID (ForumRef | ServiceRef | PolicyRef)
- **defaultStakeholders**: array of `UserRef` (applies if type = forum)
- **metadata**: object (rule-specific parameters)

---

### Forum
- **id**: string
- **policyId**: `PolicyRef`
- **name**: string
- **description**: string
- **tags**: array of strings
- **linkedServices**: array of `ServiceRef`
- **linkedFiles**: array of `FileRef`
- **messages**: array of `Message`
- **permissions**: object (default + overrides per stakeholder)
- **createdAt**: timestamp

**Permissions** (default per stakeholder):  
- Add stakeholder [Yes|No]  
- Remove stakeholder [Yes|No]  
- Create sub-forum [Yes|No]  
- Post message [Yes|No]  
- Remove own message [Yes|No]  
- Remove others’ messages [Yes|No]  
- Upload file [Yes|No]  
- Remove own file [Yes|No]  
- Remove others’ files [Yes|No]  

---

### Service
- **id**: string
- **owner**: `UserRef`
- **name**: string
- **description**: string
- **serviceType**: enum(`free`, `paid`)
- **attributes**: `ServiceAttributes`
- **linkedPolicies**: array of `PolicyRef`
- **linkedForums**: array of `ForumRef`
- **status**: enum(`active`, `pending`, `archived`)
- **createdAt**: timestamp

---

### ServiceAttributes
- **price**: number (nullable if free)
- **currency**: string (ISO-4217)
- **size**: string (e.g., "S", "M", "L", or dimension string)
- **color**: string
- **quantity**: number
- **customAttributes**: object (extensible)

**Note**:  
Attributes are defined via rules. For example:  
- Rule → Price (points to `PaymentService`)  
- Rule → Size (points to a selection service)  
- Rule → Color (points to a selection service)  
- Rule → Quantity (points to stock service)

---

### User
- **id**: string
- **name**: string
- **email**: string
- **certNumber**: number (aggregate CERT score)
- **services**: array of `ServiceRef`
- **activities**: array of `PolicyRef | ForumRef` (quick navigation)
- **createdAt**: timestamp

---

### CERT
Attached to both Services and Users.

- **cooperation**: number  
- **engagement**: number  
- **retention**: number  
  - Contextual:  
    - For `free` services → number of repeat users.  
    - For `paid` services → number of repeat buyers.  
- **trust**: number  
- **score**: number (aggregate)

---

### Data
- **id**: string
- **owner**: `UserRef`
- **serviceId**: `ServiceRef`
- **policyId**: `PolicyRef`
- **forumId**: `ForumRef`
- **payload**: object (raw or structured data)
- **timestamp**: timestamp

---

## Relationships
- **Policy → Rule → Forum/Service/Policy**  
- **Forum → Stakeholders (Users/Services)**  
- **Service → Policy** (consumption = instantiation of rules)  
- **User → Activities** (their live participation)  
- **User/Service → CERT**  

---

## Example (T-Shirt Service)

```eleuscript
policy TshirtPolicy {
  rule Price -> Service("StripePriceCapture", amount=25, currency="USD")
  rule Size -> Service("DropdownSelect", options=["S","M","L"])
  rule Color -> Service("DropdownSelect", options=["Red","Blue","Green"])
  rule Quantity -> Service("InventoryCheck", initial=100)
}
```

When consumed, this instantiates:
- A pricing service
- Size selector
- Color selector
- Stock checker  

All tied together under the TshirtPolicy.
```

