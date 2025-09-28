# Eleutherios Schema (Updated)

This schema defines the core objects and relationships in Eleutherios, including governance (Policy), collaboration (Forum), service execution (Service), storage (Data), and new social/notification features.

---

## Policy
```yaml
Policy {
  id: string
  name: string
  description: string
  visibility: enum("public", "private")   # determines discoverability
  rules: [RuleRef]
  owner: UserRef
  createdAt: timestamp
}
```

- **Public Policy**: visible to every stakeholder, anyone can consume.
- **Private Policy**: only visible to the creator or designated consumers.

---

## Rule
```yaml
Rule {
  id: string
  name: string
  type: enum("forum","service","policy")
  target: ForumRef | ServiceRef | PolicyRef
  defaultStakeholders: [UserRef]
}
```

Rules map to Forums, Services, or nested Policies.

---

## Forum
```yaml
Forum {
  id: string
  name: string
  description: string
  linkedServices: [ServiceRef]
  linkedPolicies: [PolicyRef]
  linkedFiles: [FileRef]
  stakeholders: [UserRef]
  permissions: [Permission]
}
```

### Permissions
```yaml
Permission {
  stakeholder: UserRef
  canAddStakeholder: boolean
  canRemoveStakeholder: boolean
  canCreateSubforum: boolean
  canCreateMessage: boolean
  canRemoveOwnMessage: boolean
  canRemoveOthersMessage: boolean
  canAddFile: boolean
  canRemoveOwnFile: boolean
  canRemoveOthersFile: boolean
}
```

---

## Service
```yaml
Service {
  id: string
  name: string
  description: string
  owner: UserRef
  policies: [PolicyRef]
  subscribers: [UserRef]       # users who favourited or subscribed
  CERT: number                 # Cooperation, Engagement, Retention, Trust
  attributes: ServiceAttributes
}
```

### ServiceAttributes
```yaml
ServiceAttributes {
  price: number | null          # free if null
  currency: string | null
  size: string | null           # e.g., S, M, L, XL
  color: string | null
  quantity: number | null
}
```

---

## Data
```yaml
Data {
  id: string
  type: enum("file","record","stream")
  storageRef: string
  linkedTo: PolicyRef | ForumRef | ServiceRef
}
```

---

## User
```yaml
User {
  id: string
  name: string
  email: string
  following: [UserRef]         # who this user follows
  followers: [UserRef]
  favourites: [ServiceRef]     # subscribed services
  notifications: [FeedItem]    # inbox of feed events
  activities: [ActivityRef]    # forums/policies they are active in
  CERT: number                 # aggregated CERT score
}
```

---

## CERT Metrics
- **Cooperation**: number of external services added to policies/forums, frequency.  
- **Engagement**: response speed to notifications, ratings/reviews.  
- **Retention**:  
  - Non-profit/free services: repeat *uses*.  
  - Paid/for-profit services: repeat *sales*.  
- **Trust**: followers, subscribers, overall reliability.

---

## FeedItem (Newsfeed & Notifications)
```yaml
FeedItem {
  id: string
  sourceType: enum("service","policy","forum","user")
  sourceId: string
  message: string
  timestamp: timestamp
  read: boolean
}
```

Displayed in a **newsfeed/dashboard**, similar to social media.

---

## Activity
```yaml
Activity {
  id: string
  user: UserRef
  forum: ForumRef | null
  policy: PolicyRef | null
  role: string        # "stakeholder", "superuser", "consumer"
  joinedAt: timestamp
}
```
