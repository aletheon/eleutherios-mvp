# UX Design Brief: Payment Receipt

**Screen:** Payment Receipt  
**Example:** Confirmation page after a user completes checkout of services (paid and/or free).  

---

## Purpose
The **Payment Receipt** screen provides users with a clear record of their completed transaction.  
It confirms the services obtained, how they were paid (or marked free), and generates proof for both the user and the service providers.  

---

## Key Components

1. **Header**
   - Title: **Payment Successful** (or **Receipt**)  
   - Receipt ID / Transaction Number.  
   - Date & Time of payment.  

2. **Service Summary**
   - List of all services purchased or confirmed (free).  
   - Each item shows:  
     - Service name.  
     - Linked Policy.  
     - Amount paid (or Free).  
     - Provider/Owner name.  

3. **Totals**
   - Subtotal.  
   - Fees / Taxes.  
   - Final Total.  

4. **Payment Method**
   - Stripe, PayPal, MSD subsidy, or *Free Service*.  
   - Last 4 digits of card (if applicable).  

5. **Actions**
   - **Download Receipt (PDF)**.  
   - **View Services** → links back into Eleutherios, opens service detail pages.  
   - **Join Forums** → quick links to discussions tied to purchased/consumed services.  

---

## User Flow
1. User completes checkout from **Shopping Cart**.  
2. Backend records payment event.  
3. Receipt screen is generated:  
   - Shows all confirmed services.  
   - Creates proof for user + service providers.  
   - Updates logs in Firestore (or DB).  
4. User may download/save receipt and navigate to services.  

---

## Backend Considerations
- **Firestore Document Type:** `Receipt`  
- **Schema Reference:** `schema.md > Receipts`  
- Must support:  
  - Multi-merchant payments (Stripe Connect → each service owner).  
  - Free services logged the same as paid ones (price = 0).  
  - Receipts accessible in user account history.  
- **Integration:**  
  - Stripe webhook confirms payment.  
  - Free services confirmed instantly (no payment gateway).  

---

## Future Extensions
- Send receipts by email/SMS automatically.  
- Government subsidy tracking (e.g., MSD covers part of service fee).  
- Tax-compliant invoices for service providers.  
- Aggregate reporting for policymakers: “How many free vs paid services consumed?”  

---

**Status:** MVP required.  
This screen closes the loop between **Cart → Payment → Service Activation**, ensuring accountability and auditability of Eleutherios services.
