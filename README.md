# Eleutherios MVP

**Governance through Love in Action**

Eleutherios is the open-source implementation of the Policy–Forum–Service–Data (PFSD) model. It provides a shared operating system for humankind — enabling policies to be instantiated into live forums, connected with services, and grounded in data.

## 🎯 Platform Status: Complete Policy Creation System with EleuScript Generation

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
Form Input: "CreateSupport" → "Support Coordination" → ["Person", "Caseworker"]
Generated: rule CreateSupport -> Forum("Support Coordination", stakeholders=["Person", "Caseworker"])
```

The platform has successfully transitioned from theoretical framework to working implementation with complete policy creation capabilities, user authentication, payment processing, and real governance coordination tools.

## 🏛️ The PFSD Model

Eleutherios unifies analogue and digital stakeholders (people, AI, IoT, APIs, organisations) under one governance standard:

### Policy = Governance
- Human-readable + machine-readable rules
- Rules may point to Forum, Service, or another Policy
- Policies can be Public (consumable by all) or Private (restricted to designated consumers)
- **Now with complete web-based creation interface**

### Forum = Network
- Instantiation of a rule into a space for dialogue or action
- Forums define stakeholders and permissions (add/remove members, create sub-forums, post/remove messages, upload/remove files)
- **Real-time messaging and coordination capabilities**

### Service = Information
- An analogue or digital agent (human, API, IoT, AI)
- Services may be free or paid (via Stripe, PayPal, etc.)
- Attributes include Price, Size, Color, Quantity (extensible)
- Services consume Policies to inherit their behaviour

### Data = Storage
- The storage layer — all policy, forum, and service activity
- Analytics, logs, and state management
- **Firebase Realtime Database integration with migration tools**

## 🔧 Technical Implementation

### Enhanced Policy System (Production Ready)
- **Policy Creation**: `/policies/create` - Complete form-based rule builder
- **Policy Management**: `/policies` - Enhanced list with EleuScript indicators
- **Policy Details**: `/policies/[id]` - Full rule breakdown and export
- **Policy Editing**: `/policies/[id]/edit` - Complete editing interface
- **Real-time Generation**: Form inputs automatically generate EleuScript
- **Export System**: Download policies as JSON or EleuScript files

### Database Architecture
**Hybrid Firebase Approach** optimized for different data patterns:
- **Firestore**: User profiles, policies, structured data
- **Realtime Database**: Forums, messaging, live collaboration

**Database Structure (Enhanced):**
```json
{
  "policies": {
    "policyId": {
      "title": "Policy Name",
      "description": "...", 
      "category": "housing",
      "rules": [
        {
          "ruleName": "CreateCoordination",
          "forumTitle": "Emergency Housing",
          "stakeholders": ["Person", "Caseworker"],
          "description": "..."
        }
      ],
      "eleuscript": "policy PolicyName {\n  rule CreateCoordination -> Forum(\"Emergency Housing\", stakeholders=[\"Person\", \"Caseworker\"])\n}"
    }
  }
}
```

### Frontend Stack
- **Next.js 13+** with App Router and TypeScript
- **Tailwind CSS** with Material Icons
- **React Hooks** for state management
- **Responsive design** for desktop and mobile
- **Real-time EleuScript preview** with syntax highlighting

### Authentication & Payments
- Complete Firebase Auth integration with role-based access control
- **Stripe Integration** confirmed working ($1,250.75 balance visible)
- Multi-currency support (NZD, USD, EUR, GBP)
- Two-step registration with profile creation

## 📊 CERT Trust Model

Every User and Service has a CERT score:
- **C** – Cooperation: how often you add other services to policies/forums
- **E** – Engagement: responsiveness + quality of ratings/reviews
- **R** – Retention: repeat uses (free services) or repeat sales (paid services)
- **T** – Trust: followers, subscriptions, endorsements

CERT encourages cooperation and builds legitimacy in the network.

## 🌊 EleuScript DSL (Production Implementation)

EleuScript is the domain-specific language (DSL) of Eleutherios. Users create policies through web forms that automatically generate EleuScript code.

### Current Working System:
- Form-based policy creation without requiring EleuScript knowledge
- Automatic EleuScript generation from form inputs
- Rule validation and error handling
- Stakeholder management with add/remove functionality
- Real-time preview with purple syntax highlighting
- Database integration with existing Firebase structure

```eleuscript
policy HousingPolicy {
  rule TenancyAgreement -> Forum("Tenancy Forum", stakeholders=["Tenant", "KO"])
  rule RentPayment -> Service("StripePayment", currency="NZD")
  rule IdentityVerification -> Service("RealMeAuth")
}
```

A Service may consume multiple Policies simultaneously. Policies = templates; Services = runtime consumers.

## 🏗️ Working Features

### Policy Management (Complete)
- **Policy Creation** (`/policies/create`): Form-based policy builder with real-time EleuScript generation
- **Policy List** (`/policies`): Browse all policies with rule summaries and stakeholder information
- **Policy Details** (`/policies/[id]`): Complete rule breakdown with export functionality
- **Policy Editing** (`/policies/[id]/edit`): Update existing policies and rules
- **Export System**: Download policies as JSON or EleuScript files

### User Management (Complete)
- **User Registration & Login**: Complete authentication flow
- **User Directory** (`/directory`): Browse users with CERT scores
- **User Profiles** (`/users/[id]`): Detailed user information
- **Role-based Access**: person, caseworker, housing-officer, healthcare-provider, admin

### Platform Administration (Complete)
- **Admin Dashboard** (`/admin`): Platform management and analytics
- **Data Migration** (`/admin/migrate`): Database standardization tools
- **User Management**: Platform oversight and maintenance

### Real-Time Coordination (Working)
- **Forum System** (`/forums/[id]`): Live multi-stakeholder coordination
- **Real-time Messaging**: Firebase Realtime Database integration
- **EleuScript Execution**: Basic rule parsing and execution in forums
- **Payment Processing**: Stripe integration for service coordination

## 🗂️ Project Structure

```
eleutherios-mvp/
├── src/app/
│   ├── admin/                 # Admin dashboard and migration tools
│   ├── api/                   # REST API endpoints
│   ├── directory/             # User directory
│   ├── users/[id]/           # User profile pages
│   ├── policies/              # Policy management system
│   │   ├── create/           # Policy creation interface (complete)
│   │   ├── [id]/             # Policy detail pages (complete)
│   │   └── [id]/edit/        # Policy editing interface (complete)
│   ├── forums/[id]/          # Forum interfaces with real-time messaging
│   └── services/[id]/        # Service pages
├── src/components/
│   ├── ui/                   # Reusable UI components
│   ├── forms/                # Policy creation form components
│   ├── Navigation.tsx        # Material Icons navigation
│   └── DashboardLayout.tsx   # Shared layout
├── src/lib/
│   ├── firebase.ts           # Firebase configuration
│   ├── eleuscript.ts         # EleuScript parser and generator
│   └── utils.ts              # Utility functions
├── docs/
│   ├── eleuscript.md         # EleuScript DSL specification
│   ├── schema.md             # Data model documentation
│   └── examples.md           # Policy examples and code snippets
├── LICENSE                   # Apache 2.0 license
├── CONTRIBUTING.md           # Contribution guidelines
├── CODE_OF_CONDUCT.md        # Community standards
└── README.md                 # This file
```

## 🚧 Current Development Phase

**Status**: Policy creation system complete, now expanding service integration

**Next Priorities**:
1. **Service Registration System** - User-created services with pricing and attributes
2. **Enhanced Forum Integration** - Connect generated policies to existing forum system
3. **Advanced EleuScript Features** - Complex governance patterns and conditional logic
4. **Dynamic CERT Scoring** - Calculate scores from actual user interactions

## 💻 Getting Started

### Prerequisites
- Node.js 18+
- Firebase project with Authentication, Firestore, and Realtime Database enabled

### Installation
```bash
git clone https://github.com/aletheon/eleutherios-mvp.git
cd eleutherios-mvp
npm install
```

### Environment Setup
Create `.env.local`:
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
FIREBASE_DATABASE_URL=your_realtime_db_url

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
- `/` - Dashboard
- `/register` - User registration
- `/directory` - User directory
- `/policies` - Policy list and management
- `/policies/create` - Create new policies with EleuScript generation
- `/admin` - Admin dashboard
- `/forums/coordination` - Live forum demonstration

## 🌍 Real-World Applications

### Current Implementation: Housing Coordination
The platform demonstrates complete policy-driven coordination for housing assistance:
- **Policy Creation**: Users define housing coordination rules through web forms
- **EleuScript Generation**: Forms automatically generate executable governance code
- **Forum Instantiation**: Policies create coordination spaces with defined stakeholders
- **Service Integration**: Payment processing and service coordination
- **Real-time Collaboration**: Multi-stakeholder messaging and decision-making

### Example Generated Policy
```eleuscript
policy EmergencyHousing {
  rule CreateIntake -> Forum("Housing Assessment", 
    stakeholders=["Person", "Caseworker", "Housing Officer"]
  )
  
  rule ProcessPayment -> Service("StripePayment", 
    amount=500, 
    currency="NZD",
    description="Emergency accommodation"
  )
  
  rule FollowUp -> Forum("Housing Support", 
    stakeholders=["Person", "Caseworker"],
    auto_schedule="weekly"
  )
}
```

### Healthcare Protocol Example
```eleuscript
policy DiabetesManagement {
  rule InitialAssessment -> Forum("Patient Intake", 
    required_data=["HbA1c", "BMI", "medical_history"],
    stakeholders=["Patient", "Doctor", "Nurse"]
  )
  
  rule TreatmentPlan -> Service("PersonalizedTreatment", 
    conditions=["HbA1c > 7.0"],
    medications=["metformin_500mg"],
    monitoring="monthly_checkup"
  )
}
```

## 🤝 Contributing

We welcome contributors — developers, designers, researchers, and community builders.

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

**High-Priority Development Areas**:
- Service registration workflows
- Advanced EleuScript parser features
- Forum-policy integration enhancements
- Mobile responsiveness improvements
- CERT score calculation algorithms

**Community Contributions**:
- Policy examples and templates
- Documentation improvements
- Translation and internationalization
- UX/UI design enhancements

## 📖 Documentation

- **[CONTRIBUTING.md](CONTRIBUTING.md)** - How to contribute to the project
- **[CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)** - Community standards
- **[docs/eleuscript.md](docs/eleuscript.md)** - EleuScript DSL specification
- **[docs/schema.md](docs/schema.md)** - Data model documentation
- **[docs/examples.md](docs/examples.md)** - Policy examples and code snippets

## 🏛️ Governance

This project is licensed under the Apache 2.0 License - see the [LICENSE](LICENSE) file for details.

Governance of the repository is transparent and community-driven. All major decisions are made through open discussion and consensus-building.

## 🌱 Mission

Eleutherios is maintained under the Aletheon Foundation, with the mission of advancing Prior Unity / Tino Rangatiratanga as a living governance protocol.

Eleutherios is both:
- A technical stack enabling policy-driven coordination
- A cultural protocol for humankind to organize around Prior Unity

## 📧 Contact

Maintained by Aletheon Foundation.
Contact: [rob.kara@gmail.com](mailto:rob.kara@gmail.com)

---

**Status**: Complete policy creation system with EleuScript generation, real-time preview, export functionality, and database integration. Ready for service registration development and enhanced forum integration.