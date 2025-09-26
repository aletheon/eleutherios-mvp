# UX Design Brief: Shopping Cart

**Screen:** Shopping Cart  
**Example:** Mixed services purchase (Food, Housing, Healthcare).  

---

## Purpose
The **Shopping Cart** screen allows a user (service, stakeholder, or policy participant) to review, manage, and pay for multiple services at once.  

It is the bridge between **Service Discovery** (search/detail) and **Payment Receipts**, enabling Eleutherios to handle transactions at scale across diverse providers.  

---

## Key Components

1. **Header**
   - Title: **Shopping Cart**  
   - Badge: Number of items.  

2. **Cart Items List**
   Each entry shows:
   - Service name + description.  
   - Linked policy reference (e.g., Housing > Tenancy).  
   - Quantity or unit (where applicable, e.g., food items).  
   - Price (or “Free” if no charge).  
   - Provider name.  
   - Option: remove item from cart.  

3. **Cart Summary**
   - Subtotal.  
   - Fees (transaction, Stripe, subsidies applied).  
   - Taxes (if any).  
   - Total.  

4. **Payment Options**
   - Default: Stripe (Stripe Connect).  
   - Alternatives: PayPal, RealMe Pay, MSD/KO subsidy integration.  
   - Future: Crypto wallet, direct IoT/AI payment agents.  

5. **Call to Action**
   - **Checkout** → Payment Details screen.  
   - **Continue Shopping** → back to Service Search.  

---

## User Flow
1. User adds services (food, housing, healthcare, etc.) to cart.  
2. Cart dynamically updates totals and fee breakdowns.  
3. User chooses payment provider.  
4. On checkout → system generates one or multiple **Payment Receipts**.  

---

## Backend Considerations
- **Firestore Document Type:** `Cart`  
- **Schema Reference:** `schema.md > Carts`  
- Must store:  
  - User ID.  
  - List of ServiceRefs (with policy links).  
  - Quantity, price, currency.  
  - Payment provider preference.  
- **Stripe Connect**:  
  - Supports multi-merchant checkout (fees split automatically).  
  - Eleutherios platform fee can be added transparently.  

---

## Future Extensions
- Saved carts / recurring subscriptions.  
- Subsidy auto-applied (e.g., MSD rent support).  
- AI recommendations: “add related services.”  
- Group carts (whānau or community bulk purchasing).  

---

**Status:** MVP critical.  
The shopping cart is the **transaction nexus** of Eleutherios, where policies, services, and stakeholders connect economically.  
