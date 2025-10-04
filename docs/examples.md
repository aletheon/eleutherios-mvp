# Eleutherios Examples - Complete Reference

## Current Implementation: Live Forum Rule Execution

**STATUS**: Operational on production at `https://eleutherios-mvp.vercel.app`

These examples show **simple EleuScript rules** that stakeholders can type directly into forum chat for immediate execution.

## Basic Rule Syntax (Currently Working)

### 1. Sub-Policy Creation
```eleuscript
# Basic sub-policy
rule AddHealthcare -> Policy("HealthcareAccess")

# Sub-policy with stakeholders
rule AddHealthcare -> Policy("HealthcareAccess", stakeholders=["Patient", "Doctor"])

# Complex sub-policy with permissions
rule ComprehensiveCare -> Policy("IntegratedHealthcare", 
  stakeholders=["Patient", "GP", "Specialist"], 
  permissions={"Patient": ["join", "message"], "GP": ["diagnose"]}
)
```

### 2. Service Activation
```eleuscript
# Basic service activation
rule ActivateTransport -> Service("Transportation")

# Service with parameters
rule ActivateTransport -> Service("Transportation", auto_dispatch=true)

# Payment service
rule ProcessPayment -> Service("StripePayment", amount=50, currency="NZD")

# Emergency payment
rule ProvideSupport -> Service("EmergencyPayment", amount=200, currency="NZD")
```

### 3. Forum Creation
```eleuscript
# Basic forum
rule CreateConsultation -> Forum("Medical")

# Forum with stakeholders
rule CreateConsultation -> Forum("Medical", stakeholders=["Patient", "Doctor", "Nurse"])
```

## Real-World Governance Scenarios (Operational)

### Emergency Housing → Healthcare Transition
**Context**: Emergency housing forum where healthcare need emerges

```eleuscript
# Stakeholder types this in emergency housing forum chat:
rule AddHealthcare -> Policy("HealthcareAccess", 
  stakeholders=["Patient", "GP"], 
  permissions={"Patient": ["join", "message"], "GP": ["diagnose"]}
)
```

**Result**: 
- GP automatically added to forum
- Healthcare services activated
- Forum capabilities expanded
- System message confirms execution

### Healthcare Consultation Workflow
**Context**: Healthcare forum for patient-doctor coordination

```eleuscript
# Book appointment
rule BookAppointment -> Service("GPBooking", urgent=true)

# Create prescription when needed
rule CreatePrescription -> Policy("PrescriptionPolicy", 
  stakeholders=["Patient", "GP", "Pharmacist"]
)

# Process payment for consultation
rule ProcessPayment -> Service("StripePayment", 
  amount=50, 
  currency="NZD",
  multi_party=true
)
```

### Multi-Agency Crisis Response
**Context**: Mental health crisis requiring multiple service coordination

```eleuscript
# Add medical assessment
rule AddMedicalAssessment -> Policy("CrisisMedicalCare",
  stakeholders=["Patient", "CrisisTeam", "EmergencyDoctor", "MentalHealthNurse"]
)

# Safe accommodation
rule AddSafeAccommodation -> Policy("CrisisAccommodation",
  stakeholders=["Patient", "CrisisTeam", "AccommodationProvider"],
  services=["EmergencyHousing", "SafetyMonitoring"]
)

# Family support coordination
rule AddFamilySupport -> Policy("FamilyCoordination",
  stakeholders=["Patient", "Family", "SocialWorker", "FamilyTherapist"]
)
```

## Testing Examples (Ready to Use)

### Emergency Housing Forum Tests
```eleuscript
# Test basic healthcare addition
rule AddHealthcare -> Policy("HealthcareAccess")

# Test transport coordination
rule ActivateTransport -> Service("Transportation", auto_dispatch=true)

# Test financial support
rule ProvideSupport -> Service("EmergencyPayment", amount=200, currency="NZD")
```

### Healthcare Coordination Tests
```eleuscript
# Test comprehensive healthcare policy
rule ComprehensiveCare -> Policy("IntegratedHealthcare", 
  stakeholders=["Patient", "GP", "Specialist", "Pharmacist"],
  services=["Consultation", "Prescription", "Payment"]
)

# Test specialist referral
rule AddSpecialist -> Policy("SpecialistCare", 
  stakeholders=["Patient", "GP", "Cardiologist"]
)

# Test pharmacy coordination
rule AddPharmacy -> Policy("PrescriptionFulfillment", 
  stakeholders=["Patient", "GP", "Pharmacist"]
)
```

### Payment Processing Tests
```eleuscript
# Test consultation payment
rule ProcessConsultationPayment -> Service("StripePayment",
  amount=75,
  currency="NZD",
  description="GP Consultation",
  multi_party=true
)

# Test prescription payment
rule ProcessPrescriptionPayment -> Service("StripePayment",
  amount=25,
  currency="NZD", 
  description="Prescription Fulfillment"
)
```

## Advanced Scenarios (Next Phase)

### Cross-Domain Governance Evolution
```eleuscript
# Start with housing, evolve to comprehensive support
rule ComprehensiveSupport -> Policy("IntegratedSupport",
  stakeholders=[
    "ServiceUser", 
    "CaseManager", 
    "HealthProvider", 
    "HousingOfficer", 
    "IncomeSupport",
    "EducationCoordinator"
  ],
  services=[
    "HealthcareCoordination",
    "HousingPlacement", 
    "FinancialSupport",
    "EducationPathways",
    "EmploymentSupport"
  ]
)
```

### Service Integration Chain
```eleuscript
# Eligibility → Payment → Housing → Healthcare flow
rule ProcessEligibility -> Service("EligibilityCheck", auto_approve=true)

rule ActivateIncome -> Service("IncomeSupport", 
  amount=350,
  frequency="weekly",
  currency="NZD"
)

rule SecureHousing -> Service("HousingPlacement",
  priority="urgent",
  type="temporary_to_permanent"
)

rule ActivateHealthcare -> Service("HealthcareEnrollment",
  services=["GP", "Dental", "Mental Health"],
  bulk_billing=true
)
```

## Expected Results from Rule Execution

### Database Changes
- **Sub-policy documents** created in Firestore with parent relationships
- **Forum participants** expanded with new stakeholders
- **Service status** updated with new capabilities
- **Expansion history** logged for audit trail

### UI Updates
- **Purple highlighting** when typing EleuScript rules
- **System messages** confirming rule execution
- **Service status sidebar** showing new capabilities
- **Expansion indicator** showing forum growth
- **Real-time participant updates** as stakeholders added

### Governance Evolution
- **Forum capabilities** expand organically based on needs
- **Stakeholder coordination** grows across service domains
- **Audit trail** maintains complete governance transparency
- **Permission management** adapts to new stakeholder roles

## How to Test These Examples

### 1. Basic Testing (Test Interface)
- Go to `/test-sub-policy`
- Try the pre-built test rules
- Verify parsing and execution work

### 2. Forum Testing (Production)
- Go to `/forums/emergency-housing`
- Type EleuScript rules in chat
- Watch for purple highlighting and system responses

### 3. Healthcare Testing (Next Priority)
- Start with basic healthcare addition in housing forum
- Progress to complex multi-stakeholder coordination
- Test payment processing integration

## Legacy Examples (Reference)

### Basic Policy Examples
```eleuscript
# Housing policy
policy HousingPolicy {
  rule TenancyAgreement -> Forum("Tenancy Forum", defaultStakeholders = ["Tenant", "KO"])
  rule RentPayment -> Service("StripePayment", currency="NZD")
  rule IdentityVerification -> Service("RealMeAuth")
}

# T-shirt policy (service attributes)
policy TshirtPolicy {
  rule Price -> Service("PriceCapture", default = 29.99, currency="USD")
  rule Size -> Service("SizeSelector", options = ["S","M","L","XL"])
  rule Color -> Service("ColorSelector", options = ["Black","White","Red"])
  rule Quantity -> Service("StockManager", available = 500)
}
```

### Free vs Paid Services
```eleuscript
policy HealthcarePolicy {
  rule ClinicVisit -> Service("DoctorConsult", cost="Free")
  rule TelehealthVisit -> Service("DoctorConsult", provider="StripePayment", cost=49.00, currency="NZD")
}
```

### Stakeholder Forum Participation
```eleuscript
policy FoodPolicy {
  rule Distribution -> Forum("Food Pantry Forum", defaultStakeholders = ["Volunteer", "Farmer"])
}
```

### Policy Linking
```eleuscript
policy ParentPolicy {
  rule ChildHousing -> Policy("HousingPolicy")
}
```

### CERT Ranking Implementation
```eleuscript
policy CERTExample {
  rule Engagement -> Service("MeasureEngagement", metrics = ["responseTime", "positiveReviews"])
  rule Retention -> Service("MeasureRetention", mode="free")
  rule Trust -> Service("FollowerCount")
  rule Cooperation -> Service("CrossPolicyParticipation")
}
```

## Key Implementation Notes

### Current System Capabilities
- **Rule parsing**: Real-time syntax detection and validation
- **Permission checking**: Stakeholder authorization before execution
- **Database integration**: Sub-policy creation with parent relationships
- **UI feedback**: Purple highlighting and system messages
- **Forum expansion**: Dynamic stakeholder and service addition

### Next Phase Requirements
- **Stripe integration**: Multi-party payment processing
- **Healthcare workflows**: Patient-doctor-pharmacist coordination
- **Service activation**: Real external service integration
- **Cross-forum coordination**: Policies spanning multiple forums

### Testing Validation
- **Sub-policy creation**: Firestore documents with correct relationships
- **Forum expansion**: New stakeholders added to participants
- **Service activation**: New services appear in status sidebar
- **Audit trail**: Complete governance event logging
- **Real-time updates**: UI reflects changes immediately

The examples demonstrate how EleuScript enables **adaptive governance infrastructure** where coordination systems evolve organically based on stakeholder needs rather than predetermined administrative processes.