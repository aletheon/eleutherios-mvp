# Shopping Cart – Multi-Service Checkout

## Purpose
The **Shopping Cart** screen allows users to review and purchase multiple services (local or global) in a single flow.  
It supports both free and paid services, integrating payment providers such as **Stripe Connect** and **PayPal**.

---

## Layout & Sections

### Header
- Title: **Your Cart**  
- Breadcrumb: Home → Cart  

### Cart Items
For each service added:
- **Service Name** (e.g., "Temporary Shelter", "GP Consultation", "Braeburn Apples").  
- Description (short).  
- Linked **Policy Reference**.  
- Quantity / Unit (if applicable).  
- Price (can be $0 for free services).  
- Remove button (trash icon).  

### Totals
- Subtotal  
- Tax (if any, based on service provider’s rules).  
- Platform Fees (only if configured by Aletheon/Eleutherios).  
- Grand Total  

### Payment Options
- **Stripe** (default, with Stripe Connect for cross-merchant payments).  
- **PayPal** (future option).  
- Free services auto-bypass payment, but still generate a receipt.  

### Actions
- **Checkout** → goes to payment details (or auto-confirms if all free).  
- **Continue Browsing** → returns to Service Search.  

---

## User Flow Example
1. Homeless user adds **Temporary Shelter Service** (free) and **Doctor Consultation** ($20).  
2. Cart shows both items → one free, one paid.  
3. Stripe Connect processes payment for the paid service, while free service is confirmed.  
4. User receives a single **Payment Receipt** listing both.  

---

## Data Model Links
- `Cart` object → array of `ServiceRefs`.  
- `ServiceRefs` must include policy references.  
- Payment metadata → handled via **Stripe Connect** API integration.  
- Free services must still generate **transaction logs** for auditing.  

---

## Visual
- **Left**: List of services in the cart.  
- **Right**: Totals + Payment buttons.  

---

## Notes for Developers
- Cart must support **multi-provider payments** (Stripe + PayPal).  
- Free services = $0 line item but still go through “checkout” for logging.  
- Stripe Connect onboarding required for merchants.  
- Users should always receive a consolidated **receipt** even if no money was exchanged.

---

**Status:** MVP Priority for Service Monetisation
