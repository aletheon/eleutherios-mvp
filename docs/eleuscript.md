# EleuScript Language Specification - Updated with Autonomous Services

## Current Implementation: Forum Rule Execution + Autonomous Services

**OPERATIONAL STATUS**: Stakeholders can now type simple EleuScript rules directly into forum chat for immediate execution.

**NEXT PHASE**: Autonomous service creation and validation for programmable marketplace.

**Production URL**: `https://eleutherios-mvp.vercel.app`

### Live Rule Syntax (Production Ready):
```eleuscript
# Sub-policy creation
rule AddHealthcare -> Policy("HealthcareAccess", stakeholders=["Patient", "Doctor"])

# Service activation  
rule ActivateTransport -> Service("Transportation", auto_dispatch=true)

# Forum creation
rule CreateConsultation -> Forum("Medical", stakeholders=["Patient", "Doctor"])
```

### Autonomous Service Syntax (Next Phase):
```eleuscript
# Customer purchase requests
rule pay -> Service("Milkman", $1)

# Service creation with validation
service LocalMilkman {
  price = 1.00
  currency = "NZD"
  validation_policies = [
    "rule location_check -> Service('isLocationValid', $customer.location)",
    "rule delivery_check -> Service('isDeliveryDay', $current_day)"
  ]
}
```

---

## Language Overview

EleuScript is the domain-specific language for defining governance policies in the Eleutherios PFSD protocol. It enables human-readable policies that compile to executable governance structures and autonomous marketplace services.

EleuScript policies define **rules** that instantiate into **forums**, **services**, or references to other **policies**. This creates a governance protocol that coordinates stakeholders across any domain and enables programmable commerce.

### Basic Syntax

```eleuscript
policy PolicyName {
    rule RuleName -> Target(parameters)
}
```

## Core Concepts

### 1. Policies
A policy is a container for governance rules and service definitions.

```eleuscript
policy SocialHousingPolicy {
    version "1.0.0"
    description "Coordinates housing placement for vulnerable individuals"
    author "ministry_housing"
    
    // Rules define what happens when policy is instantiated
    rule ApplicationForum -> Forum("Housing Application", ...)
    rule EligibilityCheck -> Service("MSDEligibilityService", ...)
}
```

### 2. Rules
Rules define specific governance behaviors. There are three types:

#### Forum Rules
Create spaces for stakeholder dialogue and decision-making.

```eleuscript
rule HousingApplicationForum -> Forum("Housing Application - {applicantName}",
    defaultStakeholders = [Applicant, CaseWorker, KORepresentative],
    permissions = {
        canPost = [Applicant, CaseWorker, KORepresentative],
        canAddMembers = [CaseWorker],
        canManageFiles = [CaseWorker, KORepresentative]
    },
    priority = "high",
    autoEscalate = {
        timeLimit = 48h,
        escalateTo = [SupervisorCaseWorker]
    }
)
```

#### Service Rules
Integrate external services for processing, verification, payments, etc.

```eleuscript
rule EligibilityVerification -> Service("MSDEligibilityCheck",
    applicantId = Applicant.id,
    checkTypes = ["income", "citizenship", "housing_register"],
    urgencyLevel = "high",
    webhook = "https://api.eleutherios.app/webhooks/msd"
)

rule HousingSearch -> Service("KOHousingSearch", 
    region = Applicant.preferredRegion,
    bedrooms = Applicant.bedroomNeeds,
    accessibility = Applicant.accessibilityNeeds,
    maxRent = Applicant.maxAffordableRent
)
```

#### Policy Reference Rules
Reference other policies to create governance hierarchies.

```eleuscript
rule TenancyRules -> Policy("StandardTenancyPolicy",
    version = "2.1.0",
    adaptations = {
        "supportServices" = true,
        "emergencyContacts" = [CaseWorker, SupportWorker]
    }
)
```

## Autonomous Services (NEW)

### Service Definitions
Services can be defined as autonomous entities with validation logic:

```eleuscript
service ServiceName {
    // Basic service properties
    price = amount
    currency = "NZD"
    type = "product" | "ai" | "api" | "human"
    
    // Validation policies
    validation_policies = [
        "rule validation_name -> Service('validation_service', parameters)"
    ]
    
    // Inherited capabilities
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

#### AI-Powered Service
```eleuscript
service DynamicPricingService {
    base_price = 10.00
    currency = "NZD"
    type = "ai"
    
    ai_agent = {
        type = "pricing"
        model = "gpt-4o"
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

#### Service with Policy Inheritance
```eleuscript
service ComprehensiveEcommerce {
    price = 25.00
    currency = "NZD"
    
    inherits_policies = [
        "RefundPolicy_30Day",
        "QualityGuaranteePolicy",
        "DisputeResolutionPolicy_Community"
    ]
    
    validation_policies = [
        "rule inventory_check -> Service('InventorySystem', $requested_quantity)",
        "rule payment_validation -> Service('PaymentValidator', $customer.payment_method)"
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

#### Inventory Validation
```eleuscript
validation_policy StockCheck {
    name = "inventory_availability"
    rule_expression = "Service('InventorySystem', {
        product_id: $service.id,
        requested_quantity: $request.quantity
    })"
    error_message = "Only {{available_stock}} items remaining, you requested {{requested_quantity}}"
    required = true
}
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

### AI-Powered Rules
```eleuscript
rule AI_TrafficOptimization -> Service("AI_TrafficControl", {
    authority: "automatic_adjustments",
    constraints: {
        max_adjustment: "15%",
        human_override: "always_available"
    },
    explanation_required: true,
    escalation_triggers: ["congestion > critical", "emergency_detected"]
})
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
stakeholder KORepresentative    // Kāinga Ora representative  
stakeholder SupportWorker       // Additional support staff
stakeholder PropertyManager     // Property management
stakeholder EmergencyContact    // Emergency contact person

// AI and automated stakeholders
stakeholder AI_QualityAgent     // AI monitoring agent
stakeholder IoT_Sensor          // IoT device
stakeholder API_Service         // External API integration
```

## Marketplace Integration Examples

### Cross-Forum Service Discovery
```eleuscript
policy MarketplaceCoordination {
    rule DiscoverServices -> Service("ServiceDiscovery", {
        query: $search_terms,
        location: $user.location,
        radius: 25,
        filters: {
            category: "food_delivery",
            max_price: 20.00,
            available_now: true
        }
    })
    
    rule PersonalizedRecommendations -> Service("AI_Recommender", {
        user_profile: $user.preferences,
        purchase_history: $user.past_orders,
        context: $current_situation
    })
}
```

### Service Marketplace Evolution
```eleuscript
policy EmergencyHousingMarketplace {
    # Start with basic coordination
    rule EmergencyHousing -> Forum("Emergency Housing Coordination")
    
    # Evolve to include service providers
    rule AddServiceProviders -> Policy("ServiceProviderNetwork", {
        stakeholders: ["EmergencyAccommodation", "SupportServices", "TransportProviders"],
        marketplace_enabled: true
    })
    
    # Enable autonomous service transactions
    rule EnableMarketplace -> Service("MarketplaceEngine", {
        payment_processing: true,
        autonomous_matching: true,
        quality_assurance: "CERT_scoring"
    })
}
```

## Advanced Features

### Conditional Logic

```eleuscript
policy AdaptiveHousingPolicy {
    stakeholder Applicant
    stakeholder CaseWorker
    
    // Conditional service selection based on applicant needs
    rule HousingService -> Service(
        if (Applicant.age < 25) then "YouthHousingService"
        else if (Applicant.hasChildren) then "FamilyHousingService"  
        else "GeneralHousingService",
        
        urgency = if (Applicant.currentSituation == "sleeping_rough") then "critical" else "high"
    )
    
    // Different forums based on complexity
    rule SupportForum -> Forum(
        if (Applicant.complexNeeds) then "Multi-Disciplinary Team - {Applicant.name}"
        else "Standard Support - {Applicant.name}",
        
        defaultStakeholders = if (Applicant.complexNeeds) 
            then [Applicant, CaseWorker, SpecialistWorker, HealthWorker]
            else [Applicant, CaseWorker]
    )
}
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
            purpose = "find_alternative_solutions",
            escalation = "broadcast_to_providers"
        )
    }
    
    # Purchase request handling
    on PurchaseRequest.received {
        rule ValidateRequest -> Service("RequestValidator", {
            customer: $request.customer,
            service: $request.service,
            amount: $request.amount
        })
    }
    
    on ValidationResult.passed {
        rule ProcessPayment -> Service("PaymentProcessor", {
            amount: $request.amount,
            customer: $request.customer,
            service_provider: $service.owner
        })
    }
    
    on ValidationResult.failed {
        rule SendRejection -> Service("ResponseGenerator", {
            type: "rejection",
            reason: $validation.error_message,
            suggestions: $validation.alternatives
        })
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
            defaultStakeholders = [RegionalCoordinator, ServiceProviders, Customers],
            purpose = "regional_service_coordination"
        )
    }
    
    // Set up regional service discovery
    for region in regions {
        rule ("Discovery_" + region) -> Service("RegionalServiceDiscovery",
            region = region,
            providers = getRegionalProviders(region),
            categories = getRegionalCategories(region)
        )
    }
}
```

### Policy Inheritance

```eleuscript
policy SpecializedMarketplace extends StandardMarketplace {
    // Additional stakeholders for specialized needs
    stakeholder SpecialtyProvider
    stakeholder QualityInspector
    
    // Override standard service matching
    override rule ServiceMatching -> Service("SpecializedMatcher",
        criteria = "specialty_requirements",
        quality_threshold = "premium",
        certification_required = true
    )
    
    // Add specialized validation
    rule SpecialtyValidation -> Service("SpecialtyValidator",
        standards = ["industry_certification", "quality_metrics"],
        compliance_check = "mandatory"
    )
}
```

## Built-in Functions

### Date/Time Functions
```eleuscript
policy TimedMarketplace {
    let currentTime = now()
    let businessHours = isBusinessHours(currentTime)
    let deliveryWindow = addHours(currentTime, 2)
    
    rule TimeBasedServices -> Service("ServiceMatcher",
        available_now = businessHours,
        delivery_by = deliveryWindow
    )
}
```

### Validation Functions
```eleuscript
policy ValidatedMarketplace {
    rule ValidatedService -> Service("ServiceProvider",
        contact_email = validate_email(Provider.email),
        contact_phone = validate_phone(Provider.phone),
        service_price = validate_currency(Service.price),
        service_location = validate_nz_region(Service.region)
    )
}
```

### String Formatting
```eleuscript
policy PersonalizedMarketplace {
    rule ServiceOffer -> Service("OfferGenerator",
        message = format("Hi {}, {} is available for ${} in your area", 
                        Customer.firstName, 
                        Service.name,
                        Service.price)
    )
}
```

## Error Handling

```eleuscript
policy RobustMarketplace {
    rule PrimaryServiceSearch -> Service("PrimaryServiceMatcher")
        onError {
            // Try alternative service providers
            rule BackupServiceSearch -> Service("BackupServiceMatcher")
                onError {
                    // Create manual coordination if automated matching fails
                    rule ManualCoordination -> Forum("Manual Service Coordination",
                        defaultStakeholders = [Customer, ServiceCoordinator],
                        priority = "urgent",
                        message = "Automated service matching failed - manual assistance required"
                    )
                }
        }
        
    rule ProcessPayment -> Service("PaymentProcessor")
        onError {
            rule PaymentRecovery -> Service("PaymentRecoveryService")
                onError {
                    rule RefundInitiation -> Service("RefundProcessor",
                        amount = $original_payment,
                        reason = "payment_processing_failed"
                    )
                }
        }
}
```

## Integration with New Zealand Systems

### RealMe Identity Verification
```eleuscript
policy VerifiedMarketplace {
    rule IdentityVerification -> Service("RealMeAuth",
        verificationLevel = "verified",
        requiredAttributes = ["name", "address", "age_verification"],
        purposes = ["service_provision", "payment_verification"]
    )
    
    rule ServiceAccess -> Service("ServiceProvider",
        identity = IdentityVerification.verifiedIdentity,
        trustLevel = "realme_verified"
    ) requires [IdentityVerification.success]
}
```

### Payment Integration
```eleuscript
policy NZPaymentMarketplace {
    rule PaymentProcessing -> Service("StripeNZ",
        currency = "NZD",
        payment_methods = ["card", "bank_transfer", "poli"],
        compliance = ["nz_consumer_protection", "nz_privacy_act"]
    )
    
    rule BusinessPayments -> Service("StripeConnect",
        platform_fee = 5.0,
        currency = "NZD",
        verification = "nz_business_number"
    )
}
```

## Compilation and Execution

EleuScript policies compile to executable instructions that:

1. **Create Firestore documents** for forums, services, and tracking
2. **Generate Cloud Functions** for service integrations
3. **Set up security rules** based on stakeholder permissions
4. **Configure webhooks** for external service callbacks
5. **Establish monitoring** for SLA compliance and escalation
6. **Deploy autonomous service validators** for marketplace transactions
7. **Configure AI agents** for intelligent service operations

### Example Compilation Output

```typescript
// Compiled from AutonomousMarketplacePolicy
export const AutonomousMarketplacePolicyExecutor = {
  async instantiate(context: PolicyContext): Promise<InstantiationResult> {
    // 1. Create marketplace forum
    const forumId = await createForum({
      name: `${context.regionName} Marketplace`,
      stakeholders: context.stakeholders,
      permissions: compiledPermissions,
      policyId: this.policyId
    });
    
    // 2. Deploy autonomous services
    const services = await Promise.all(
      context.services.map(service => deployAutonomousService({
        serviceConfig: service,
        validationPolicies: service.validationPolicies,
        paymentIntegration: 'stripe',
        forumId
      }))
    );
    
    // 3. Configure service discovery
    await configureServiceDiscovery({
      forumId,
      services: services.map(s => s.id),
      searchCapabilities: ['location', 'category', 'price', 'ai_recommendations']
    });
    
    return {
      instantiationId: generateId(),
      forumsCreated: [forumId],
      servicesDeployed: services.map(s => s.id),
      autonomousValidationEnabled: true,
      status: 'active'
    };
  }
};
```

## Standard Library

### NZ Social Services
```eleuscript
import "std/nz_social_services" as NZSocial
import "std/nz_marketplace" as NZMarket

policy SocialServicesMarketplace extends NZSocial.StandardHousingPolicy {
    // Automatically includes:
    // - MSD eligibility checking
    // - KO housing search integration  
    // - Standard application workflows
    // - Marketplace service providers
    // - Payment processing capabilities
    
    rule ServiceProviderNetwork -> NZMarket.ServiceDiscovery({
        categories: ["emergency_accommodation", "support_services", "transport"],
        region: $applicant.region,
        quality_threshold: "certified"
    })
}
```

### Autonomous Service Library
```eleuscript
import "std/autonomous_services" as AutoServices

service LocalDelivery extends AutoServices.LocationBasedService {
    // Inherits:
    // - Location validation
    // - Distance calculations
    // - Regional service boundaries
    // - Delivery scheduling
    
    validation_policies = [
        AutoServices.LocationValidator,
        AutoServices.DeliveryScheduler,
        "rule custom_validation -> Service('BusinessSpecificValidator')"
    ]
}
```

## Best Practices

### 1. Clear Service Definitions
```eleuscript
// Good: Specific validation and clear business logic
service LocalGroceryDelivery {
    price = 15.00
    currency = "NZD"
    validation_policies = [
        "rule delivery_area -> Service('LocationValidator', max_distance=10)",
        "rule business_hours -> Service('ScheduleValidator', hours='9am-6pm')",
        "rule minimum_order -> Service('OrderValidator', min_amount=30)"
    ]
}

// Avoid: Vague or missing validation
service GenericService {
    price = 10.00
}
```

### 2. Appropriate Autonomy Levels
```eleuscript
// Good: Balanced autonomy with human oversight
service ExpensiveConsultation {
    price = 500.00
    autonomy = {
        auto_accept = false
        auto_reject = true
        require_human_approval = true
    }
}

// Good: Full autonomy for simple, low-risk services
service DigitalDownload {
    price = 5.00
    autonomy = {
        auto_accept = true
        auto_reject = true
        require_human_approval = false
    }
}
```

### 3. Comprehensive Error Handling
```eleuscript
// Always provide fallback options for service failures
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

### 4. Clear Validation Messages
```eleuscript
validation_policy DeliveryArea {
    error_message = "Sorry, we only deliver within {{max_distance}}km of {{store_location}}. You're {{customer_distance}}km away. Try our partner stores: {{alternative_stores}}"
}

// Avoid generic error messages
validation_policy BadExample {
    error_message = "Invalid request"
}
```

This EleuScript specification provides the complete language definition for creating governance policies that coordinate complex multi-stakeholder processes AND autonomous marketplace services, enabling programmable society coordination through natural language business logic.