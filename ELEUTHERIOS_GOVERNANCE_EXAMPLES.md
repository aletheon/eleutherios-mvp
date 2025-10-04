# Eleutherios Governance Examples

## Real-World Governance Scenarios

These examples show how EleuScript sub-policy creation enables adaptive governance coordination for actual social services and emergency response situations.

## Emergency Housing Coordination (Operational)

### Initial Forum State
- **Forum**: Emergency Housing Coordination
- **Participants**: Person (Alex), MSD Caseworker (Sarah), Kainga Ora Officer (Mike)
- **Services**: Housing placement, financial support

### Adaptive Evolution Through Sub-Policies

#### Healthcare Need Emerges
```eleuscript
# Typed by MSD caseworker when medical needs identified
rule AddHealthcare -> Policy("HealthcareAccess", 
  stakeholders=["Patient", "GP", "Nurse"],
  permissions={
    "Patient": ["join", "message", "book_appointments"],
    "GP": ["join", "message", "diagnose", "prescribe"],
    "Nurse": ["join", "message", "assist", "follow_up"]
  }
)
```

**Result**: GP and Nurse automatically added to forum, healthcare booking services activated

#### Mental Health Support Required
```eleuscript
# Typed by GP when assessment reveals mental health needs
rule AddMentalHealth -> Policy("MentalHealthSupport",
  stakeholders=["Patient", "Counselor", "Psychiatrist"],
  permissions={
    "Counselor": ["join", "message", "schedule_sessions"],
    "Psychiatrist": ["join", "message", "prescribe", "assess"]
  }
)
```

**Result**: Mental health professionals join, specialized services activated

#### Transport Coordination Needed
```eleuscript
# Typed by any participant when transport barriers identified
rule ActivateTransport -> Service("TransportCoordination", 
  conditions=["urgent_need", "mobility_barriers"],
  auto_dispatch=true,
  coverage_area="Wellington"
)
```

**Result**: Transport service activated with automatic dispatch

## Healthcare Consultation Workflow

### Initial Policy: Basic GP Consultation
```eleuscript
policy BasicConsultation {
  rule CreateConsultationRoom -> Forum("GP Consultation",
    stakeholders=["Patient", "GP"],
    permissions={
      "Patient": ["join", "message", "upload_symptoms"],
      "GP": ["join", "message", "diagnose", "end_session"]
    }
  )
}
```

### Dynamic Expansion During Consultation

#### Specialist Referral Needed
```eleuscript
# Typed by GP during consultation
rule AddSpecialist -> Policy("SpecialistCare",
  stakeholders=["Patient", "GP", "Cardiologist"],
  permissions={
    "Cardiologist": ["join", "message", "review_history", "recommend_treatment"]
  }
)
```

#### Prescription Required
```eleuscript
# Typed by GP when medication needed
rule CreatePrescription -> Policy("PrescriptionWorkflow",
  stakeholders=["Patient", "GP", "Pharmacist"],
  services=["PrescriptionValidation", "StripePayment", "DeliveryCoordination"]
)
```

#### Payment Processing
```eleuscript
# Activated automatically when prescription created
rule ProcessPayment -> Service("StripePayment",
  amount=50,
  currency="NZD",
  multi_party=true,
  recipients=["GP", "Platform"],
  split=[80, 20]
)
```

## Multi-Agency Crisis Response

### Initial Crisis Forum
- **Trigger**: Mental health crisis reported
- **Initial stakeholders**: Person, Crisis team, Family member

### Coordinated Response Evolution

#### Medical Assessment Required
```eleuscript
rule AddMedicalAssessment -> Policy("CrisisMedicalCare",
  stakeholders=["Patient", "CrisisTeam", "EmergencyDoctor", "MentalHealthNurse"],
  permissions={
    "EmergencyDoctor": ["join", "message", "assess", "admit_if_needed"],
    "MentalHealthNurse": ["join", "message", "monitor", "coordinate_care"]
  }
)
```

#### Safe Accommodation Needed
```eleuscript
rule AddSafeAccommodation -> Policy("CrisisAccommodation",
  stakeholders=["Patient", "CrisisTeam", "AccommodationProvider"],
  services=["EmergencyHousing", "SafetyMonitoring"],
  conditions=["medical_clearance", "safety_assessment_complete"]
)
```

#### Family Support Coordination
```eleuscript
rule AddFamilySupport -> Policy("FamilyCoordination",
  stakeholders=["Patient", "Family", "SocialWorker", "FamilyTherapist"],
  permissions={
    "Family": ["join", "message", "receive_updates"],
    "SocialWorker": ["join", "message", "coordinate_services"],
    "FamilyTherapist": ["join", "message", "facilitate_communication"]
  }
)
```

## Integrated Service Delivery

### Comprehensive Support Package
```eleuscript
# Created when complex needs identified
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
  ],
  permissions={
    "ServiceUser": ["join", "message", "access_all_services", "provide_feedback"],
    "CaseManager": ["join", "message", "coordinate_all", "approve_services"],
    "HealthProvider": ["join", "message", "provide_healthcare", "share_medical_info"],
    "HousingOfficer": ["join", "message", "arrange_housing", "monitor_tenancy"],
    "IncomeSupport": ["join", "message", "process_payments", "assess_eligibility"],
    "EducationCoordinator": ["join", "message", "arrange_education", "track_progress"]
  }
)
```

### Service Activation Chain
```eleuscript
# Eligibility processing
rule ProcessEligibility -> Service("EligibilityCheck",
  auto_approve=true,
  criteria=["vulnerability_assessment", "needs_analysis"]
)

# Financial support
rule ActivateIncome -> Service("IncomeSupport", 
  amount=350,
  frequency="weekly",
  currency="NZD",
  conditions=["eligibility_approved"]
)

# Housing placement
rule SecureHousing -> Service("HousingPlacement",
  priority="urgent",
  type="temporary_to_permanent",
  location_preference="current_area"
)

# Healthcare activation
rule ActivateHealthcare -> Service("HealthcareEnrollment",
  services=["GP", "Dental", "Mental Health"],
  bulk_billing=true
)

# Education pathways
rule ActivateEducation -> Service("EducationCoordination",
  pathways=["literacy", "numeracy", "digital_skills", "job_readiness"]
)
```

## Real-Time Governance Evolution

### Policy Hierarchy Example
```
EmergencyHousingPolicy (root)
├── HealthcareAccess (sub-policy)
│   ├── SpecialistCare (sub-sub-policy)
│   └── PrescriptionWorkflow (sub-sub-policy)
├── MentalHealthSupport (sub-policy)
├── TransportCoordination (sub-policy)
└── FamilySupport (sub-policy)
```

### Forum Capability Evolution Timeline
1. **Initial**: 3 participants, 2 services
2. **+Healthcare**: 5 participants, 4 services  
3. **+Mental Health**: 7 participants, 6 services
4. **+Transport**: 7 participants, 7 services
5. **+Family Support**: 10 participants, 9 services

### Audit Trail Example
```
09:15 - Emergency housing forum created
09:22 - rule AddHealthcare -> Policy("HealthcareAccess") [executed by sarah.williams]
09:23 - GP and Nurse added to forum participants
09:23 - Healthcare booking services activated
09:45 - rule AddMentalHealth -> Policy("MentalHealthSupport") [executed by dr.smith]
09:46 - Counselor added to forum participants
09:46 - Mental health services activated
10:30 - rule ActivateTransport -> Service("TransportCoordination") [executed by alex.chen]
10:30 - Transport service activated with auto-dispatch
```

## Service Integration Examples

### Stripe Payment Integration
```eleuscript
rule ProcessConsultationPayment -> Service("StripePayment",
  amount=75,
  currency="NZD",
  description="GP Consultation - Alex Chen",
  multi_party=true,
  recipients={
    "healthcare_provider": 60,
    "platform_fee": 15
  },
  payment_methods=["card", "bank_transfer"],
  capture_method="automatic"
)
```

### Google Calendar Integration
```eleuscript
rule BookFollowUpAppointment -> Service("GoogleCalendar",
  event_type="GP Follow-up",
  duration=30,
  attendees=["patient@email.com", "gp@clinic.nz"],
  auto_send_reminders=true,
  reminder_times=[24, 2] // hours before
)
```

### SMS Notification Integration
```eleuscript
rule ActivateNotifications -> Service("SMSNotification",
  recipients=["patient", "family_contact"],
  triggers=["appointment_confirmed", "service_activated", "payment_processed"],
  template_type="healthcare_coordination"
)
```

## Governance Compliance Examples

### Regulatory Compliance
```eleuscript
rule EnsureCompliance -> Policy("RegulatoryCompliance",
  stakeholders=["ComplianceOfficer", "LegalAdvisor"],
  audit_requirements=[
    "privacy_act_compliance",
    "health_information_privacy",
    "disability_rights_compliance"
  ],
  permissions={
    "ComplianceOfficer": ["join", "message", "audit_all", "generate_reports"],
    "LegalAdvisor": ["join", "message", "review_decisions", "provide_guidance"]
  }
)
```

### Data Privacy Protection
```eleuscript
rule ActivatePrivacyProtection -> Service("DataPrivacy",
  encryption_level="end_to_end",
  data_retention_period="7_years",
  access_controls="role_based",
  audit_logging=true,
  gdpr_compliance=true
)
```

These examples demonstrate how the sub-policy creation system enables governance systems to evolve organically based on real-world coordination needs, while maintaining compliance and audit transparency.