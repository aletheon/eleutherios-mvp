# UX Design Brief: Payment Receipt

**Screen:** Payment Receipt  
**Example:** Confirmation of Service Purchase (e.g., Housing Consultation, Braeburn Apples)

---

## Purpose
The **Payment Receipt** screen provides confirmation of completed transactions.  
It ensures transparency for users and services, documenting key payment details.  
Receipts form part of the **Data Layer**, linked back to the policies and services consumed.

---

## Key Components

1. **Receipt Header**
   - Title: "Payment Receipt"
   - Date & Time of Transaction
   - Receipt/Invoice ID

2. **Service Details**
   - Service Name: e.g., *Braeburn Apples*  
   - Description: "Purchase of 5kg apples through community provisioning service."
   - Linked Policy: `Food Policy → Provision → Community Pantry`

3. **Payment Details**
   - Amount Paid (e.g., $25.00 NZD)  
   - Payment Method (Stripe, PayPal, Subscription Credit, etc.)  
   - Transaction ID (from provider, e.g., Stripe/PayPal ID)  

4. **Buyer & Seller Info**
   - Buyer: End-user identity or service account.  
   - Seller: Service owner or organisation name.  
   - Contact details if provided.

5. **Actions**
   - **Download PDF** receipt.  
   - **Email Receipt** to buyer.  
   - **Refund Request** (if allowed).  

---

## User Flow
1. User confirms payment in shopping cart.  
2. Payment provider processes transaction.  
3. Receipt generated dynamically with reference to policies/services.  
4. Receipt visible in-app and stored in user’s account history.  
5. Option to export/share.

---

## Backend Considerations
- **Firestore Document Type:** `Receipt`
- **Schema Reference:** See `schema.md > Payments`
- **Relationships:**
  - `Receipt -> Service` (one-to-one, records what was purchased)  
  - `Receipt -> Policy` (policy underpinning the service)  
  - `Receipt -> PaymentProvider` (Stripe, PayPal, etc.)

- Store securely:
  - Transaction metadata (amount, currency, payment method, ID).  
  - Service reference + buyer/seller IDs.  
  - Policy references.  

---

## Future Extensions
- Subscription management (recurring receipts).  
- Aggregated annual report for tax purposes.  
- Cross-border multi-currency support.  
- Smart contracts: blockchain receipts for immutability.  

---

**Status:** MVP-ready.  
Payment receipts are critical for trust, accountability, and compliance in Eleutherios’ service marketplace.
