# Eleutherios Session Starter - Critical Context for Claude

## How to Use This Document
**Copy this entire document and paste it at the start of any new Claude session when working on Eleutherios.**

---

## CRITICAL: Read ELEUTHERIOS_FUNDAMENTALS.md First
Before doing anything, you must understand that **forums are policy execution environments, not chat rooms**. They are rule-based coordination engines that execute EleuScript policies.

## Core Principle: Policy-Driven Interface Generation
**EVERYTHING in Eleutherios is generated from EleuScript policies.** The interface displays the execution state of policy rules, not hardcoded UI elements.

## EleuScript Structure
Policies contain rules that create Forums, Services, or reference other Policies:

```eleuscript
policy ConsultationPolicy {
  rule BookAppointment -> Forum("Consultation Room", 
    stakeholders = ["Patient", "Doctor"],
    permissions = {
      "Patient": ["join", "message", "upload_files"], 
      "Doctor": ["join", "message", "upload_files", "end_session"]
    }
  )
  
  rule DocumentConsultation -> Service("ConsultationNotes", 
    required_fields = ["symptoms", "diagnosis", "recommendations"]
  )
  
  rule CreatePrescription -> Policy("PrescriptionPolicy", 
    conditions = ["consultation_completed", "doctor_verified"]
  )
}

policy PrescriptionPolicy {
  rule VerifyPrescription -> Service("PrescriptionValidation",
    required_data = ["patient_id", "medication", "dosage", "duration"]
  )
  
  rule FulfillPrescription -> Forum("Pharmacy Fulfillment",
    stakeholders = ["Patient", "Pharmacist"],
    permissions = {
      "Patient": ["view", "confirm_pickup"],
      "Pharmacist": ["view", "update_status", "message"]
    }
  )
  
  rule PaymentProcessing -> Service("StripePayment", 
    currency = "NZD", 
    conditions = ["prescription_verified", "insurance_checked"]
  )
}
```

## Forum Interface Generation Rules

### 1. Parse the Complete Policy
When displaying a forum, parse ALL rules in the policy (not just the forum creation rule) and show their execution status:

```
Active Policy Rules:
✓ EXECUTED - BookAppointment (Forum created)
⚡ EXECUTING - DocumentConsultation (Notes being completed)
⏳ PENDING - CreatePrescription (Waiting for consultation_completed)

Referenced Policies:
→ PrescriptionPolicy (Will activate when conditions met)
```

### 2. Rule Execution States
- **✓ EXECUTED**: Rule has completed successfully
- **⚡ EXECUTING**: Rule is currently running
- **⏳ PENDING**: Rule is waiting for conditions/triggers
- **❌ FAILED**: Rule execution failed

### 3. Messages Show Rule Context
Messages in forums should show which EleuScript rules triggered them:

```
⚙️ EleuScript Execution Engine
rule: ProvideFinancialSupport → Service("EmergencyPayment")
$200 emergency payment approved automatically
```

### 4. Dynamic Service Status
The service status sidebar shows the real-time execution state of policy rules, not static UI elements.

## Key Files to Reference
- `eleuscript.md` - Complete EleuScript language specification
- `schema.md` - Data model definitions
- `ELEUTHERIOS_FUNDAMENTALS.md` - Core concepts (forums = execution environments)
- `examples.md` - Working EleuScript examples

## Development Approach
1. **Always start with EleuScript** - What policy rules create this interface?
2. **Parse the policy structure** - What rules exist and what's their current state?
3. **Generate interface dynamically** - Display rule execution status, not hardcoded elements
4. **Show rule context** - Make it clear which rules triggered which actions

## Common Mistakes to Avoid
- Treating forums as chat rooms instead of execution environments
- Hardcoding UI elements instead of generating from policies
- Creating rules in the interface without corresponding EleuScript
- Missing the policy → forum → service → data flow

## Repository Context
- **Platform**: Eleutherios MVP on Vercel
- **Database**: Hybrid Firebase (Firestore + Realtime Database)
- **Framework**: Next.js with TypeScript and Tailwind
- **Authentication**: Firebase Auth with role-based access
- **URL**: `eleutherios-mvp.vercel.app`

## Current Implementation Status
- Authentication system: ✓ Complete
- User management: ✓ Complete with CERT scoring
- Navigation: ✓ Material Icons design system
- Policy detail pages: ✓ Working
- Forum detail pages: ✓ Updated to show EleuScript context
- Service detail pages: ✓ Working with database integration

## How This Project Works
Eleutherios implements the PFSD (Policy-Forum-Service-Data) governance model where:
- **Policies** are written in EleuScript DSL
- **Forums** are automatically instantiated when policy rules execute
- **Services** are activated through forum-based coordination
- **Data** captures the governance audit trail

The platform enables real-world governance coordination like emergency housing, healthcare access, and social services through programmatic policy execution rather than manual processes.

---

**Remember: This is not a traditional web app. It's a governance execution platform where EleuScript policies define everything.**