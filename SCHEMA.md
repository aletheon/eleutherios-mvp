# Eleutherios Schema

This schema defines the core entities of the Eleutherios MVP system, their relationships, and attributes.  
It aligns with the PFSD model (Policy, Forum, Service, Data) and EleuScript execution model.  

---

## Entities

### Policy
- **id**: string (UUID)
- **name**: string
- **description**: string
- **rules**: [RuleRef]
- **createdBy**: UserRef
- **createdAt**: timestamp
- **updatedAt**: timestamp

---

### Rule
- **id**: string
- **name**: string
- **type**: enum { Forum, Service, Policy }
- **targetRef**: ForumRef | ServiceRef | PolicyRef
- **defaultStakeholders**: [ServiceRef] (optional, pre-populates forum membership)
- **conditions**: JSON (optional)
- **createdAt**: timestamp

---

### Forum
- **id**: string
- **name**: string
- **description**: string
- **tags**: [string]
- **linkedServices**: [ServiceRef]
- **linkedPolicies**: [PolicyRef]
- **linkedFiles**: [FileRef]
- **messages**: [MessageRef]
- **permissions**: [PermissionRef]
- **createdBy**: UserRef
- **createdAt**: timestamp

---

### Forum Permissions
Each stakeholder in a forum has a set of permissions (default = true unless overridden).

- **addStakeholder**: boolean
- **removeStakeholder**: boolean
- **createSubForum**: boolean
- **createMessage**: boolean
- **removeOwnMessage**: boolean
- **removeOthersMessage**: boolean
- **uploadFile**: boolean
- **removeOwnFile**: boolean
- **removeOthersFile**: boolean

---

### Service
- **id**: string
- **name**: string
- **description**: string
- **owner**: UserRef
- **tags**: [string]
- **policies**: [PolicyRef]
- **forums**: [ForumRef]
- **serviceAttributes**: [ServiceAttribute]   ← NEW
- **status**: enum { active, inactive, archived }
- **createdAt**: timestamp

#### ServiceAttributes (NEW)
A flexible key-value structure that captures service-specific attributes.  
This allows modeling arbitrary rules like “Price”, “Size”, “Color”, “Quantity”.  

- **attributeName**: string (e.g., "Price", "Size", "Color", "Quantity")  
- **attributeType**: enum { string, number, enum, boolean }  
- **value**: string | number | boolean | enum  
- **unit**: string (optional, e.g., "NZD", "kg")  
- **required**: boolean  

Example for T-shirt Service:
```json
[
  { "attributeName": "Price", "attributeType": "number", "value": 29.99, "unit": "NZD", "required": true },
  { "attributeName": "Size", "attributeType": "enum", "value": "L", "required": true },
  { "attributeName": "Color", "attributeType": "string", "value": "Blue", "required": true },
  { "attributeName": "Quantity", "attributeType": "number", "value": 100, "required": true }
]
```

---

### Data
- **id**: string
- **owner**: ServiceRef
- **schema**: JSON schema definition
- **storageRef**: URI (Firestore, GCP bucket, etc.)
- **createdAt**: timestamp

---

### Message
- **id**: string
- **forumRef**: ForumRef
- **sender**: ServiceRef (user or agent posting)
- **content**: string | JSON | FileRef
- **timestamp**: timestamp

---

### User
- **id**: string
- **displayName**: string
- **email**: string
- **services**: [ServiceRef]
- **forums**: [ForumRef]
- **policies**: [PolicyRef]
- **activities**: [ActivityRef]

---

### Activity
- **id**: string
- **userRef**: UserRef
- **linkedForum**: ForumRef
- **linkedPolicy**: PolicyRef
- **lastActive**: timestamp

---

## Relationships

- Policy → Rule → (Forum | Service | Policy)
- Forum ↔ Service (many-to-many)
- Forum ↔ Policy (many-to-many)
- Service ↔ Policy (many-to-many)
- User ↔ Service (many-to-many)
- User ↔ Forum (many-to-many)
- Activity ↔ (Policy | Forum)

---

**Status:** Updated with `ServiceAttributes` section.
