# UX Design Brief: Create Service Screen

**Screen:** Create Service  
**Example:** Braeburn Apples

---

## Purpose
The **Create Service** screen allows a user (e.g., a farmer, wholesaler, or housing provider) to define a new service or product that they want to make available within the Eleutherios system.  
This service can then be linked to relevant **Policies** and **Forums**, enabling governance and collaboration.

---

## Key Components

1. **Details Section**
   - Title field: "Braeburn Apples"
   - Type selector: Product / Service (dropdown)
   - Description: "1000Kg fresh picked braeburn apples."
   - Quantity: Example shows `5` units.

2. **Price & Payments**
   - Integration with **Stripe** for payments.
   - Example: Price set to `USD 799.00`.

3. **Photo**
   - Service/product image upload (Braeburn apples photo shown).

4. **Tags**
   - Helps with categorisation and discovery.
   - Example tags: `Apples`, `Braeburn`.

5. **Policies**
   - Services can be bound by governance rules (e.g., eligibility, compliance).
   - Shown as a counter (`1` policy attached).

6. **Forums**
   - Services can link to active forums where rules are instantiated into actions/discussions.
   - Shown as a counter (`1` forum attached).

---

## User Flow
1. User enters basic service details (name, type, description).
2. User sets price and quantity (optionally attaches payment integration).
3. User uploads an image.
4. User attaches tags for classification.
5. User links the service to one or more **Policies**.
6. User links the service to one or more **Forums**.
7. Service is published into the system and becomes visible/searchable.

---

## Backend Considerations
- **Firestore Document Type:** `Service`
- **Schema Reference:** See `schema.md > Services`
- **Relationships:**
  - `Service -> Policy` (one-to-many)
  - `Service -> Forum` (one-to-many)
- **Stripe Integration:** Store product ID and pricing reference securely.

---

## Future Extensions
- Support multiple currencies beyond USD/INR.
- Enable multiple payment providers (PayPal, MSD subsidies, KO subsidies).
- Allow bulk upload of services via CSV/Excel for enterprise users.
- Advanced tagging and recommendation engine.

---

**Status:** MVP priority.  
This screen is essential for initial user testing and onboarding.
