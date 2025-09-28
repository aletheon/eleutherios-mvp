# Newsfeed – Unified Dashboard

## Purpose
The **Newsfeed** provides each user with a personalised dashboard of updates from the services, policies, forums, and people they follow or have favourited.  
It is the *living stream* of Eleutherios, enabling users to stay aware of activity across the ecosystem in real time.

---

## Key Features
- **Follows & Favourites**
  - Following a user: see their public activity (new services, policy edits, forum posts).
  - Favouriting a service: receive updates when the service changes (status, availability, posts).
- **Types of Updates**
  - New service created or updated.
  - Policy consumed or edited.
  - Forum activity: replies, new sub-forums.
  - Ratings/reviews on services.
  - User status changes (e.g., “Available”, “Busy”).  
- **Respecting Visibility**
  - Public vs Private policies and services respected.
  - Feed only shows items user has permission to view.

---

## User Flow
1. User follows another user, or favourites a service.  
2. Updates from that entity are added to their feed.  
3. The feed appears as a timeline/dashboard.  
4. Clicking an entry takes the user back to the originating Service, Policy, Forum, or User profile.  
5. Filters allow narrowing (Services | Policies | Forums | People).

---

## Backend Schema (Firestore Example)
**Collection:** `newsfeed`  
Each `NewsfeedItem` includes:
- `id`: unique identifier  
- `userId`: the user receiving this item  
- `entityType`: `Service | Policy | Forum | User`  
- `entityId`: reference ID  
- `type`: `update | review | status | forum_reply | policy_change`  
- `message`: human-readable update string  
- `timestamp`: createdAt  
- `visibility`: respects public/private rules  

---

## Future Extensions
- Reactions (👍, ❤️, 🔁).  
- Sharing an item into a Forum for group discussion.  
- AI summarisation: “10 updates you missed today.”  
- Smart ranking (most relevant updates first).  

---

**Status:** MVP priority.  
The Newsfeed is central to engagement, encouraging users to stay active, follow others, and discover services organically.
