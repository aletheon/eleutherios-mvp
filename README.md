# Eleutherios MVP

**Governance through Love in Action**  
Eleutherios is the open-source implementation of the **Policy–Forum–Service–Data (PFSD)** model.  
It provides a shared operating system for humankind — enabling **policies** to be instantiated into live **forums**, connected with **services**, and grounded in **data**.  

Eleutherios is maintained under the **Aletheon Foundation**, with the mission of advancing **Prior Unity** / **Tino Rangatiratanga** as a living governance protocol.

---

## 🌍 Vision

Eleutherios is both:
- A **technical stack** (IAAS → PAAS → SAAS → Hardware), and
- A **cultural protocol** for humankind to organise around **Prior Unity**.

It unifies **analogue and digital stakeholders** (people, AI, IoT, APIs, organisations) under one governance standard:
- **Policy** = Governance  
- **Forum** = Network  
- **Service** = Information  
- **Data** = Storage  

---

## ⚙️ Core Architecture: PFSD

### Policy
- Human-readable + machine-readable rules.
- Rules may point to **Forum**, **Service**, or another **Policy**.
- Policies can be **Public** (consumable by all) or **Private** (restricted to designated consumers).

### Forum
- Instantiation of a rule into a space for dialogue or action.
- Forums define **stakeholders** and **permissions** (add/remove members, create sub-forums, post/remove messages, upload/remove files).

### Service
- An analogue or digital agent (human, API, IoT, AI).
- Services may be **free** or **paid** (via Stripe, PayPal, etc.).
- Attributes include **Price, Size, Color, Quantity** (extensible).
- Services connect to Policies and instantiate behaviour.

### Data
- The storage layer — all policy, forum, and service activity.
- Analytics, logs, and state management.

---

## 🧩 EleuScript

**EleuScript** is the domain-specific language (DSL) of Eleutherios.  
Its base object is a `policy`, which defines `rules`.  
Rules are only **instantiated when consumed** by a Service.

```eleuscript
policy HousingPolicy {
  rule TenancyAgreement -> Forum("Tenancy Forum", defaultStakeholders = ["Tenant", "KO"])
  rule RentPayment -> Service("StripePayment", currency="NZD")
  rule IdentityVerification -> Service("RealMeAuth")
}
