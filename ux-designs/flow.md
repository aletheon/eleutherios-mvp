# UX Flow: Service Discovery to Activation

This document explains the **end-to-end journey** of an Eleutherios user, from finding a service through to payment (or free activation) and proof of engagement.

---

## 1. Service Search

**Screen:** `service_search.md`  
**Purpose:** Discover services linked to policies.  

- User enters keywords, applies filters (category, location, status, etc).  
- Results show services with links to policies.  
- Call-to-actions:  
  - **View Service Detail**  
  - **Create Service**  
  - **Propose Policy**  

**Transition →** Clicking a result opens **Service Detail**.

---

## 2. Service Detail

**Screen:** `service_detail.md`  
**Purpose:** Show full metadata for a selected service.  

- Includes description, owner, linked policies, forums, and rules.  
- Actions:  
  - **Join as Stakeholder**  
  - **Consume Policy**  
  - **Trigger Service**  
  - **Add to Cart**  

**Transition →** Selecting **Add to Cart** pushes service to **Shopping Cart**.

---

## 3. Shopping Cart

**Screen:** `shopping_cart.md`  
**Purpose:** Manage selected services prior to checkout.  

- Shows list of services (paid and free).  
- Each service references its policy link.  
- Subtotal, taxes/fees, and total displayed.  
- User can:  
  - Remove services.  
  - Update quantities (if relevant).  
  - Proceed to checkout.  

**Transition →** Checkout opens **Payment Details**.

---

## 4. Payment Details

**Screen:** `shopping_cart.md` (extended)  
**Purpose:** Capture user’s chosen payment method.  

- Stripe, PayPal, or other providers.  
- Support for MSD/government subsidies.  
- Support for **Free services** → requires no payment entry.  

**Transition →** Successful submission generates **Payment Receipt**.

---

## 5. Payment Receipt

**Screen:** `payment_receipt.md`  
**Purpose:** Confirm the transaction and activate services.  

- Receipt ID, date, time, list of services.  
- Totals, fees, and payment method.  
- Free services displayed with cost = $0.  
- Downloadable PDF receipt.  
- Links to associated forums and services for engagement.  

**Transition →** User can:  
  - Jump to forums for discussion.  
  - View service detail pages.  
  - Save receipt.  

---

## Backend Notes

- **Firestore/DB Entities:**  
  - `Service`  
  - `Policy`  
  - `Forum`  
  - `Cart`  
  - `Receipt`  
- Payment handled via Stripe Connect (multi-merchant) or PayPal.  
- Free services follow the same flow (receipt generated with $0 total).  

---

## Future Extensions
- Multi-cart support (shopping cart per project).  
- Cross-border payments with currency conversion.  
- Service subscriptions (monthly/annual).  
- Integration with RealMe/MSD identity.  

---

**Status:** Core MVP flow — this journey must be working end-to-end to demonstrate Eleutherios as a live governance-to-service engine.
