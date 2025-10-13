# EleuScript Language Specification - Comprehensive

EleuScript is the domain-specific language (DSL) of Eleutherios that enables natural language governance rules to compile into executable coordination workflows and autonomous marketplace services.

## Current Implementation Status

**OPERATIONAL**: Stakeholders can type EleuScript rules directly into forum chat for immediate execution.
**NEXT PHASE**: Autonomous service creation and validation for programmable marketplace.
**Production URL**: `https://eleutherios-mvp.vercel.app`

## Language Overview

EleuScript's base object is a `policy`, which defines `rules`. Rules instantiate into **forums**, **services**, or references to other **policies**. This creates a governance protocol that coordinates stakeholders across any domain and enables programmable commerce through the Policy-Forum-Service-Data (PFSD) model.

### Basic Syntax

```eleuscript
policy PolicyName {
  rule RuleName -> Target(parameters)
}
```

## Core Rule Types

### Forum Rules
Create coordination spaces for multi-stakeholder collaboration.

```eleuscript
rule CreateConsultation -> Forum("Patient Care", 
  stakeholders=["Patient", "Doctor", "Pharmacist"]
)

rule EmergencyCoordination -> Forum("Crisis Response",
  stakeholders=["Person", "Caseworker", "Emergency Services"],
  priority="urgent",
  autoNotify=true,
  autoEscalate={
    timeLimit=48h,
    escalateTo=["SupervisorCaseWorker"]
  }
)
```

### Service Rules
Define access to and interaction with services, including revolutionary visibility controls.

#### Public Service Access
```eleuscript
rule FindTransport -> Service("TransportDirectory", {
  "visibility": "public",
  "category": "transportation",
  "searchable_by": "all"
})
```

#### Private Service Access
```eleuscript
rule AccessMedication -> Service("MedicationDirectory", {
  "visibility": "private",
  "authorized_roles": ["Pharmacist", "Doctor"],
  "requires_license": true,
  "audit_level": "full"
})
```

#### Restricted Service Access
```eleuscript
rule AccessControlledSubstance -> Service("ControlledMedicationDirectory", {
  "visibility": "restricted",
  "authorized_roles": ["Doctor"],
  "additional_requirements": ["DEA_License", "Patient_Consent"],
  "approval_chain": ["Supervisor", "Pharmacist"],
  "audit_level": "maximum"
})
```

### Shopping Cart Governance Rules
Enable authorized multi-stakeholder service coordination.

#### Basic Cart Access
```eleuscript
rule AddToPatientCart -> Service("CartManagement", {
  "permission": "can_add_to_stakeholder_cart",
  "requiredRole": "Pharmacist",
  "targetStakeholder": "Patient",
  "auditTrail": true
})
```

#### Context-Aware Cart Management
```eleuscript
rule PharmacistMedicationAdd -> Service("AddToCart", {
  "permission": "can_add_to_stakeholder_cart",
  "requiredRole": "Pharmacist", 
  "targetStakeholder": "Patient",
  "requires_forum_context": true,
  "service_visibility": "private",
  "approval_required": true,
  "audit_level": "full",
  "compliance_flags": ["prescription_required", "HIPAA"]
})
```

#### Emergency Cart Access
```eleuscript
rule EmergencyMedicationAdd -> Service("EmergencyCartAdd", {
  "permission": "emergency_add_to_cart",
  "requiredRole": "Emergency Doctor",
  "targetStakeholder": "Patient",
  "bypass_approval": true,
  "requires_justification": true,
  "audit_level": "maximum",
  "notify_stakeholders": ["Patient", "Primary Doctor"]
})
```

### Payment Rules
Handle multi-party payment processing with governance transparency.

```eleuscript
rule ProcessCoordinatedPayment -> Service("MultiPartyPayment", {
  "payer": "Patient",
  "revenue_splits": {
    "pharmacy": 80,
    "platform": 15,
    "compliance": 5
  },
  "requires_approval": true,
  "audit_trail": true
})
```

### Policy Reference Rules
Enable policy composition and inheritance.

```eleuscript
rule InheritMemoryGovernance -> Policy("AIMemoryGovernance", {
  "apply_to_user": true,
  "override_permissions": ["data_retention"]
})
```

## Autonomous Services (NEW)

### Service Definitions
Services can be defined as autonomous entities with validation logic and governance integration:

```eleuscript
service ServiceName {
    // Basic service properties
    price = amount
    currency = "NZD"
    type = "product" | "ai" | "api" | "human"
    visibility = "public" | "private" | "restricted"
    
    // Validation policies
    validation_policies = [
        "rule validation_name -> Service('validation_service', parameters)"
    ]
    
    // Inherited governance capabilities
    inherits_policies = [
        "PolicyName_Version"
    ]
    
    // Autonomy settings
    autonomy = {
        auto_accept = true | false
        auto_reject = true | false
        require_human_approval = true | false
    }
    
    // AI integration
    ai_agent = {
        type = "validation" | "pricing" | "customer_service"
        model = "model_name"
        authority = "advisory" | "limited" | "autonomous"
    }
}
```

### Service Examples

#### Simple Product Service
```eleuscript
service LocalMilk {
    price = 1.00
    currency = "NZD"
    type = "product"
    visibility = "public"
    
    validation_policies = [
        "rule location_check -> Service('LocationValidator', $customer.location)",
        "rule delivery_day -> Service('DeliverySchedule', $current_day)"
    ]
    
    autonomy = {
        auto_accept = true
        auto_reject = true
        require_human_approval = false
    }
}
```

#### Private Healthcare Service
```eleuscript
service PrescriptionMedication {
    price = 25.00
    currency = "NZD"
    type = "product"
    visibility = "private"
    authorized_roles = ["Pharmacist", "Doctor"]
    
    validation_policies = [
        "rule prescription_check -> Service('PrescriptionValidator', $prescription)",
        "rule license_verification -> Service('LicenseCheck', $provider.license)"
    ]
    
    autonomy = {
        auto_accept = false
        auto_reject = false
        require_human_approval = true
    }
    
    compliance_requirements = ["FDA_Approved", "Prescription_Required"]
}
```

#### AI-Powered Service
```eleuscript
service DynamicPricingService {
    base_price = 10.00
    currency = "NZD"
    type = "ai"
    visibility = "public"
    
    ai_agent = {
        type = "pricing"
        model = "gpt-4"
        authority = "limited"
    }
    
    validation_policies = [
        "rule price_calculation -> Service('AI_PricingAgent', {
            inputs: ['supply_levels', 'demand_patterns'],
            max_adjustment: '20%',
            explanation_required: true
        })"
    ]
}
```

### Purchase Request Syntax
Customers can request services using natural language:

```eleuscript
# Simple purchase
rule pay -> Service("ServiceName", $amount)

# Purchase with parameters
rule pay -> Service("CustomService", {
    amount: $50,
    quantity: 2,
    delivery_preference: "express"
})

# Conditional purchase
rule pay -> Service("EventTickets", $75) if Availability.remaining > 0
```

## Service Visibility Specification

### Visibility Levels

#### Public Services
- Searchable and discoverable by any authenticated user
- Suitable for general coordination services
- No role restrictions

```eleuscript
rule PublicTransport -> Service("RideShare", {
  "visibility": "public",
  "category": "transportation"
})
```

#### Private Services  
- Only accessible to specific roles
- Requires role validation
- Often requires professional licensing

```eleuscript
rule PrivateMedication -> Service("PrescriptionDrugs", {
  "visibility": "private",
  "authorized_roles": ["Pharmacist", "Doctor"],
  "requires_license": true
})
```

#### Restricted Services
- Role-based access plus additional policy requirements
- Multiple authorization layers
- Enhanced audit requirements

```eleuscript
rule RestrictedNarcotics -> Service("ControlledSubstances", {
  "visibility": "restricted",
  "authorized_roles": ["Doctor"],
  "additional_requirements": ["DEA_License", "Patient_History_Check"],
  "audit_level": "maximum"
})
```

## Validation Policies

### Validation Rule Syntax
```eleuscript
validation_policy PolicyName {
    name = "descriptive_name"
    rule_expression = "Service('validation_service', parameters)"
    error_message = "Human readable error explanation"
    required = true | false
    parameters = {
        key: "value"
    }
}
```

### Common Validation Patterns

#### Location Validation
```eleuscript
validation_policy LocationValidation {
    name = "acceptable_location"
    rule_expression = "Service('LocationValidator', {
        customer_location: $customer.location,
        service_radius: 10,
        unit: 'km'
    })"
    error_message = "Sorry, you're outside our delivery area ({{distance}}km away, max {{max_distance}}km)"
    required = true
}
```

#### Time-Based Validation
```eleuscript
validation_policy DeliverySchedule {
    name = "delivery_day_check"
    rule_expression = "Service('ScheduleValidator', {
        current_day: $current_day,
        delivery_days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    })"
    error_message = "We don't deliver on {{current_day}}. Available: {{available_days}}"
    required = true
}
```

#### Healthcare Compliance Validation
```eleuscript
validation_policy PrescriptionValidation {
    name = "prescription_required"
    rule_expression = "Service('PrescriptionValidator', {
        medication_id: $service.id,
        prescriber: $prescription.doctor,
        patient: $request.patient
    })"
    error_message = "Valid prescription required for {{medication_name}}"
    required = true
}
```

## Advanced Features

### Conditional Logic
```eleuscript
rule ConditionalMedication -> Service("MedicationDirectory", {
  "condition": "patient.age >= 18",
  "visibility": "private",
  "authorized_roles": ["Doctor", "Pharmacist"]
})

rule PediatricMedication -> Service("PediatricMedicationDirectory", {
  "condition": "patient.age < 18",
  "visibility": "restricted", 
  "authorized_roles": ["Pediatrician", "Pediatric Pharmacist"],
  "requires_parental_consent": true
})
```

### Event Handlers
```eleuscript
policy ResponsiveMarketplace {
    rule ServiceRequest -> Service("ServiceMatcher")
    
    // React to service outcomes
    on ServiceRequest.match_found {
        rule NotifyCustomer -> Service("NotificationService",
            recipients = [Customer],
            message = "Service match found - {ServiceName} available for ${price}",
            priority = "high"
        )
        
        rule CreateTransaction -> Forum("Service Transaction - {Customer.name}",
            defaultStakeholders = [Customer, ServiceProvider],
            timeLimit = 1h,
            outcomes = ["accept", "decline", "negotiate"]
        )
    }
    
    on ServiceRequest.no_match {
        rule CreateRequest -> Forum("Service Request - {Customer.name}",
            defaultStakeholders = [Customer, ServiceCoordinator],
            purpose = "find_alternative_solutions"
        )
    }
}
```

### Loops and Bulk Operations
```eleuscript
policy RegionalMarketplace {
    let regions = ["Auckland", "Wellington", "Christchurch", "Hamilton", "Tauranga"]
    
    // Create regional marketplaces
    for region in regions {
        rule ("Marketplace_" + region) -> Forum(region + " Service Marketplace",
            defaultStakeholders = [RegionalCoordinator, ServiceProviders, Customers]
        )
    }
    
    // Set up regional service discovery
    for region in regions {
        rule ("Discovery_" + region) -> Service("RegionalServiceDiscovery",
            region = region,
            providers = getRegionalProviders(region)
        )
    }
}
```

### Dynamic Stakeholder Assignment
```eleuscript
rule AssignSpecialist -> Forum("Specialized Care", {
  "stakeholders": ["Patient", "Primary Doctor"],
  "dynamic_assignment": {
    "condition": "diagnosis.category == 'cardiology'",
    "add_stakeholder": "Cardiologist"
  }
})
```

### Time-Based Rules
```eleuscript
rule ScheduledFollowUp -> Forum("Follow-Up Appointment", {
  "stakeholders": ["Patient", "Doctor"],
  "schedule": {
    "delay": "7days",
    "repeat": "weekly",
    "max_occurrences": 4
  }
})
```

## AI Integration Syntax

### AI Stakeholders
```eleuscript
stakeholder AI_Agent {
    type = "ai"
    capabilities = ["monitoring", "decision_making", "coordination"]
    authority_level = "limited" | "autonomous"
    human_oversight = {
        required = true | false
        escalation_threshold = value
        approval_required = ["action1", "action2"]
    }
}
```

### AI Service Agents
```eleuscript
ai_agent ServiceAssistant {
    type = "customer_service"
    model = "claude-3.5-sonnet"
    authority = "advisory"
    
    capabilities = [
        "answer_questions",
        "process_refunds",
        "escalate_complex_issues"
    ]
    
    decision_limits = {
        max_refund_amount = 100.00
        auto_approve_timeframe = 24h
    }
}
```

## Governance Patterns

### Healthcare Coordination Pattern
```eleuscript
policy HealthcareCoordination {
  // Create multi-stakeholder forum
  rule CreateConsultation -> Forum("Patient Care", 
    stakeholders=["Patient", "Doctor", "Pharmacist"]
  )
  
  // Enable private medication access
  rule MedicationAccess -> Service("MedicationDirectory", {
    "visibility": "private",
    "authorized_roles": ["Pharmacist", "Doctor"]
  })
  
  // Allow authorized cart management
  rule PharmacistCartAccess -> Service("AddToCart", {
    "permission": "can_add_to_stakeholder_cart",
    "requiredRole": "Pharmacist",
    "targetStakeholder": "Patient"
  })
  
  // Process payment with splits
  rule PaymentProcessing -> Service("MultiPartyPayment", {
    "revenue_splits": {"pharmacy": 80, "platform": 20}
  })
}
```

### AI Memory Governance Pattern
```eleuscript
policy AIMemoryGovernance {
  // Multi-stakeholder memory decisions
  rule MemoryPreferences -> Forum("Memory Coordination", 
    stakeholders=["User", "AI System", "Privacy Officer"]
  )
  
  // Data retention service
  rule DataRetention -> Service("MemoryManagement", {
    "duration": "30days",
    "conditions": ["user_consent", "legal_compliance"],
    "visibility": "restricted",
    "authorized_roles": ["Privacy Officer", "User"]
  })
  
  // Cross-platform memory export
  rule MemoryPortability -> Service("DataExport", {
    "format": "standardized",
    "encryption": true,
    "user_controlled": true
  })
}
```

### Emergency Housing Pattern
```eleuscript
policy EmergencyHousing {
  // Create urgent coordination forum
  rule EmergencyIntake -> Forum("Crisis Housing", {
    "stakeholders": ["Person", "Caseworker", "Housing Officer"],
    "priority": "urgent",
    "response_time": "2hours"
  })
  
  // Enable emergency service additions
  rule EmergencyAccommodation -> Service("AddToCart", {
    "permission": "emergency_add_to_cart",
    "requiredRole": "Housing Officer",
    "targetStakeholder": "Person",
    "bypass_approval": true,
    "audit_level": "maximum"
  })
  
  // Government payment processing
  rule GovernmentPayment -> Service("GovernmentPayment", {
    "payer": "MSD",
    "approval_required": false,
    "emergency_authorization": true
  })
}
```

## Data Types

### Primitive Types
```eleuscript
// Strings
"Housing Application"
'Emergency Housing'

// Numbers
2           // bedrooms needed
500.00      // maximum rent
85          // eligibility score

// Booleans  
true        // accessibility required
false       // pets allowed

// Arrays
[Applicant, CaseWorker, KORepresentative]
["income", "citizenship", "housing_register"]

// Objects
{
    "urgency" = "high",
    "region" = "Auckland", 
    "bedrooms" = 2
}
```

### Currency and Monetary Values
```eleuscript
// Currency amounts
$1.00       // Simple amount
$25.50      // Decimal precision
amount = 50.00, currency = "NZD"    // Explicit currency

// Multi-party payments
payment_split = {
    "provider": 80,
    "platform": 15,
    "payment_processor": 5
}
```

### Time Durations
```eleuscript
48h         // 48 hours
7d          // 7 days
2w          // 2 weeks
30d         // 30 days
```

### Stakeholder Types
```eleuscript
stakeholder Applicant           // The person needing housing
stakeholder CaseWorker          // MSD case worker
stakeholder Doctor              // Healthcare provider
stakeholder Pharmacist          // Medication specialist
stakeholder AI_QualityAgent     // AI monitoring agent
stakeholder IoT_Sensor          // IoT device
```

## Built-in Functions

### Date/Time Functions
```eleuscript
let currentTime = now()
let businessHours = isBusinessHours(currentTime)
let deliveryWindow = addHours(currentTime, 2)
```

### Validation Functions
```eleuscript
rule ValidatedService -> Service("ServiceProvider",
    contact_email = validate_email(Provider.email),
    contact_phone = validate_phone(Provider.phone),
    service_price = validate_currency(Service.price)
)
```

### String Formatting
```eleuscript
rule ServiceOffer -> Service("OfferGenerator",
    message = format("Hi {}, {} is available for ${}", 
                    Customer.firstName, 
                    Service.name,
                    Service.price)
)
```

## Error Handling

### Comprehensive Error Handling
```eleuscript
rule ServiceRequest -> Service("PrimaryProvider")
    onError {
        rule BackupService -> Service("BackupProvider")
            onError {
                rule ManualAssistance -> Forum("Customer Service", 
                    message = "Automated service failed - human assistance provided"
                )
            }
    }
```

### Rule Validation Errors
```eleuscript
// Invalid - missing required parameters
rule BadRule -> Service("MedicationDirectory")

// Valid - includes required visibility settings
rule GoodRule -> Service("MedicationDirectory", {
  "visibility": "private",
  "authorized_roles": ["Pharmacist"]
})
```

## Governance Validation

### Permission Validation
All EleuScript rules are validated against user permissions and forum contexts:

```eleuscript
rule ValidatedCartAdd -> Service("AddToCart", {
  "validate_permission": true,
  "required_forum_role": "authorized_stakeholder",
  "policy_compliance": "healthcare_coordination"
})
```

### Audit Requirements
All governance actions generate comprehensive audit trails:

```eleuscript
rule AuditedMedicationAccess -> Service("MedicationDirectory", {
  "audit_level": "full",
  "log_searches": true,
  "compliance_reporting": ["HIPAA", "FDA"]
})
```

### Compliance Integration
Rules can enforce regulatory compliance automatically:

```eleuscript
rule HIPAACompliantSharing -> Service("PatientDataAccess", {
  "compliance_requirements": ["HIPAA"],
  "requires_patient_consent": true,
  "data_minimization": true,
  "audit_trail": true
})
```

## Integration with External Systems

### RealMe Identity Verification
```eleuscript
rule IdentityVerification -> Service("RealMeAuth",
    verificationLevel = "verified",
    requiredAttributes = ["name", "address", "age_verification"]
)
```

### Payment Integration
```eleuscript
rule PaymentProcessing -> Service("StripeNZ",
    currency = "NZD",
    payment_methods = ["card", "bank_transfer", "poli"],
    compliance = ["nz_consumer_protection", "nz_privacy_act"]
)
```

## Best Practices

### 1. Clear Service Definitions
```eleuscript
// Good: Specific validation and clear business logic
service LocalGroceryDelivery {
    price = 15.00
    currency = "NZD"
    visibility = "public"
    validation_policies = [
        "rule delivery_area -> Service('LocationValidator', max_distance=10)",
        "rule business_hours -> Service('ScheduleValidator', hours='9am-6pm')"
    ]
}
```

### 2. Appropriate Autonomy Levels
```eleuscript
// Good: Full autonomy for simple, low-risk services
service DigitalDownload {
    price = 5.00
    autonomy = {
        auto_accept = true
        auto_reject = true
        require_human_approval = false
    }
}

// Good: Human approval for high-value services
service ExpensiveConsultation {
    price = 500.00
    autonomy = {
        auto_accept = false
        require_human_approval = true
    }
}
```

### 3. Clear Validation Messages
```eleuscript
validation_policy DeliveryArea {
    error_message = "Sorry, we only deliver within {{max_distance}}km of {{store_location}}. You're {{customer_distance}}km away."
}
```

## Compilation and Execution

EleuScript policies compile to executable instructions that:

1. **Create Firestore documents** for forums, services, and tracking
2. **Generate Cloud Functions** for service integrations  
3. **Set up security rules** based on stakeholder permissions
4. **Configure webhooks** for external service callbacks
5. **Deploy autonomous service validators** for marketplace transactions
6. **Configure AI agents** for intelligent service operations

### Example Compilation Output

```typescript
export const HealthcareCoordinationExecutor = {
  async instantiate(context: PolicyContext): Promise<InstantiationResult> {
    // Create coordination forum
    const forumId = await createForum({
      name: `Patient Care - ${context.patientName}`,
      stakeholders: context.stakeholders,
      permissions: compiledPermissions
    });
    
    // Deploy service validators
    await deployServiceValidators({
      medicationAccess: {
        visibility: 'private',
        authorizedRoles: ['Pharmacist', 'Doctor']
      }
    });
    
    return {
      forumsCreated: [forumId],
      servicesConfigured: ['MedicationDirectory', 'CartManagement'],
      status: 'active'
    };
  }
};
```

EleuScript enables sophisticated governance coordination and autonomous marketplace services while maintaining simplicity for non-technical users through the form-based policy creation interface. The language combines natural language governance rules with programmable commerce capabilities, creating a comprehensive platform for multi-stakeholder coordination.