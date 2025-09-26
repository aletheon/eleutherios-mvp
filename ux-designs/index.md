# Eleutherios MVP – UX Design Index

This folder contains **UX design mockups and briefs** for the Eleutherios MVP.  
Each screen corresponds to the Policy → Forum → Service → Data architecture.  

---

## Screens & Briefs

### Authentication & Identity
- `login.md` → Login screen (supports Google, email, RealMe, KO/MSD in future).  
- `identity.md` → Identity model and UX flow (users, services, stakeholders).  

### Policy Layer
- `create_policy.md` → Create a new policy (define rules).  
- `policy_detail.md` → View a policy, its rules, and linked forums/services.  

### Forum Layer
- `create_forum.md` → Create forum linked to a policy rule.  
- `forum_detail.md` → View forum discussion and linked services/files.  
- `add_image_to_forum.md` → Upload images/files to a forum.  
- `search_forums.md` → Search and discover forums.

### Service Layer
- `create_service.md` → Create a service linked to a policy.  
- `service_detail.md` → Service overview + forums from rules.  
- `search_service.md` → Search for services by category, location, policy.  
- `add_service.md` → Add/link services into a policy or forum.  
- `service_review.md` → Leave written reviews for a service.  
- `rate_service.md` → Rate services with stars or metrics.  
- `shopping_cart.md` → Enter payment details to buy/join a service.  
- `payment_receipt.md` → Payment confirmation for service purchase.

### Data Layer
- Data is implicit across all screens (logs, analytics, rule-materialization).  

---

## Payment Integration
Services may be **monetized or subscribed** using payment providers (e.g. **Stripe**).  
Examples:  
- A doctor service charges consultation fees.  
- A housing support service collects rent.  
- A music service collects subscription donations.  

All services should support:  
- **One-time payments** (e.g. doctor fee).  
- **Recurring subscriptions** (e.g. housing co-op, music SaaS).  
- **Receipts & audit logs** (stored in Data layer).  

---

## Notes for Developers
- **Each UX brief has schema references** back to `schema.md`.  
- **Images are stored in `/ux-designs/images/`**.  
- **Stripe/payment integration** → MVP placeholder, extensible later.  
- **Services are stakeholders**: people, IoT, APIs, AI all treated as services.  
- **Forums are rule-instantiations**: every rule creates a space for discussion.  

---

✅ **Status:**  
This index will grow as more UX screens are added. Developers should start with **Policy → Forum → Service flows**, then integrate payments.  
