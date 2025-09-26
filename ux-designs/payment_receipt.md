# UX Design Brief: Payment Receipt

**Screen:** Payment Receipt  
**Example:** Braeburn Apples service purchase  

---

## Purpose
The **Payment Receipt** screen confirms a successful transaction inside Eleutherios.  
It provides transparency, record-keeping, and proof of payment for services linked to policies.  

This is critical for:
- Homeless person accessing housing services (MSD/KO supported).  
- Healthcare patient paying a GP fee.  
- Community stakeholder recording payment for shared resources.  

---

## Key Components

1. **Header**
   - Title: **Payment Receipt**  
   - Status: ✅ Successful (or ❌ Failed for errors).  

2. **Receipt Details**
   - Receipt ID / Transaction reference.  
   - Service purchased.  
   - Policy link(s).  
   - Forum (rule) references if applicable.  

3. **Payment Information**
   - Amount paid.  
   - Currency.  
   - Payment method (e.g., Stripe, PayPal, RealMe Pay, KO/MSD subsidy).  
   - Date/time of payment.  

4. **Buyer / Seller Info**
   - Buyer name (or anonymised ID if sensitive).  
   - Seller / Service Provider name.  

5. **Actions**
   - Download PDF receipt.  
   - Email / share receipt.  
   - Go to Service Detail.  
   - Continue Shopping.  

---

## User Flow
1. User confirms payment in **Shopping Cart**.  
2. Payment provider (e.g., Stripe) returns transaction success.  
3. Eleutherios generates receipt, links to **Policy + Service + Forum**.  
4. Receipt stored in **Data Layer** for audit and reporting.  

---

## Backend Considerations
- **Firestore Document Type:** `Receipt`  
- **Schema Reference:** `schema.md > Receipts`  
- Must link:
  - `Receipt → Service` (mandatory)  
  - `Receipt → Policy` (mandatory)  
  - `Receipt → Forum` (optional, if rule instantiated).  
- Store:  
  - Provider transaction ID.  
  - Provider metadata (fees, taxes, subsidy).  
  - User + Service IDs.  

---

## Future Extensions
- Refund / dispute handling.  
- Integration with government subsidies (e.g., MSD housing, KO tenancy).  
- Automatic receipts into user’s **Identity Policy > Records**.  
- AI summaries of recurring payments.  

---

**Status:** MVP feature, needed for trust + compliance.  
