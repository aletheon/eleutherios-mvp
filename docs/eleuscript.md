# EleuScript Language Specification

EleuScript is the domain-specific language for defining governance policies in the Eleutherios PFSD protocol. It enables human-readable policies that compile to executable governance structures.

## Language Overview

EleuScript policies define **rules** that instantiate into **forums**, **services**, or references to other **policies**. This creates a governance protocol that coordinates stakeholders across any domain.

### Basic Syntax

```eleuscript
policy PolicyName {
    rule RuleName -> Target(parameters)
}
```

## Core Concepts

### 1. Policies
A policy is a container for governance rules.

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
```

## Social Housing Policy Examples

### Emergency Housing Policy

```eleuscript
policy EmergencyHousingPolicy {
    version "1.2.0"
    description "Rapid housing placement for people in crisis"
    category "emergency_housing"
    
    // Define stakeholders
    stakeholder Applicant
    stakeholder EmergencyCaseWorker
    stakeholder KOEmergencyTeam
    stakeholder SupportWorker
    
    // Variables for this policy
    let maxProcessingTime = 24h
    let urgencyThreshold = "critical"
    
    // Create application forum immediately
    rule EmergencyApplicationForum -> Forum("URGENT: Emergency Housing - {Applicant.name}",
        defaultStakeholders = [Applicant, EmergencyCaseWorker, KOEmergencyTeam],
        permissions = {
            canPost = [Applicant, EmergencyCaseWorker, KOEmergencyTeam, SupportWorker],
            canAddMembers = [EmergencyCaseWorker],
            canEscalate = [EmergencyCaseWorker, KOEmergencyTeam]
        },
        urgency = urgencyThreshold,
        autoEscalate = {
            timeLimit = maxProcessingTime,
            escalateTo = [EmergencyHousingManager]
        }
    )
    
    // Verify eligibility immediately
    rule EmergencyEligibilityCheck -> Service("MSDEmergencyEligibility",
        applicantId = Applicant.id,
        urgencyLevel = urgencyThreshold,
        fastTrack = true,
        requiredDocuments = ["identity", "income_verification"],
        maxWaitTime = 4h
    ) 
    
    // Search for immediate accommodation
    rule EmergencyAccommodationSearch -> Service("KOEmergencyHousing",
        applicantProfile = Applicant.profile,
        region = Applicant.currentLocation,
        availableTonight = true,
        accessibility = Applicant.accessibilityNeeds
    ) requires [EmergencyEligibilityCheck.approved]
    
    // Set up temporary support services
    rule SupportServicesCoordination -> Service("SupportServicesMSD",
        serviceTypes = ["mental_health", "addiction", "employment"],
        duration = "temporary",
        location = EmergencyAccommodationSearch.location
    ) requires [EmergencyAccommodationSearch.confirmed]
    
    // Monitor progress and outcomes
    rule ProgressTracking -> Forum("Emergency Housing Progress - {Applicant.name}",
        defaultStakeholders = [EmergencyCaseWorker, SupportWorker],
        permissions = {
            canPost = [EmergencyCaseWorker, SupportWorker],
            canView = [Applicant]
        },
        schedule = {
            checkIns = "daily",
            duration = 14d
        }
    )
}
```

### Transitional Housing Policy

```eleuscript
policy TransitionalHousingPolicy {
    version "1.0.0"
    description "Medium-term housing with support services"
    
    stakeholder Applicant
    stakeholder CaseWorker  
    stakeholder KORepresentative
    stakeholder SupportCoordinator
    stakeholder PropertyManager
    
    // Application and assessment process
    rule ApplicationForum -> Forum("Transitional Housing Application - {Applicant.name}",
        defaultStakeholders = [Applicant, CaseWorker, KORepresentative],
        phases = ["initial_assessment", "housing_match", "placement", "support_setup"]
    )
    
    rule ComprehensiveAssessment -> Service("MSDHousingAssessment",
        assessmentType = "comprehensive",
        includeSupports = true,
        timeframe = 5d
    )
    
    rule HousingMatching -> Service("KOTransitionalMatching",
        housingType = "transitional",
        duration = "6_to_18_months",
        supportLevel = ComprehensiveAssessment.supportLevel,
        location = Applicant.preferredRegion
    ) requires [ComprehensiveAssessment.completed]
    
    // Support service coordination
    rule SupportPlan -> Service("SupportPlanningMSD",
        goals = ComprehensiveAssessment.identifiedNeeds,
        duration = HousingMatching.expectedStay,
        providers = ["health", "education", "employment", "budgeting"]
    ) requires [HousingMatching.confirmed]
    
    // Regular review and transition planning
    rule MonthlyReview -> Forum("Monthly Review - {Applicant.name}",
        defaultStakeholders = [Applicant, CaseWorker, SupportCoordinator],
        schedule = "monthly",
        outcomes = ["continue", "extend", "transition_permanent", "additional_support"]
    )
    
    // Transition to permanent housing
    rule PermanentHousingTransition -> Policy("PermanentHousingPolicy") 
        when MonthlyReview.outcome == "transition_permanent"
}
```

### Cross-Agency Coordination Policy

```eleuscript
policy CrossAgencyCoordinationPolicy {
    version "1.0.0"
    description "Coordinates multiple agencies for complex cases"
    
    stakeholder PrimaryApplicant
    stakeholder MSDCaseWorker
    stakeholder KORepresentative  
    stakeholder HealthServiceCoordinator
    stakeholder EducationLiaison
    stakeholder PoliceYouthWorker      // For youth cases
    stakeholder OrganaCaseWorker       // For Māori/Pacific cases
    
    // Central coordination forum
    rule AgencyCoordinationForum -> Forum("Multi-Agency Case - {PrimaryApplicant.name}",
        defaultStakeholders = [MSDCaseWorker, KORepresentative, HealthServiceCoordinator],
        permissions = {
            canAddAgencies = [MSDCaseWorker],
            canViewProgress = [PrimaryApplicant],
            canUpdatePlans = [MSDCaseWorker, KORepresentative]
        },
        confidentiality = "high",
        dataSharing = {
            level = "case_relevant_only",
            retention = "case_duration_plus_2_years"
        }
    )
    
    // Information sharing protocols
    rule InformationSharing -> Service("SecureDataSharing",
        participants = [MSDCaseWorker, KORepresentative, HealthServiceCoordinator],
        dataTypes = ["housing_status", "support_needs", "risk_factors"],
        compliance = ["privacy_act", "health_information_privacy"],
        auditTrail = true
    )
    
    // Coordinated service planning
    rule CoordinatedServicePlan -> Service("MultiAgencyPlanning",
        primaryAgency = "MSD",
        participatingAgencies = AgencyCoordinationForum.members,
        planDuration = 12_months,
        reviewFrequency = 6_weeks
    )
    
    // Crisis escalation pathway
    rule CrisisEscalation -> Forum("URGENT: Crisis Response - {PrimaryApplicant.name}",
        defaultStakeholders = [MSDCaseWorker, KORepresentative, HealthServiceCoordinator],
        activationTriggers = ["safety_risk", "housing_loss", "health_emergency"],
        responseTime = 2h,
        escalationPath = [TeamLeaders, ServiceManagers, RegionalDirectors]
    )
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
policy ResponsiveHousingPolicy {
    rule HousingApplication -> Service("KOHousingSearch")
    
    // React to service outcomes
    on HousingApplication.success {
        rule SuccessNotification -> Service("NotificationService",
            recipients = [Applicant, CaseWorker],
            message = "Housing offer available - please respond within 24h",
            priority = "high"
        )
        
        rule AcceptanceDecisionForum -> Forum("Housing Offer Response - {Applicant.name}",
            defaultStakeholders = [Applicant, CaseWorker],
            timeLimit = 24h,
            outcomes = ["accept", "decline", "request_modification"]
        )
    }
    
    on HousingApplication.declined {
        rule AppealProcess -> Forum("Housing Decision Appeal - {Applicant.name}",
            defaultStakeholders = [Applicant, CaseWorker, ReviewOfficer],
            process = "formal_review",
            timeframe = 10_business_days
        )
        
        rule AlternativeOptions -> Service("AlternativeHousingSearch",
            expandedCriteria = true,
            includePartnerOrgs = true
        )
    }
}
```

### Loops and Bulk Operations

```eleuscript
policy RegionalHousingCoordination {
    let regions = ["Auckland", "Wellington", "Christchurch", "Hamilton", "Tauranga"]
    
    // Create coordination forums for each region
    for region in regions {
        rule ("RegionalCoordination_" + region) -> Forum(region + " Housing Coordination",
            defaultStakeholders = [RegionalManager, KORegionalRep, MSDRegionalRep],
            purpose = "coordinate_regional_housing_strategy",
            meetingSchedule = "monthly"
        )
    }
    
    // Set up regional housing services
    for region in regions {
        rule ("HousingService_" + region) -> Service("RegionalHousingSearch",
            region = region,
            providers = getRegionalProviders(region),
            capacity = getRegionalCapacity(region)
        )
    }
}
```

### Policy Inheritance

```eleuscript
policy SpecializedYouthHousing extends SocialHousingPolicy {
    // Additional stakeholders for youth cases
    stakeholder YouthWorker
    stakeholder GuardianAdvocate
    stakeholder EducationLiaison
    
    // Override standard eligibility with youth-specific requirements
    override rule EligibilityCheck -> Service("YouthEligibilityMSD",
        ageRange = "16_24",
        guardianConsent = if (Applicant.age < 18) then true else false,
        educationStatus = required,
        riskAssessment = "youth_specific"
    )
    
    // Add youth-specific support services
    rule YouthSupportServices -> Service("YouthSupportCoordination",
        services = ["education", "life_skills", "mental_health", "employment_training"],
        duration = "up_to_2_years",
        transitionPlanning = true
    )
    
    // Youth-focused forums with appropriate safeguards
    rule YouthSupportForum -> Forum("Youth Housing Support - {Applicant.name}",
        defaultStakeholders = [Applicant, YouthWorker, CaseWorker],
        safeguards = {
            adultPresent = true,
            confidentiality = "youth_protection_standards",
            mandatoryReporting = true
        }
    )
}
```

## Built-in Functions

### Date/Time Functions
```eleuscript
policy TimedHousingPolicy {
    let applicationDate = now()
    let reviewDue = addDays(applicationDate, 10)
    let urgentDeadline = addHours(now(), 24)
    
    rule HousingReview -> Forum("Housing Review",
        scheduledFor = reviewDue,
        urgentBy = urgentDeadline
    )
}
```

### Validation Functions
```eleuscript
policy ValidatedApplication {
    rule SubmitApplication -> Service("HousingApplicationMSD",
        applicantEmail = validate_email(Applicant.email),
        contactPhone = validate_phone(Applicant.phone),
        incomeAmount = validate_currency(Applicant.weeklyIncome),
        region = validate_nz_region(Applicant.preferredRegion)
    )
}
```

### String Formatting
```eleuscript
policy FormattedCommunication {
    rule WelcomeForum -> Forum(
        format("Welcome {}, your housing application #{}", 
               Applicant.firstName, 
               Application.referenceNumber),
        defaultStakeholders = [Applicant, CaseWorker]
    )
}
```

## Error Handling

```eleuscript
policy RobustHousingPolicy {
    rule PrimaryHousingSearch -> Service("KOHousingSearch")
        onError {
            // Try alternative housing providers
            rule BackupHousingSearch -> Service("CommunityHousingSearch")
                onError {
                    // Create manual coordination forum if all automated searches fail
                    rule ManualCoordination -> Forum("Manual Housing Coordination - {Applicant.name}",
                        defaultStakeholders = [CaseWorker, SupervisorCaseWorker, KORepresentative],
                        priority = "urgent",
                        message = "Automated housing search failed - manual intervention required"
                    )
                }
        }
}
```

## Variable and Context Management

```eleuscript
policy ContextAwareHousingPolicy {
    // Variables can be set from external context during instantiation
    let applicantId = context.applicantId
    let urgencyLevel = context.urgencyLevel || "normal"
    let preferredRegion = context.preferredRegion || "any"
    
    // Use variables throughout the policy
    rule ApplicationForum -> Forum("Housing Application - " + context.applicantName,
        defaultStakeholders = getStakeholdersForRegion(preferredRegion),
        priority = urgencyLevel
    )
    
    rule RegionalHousingSearch -> Service("RegionalHousingSearch",
        region = preferredRegion,
        urgency = urgencyLevel,
        applicant = applicantId
    )
}
```

## Integration with New Zealand Systems

### RealMe Identity Verification
```eleuscript
policy VerifiedHousingApplication {
    rule IdentityVerification -> Service("RealMeAuth",
        verificationLevel = "verified",
        requiredAttributes = ["name", "address", "age_verification"],
        purposes = ["housing_application", "benefit_verification"]
    )
    
    rule ApplicationSubmission -> Service("HousingApplicationMSD",
        identity = IdentityVerification.verifiedIdentity,
        trustLevel = "realme_verified"
    ) requires [IdentityVerification.success]
}
```

### IRD Integration for Income Verification
```eleuscript
policy IncomeVerifiedHousing {
    rule IncomeVerification -> Service("IRDIncomeVerification",
        applicantIRD = Applicant.irdNumber,
        consentProvided = true,
        period = "last_26_weeks"
    )
    
    rule EligibilityCalculation -> Service("MSDEligibilityCalculator",
        income = IncomeVerification.averageWeeklyIncome,
        dependents = Applicant.dependentCount,
        region = Applicant.region
    ) requires [IncomeVerification.completed]
}
```

## Compilation and Execution

EleuScript policies compile to executable instructions that:

1. **Create Firestore documents** for forums, services, and tracking
2. **Generate Cloud Functions** for service integrations
3. **Set up security rules** based on stakeholder permissions
4. **Configure webhooks** for external service callbacks
5. **Establish monitoring** for SLA compliance and escalation

### Example Compilation Output

```typescript
// Compiled from SocialHousingPolicy
export const SocialHousingPolicyExecutor = {
  async instantiate(context: PolicyContext): Promise<InstantiationResult> {
    // 1. Create application forum
    const forumId = await createForum({
      name: `Housing Application - ${context.applicantName}`,
      stakeholders: [
        { userId: context.applicantId, role: 'Applicant' },
        { userId: context.caseWorkerId, role: 'CaseWorker' },
        { userId: context.koRepId, role: 'KORepresentative' }
      ],
      permissions: compiledPermissions,
      policyId: this.policyId,
      ruleId: 'HousingApplicationForum'
    });
    
    // 2. Execute eligibility check service
    const eligibilityResult = await executeService({
      serviceId: 'MSDEligibilityCheck',
      parameters: {
        applicantId: context.applicantId,
        urgencyLevel: 'high'
      }
    });
    
    // 3. Set up monitoring and escalation
    await setupEscalation({
      forumId,
      timeLimit: 48 * 60 * 60 * 1000, // 48 hours in ms
      escalationPath: ['SupervisorCaseWorker']
    });
    
    return {
      instantiationId: generateId(),
      forumsCreated: [forumId],
      servicesExecuted: [eligibilityResult.executionId],
      status: 'active'
    };
  }
};
```

## Standard Library

### NZ Social Services
```eleuscript
import "std/nz_social_services" as NZSocial

policy StreamlinedHousing extends NZSocial.StandardHousingPolicy {
    // Automatically includes:
    // - MSD eligibility checking
    // - KO housing search integration  
    // - Standard application workflows
    // - Compliance with Housing Act requirements
}
```

### NZ Government Services
```eleuscript
import "std/nz_government" as NZGov

policy ComprehensiveSupport {
    rule IdentityCheck -> NZGov.RealMe(level = "verified")
    rule IncomeCheck -> NZGov.IRD(purpose = "benefit_verification")
    rule HealthCheck -> NZGov.HealthRecords(consent = true)
}
```

## Best Practices

### 1. Clear Stakeholder Roles
```eleuscript
// Good: Specific, meaningful roles
stakeholder EmergencyCaseWorker
stakeholder KOEmergencyTeam  
stakeholder SupportWorker

// Avoid: Generic or unclear roles
stakeholder User1
stakeholder Helper
```

### 2. Descriptive Rule Names
```eleuscript
// Good: Clear purpose and context
rule EmergencyHousingApplicationForum
rule UrgentEligibilityVerification
rule CrisisResponseCoordination

// Avoid: Generic names
rule Forum1
rule Check
rule Process
```

### 3. Appropriate Error Handling
```eleuscript
// Always provide fallback options
rule PrimaryService -> Service("MainProvider")
    onError {
        rule BackupService -> Service("BackupProvider")
            onError {
                rule ManualProcess -> Forum("Manual Intervention Required")
            }
    }
```

### 4. Time-bound Processes
```eleuscript
// Set clear timeframes and escalation
rule HousingReview -> Forum("Housing Application Review",
    timeLimit = 48h,
    autoEscalate = {
        timeLimit = 24h,
        escalateTo = [Supervisor]
    }
)
```

This EleuScript specification provides the complete language definition for creating governance policies that coordinate complex multi-stakeholder processes like social housing placement, ensuring vulnerable people get the support they need through clear, executable protocols.
