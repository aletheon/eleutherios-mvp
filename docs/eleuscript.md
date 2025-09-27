# EleuScript Overview

**EleuScript** is a domain-specific, governance-oriented programming language that enables the definition, linkage, and execution of policies, forums, services, and data flows within the Eleutherios OS.

Inspired by object-oriented and event-driven paradigms, EleuScript uses `policy` as its root object and supports runtime rule instantiation upon service consumption.

---

## 🧱 Core Syntax Example

```eleuscript
policy HousingPolicy {
  rule TenancyAgreement -> Forum("Tenancy Forum", defaultStakeholders = ["Tenant", "KO"])
  rule RentPayment -> Service("StripePayment", currency="NZD")
  rule IdentityVerification -> Service("RealMeAuth")
}
```

---

## 📐 Key Concepts

### 1. `policy`

The root construct. Policies are containers for governance logic.

* Can contain multiple `rule` definitions.
* May be consumed by services (analogue or digital).

### 2. `rule`

Defines the behavior or flow when the policy is consumed.
Each rule can:

* Instantiate a **Forum** for stakeholder communication.
* Trigger or register a **Service** (API, IoT, person, AI, etc).
* Reference another **Policy**, recursively.

### 3. `Forum(...)`

Declares a forum to be instantiated with default stakeholders.

* Parameters: forum name, default members (services or users).

### 4. `Service(...)`

Describes a service to be executed when the policy is consumed.

* Parameters: name, config options (currency, location, etc).

### 5. Rule Instantiation Model

Rules are not executed immediately. They are *instantiated dynamically* only when:

* A Service consumes the Policy.
* A Forum member triggers a Rule.

---

## 🎯 Runtime Behavior

### When a Policy is Consumed:

* Rules are evaluated for instantiation.
* Forums are created with specified stakeholders.
* Services are executed or registered.
* Policy references are linked recursively.

---

## 🧑‍⚖️ Stakeholders

Stakeholders (services or users) may:

* Consume a policy.
* Join or create forums.
* Be assigned permissions.
* Trigger services.

A stakeholder can be:

* A human user
* An IoT device
* An AI agent
* An external API

---

## 🔐 Default Forum Permissions

Each stakeholder added to a forum gets default permissions:

* [x] Add other stakeholders to the forum
* [x] Remove other stakeholders
* [x] Create sub-forum (they become superuser)
* [x] Post messages
* [x] Remove own messages
* [x] Remove others' messages
* [x] Upload files
* [x] Remove own files
* [x] Remove others' files

These are modifiable via a **permissions panel** in the UI.

---

## 🛒 Payment Integration

* Services can be free or paid.
* Supports Stripe, Stripe Connect, PayPal, etc.
* Services may be subscriptions or one-off charges.
* Shopping carts can include global services from multiple providers.

---

## 🔄 Comparison to OOP

| OOP           | EleuScript                 |
| ------------- | -------------------------- |
| `class`       | `policy`                   |
| `method`      | `rule`                     |
| `object`      | `forum`, `service`, `data` |
| `constructor` | `consumption`              |

---

## 🌍 Architectural Mapping

| TCP/IP Layer | PFSD Equivalent         |
| ------------ | ----------------------- |
| Application  | **Policy** (governance) |
| Transport    | **Forum** (networking)  |
| Session      | **Service** (execution) |
| Data Link    | **Data** (persistence)  |

---

## 🧠 Summary

EleuScript allows communities to encode their governance protocols as executable objects. These can:

* Scale across analogue + digital domains.
* Be instantiated only when relevant.
* Remain adaptive, composable, and auditable.

The Policy → Forum/Service → Data stack reflects the PFSD protocol for a post-Westminster, Prior Unity-governed society.
