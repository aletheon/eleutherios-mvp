# Eleutherios Schema (PFSD)

This schema defines the **Policy–Forum–Service–Data (PFSD)** architecture and its relationships.

---

## 1. Policy
- **Definition:** The governance layer. Defines rules that can instantiate forums, trigger services, or reference other policies.
- **Rules:**  
  - `ForumRule`: points to a forum definition.  
  - `ServiceRule`: points to a service (human, IoT, AI, API, etc.).  
  - `PolicyRule`: points to another policy (can create new at runtime).  

### Example (EleuScript)
```eleuscript
policy HousingPolicy {
  rule TenancyAgreement -> Forum("Tenancy Forum", defaultStakeholders = ["Tenant", "KO"])
  rule RentPayment -> Service("StripePayment", currency="NZD")
  rule IdentityVerification -> Service("RealMeAuth")
}
```

---

## 2. Forum
- **Definition:** Instantiated when a policy rule is consumed. Acts as the *network layer*.  
- **Default Permissions (per stakeholder):**
  1. Add stakeholder/service [Yes|No]  
  2. Remove stakeholder/service [Yes|No]  
  3. Create sub-forum (becomes superuser) [Yes|No]  
  4. Create own message [Yes|No]  
  5. Remove own message [Yes|No]  
  6. Remove another’s message [Yes|No]  
  7. Upload file [Yes|No]  
  8. Remove own file [Yes|No]  
  9. Remove another’s file [Yes|No]  

- **Stakeholders:**  
  - Policymakers  
  - Forum members  
  - Service consumers  
  - Any analogue/digital service (IoT, API, AI, human, etc.)  

---

## 3. Service
- **Definition:** An action or information process. Can consume policies.  
- **Types:** Analogue (human role) or Digital (IoT, API, AI).  
- **Payment Models:**  
  - Free (stakeholder chooses)  
  - Paid via **Stripe Connect** (default)  
  - External (PayPal, 3rd party API, custom gateway)  
- **Shopping Cart:**  
  - Aggregates services globally.  
  - Supports multi-provider payments.  
  - Stripe Connect enables cross-merchant operations.  

---

## 4. Data
- **Definition:** Storage layer. Captures artefacts, logs, and outputs.  
- **Types:**  
  - Policy docs & rules.  
  - Forum transcripts.  
  - Service outputs (transactions, API calls, IoT readings).  
  - Files & attachments.  

---

## 5. Relationships
- **Policy → Rule → (Forum | Service | Policy)**  
- **Forum → Stakeholders | Files | Sub-forums**  
- **Service → Policy (consumption)**  
- **Data ↔ All (storage + retrieval)**  

---

## 6. Execution Flow
1. A **Service** consumes a **Policy**.  
2. Rules are instantiated → Forums, Services, or Policies.  
3. Stakeholders interact in Forums.  
4. Services trigger processes (analogue/digital).  
5. Data is stored/retrieved.  

---

## 7. Future Extensions
- AI summarisation of forums.  
- Distributed ledger integration for policies.  
- EleuScript OS + hardware chip embedding PFSD.  
