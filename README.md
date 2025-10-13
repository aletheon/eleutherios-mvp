# Eleutherios MVP

**SDG Coordination through Multi-Stakeholder Governance**

Eleutherios is the open-source implementation of the Policy–Forum–Service–Data (PFSD) model grounded in the UN 2030 Agenda. It provides coordination infrastructure for multi-stakeholder partnerships — enabling individuals to receive comprehensive SDG policies that professionals and organizations join rather than create.

## 🎯 Platform Status: Complete Policy Creation System with Person-Centered SDG Framework

**Live Platform**: https://eleutherios-mvp.vercel.app  
**GitHub Repository**: https://github.com/aletheon/eleutherios-mvp

### Major Achievement: Complete EleuScript Policy Management System ✅

**Successfully Implemented Policy Interface:**
- ✅ Form-based policy creation with EleuScript rule generation
- ✅ Real-time EleuScript preview and syntax highlighting
- ✅ Policy list with rule summaries and stakeholder information
- ✅ Detailed policy view with complete rule breakdown
- ✅ Policy editing interface for updating existing policies
- ✅ Export functionality (JSON and EleuScript file downloads)
- ✅ "Add Rule" capability for expanding existing policies

**Working Form-to-EleuScript Generation:**
```
Form Input: "CreateSupport" → "Food Coordination" → ["Person", "NGO", "Food Provider"]
Generated: rule CreateSupport -> Forum("Food Coordination", stakeholders=["Person", "NGO", "Food Provider"])
```

## 🏛️ The PFSD Model: SDG-17 Partnership Infrastructure

Eleutherios enables multi-stakeholder partnerships through person-centered coordination:

### Policy = UN 2030 SDG Framework
- Every user receives comprehensive SDG policies upon registration
- Rules enable coordination for food, water, healthcare, housing, education access
- Policies are person-owned, with professionals joining existing frameworks
- **Complete web-based creation interface for policy customization**

### Forum = Multi-Stakeholder Coordination
- Person creates coordination spaces using their default SDG policies
- Forums enable dialogue between individuals, NGOs, government, private sector
- **Person-controlled governance** - professionals join rather than create
- **Cross-sector partnerships** for coordinated SDG implementation

### Service = Cross-Sector Integration
- NGOs, government agencies, businesses offer services within person's governance
- Services coordinated through person's existing policy framework
- **Multi-stakeholder service discovery**: Organizations find coordination opportunities

### Data = Transparent Coordination
- Complete audit trails for all multi-stakeholder coordination
- Analytics showing coordination effectiveness vs traditional approaches
- **Evidence-based validation** of whether governance tools improve outcomes

## 🛒 Multi-Stakeholder Coordination: Beyond Traditional Approaches

Eleutherios coordination enables authorized stakeholders to work within person's existing governance frameworks rather than creating new professional-controlled systems.

### Person-Centered Coordination Model
- **Universal SDG Policies**: Every user receives comprehensive coordination frameworks for basic rights
- **Professional Integration**: Healthcare providers, social workers, NGOs join person's existing governance
- **Cross-Sector Services**: Government, private sector, civil society coordinate within person's policies

### Multi-Stakeholder Integration Example

**Stakeholders:**
- **Person**: Owns coordination framework with full governance control
- **NGO**: Provides services within person's existing policies  
- **Government**: Processes benefits through person's coordination framework
- **Private Sector**: Delivers services according to person's governance preferences

**Workflow (requires validation):**
1. **Person** uses default FoodSecurity policy from registration
2. **NGO** (like City Mission) joins person's existing food coordination framework
3. **Government** coordinates benefits within person's governance structure
4. **Private Sector** suppliers coordinate through person's existing policies
5. **Multi-party coordination** managed within person's governance framework
6. **Complete audit trail** maintains transparency across all stakeholder interactions

```eleuscript
policy FoodSecurity {
  rule FoodAccess -> Forum("Food Coordination", 
    stakeholders=["Person", "NGO", "Government", "Food Provider"]
  )
  
  rule EmergencyFoodAdd -> Service("AddToCart", {
    "permission": "can_add_essential_service",
    "requiredRole": "Social Worker",
    "targetStakeholder": "Person",
    "governance_model": "person_controlled"
  })
}
```

## 🔧 Technical Implementation

### Complete Policy System (Production Ready)
- **Policy Creation**: `/policies/create` - Complete form-based rule builder
- **Policy Management**: `/policies` - Enhanced list with EleuScript indicators
- **Policy Details**: `/policies/[id]` - Full rule breakdown and export
- **Policy Editing**: `/policies/[id]/edit` - Complete editing interface
- **Export System**: Download policies as JSON or EleuScript files

### Database Architecture
**Hybrid Firebase Approach** optimized for different data patterns:
- **Firestore**: User profiles, policies, services, structured data
- **Realtime Database**: Forums, messaging, live collaboration

### Frontend Stack
- **Next.js 13+** with App Router and TypeScript
- **Tailwind CSS** with Material Icons
- **Navigation**: Consistent purple gradient header across all pages
- **Real-time EleuScript preview** with syntax highlighting

### Authentication & Payments
- Firebase Auth with role-based access control
- **Stripe Integration** with multi-party payment processing capability
- User ownership and governance permissions

## 🌊 EleuScript DSL (Production Implementation)

EleuScript enables users to create governance policies through web forms that automatically generate executable code.

### Service Visibility Rules
```eleuscript
# Private service only accessible to authorized roles
rule AccessMedication -> Service("MedicationDirectory", {
  "visibility": "private",
  "authorized_roles": ["Pharmacist", "Doctor"],
  "audit_level": "full"
})

# Public service discoverable by anyone
rule FindTransport -> Service("TransportDirectory", {
  "visibility": "public",
  "category": "transportation"
})

# Restricted service with additional policy requirements
rule AccessPatientRecords -> Service("MedicalRecords", {
  "visibility": "restricted",
  "requires_consent": true,
  "authorized_roles": ["Doctor"],
  "policy_requirements": ["HIPAA_Compliance"]
})
```

### Shopping Cart Governance
```eleuscript
# Multi-stakeholder cart management
rule PharmacistCartAccess -> Service("AddToCart", {
  "permission": "can_add_to_stakeholder_cart",
  "requiredRole": "Pharmacist",
  "targetStakeholder": "Patient",
  "requires_forum_context": true,
  "auditTrail": true
})
```

## 🏗️ Working Features

### Policy Management (Complete)
- **Policy Creation** (`/policies/create`): Form-based policy builder with real-time EleuScript generation
- **Policy List** (`/policies`): Browse all policies with rule summaries
- **Policy Details** (`/policies/[id]`): Complete rule breakdown with export functionality
- **Policy Editing** (`/policies/[id]/edit`): Update existing policies and rules

### User Management (Complete)
- Complete authentication flow with role-based access
- User directory with CERT scoring framework
- **Role Types**: person, caseworker, housing-officer, healthcare-provider, pharmacist, doctor, admin
- Protected routes and governance permissions

### Real-Time Coordination (Working)
- **Forum System** (`/forums/[id]`): Multi-stakeholder coordination spaces
- **Real-time Messaging**: Firebase integration with governance context
- **EleuScript Execution**: Policy-driven rule execution in forums
- **Payment Processing**: Stripe integration for coordinated services

### Service Visibility System (Planned)
- **Service Registration**: Users can create public, private, or restricted services
- **Role-based Discovery**: Services filtered by user permissions
- **Governance Integration**: Service access governed by forum policies
- **Shopping Cart Coordination**: Multi-party service selection and payment

## 🌍 Real-World Applications

### AI Memory Governance
```eleuscript
policy AIMemoryGovernance {
  rule UserDataControl -> Forum("Memory Preferences", 
    stakeholders=["User", "AI System", "Privacy Officer"]
  )
  
  rule RetentionPolicy -> Service("DataRetention", 
    duration="30days", 
    conditions=["user_consent", "legal_compliance"]
  )
}
```

### Housing Coordination
```eleuscript
policy EmergencyHousing {
  rule CreateIntake -> Forum("Housing Assessment", 
    stakeholders=["Person", "Caseworker", "Housing Officer"]
  )
  
  rule AddAccommodation -> Service("AddToCart", {
    "permission": "can_add_housing_service",
    "requiredRole": "Housing Officer",
    "targetStakeholder": "Person"
  })
}
```

### Healthcare Protocol
Doctors and pharmacists coordinate patient care through governance-enabled service selection, with private medication directories and transparent multi-party payment processing.

## 💻 Getting Started

### Prerequisites
- Node.js 18+
- Firebase project with Authentication, Firestore, and Realtime Database

### Installation
```bash
git clone https://github.com/aletheon/eleutherios-mvp.git
cd eleutherios-mvp
npm install
```

### Environment Setup
```bash
# .env.local
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
# ... other Firebase config

# Optional for payment testing
STRIPE_SECRET_KEY=your_stripe_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

### Development
```bash
npm run dev
```

Visit `http://localhost:3000` to see the platform.

### Key Routes
- `/` - Dashboard with policy and service management
- `/policies/create` - Create new governance policies
- `/policies` - Policy list and management
- `/directory` - User directory with CERT scores
- `/admin` - Platform administration

## 🚧 Current Development Phase

**Status**: Policy creation system complete, now developing service registration with visibility controls

**Next Priorities**:
1. **Service Registration System** - Enable users to create services with visibility controls
2. **Shopping Cart Implementation** - Multi-stakeholder service coordination
3. **AI Memory Governance** - User-controlled memory policies for AI interactions
4. **Enhanced Forum Integration** - Connect policies to real-time coordination

## 📊 CERT Trust Model

Every User and Service has a CERT score:
- **C** – Cooperation: how often you add other services to policies/forums
- **E** – Engagement: responsiveness + quality of ratings/reviews
- **R** – Retention: repeat uses (free services) or repeat sales (paid services)
- **T** – Trust: followers, subscriptions, endorsements

CERT encourages cooperation and builds legitimacy in governance networks.

## 🤝 Contributing

We welcome contributors — developers, designers, researchers, and community builders.

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

**High-Priority Development Areas**:
- Service registration with visibility controls
- Shopping cart governance implementation
- AI memory governance policies
- Healthcare coordination workflows
- Mobile responsiveness improvements

## 📖 Documentation

- **[CONTRIBUTING.md](CONTRIBUTING.md)** - How to contribute to the project
- **[CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)** - Community standards
- **[schema.md](schema.md)** - Data model with service visibility specification
- **[eleuscript.md](eleuscript.md)** - EleuScript DSL with governance examples
- **[examples.md](examples.md)** - Policy examples and healthcare workflows

## 🏛️ Governance

This project is licensed under the Apache 2.0 License - see the [LICENSE](LICENSE) file for details.

Governance of the repository is transparent and community-driven through the PFSD model itself.

## 🌱 Mission & Validation Requirements

Eleutherios is maintained under the Aletheon Foundation, with the mission of advancing SDG coordination through person-centered multi-stakeholder governance.

**Mission-Driven Approach:**
- Universal access to coordination tools regardless of economic situation
- Person-centered governance where professionals join existing frameworks rather than creating new ones
- Evidence-based development validating whether governance tools improve coordination outcomes

**Critical Validation Requirements:**
- **Multi-stakeholder complexity**: Unknown whether 5+ stakeholder forums work better than current approaches
- **Institutional integration**: Government agencies and NGOs must be willing to work within citizen-controlled frameworks
- **Cultural adaptation**: Universal SDG policies may require significant localization across different contexts
- **Outcome measurement**: Need evidence that governance coordination produces better results than traditional methods

**Current Testing Strategy:**
- Partner with NGOs like Auckland City Mission to test real-world coordination challenges
- Measure coordination effectiveness vs traditional approaches
- Build evidence base before scaling to broader SDG implementation

---

**Status**: Complete policy creation system with person-centered SDG framework. Mission-driven approach requires validation that multi-stakeholder governance coordination actually improves outcomes before scaling to universal SDG implementation.