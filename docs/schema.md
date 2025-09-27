# Eleutherios Schema

This file defines the core Firestore schema for the Eleutherios MVP, aligned with the Policy–Forum–Service–Data (PFSD) model.

---

## Users
`/users/{userId}`
- name
- email
- identityProvider (Google, RealMe, MSD, KO, etc.)
- metadata (contact info, profile photo, etc.)

---

## Policies
`/policies/{policyId}`
- title
- description
- rules: [ { type: Forum|Service|Policy, targetRef } ]
- tags
- createdBy
- createdAt

---

## Forums
`/forums/{forumId}`
- title
- description
- tags
- photo
- linkedServices: [serviceRefs]
- linkedPolicies: [policyRefs]
- createdBy
- createdAt

**Permissions**
- addStakeholder
- removeStakeholder
- createSubForum
- postMessage
- removeOwnMessage
- removeOthersMessage
- uploadFile
- removeOwnFile
- removeOthersFile

---

## Services
`/services/{serviceId}`
- title
- description
- type (digital|analogue)
- provider (Stripe, PayPal, IoT, Human, API, AI)
- metadata (capacity, price, location)
- linkedPolicies: [policyRefs]
- linkedForums: [forumRefs]

---

## Data
`/data/{dataId}`
- type (file, record, transaction)
- storageProvider (Firestore, Google Drive, Dropbox)
- metadata

---

## Activities
`/users/{userId}/activities/{activityId}`
- entityType: Forum | Policy | Service
- entityRef: reference ID
- status: Active | Archived | Pending
- notifications: integer
- lastUpdated: timestamp

---
