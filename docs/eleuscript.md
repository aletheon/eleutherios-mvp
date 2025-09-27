# EleuScript Specification

EleuScript is the domain-specific language (DSL) for defining governance structures in **Eleutherios OS**.

Unlike traditional Object-Oriented Programming (OOP) where the root type is `class`, EleuScript’s root object is **`Policy`**.  
Everything (Forum, Service, Data) derives from and is orchestrated by a Policy.

---

## Core Concepts

### Policy
- A Policy defines the rules of governance.
- Rules are pointers that can resolve to:
  - **Forum** → instantiated discussion spaces.
  - **Service** → processes, human or machine.
  - **Policy** → nested governance (policies within policies).

### Rules
- Dormant until consumed by a Service.
- Once consumed, they instantiate their linked Forum, Service, or Policy.

### Service
- Any analogue or digital actor: human, API, IoT, AI, organisation.
- Can consume multiple policies simultaneously.

### Forum
- Instantiated from a rule of type Forum.
- Auto-populated with default stakeholders.
- Stakeholders have permissions (add/remove, post, upload, etc).

### Data
- Underpins all entities.
- Always referenced live (never static copy).

---

## Example

```eleuscript
policy HousingPolicy {
  rule TenancyAgreement -> Forum("Tenancy Forum", defaultStakeholders = ["Tenant", "KO"])
  rule RentPayment -> Service("StripePayment", currency="NZD")
  rule IdentityVerification -> Service("RealMeAuth")
}
```

- **TenancyAgreement** → Instantiates a Forum with Tenant + KO as default members.
- **RentPayment** → Points to a Stripe-based payment service.
- **IdentityVerification** → Delegates to RealMe authentication.

---

## Permissions (Forum Example)
Each stakeholder in a Forum has default permissions:

- Add another stakeholder/service [Yes|No]
- Remove another stakeholder/service [Yes|No]
- Create sub-forum [Yes|No]
- Post/remove messages [Yes|No]
- Upload/remove files [Yes|No]

Superusers can adjust permissions.

---

## Execution Model

- Policies are declarative.
- Rules instantiate **only at consumption** by a Service.
- Services then dynamically apply the latest rules of all policies they consume.
