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
```

A Service may consume multiple Policies simultaneously.  
Policies = templates; Services = runtime consumers.

See [`eleuscript.md`](eleuscript.md) for full spec and [`examples.md`](examples.md) for copy-paste snippets.

---

## 🖼️ Execution Diagrams

### Developer View
Shows how **Policies** define **Rules** that instantiate into **Forums, Services, or PolicyRefs**, which ultimately operate on **Data**.  
This is the low-level execution path programmers need to implement.

![Developer View](eleuscript_execution_dev.png)

---

### Stakeholder View
Maps PFSD into accessible terms:  
- **Policy → Governance**  
- **Forum → Network**  
- **Service → Information**  
- **Data → Storage**

Also includes **ServiceAttributes** (Price, Size, Color, Quantity) and the **CERT** trust model (Cooperation, Engagement, Retention, Trust).

![Stakeholder View](eleuscript_execution_stakeholder.png)

---

## 🔐 Permissions & Identity

- Policies can be **Public** or **Private**.  
- Stakeholders in a Forum have configurable permissions (add/remove members, post, manage files).  
- Users have an **Activities** collection: all forums/policies they serve in.  
- Users can **follow** other users, **favourite** services, and get updates via a **Newsfeed** (`newsfeed.md`).

---

## 📊 CERT Ranking

Every **User** and **Service** has a **CERT score**:

- **C – Cooperation:** how often you add other services to policies/forums.  
- **E – Engagement:** responsiveness + quality of ratings/reviews.  
- **R – Retention:** repeat uses (free services) or repeat sales (paid services).  
- **T – Trust:** followers, subscriptions, endorsements.

CERT encourages cooperation and builds legitimacy in the network.

---

## 📚 Repository Structure

```
eleutherios-mvp/
├── README.md               # This file
├── schema.md               # Data model specification
├── eleuscript.md           # EleuScript DSL spec
├── examples.md             # Code snippets
├── activities.md           # User activities collection
├── newsfeed.md             # Newsfeed specification
├── CONTRIBUTING.md         # How to contribute
├── GOVERNANCE.md           # Project governance
├── ux-designs/             # UX images & .md briefs
│   ├── create_forum.md
│   ├── service_detail.md
│   └── ...
└── diagrams/
    ├── eleuscript_execution_dev.png
    └── eleuscript_execution_stakeholder.png
```

---

## 🤝 Contributing

We welcome contributors — developers, designers, researchers, and community builders.  
See [`CONTRIBUTING.md`](CONTRIBUTING.md) for guidelines.  

Governance of the repo is transparent — see [`GOVERNANCE.md`](GOVERNANCE.md).

---

## 📜 License

This project will be licensed under an **open-source license** (to be finalised — likely Apache 2.0 or AGPL).  
See `LICENSE` once added.

---

## 🌐 Maintainers

Maintained by **Aletheon Foundation**.  
Contact: rob.kara@gmail.com  
