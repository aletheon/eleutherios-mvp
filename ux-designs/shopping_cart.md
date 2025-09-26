# UX Design Brief: Shopping Cart

**Screen:** Shopping Cart  
**Example:** A user (homeless person, policymaker, or service provider) adding multiple services (housing, food, healthcare) into a single checkout experience.  

---

## Purpose
The **Shopping Cart** allows stakeholders to **bundle multiple services** into one transaction, whether free or paid.  
It supports both **monetary payments** (via Stripe, PayPal, or other providers) and **zero-cost services** offered by stakeholders.  

---

## Key Components

1. **Header**
   - Title: **Your Cart**  
   - Cart summary (e.g., “3 Services”).  

2. **Cart Items**
   - Each item shows:  
     - Service name (e.g., *Temporary Shelter*, *Braeburn Apples*).  
     - Linked Policy (e.g., Housing Policy → Tenancy).  
     - Price (e.g., $50 fee, or *Free*).  
     - Quantity / Unit (if relevant, e.g., kg of food).  
     - Remove / Edit option.  

3. **Totals Section**
   - Subtotal (currency + free services noted).  
   - Taxes / fees if applicable.  
   - Final Total.  

4. **Checkout Options**
   - **Proceed to Payment** → Payment screen.  
   - **Continue Browsing** → Returns to Service Search.  

---

## User Flow
1. User searches and discovers services.  
2. Adds one or more services into their **Cart**.  
3. Cart shows a mixed list:  
   - *Free* services (still require confirmation).  
   - *Paid* services (integrated with Stripe/PayPal/etc).  
4. User clicks **Checkout**, proceeds to `payment_receipt.md` workflow.  

---

## Backend Considerations
- **Firestore Document Type:** `Cart`  
- **Schema Reference:** `schema.md > Carts`  
- Must support:  
  - Multiple payment providers (Stripe Connect default, extendable).  
  - Services with zero price.  
  - Services from multiple merchants (multi-merchant checkout).  
- **Stripe Connect Integration:**  
  - Eleutherios can collect a platform fee.  
  - Payments routed directly to merchant accounts.  

---

## Future Extensions
- Subscription support (e.g., monthly housing stipend).  
- In-app credit wallets.  
- Microtransactions for digital services (e.g., AI rulesets).  
- Policy-driven discounts or subsidies (e.g., MSD-funded services = free).  

---

**Status:** MVP required.  
The cart + checkout flow is essential to connect policies with real-world services and create accountability for both **paid** and **free** offerings.  
