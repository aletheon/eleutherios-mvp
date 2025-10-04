# Eleutherios Session Starter - Updated Implementation Guide

## How to Use This Document
**Copy this entire document and paste it at the start of any new Claude session when working on Eleutherios.**

**IMPORTANT FOR HUMAN**: When starting a new Claude session, after pasting this document, please show Claude these specific things:

1. **Show the current project summary** (the old version you just shared combines well with what we built)
2. **Show the working production URLs**:
   - Main app: `https://eleutherios-mvp.vercel.app`
   - Test interface: `/test-sub-policy` 
   - Working forum: `/forums/emergency-housing`
3. **Show current file structure** (especially the `src/` vs `app/` paths)
4. **Show any immediate issues** you want to work on

This will give Claude complete context of where the project stands and what you want to focus on next.

---

## CRITICAL: Read ELEUTHERIOS_FUNDAMENTALS.md First
Before doing anything, you must understand that **forums are policy execution environments, not chat rooms**. They are rule-based coordination engines that execute EleuScript policies.

## Current Implementation Status: Sub-Policy Creation Operational on Production

### Major Breakthrough Achieved ✅
**Sub-policy creation system is now fully operational on production** - stakeholders can type governance rules directly into forum chat and create child policies that expand forum capabilities in real-time.

**Production URLs Confirmed Working:**
- Main app: `https://eleutherios-mvp.vercel.app`
- Test interface: `/test-sub-policy` (operational)
- Emergency housing forum: `/forums/emergency-housing` (EleuScript execution confirmed)

#### Confirmed Working Features:
- **Real-time EleuScript detection** - Purple highlighting when typing rules
- **Live rule parsing** - Components extracted (ruleName, ruleTarget, targetName)  
- **Rule execution system** - Complete PolicyExecutor implementation
- **Sub-policy creation** - Policy() rules create child policies with parent relationships
- **Forum capability expansion** - New stakeholders and services added dynamically
- **Permission validation** - Stakeholder authorization checks
- **Audit trail** - Complete governance event logging
- **Real-time UI updates** - Service status shows expansion history

#### Working EleuScript Examples:
```eleuscript
rule AddHealthcare -> Policy("HealthcareAccess", stakeholders=["Patient", "Doctor"])
rule ActivateTransport -> Service("Transportation", conditions=["urgent_need"])
rule CreateConsultation -> Forum("Medical", stakeholders=["Patient", "Doctor", "Nurse"])
rule ProvideSupport -> Service("EmergencyPayment", amount=200, currency="NZD")
```

## Current File Structure (Updated)
```
app/
  forums/
    components/
      ForumChat.tsx         ← Sub-policy creation integrated
      ServiceStatus.tsx     ← Expansion tracking UI
    [forumId]/
      page.tsx             ← Forum detail pages
  test-sub-policy/
    page.tsx              ← Testing interface
lib/
  eleuScript/
    parser.ts             ← EleuScript parser (working)
    policyExecutor.ts     ← Sub-policy execution engine (NEW)
  auth.tsx                ← Authentication context (NEW)
  firebase.ts             ← Firebase configuration (NEW)
```

## Core Principle: Dynamic Policy-Driven Governance
**EVERYTHING in Eleutherios is generated from EleuScript policies.** Sub-policies can now be created dynamically, expanding forum capabilities in real-time based on stakeholder needs.

## Sub-Policy Creation Workflow (NEW FEATURE)

### 1. User Types EleuScript Rule in Forum Chat
```eleuscript
rule AddHealthcare -> Policy("HealthcareAccess", 
  stakeholders=["Patient", "Doctor"], 
  permissions={"Patient": ["join", "message"], "Doctor": ["prescribe"]}
)
```

### 2. System Processes Rule Execution
- **Parse** the EleuScript rule
- **Validate** stakeholder permissions
- **Create** sub-policy document in Firestore
- **Expand** forum capabilities
- **Update** UI in real-time

### 3. Forum Capabilities Expand Automatically
- **New stakeholders** added to forum participants
- **New services** added to service status sidebar
- **New permissions** granted based on policy rules
- **Expansion history** tracked for audit trail

### 4. Real-Time UI Updates
- Service Status sidebar shows expansion indicator
- Chat shows system messages confirming policy creation
- New stakeholders can immediately join and participate
- Forum becomes more capable without manual intervention

## Healthcare Coordination Architecture (Next Priority)

### ConsultationPolicy → PrescriptionPolicy Flow
The older project summary revealed a detailed healthcare workflow that should be implemented next:

```eleuscript
policy ConsultationPolicy {
  rule BookAppointment -> Forum("Consultation Room", 
    stakeholders = ["Patient", "Doctor"],
    permissions = {
      "Patient": ["join", "message", "upload_files"], 
      "Doctor": ["join", "message", "upload_files", "end_session", "create_sub_policies"]
    }
  )
  
  rule DocumentConsultation -> Service("ConsultationNotes", 
    required_fields = ["symptoms", "diagnosis", "recommendations"]
  )
  
  rule CreatePrescription -> Policy("PrescriptionPolicy", 
    parent_policy = "ConsultationPolicy",
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

### Required Stripe Configuration for Healthcare:
- **Test accounts** for patients, doctors, pharmacies with NZD currency
- **Multi-party payment splits** (consultation fees, prescription costs, platform fees)
- **Payment webhooks** for real-time status updates
- **Healthcare provider onboarding** with test accounts

### Database Schema for Healthcare Coordination:
```typescript
interface ConsultationNotes {
  consultationId: string;
  patientId: string;
  doctorId: string;
  symptoms: string;
  diagnosis: string;
  recommendations: string;
  prescriptions?: string[];
  consultationFee: number;
  currency: string;
  paymentStatus: 'pending' | 'paid' | 'failed';
  timestamp: string;
}

interface Prescription {
  id: string;
  consultationId: string;
  patientId: string;
  doctorId: string;
  medication: string;
  dosage: string;
  duration: string;
  pharmacyId?: string;
  price: number;
  currency: string;
  status: 'pending' | 'verified' | 'dispensed' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'failed';
}
```

### Immediate Testing Steps:

1. **Start the development server**
   ```bash
   npm run dev
   ```

2. **Set up Firebase configuration** (if not already done)
   - Create `.env.local` with your Firebase credentials
   - Ensure Firestore database is set up

3. **Test using the dedicated test interface**
   - Navigate to `/test-sub-policy`
   - Try the pre-built test rules
   - Verify parsing and execution work

4. **Test in actual forum**
   - Go to `/forums/emergency-housing` (or any existing forum)
   - Type EleuScript rules in chat
   - Watch for purple highlighting and system responses

### Test Rules to Try:

#### Simple Policy Creation:
```eleuscript
rule AddHealthcare -> Policy("HealthcareAccess")
```

#### Complex Policy with Stakeholders:
```eleuscript
rule ComprehensiveCare -> Policy("IntegratedHealthcare", 
  stakeholders=["Patient", "GP", "Specialist"], 
  permissions={"Patient": ["join", "message"], "GP": ["diagnose"]}
)
```

#### Service Activation:
```eleuscript
rule ActivateTransport -> Service("Transportation", auto_dispatch=true)
```

### What to Look For:

✅ **Purple highlighting** when typing EleuScript rules
✅ **Parse validation** showing rule components
✅ **System messages** confirming execution
✅ **Service status updates** showing new capabilities
✅ **Firestore documents** created for sub-policies
✅ **Forum expansion history** tracked in UI

## Current Implementation Status

### ✅ Fully Operational:
- **EleuScript parser** - Syntax detection and validation
- **Authentication system** - Firebase Auth integration
- **Forum chat integration** - EleuScript execution in chat
- **Sub-policy creation** - Dynamic policy hierarchy
- **Forum expansion** - Capability addition in real-time
- **Service status tracking** - Visual expansion feedback
- **Database schema** - Complete policy and forum expansion support
- **Audit trail** - Governance event logging

### 🧪 Ready for Testing:
- **Healthcare coordination** - Multi-stakeholder workflows
- **Payment processing** - Stripe integration hooks
- **Cross-policy coordination** - Governance evolution testing
- **Permission management** - Role-based access expansion

### 🎯 Next Phase (After Testing):
- **Production deployment** - Vercel deployment optimization
- **Stripe integration** - Multi-party payment workflows
- **Advanced governance** - Policy conflict resolution
- **Mobile optimization** - Responsive governance interfaces

## Technical Architecture

### Sub-Policy Creation Engine:
```typescript
// lib/eleuScript/policyExecutor.ts
export class PolicyExecutor {
  static async executeRule(rule: ParsedRule, stakeholderId: string, forumId: string)
  static async createSubPolicy(rule: ParsedRule, stakeholderId: string, forumId: string)
  static async expandForumCapabilities(forumId: string, subPolicy: SubPolicy)
  static extractServicesFromPolicy(policy: SubPolicy): string[]
}
```

### Database Schema (Enhanced):
```typescript
// Forums now support dynamic expansion
interface Forum {
  connectedPolicies: string[];        // Sub-policies created in this forum
  dynamicallyExpanded: boolean;       // Expansion flag
  expansionHistory: ForumExpansion[]; // Complete audit trail
  originalStakeholders: string[];     // Pre-expansion state
}

// Sub-policies have parent relationships
interface SubPolicy {
  parent_policy_id: string;          // Links to parent policy
  parent_forum_id: string;           // Forum where created
  created_by: string;                // Creator stakeholder
}
```

## Common Testing Scenarios

### 1. Emergency Housing + Healthcare Integration
```eleuscript
# In emergency housing forum
rule AddHealthcare -> Policy("HealthcareAccess", stakeholders=["Patient", "GP"])
rule BookAppointment -> Service("GPBooking", urgent=true)
```

### 2. Service Activation Chain
```eleuscript
rule ActivateTransport -> Service("Transportation")
rule ProvideSupport -> Service("EmergencyPayment", amount=200)
rule CoordinateServices -> Forum("ServiceCoordination")
```

### 3. Multi-Stakeholder Coordination
```eleuscript
rule CreateMedicalTeam -> Policy("MedicalCoordination", 
  stakeholders=["Patient", "GP", "Specialist", "Pharmacist"],
  permissions={"Patient": ["join", "message"], "GP": ["diagnose", "prescribe"]}
)
```

## Troubleshooting Guide

### If EleuScript Detection Not Working:
- Check browser console for parser errors
- Verify EleuScript syntax (use test interface)
- Ensure Firebase connection is working

### If Sub-Policy Creation Fails:
- Check stakeholder permissions in forum
- Verify Firestore write permissions
- Look for authentication issues

### If Forum Expansion Not Visible:
- Check service status component is loaded
- Verify Firestore real-time listeners
- Look for UI state update issues

## Key Development Insights

### Major Breakthrough Understanding:
**Governance systems can evolve in real-time** based on stakeholder needs rather than predetermined administrative processes. The sub-policy creation system proves that:

1. **Forums are programmable** - Rules typed in chat modify forum capabilities
2. **Governance is adaptive** - Policies create child policies as needs emerge  
3. **Coordination is automatic** - Stakeholders added and services activated programmatically
4. **Audit trails are built-in** - Every expansion tracked for compliance

### What Makes This Unique:
- **Natural language governance** - Type rules, get immediate execution
- **Dynamic capability expansion** - Forums grow more powerful over time
- **Real-time coordination** - No manual configuration required
- **Compliance-ready** - Complete audit trail automatically maintained

## Repository Context
- **Platform**: Eleutherios MVP on Vercel
- **Database**: Firebase (Firestore + Authentication)
- **Framework**: Next.js 14 with TypeScript and Tailwind
- **Authentication**: Firebase Auth with role-based access
- **Real-time**: Firestore real-time listeners
- **URL**: `eleutherios-mvp.vercel.app`

## How This Project Works
Eleutherios implements the PFSD (Policy-Forum-Service-Data) governance model where:
- **Policies** are written in EleuScript DSL and can create child policies
- **Forums** are automatically instantiated and expanded when policy rules execute
- **Services** are activated through forum-based coordination
- **Data** captures the complete governance evolution audit trail

The platform enables real-world governance coordination like emergency housing, healthcare access, and social services through programmatic policy execution rather than manual processes.

## Current Development Priority: Testing & Validation

The sub-policy creation system is implemented and ready for comprehensive testing. Focus on:

1. **Functional testing** - Verify all EleuScript rules work correctly
2. **Integration testing** - Test real governance workflows  
3. **UI/UX validation** - Ensure smooth stakeholder experience
4. **Database integrity** - Verify all documents created correctly
5. **Performance testing** - Check real-time updates work smoothly

---

**Remember: This is not a traditional web app. It's a governance execution platform where EleuScript policies define everything. The breakthrough of sub-policy creation means governance systems can now evolve dynamically based on real-world coordination needs.**