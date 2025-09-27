# schema.md

## Overview
This schema defines the **Policy–Forum–Service–Data (PFSD)** architecture, the core substrate of Eleutherios.  
It functions as a digital governance protocol, instantiating rules into living processes across analogue (human) and digital (AI, IoT, API) stakeholders.  

**Key principle:**  
> *PRIOR UNITY → PROCESS → PRIOR UNITY*  
Every input, process, and output resolves into the same unity.

---

## Core Entities

### 1. Policy
- **Definition:** The top-level governance artifact, representing unity codified into rules.  
- **Fields:**
  - `id` (string, UUID)
  - `title` (string)
  - `description` (markdown)
  - `rules[]` (array of `Rule`)
  - `owner` (ServiceRef)
  - `createdAt` (timestamp)
  - `updatedAt` (timestamp)

- **Rules:**
  Each `Rule` can be of type:
  - **Forum** → Instantiates a Forum (discussion & action space).
    - Optional: `defaultStakeholders[]` (list of Services auto-added at instantiation).
  - **Service** → Calls or triggers a Service (human, IoT, API, AI, etc.).
  - **Policy** → Points to another Policy (existing or new at runtime).

---

### 2. Forum
- **Definition:** Instantiated space for dialogue, coordination, and enactment of a rule.  
- **Fields:**
  - `id` (string, UUID)
  - `policyId` (string → Policy)
  - `ruleId` (string → Rule)
  - `title` (string)
  - `description` (string)
  - `members[]` (array of ServiceRefs)
  - `messages[]` (array of Message)
  - `createdAt` (timestamp)
  - `updatedAt` (timestamp)

- **Message:**
  - `sender` (ServiceRef)
  - `content` (markdown / media ref)
  - `timestamp` (timestamp)

- **Notes:**
  - Forums are ephemeral or permanent depending on the policy rule.
  - Can support multimedia, AI summaries, and linked services.

---

### 3. Service
- **Definition:** Any agent (human, organisation, AI, IoT, API, etc.) that can act in the system.  
- **Fields:**
  - `id` (string, UUID)
  - `type` (enum: Human, Org, AI, IoT, API, Other)
  - `name` (string)
  - `description` (string)
  - `owner` (optional, ServiceRef)
  - `policies[]` (PolicyRefs consumed)
  - `forums[]` (ForumRefs participated in)
  - `capabilities[]` (array of Capability)

- **Capabilities:**  
  - Examples:
    - `FetchData(API)`
    - `IoTTrigger(deviceId)`
    - `MakePayment(Stripe/PayPal/Other)`
    - `HumanAction(description)`
    - `AIProcess(model, prompt)`

- **Notes:**
  - A Service can charge fees (via Stripe, PayPal, etc.) or be free.
  - By default, Stripe Connect integration is offered.

---

### 4. Data
- **Definition:** The shared substrate for all persisted state and analytics.  
- **Fields:**
  - `id` (string, UUID)
  - `type` (enum: File, Record, Transaction, Message, Media, Other)
  - `location` (cloud storage ref / database ref)
  - `owner` (ServiceRef)
  - `linkedTo` (PolicyRef | ForumRef | ServiceRef)
  - `createdAt`
  - `updatedAt`

- **Notes:**
  - Data is always tagged with lineage (which policy/service/forum created it).
  - Enables analytics for unmet needs, bottlenecks, and governance insights.

---

## Relationships

- **Policy → Rule → Forum/Service/Policy**
- **Forum ↔ Service (membership, discussion)**
- **Service ↔ Policy (consumes, provides, maintains)**
- **Service ↔ Service (transactions, payments, interactions)**
- **All ↔ Data (audit trail, storage)**

---

## Runtime Examples

1. **Homeless person seeks housing:**
   - Creates a Policy → Rule = “Find Shelter” (Service type).  
   - Service triggers KO/MSD API + creates Forum with caseworkers.  
   - Data = audit trail of requests, approvals, shelter info.

2. **Doctor offers free consultation:**
   - Service = Doctor (Human).  
   - Policy = “Healthcare Access” → Rule = Service link.  
   - Patient joins via Forum.  
   - Payment = free (capability `HumanAction` only).

3. **Doctor offers paid subscription:**
   - Service capability = `MakePayment(Stripe Subscription)`.  
   - Policy enforces “Access Rules” for subscribers.  
   - Forum = patient-doctor ongoing care.  
   - Data = patient logs, prescriptions.

---

## Extensibility

- **Federated Identity:** Supports RealMe, KO/MSD, Google, etc.  
- **Federated Payments:** Stripe by default, PayPal optional, open to others.  
- **Governance AI:** Rules can be AI-assisted (propose, summarise, enforce).  
- **Hardware future:** PFSD protocol can extend down to chip-level standards.  

---

**Status:** Canonical v1 schema for Eleutherios MVP.  
