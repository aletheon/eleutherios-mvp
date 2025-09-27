# EleuScript Specification (Prototype)

## Base Principle
EleuScript is a **policy-oriented language**.  
Whereas Object-Oriented Programming (OOP) begins with `class`, EleuScript begins with `policy`.

- **Root Type:** `policy`  
- **Child Types:** `Forum`, `Service`, `Data`  
- **Activation:** Rules do not instantiate until a `Service` consumes the `Policy`.

---

## Policy
A `policy` defines a **set of rules**.  

```eleuscript
policy PolicyName {
  rule RuleName -> TargetType(parameters)
}
```

- **RuleName** → the label of the governance behaviour.  
- **TargetType** → one of:  
  - `Forum()` → Creates a discussion/coordination forum.  
  - `Service()` → Executes or integrates a service (IoT, API, AI, human, payment, etc).  
  - `Policy()` → Points to another Policy (nested governance).  

---

## Rule Instantiation
- Rules remain **dormant** until a Service **consumes** the Policy.  
- When consumed, rules instantiate as their defined type.  
- **Consumption is dynamic**: Services can consume multiple Policies simultaneously, merging behaviours.

### Example
```eleuscript
policy HousingPolicy {
  rule TenancyAgreement -> Forum("Tenancy Forum", defaultStakeholders=["Tenant", "KO"])
  rule RentPayment -> Service("StripePayment", currency="NZD")
  rule IdentityVerification -> Service("RealMeAuth")
}
```

No rules run until:  
```eleuscript
Service("HomelessClientPortal").consume(HousingPolicy)
```

This creates:
- `Tenancy Forum` with default stakeholders.  
- Stripe rent payment link.  
- RealMe authentication check.  

---

## Forums
- Forums are **instantiated conversations** around rules.  
- Default stakeholders can be defined in the Policy or added later.  
- Forums inherit governance context from the parent Policy.

---

## Services
- Services = analogue or digital actors.  
- Services **consume Policies** to enact rules.  
- A Service can consume **multiple Policies simultaneously** (composability).  
- Runtime behaviour = aggregate of all rules from consumed Policies.

---

## Data
- Data = **state and storage**.  
- Rules that output data push into the Data layer.  
- Services can consume and emit Data.  

---

## Example: Multi-Policy Consumption
```eleuscript
policy HealthcarePolicy {
  rule Appointment -> Forum("GP Forum")
  rule Payment -> Service("StripePayment", currency="NZD")
}

policy HousingPolicy {
  rule RentAgreement -> Forum("Tenancy Forum", defaultStakeholders=["Tenant", "KO"])
  rule RentPayment -> Service("StripePayment", currency="NZD")
}

Service("CitizenPortal").consume(HousingPolicy, HealthcarePolicy)
```

The `CitizenPortal` Service now consumes **both Housing + Healthcare**:  
- Forums for tenancy + appointments.  
- Payment services for rent + doctor’s fees.

---

## Key Insights
- **Policies define governance.**  
- **Forums are the network layer.**  
- **Services enact information processes.**  
- **Data records and stores outcomes.**  
- Together, this makes EleuScript the **executable form of PFSD**.

---

📌 **Status:** Draft Spec.  
This is the first prototype of EleuScript, defining PFSD as a programmable governance protocol.
