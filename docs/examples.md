# Eleutherios Policy Examples

This document provides practical examples of EleuScript policies that demonstrate the Platform's governance capabilities, including the revolutionary service visibility model and governance-enabled shopping cart.

## Healthcare Coordination Workflow

### Complete Patient Care Coordination

This example demonstrates how a patient, doctor, and pharmacist coordinate care using private services and authorized shopping cart management.

```eleuscript
policy PatientCareCoordination {
  // Create multi-stakeholder forum for patient care
  rule CreateConsultation -> Forum("Patient Care - John Smith", {
    "stakeholders": ["Patient", "Doctor", "Pharmacist"],
    "permissions": {
      "Patient": ["view", "approve", "request"],
      "Doctor": ["create", "prescribe", "add_to_cart"],
      "Pharmacist": ["view", "add_medication", "add_to_cart"]
    },
    "compliance": ["HIPAA"],
    "data_retention": "7years"
  })
  
  // Enable private medication directory access
  rule MedicationAccess -> Service("MedicationDirectory", {
    "visibility": "private",
    "authorized_roles": ["Pharmacist", "Doctor"],
    "requires_license": true,
    "audit_level": "full",
    "searchable_categories": ["prescription", "otc_restricted"]
  })
  
  // Allow pharmacist to add medications to patient cart
  rule PharmacistCartAccess -> Service("AddToCart", {
    "permission": "can_add_to_stakeholder_cart",
    "requiredRole": "Pharmacist",
    "targetStakeholder": "Patient", 
    "requires_forum_context": true,
    "approval_required": true,
    "audit_trail": true,
    "compliance_validation": ["prescription_required"]
  })
  
  // Process payment with multi-party splits
  rule PaymentProcessing -> Service("MultiPartyPayment", {
    "payer": "Patient",
    "revenue_splits": {
      "pharmacy": 80,
      "platform": 15,
      "regulatory_compliance": 5
    },
    "requires_patient_approval": true
  })
}
```

### Workflow Execution Steps:

1. **Doctor creates consultation forum** with patient and pharmacist
2. **Doctor diagnoses patient** and discusses treatment options
3. **Pharmacist searches private medication directory** (not visible to patient)
4. **Pharmacist adds medication to patient's cart** using authorized permissions
5. **Patient reviews cart** with complete transparency of who added what
6. **Patient approves payment** with automatic revenue distribution
7. **Complete audit trail** maintained for regulatory compliance

## Emergency Housing Coordination

### Urgent Multi-Agency Response

```eleuscript
policy EmergencyHousingResponse {
  // Create urgent coordination forum
  rule EmergencyIntake -> Forum("Crisis Housing - Emergency", {
    "stakeholders": ["Person", "MSD Caseworker", "Housing Officer", "Support Worker"],
    "priority": "urgent",
    "response_time": "2hours",
    "auto_notify": true
  })
  
  // Enable emergency accommodation access
  rule EmergencyAccommodation -> Service("EmergencyHousingDirectory", {
    "visibility": "restricted",
    "authorized_roles": ["Housing Officer", "MSD Caseworker"],
    "emergency_access": true,
    "availability_filter": "immediate"
  })
  
  // Allow authorized emergency service additions
  rule EmergencyServiceAdd -> Service("AddToCart", {
    "permission": "emergency_add_to_cart",
    "requiredRole": "Housing Officer",
    "targetStakeholder": "Person",
    "bypass_approval": true,
    "requires_justification": true,
    "audit_level": "maximum",
    "notify_stakeholders": ["Person", "MSD Caseworker"]
  })
  
  // Government payment processing
  rule GovernmentPayment -> Service("GovernmentPayment", {
    "payer": "MSD",
    "payment_method": "emergency_fund",
    "approval_required": false,
    "emergency_authorization": true,
    "audit_trail": true
  })
}
```

## AI Memory Governance

### User-Controlled Memory Management

```eleuscript
policy AIMemoryGovernance {
  // Multi-stakeholder memory coordination
  rule MemoryPreferences -> Forum("Memory Governance", {
    "stakeholders": ["User", "AI System", "Privacy Officer"],
    "decision_method": "user_primary",
    "privacy_level": "maximum"
  })
  
  // Data retention service
  rule DataRetention -> Service("MemoryManagement", {
    "duration": "30days", 
    "conditions": ["user_consent", "legal_compliance"],
    "visibility": "restricted",
    "authorized_roles": ["Privacy Officer", "User"],
    "user_control": true
  })
  
  // Context preservation with privacy
  rule ContextPreservation -> Service("ConversationMemory", {
    "scope": "session",
    "privacy_level": "encrypted",
    "cross_platform": true,
    "user_portable": true
  })
  
  // Memory export for portability
  rule MemoryExport -> Service("DataPortability", {
    "format": "standardized_json",
    "encryption": "user_key",
    "includes": ["preferences", "context", "permissions"],
    "excludes": ["internal_model_weights"]
  })
}
```

## Service Visibility Examples

### Public Transportation Service

```eleuscript
policy PublicTransportation {
  rule AccessRideShare -> Service("RideShareDirectory", {
    "visibility": "public",
    "searchable_by": "all_authenticated_users",
    "category": "transportation",
    "pricing_model": "per_trip"
  })
  
  rule BookTransport -> Service("AddToCart", {
    "permission": "self_service",
    "requires_payment_method": true,
    "instant_booking": true
  })
}
```

### Private Legal Services

```eleuscript
policy LegalServicesAccess {
  rule AccessLegalDirectory -> Service("LegalServicesDirectory", {
    "visibility": "private",
    "authorized_roles": ["Lawyer", "Legal Aid Worker"],
    "requires_bar_admission": true,
    "specialization_filter": true
  })
  
  rule ClientRepresentation -> Service("AddToCart", {
    "permission": "can_add_to_stakeholder_cart",
    "requiredRole": "Lawyer",
    "targetStakeholder": "Client",
    "requires_retainer_agreement": true,
    "audit_level": "full"
  })
}
```

### Restricted Financial Services

```eleuscript
policy RestrictedFinancialServices {
  rule AccessInvestmentProducts -> Service("InvestmentDirectory", {
    "visibility": "restricted",
    "authorized_roles": ["Financial Advisor"],
    "additional_requirements": ["Series_7_License", "Client_Suitability_Check"],
    "compliance_requirements": ["SEC_Regulation", "FINRA_Rules"]
  })
  
  rule InvestmentRecommendation -> Service("AddToCart", {
    "permission": "fiduciary_add_to_cart",
    "requiredRole": "Financial Advisor",
    "targetStakeholder": "Client",
    "requires_risk_assessment": true,
    "approval_chain": ["Client", "Compliance_Officer"],
    "audit_level": "maximum"
  })
}
```

## Complex Multi-Stakeholder Scenarios

### Foster Care Coordination

```eleuscript
policy FosterCareCoordination {
  // Create child-focused coordination forum
  rule CreateCareTeam -> Forum("Child Welfare - Case #123", {
    "stakeholders": ["Child", "Foster Parent", "Social Worker", "Guardian ad Litem", "Therapist"],
    "child_protection": true,
    "confidentiality_level": "maximum"
  })
  
  // Enable access to child services directory
  rule ChildServicesAccess -> Service("ChildWelfareServices", {
    "visibility": "restricted",
    "authorized_roles": ["Social Worker", "Guardian ad Litem"],
    "requires_background_check": true,
    "child_safety_validated": true
  })
  
  // Coordinated service planning
  rule ServicePlanAdd -> Service("AddToCart", {
    "permission": "welfare_service_add",
    "requiredRole": "Social Worker",
    "targetStakeholder": "Child",
    "requires_court_approval": true,
    "best_interest_standard": true,
    "notify_stakeholders": ["Foster Parent", "Guardian ad Litem"]
  })
}
```

### Mental Health Crisis Response

```eleuscript
policy MentalHealthCrisis {
  // Create crisis response forum
  rule CrisisResponse -> Forum("Mental Health Crisis Response", {
    "stakeholders": ["Person", "Crisis Counselor", "Psychiatrist", "Family Member"],
    "priority": "critical",
    "response_time": "immediate",
    "safety_protocols": true
  })
  
  // Enable crisis intervention services
  rule CrisisServices -> Service("MentalHealthCrisisDirectory", {
    "visibility": "restricted",
    "authorized_roles": ["Crisis Counselor", "Psychiatrist", "Licensed Social Worker"],
    "crisis_level_access": true,
    "24_7_availability": true
  })
  
  // Emergency service authorization
  rule EmergencyMentalHealthAdd -> Service("AddToCart", {
    "permission": "crisis_add_to_cart",
    "requiredRole": "Crisis Counselor",
    "targetStakeholder": "Person",
    "emergency_override": true,
    "safety_justification_required": true,
    "immediate_implementation": true
  })
}
```

## Service Provider Examples

### Pharmacy Service Registration

```eleuscript
policy PharmacyServiceOffering {
  // Register prescription medication service
  rule RegisterMedication -> Service("ServiceRegistration", {
    "service_type": "prescription_medication",
    "visibility": "private",
    "authorized_purchasers": ["Patient"],
    "authorized_prescribers": ["Doctor"],
    "authorized_dispensers": ["Pharmacist"],
    "regulatory_compliance": ["FDA_Approved", "DEA_Scheduled"],
    "pricing_model": "per_prescription"
  })
  
  // Define service attributes
  rule MedicationAttributes -> Service("ServiceAttributes", {
    "dosage_forms": ["tablet", "capsule", "liquid"],
    "strength_options": ["250mg", "500mg", "750mg"],
    "package_sizes": [10, 21, 30, 90],
    "storage_requirements": "room_temperature",
    "expiration_tracking": true
  })
}
```

### Transportation Service Provider

```eleuscript
policy TransportServiceOffering {
  // Register public transportation service
  rule RegisterRideService -> Service("ServiceRegistration", {
    "service_type": "transportation",
    "visibility": "public", 
    "geographic_coverage": "Greater Auckland",
    "availability": "24_7",
    "booking_method": "app_based"
  })
  
  // Define service capabilities
  rule TransportCapabilities -> Service("ServiceAttributes", {
    "vehicle_types": ["standard", "wheelchair_accessible", "premium"],
    "passenger_capacity": [1, 2, 4, 6],
    "payment_methods": ["credit_card", "digital_wallet", "cash"],
    "estimated_arrival": "real_time_tracking"
  })
}
```

## Compliance and Audit Examples

### HIPAA Compliance Pattern

```eleuscript
policy HIPAACompliance {
  // Ensure all healthcare actions comply with HIPAA
  rule PatientDataAccess -> Service("PatientRecords", {
    "compliance_requirements": ["HIPAA"],
    "minimum_necessary_standard": true,
    "requires_patient_authorization": true,
    "audit_all_access": true,
    "data_breach_notification": true
  })
  
  // Secure communication requirements
  rule SecureCommunication -> Forum("Patient Discussion", {
    "encryption": "end_to_end",
    "message_retention": "legally_required_minimum",
    "access_logging": true,
    "unauthorized_access_alerts": true
  })
}
```

### Financial Regulation Compliance

```eleuscript
policy FinancialCompliance {
  // Ensure fiduciary responsibility
  rule FiduciaryStandard -> Service("InvestmentAdvice", {
    "compliance_requirements": ["SEC_Fiduciary", "FINRA_Suitability"],
    "client_best_interest": true,
    "conflict_disclosure": true,
    "documentation_required": true
  })
  
  // Anti-money laundering requirements
  rule AMLCompliance -> Service("FinancialTransaction", {
    "kyc_verification": true,
    "transaction_monitoring": true,
    "suspicious_activity_reporting": true,
    "record_retention": "5years"
  })
}
```

## Multi-Party Coordination Patterns

### Local Service Coordination (Milk + Delivery Example)

```eleuscript
policy LocalServiceCoordination {
  // Create coordination forum for independent service providers
  rule CreateServiceForum -> Forum("Local Service Coordination", {
    "stakeholders": ["Customer", "Local Farmer", "Delivery Service"],
    "coordination_type": "multi_provider"
  })
  
  // Enable farmer to add delivery service to customer cart
  rule AuthorizedServiceAddition -> Service("AddToCart", {
    "permission": "can_add_coordinated_service",
    "requiredRole": "Service Provider",
    "targetStakeholder": "Customer",
    "requires_coordination_context": true,
    "multi_party_billing": true
  })
  
  // Process coordinated payment with revenue splits
  rule CoordinatedPayment -> Service("MultiPartyPayment", {
    "payer": "Customer",
    "revenue_splits": {
      "farmer": 70,
      "delivery": 25,
      "platform": 5
    },
    "coordination_fee": "included"
  })
}
```

## Testing and Validation Examples

### Policy Testing Framework

```eleuscript
policy PolicyTesting {
  // Test permission validation
  rule TestPermissions -> Service("PermissionValidator", {
    "test_cases": ["authorized_user", "unauthorized_user", "expired_credentials"],
    "expected_outcomes": ["access_granted", "access_denied", "re_authentication_required"],
    "audit_test_results": true
  })
  
  // Test service visibility
  rule TestVisibility -> Service("VisibilityValidator", {
    "test_scenarios": ["public_discovery", "private_role_access", "restricted_compliance"],
    "role_simulation": ["Patient", "Doctor", "Pharmacist", "Public"],
    "validate_search_results": true
  })
}
```

These examples demonstrate the power of EleuScript to create sophisticated governance workflows while maintaining transparency, compliance, and stakeholder coordination. The language enables everything from simple service access to complex multi-agency emergency response, all with complete audit trails and stakeholder empowerment.