# Activities Collection

Each user in Eleutherios has an **activities collection** that tracks all of their live participation across **Policies**, **Forums**, and **Services**.  
This provides quick navigation, a holistic view of their governance involvement, and a clear record of where they are currently serving.

---

## Purpose
- Give end-users (e.g., KO staff, MSD clients, or individuals) a **dashboard of engagement**.  
- Ensure **no stakeholder is “lost”** across multiple policies or forums.  
- Provide **auditable trails** of participation and service consumption.

---

## Model
- **activities** (per user)
  - **policyRefs** → Policies the user is consuming or serving under.
  - **forumRefs** → Forums the user is a stakeholder/member of.
  - **serviceRefs** → Services the user owns, consumes, or participates in.

Each activity entry includes:
- `id`: reference ID of the policy/forum/service
- `type`: one of `Policy`, `Forum`, `Service`
- `role`: e.g., stakeholder, consumer, policymaker, admin
- `joinedAt`: timestamp of when user entered
- `permissions`: effective permissions for this user in the context (see `schema.md > ForumPermissions`)

---

## Example (Firestore)
```json
{
  "activities": [
    {
      "id": "policy_housing123",
      "type": "Policy",
      "role": "Consumer",
      "joinedAt": "2025-09-27T01:22:00Z"
    },
    {
      "id": "forum_tenancy456",
      "type": "Forum",
      "role": "Stakeholder",
      "permissions": {
        "addStakeholder": true,
        "removeStakeholder": false,
        "createSubForum": true,
        "postMessage": true,
        "deleteOwnMessage": true,
        "deleteOthersMessage": false
      },
      "joinedAt": "2025-09-27T01:25:00Z"
    },
    {
      "id": "service_stripe789",
      "type": "Service",
      "role": "Consumer",
      "joinedAt": "2025-09-27T01:27:00Z"
    }
  ]
}
```

---

## Visual
![Activities Diagram](images/activities_diagram.png)

---

## Future Extensions
- AI summarisation of a user’s activity log (daily/weekly).  
- Graph view of policy–forum–service connections.  
- Export activities for reporting (e.g., KO/MSD dashboards).
