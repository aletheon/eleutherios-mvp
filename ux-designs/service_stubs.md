# UX Design Stubs for Services & Payments

This folder contains placeholder UX specifications. Each file should be expanded later with full descriptions, flows, and backend notes.

---

## Files

### `add_service.md`
- Purpose: Allow policymakers or stakeholders to **add a new service** to a forum or policy.
- Notes: Services can be analogue (person) or digital (IoT, API, AI).  
- Links: `PolicyRef`, `ForumRef`.

---

### `write_service_review.md`
- Purpose: Enable users to **write qualitative reviews** about a service.  
- Notes: Ties into transparency + accountability of service providers.  
- Links: `ServiceRef`.

---

### `rate_service.md`
- Purpose: Provide a **quantitative star/rating system** for services.  
- Notes: Ratings feed into analytics for service trustworthiness.  
- Links: `ServiceRef`.

---

### `shopping_cart.md`
- Purpose: Allow stakeholders to **bundle multiple services** for checkout.  
- Notes: Cart can contain free + paid services.  
- Links: `ServiceRef`, `PolicyRef`.

---

### `payment_receipt.md`
- Purpose: Generate proof of payment for a service.  
- Notes: Must integrate with Stripe (or other payment platforms).  
- Free services → receipt still generated (shows $0).  
- Links: `ServiceRef`, `PaymentProcessor`.

---

## Reminder
All services may be:
- **Free** (stakeholder offers without charge).  
- **Paid** (subscription, one-off, or usage-based).  

This dual-mode design is essential for Eleutherios.

