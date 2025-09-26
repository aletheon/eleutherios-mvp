Eleutherios Firestore Schema

This document describes the initial Firestore schema for the Eleutherios MVP.
The architecture is based on the Policy → Forum → Service → Data model, where all entities are policies or derived from policies.

Collections Overview
1. Users (users/{userId})

Each human or non-human participant gets a user account.

Fields:
* userId (string, auto UID)
* email (string)
* displayName (string)
* createdAt (timestamp)
* whakapapa (map, optional for Māori users)
* defaultPolicyId (string → ref to userRoot policy)

Subcollections:
* policies → policies authored/owned by the user
* services → services the user operates or consumes

2. Policies (users/{userId}/policies/{policyId})

Policies are the core substrate. Each policy can nest rules, reference other policies, or point to services.

Fields:
* policyId (string, auto UID)
* title (string)
* description (string)
* kind (enum: userRoot, domain, subdomain, attributeRule, policyRef, serviceRef)
* parentId (string, FK to another policy)
* parentUid (string, FK to owner userId)
* createdAt (timestamp)
* updatedAt (timestamp)

Subcollections:
* rules → rules attached to this policy
* forums → instantiated forums created from rules

3. Forums (users/{userId}/policies/{policyId}/forums/{forumId})

A rule from a policy is instantiated as a forum for stakeholder interaction.

Fields:
* forumId (string, auto UID)
* ruleId (string → original rule)
* title (string)
* description (string)
* startDate (timestamp, optional)
* endDate (timestamp, optional)
* trigger (string: IoT event, cron job, AI event, etc.)

Subcollections:
* messages → stakeholder discussion threads
* references → links back to services or policies

4. Services (services/{serviceId})

Services consume policies and stream data.

Fields:
* serviceId (string, auto UID)
* name (string)
* ownerUid (string → userId)
* policyRefs (array of policyIds consumed)
* endpoint (string: API/PAAS/IoT hook)
* createdAt (timestamp)

5. Data (services/{serviceId}/data/{dataId})

Each service exposes or streams data that can be consumed by policies or forums.

Fields:
* dataId (string, auto UID)
* payload (map/json)
* timestamp (timestamp)
* source (string: API, IoT device, manual entry, etc.)

Example Structure

users/{userId}
  └── policies/{policyId} (kind=userRoot)
        ├── policies/{policyId} (kind=domain: Housing)
        │     ├── policies/{policyId} (kind=subdomain: Rooms)
        │     │     └── policies/{policyId} (kind=attributeRule: No. of bedrooms)
        │     └── forums/{forumId}
        └── services/{serviceId}
              └── data/{dataId}

Notes
* Circular references are prevented (policy cannot reference itself).
* Breadcrumbs are materialised for navigation and auditing.
* Triggers allow rules to instantiate dynamically from events (IoT, cron, AI).
* All entities resolve back to Policy as the atomic unit.
