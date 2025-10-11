# Eleutherios MVP

**Governance through Love in Action**

Eleutherios is the open-source implementation of the Policy–Forum–Service–Data (PFSD) model. It provides a shared operating system for humankind — enabling policies to be instantiated into live forums, connected with services, and grounded in data.

## 🚀 Platform Status: Production-Ready Foundation

The platform has successfully transitioned from theoretical framework to working implementation with:
- **Real user authentication** and profile management
- **Data migration system** for database standardization
- **Material Icons navigation** with activities panel
- **User directory** with CERT score integration
- **Admin tooling** for platform maintenance

## 🏛️ The PFSD Model

Eleutherios unifies analogue and digital stakeholders (people, AI, IoT, APIs, organisations) under one governance standard:

### Policy = Governance
- Human-readable + machine-readable rules
- Rules may point to Forum, Service, or another Policy
- Policies can be Public (consumable by all) or Private (restricted to designated consumers)

### Forum = Network
- Instantiation of a rule into a space for dialogue or action
- Forums define stakeholders and permissions (add/remove members, create sub-forums, post/remove messages, upload/remove files)

### Service = Information
- An analogue or digital agent (human, API, IoT, AI)
- Services may be free or paid (via Stripe, PayPal, etc.)
- Attributes include Price, Size, Color, Quantity (extensible)
- Services connect to Policies and instantiate behaviour

### Data = Storage
- The storage layer — all policy, forum, and service activity
- Analytics, logs, and state management

## 🔧 Technical Implementation

### Database Architecture
**Hybrid Firebase Approach** optimized for different data patterns:
- **Firestore**: User profiles, complex queries, structured data
- **Realtime Database**: Forums, messaging, live collaboration

### Authentication System
- Complete Firebase Auth integration
- Role-based access control (person, caseworker, housing-officer, healthcare-provider, admin)
- Two-step registration with profile creation
- Protected routes and session management

### Frontend Stack
- **Next.js 13+** with App Router and TypeScript
- **Tailwind CSS** with Material Icons
- **React Hooks** for state management
- **Responsive design** for desktop and mobile

## 📊 CERT Trust Model

Every User and Service has a CERT score:
- **C** – Cooperation: how often you add other services to policies/forums
- **E** – Engagement: responsiveness + quality of ratings/reviews
- **R** – Retention: repeat uses (free services) or repeat sales (paid services)
- **T** – Trust: followers, subscriptions, endorsements

CERT encourages cooperation and builds legitimacy in the network.

## 🌊 EleuScript DSL

EleuScript is the domain-specific language (DSL) of Eleutherios. Its base object is a `policy`, which defines `rules`. Rules are only instantiated when consumed by a Service.

```eleuscript
policy HousingPolicy {
  rule TenancyAgreement -> Forum("Tenancy Forum", defaultStakeholders = ["Tenant", "KO"])
  rule RentPayment -> Service("StripePayment", currency="NZD")
  rule IdentityVerification -> Service("RealMeAuth")
}
```

A Service may consume multiple Policies simultaneously. Policies = templates; Services = runtime consumers.

## 🏗️ Live Implementation Examples

### Working Features
- **User Registration & Login**: Complete authentication flow
- **User Directory** (`/directory`): Browse real users with CERT scores
- **User Profiles** (`/users/[id]`): Detailed user information with migration status
- **Admin Dashboard** (`/admin`): Platform management and migration tools
- **Data Migration** (`/admin/migrate`): Safe database standardization tools

### Real-Time Forum Demonstration
**Coordination Forum** (`/forums/coordination`): Live multi-stakeholder coordination showing:
- Policy rules creating coordination spaces
- Real-time messaging between stakeholders
- Service activation through forum decisions
- Full audit trail for governance compliance

This demonstrates the **Policy → Forum → Service cycle** in action.

## 🗂️ Project Structure

```
eleutherios-mvp/
├── src/app/
│   ├── admin/                 # Admin dashboard and migration tools
│   ├── api/                   # REST API endpoints
│   ├── directory/             # User directory
│   ├── users/[id]/           # User profile pages
│   ├── policies/[id]/        # Policy detail pages
│   ├── forums/[id]/          # Forum interfaces
│   └── services/[id]/        # Service pages
├── src/components/
│   ├── Navigation.tsx         # Material Icons navigation
│   └── DashboardLayout.tsx    # Shared layout
├── docs/
│   ├── IMPLEMENTATION_ARCHITECTURE.md  # Technical implementation details
│   ├── DEVELOPMENT_TIMELINE.md         # Development progression
│   ├── IMPLEMENTATION_EXAMPLES.md      # Live feature demonstrations
│   ├── eleuscript.md                   # EleuScript DSL specification
│   └── schema.md                       # Data model documentation
└── PROJECT_SUMMARY.md         # Comprehensive development status
```

## 🚧 Current Development Phase

**Focus**: Transitioning from demonstration platform to user-generated content system

**Next Priorities**:
1. **Policy Creation Interface** - Enable users to create policies using forms that generate EleuScript
2. **Service Registration** - User-controlled service offerings with pricing and attributes
3. **Dynamic CERT Scoring** - Calculate scores from actual user interactions
4. **Forum Creation Tools** - User-initiated coordination spaces

## 💻 Getting Started

### Prerequisites
- Node.js 18+
- Firebase project with Authentication and Firestore enabled

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
- `/admin` - Admin dashboard
- `/admin/migrate` - Data migration tools
- `/forums/coordination` - Live forum demonstration

## 🌍 Real-World Applications

### Current Use Case: Housing Coordination
The platform demonstrates multi-stakeholder coordination for housing assistance:
- **Person in need** requests housing support
- **MSD caseworker** coordinates services
- **Housing officer** manages accommodation
- **Healthcare provider** addresses medical needs

### Future Healthcare Applications
Doctors could use EleuScript to define treatment protocols as code:
```eleuscript
policy DiabetesManagement {
  rule InitialAssessment -> Forum("Patient Intake", 
    required_data = ["HbA1c", "BMI", "medical_history"]
  )
  
  rule TreatmentPlan -> Service("PersonalizedTreatment", 
    conditions = ["HbA1c > 7.0"],
    medications = ["metformin_500mg"],
    monitoring = ["monthly_checkup"]
  )
}
```

## 🤝 Contributing

We welcome contributors — developers, designers, researchers, and community builders.

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

**Development Areas**:
- Policy creation interfaces
- Service registration workflows
- CERT score calculation algorithms
- EleuScript parser development
- UX/UI improvements
- Documentation and examples

## 📖 Documentation

- **[IMPLEMENTATION_ARCHITECTURE.md](docs/IMPLEMENTATION_ARCHITECTURE.md)** - Technical implementation details
- **[DEVELOPMENT_TIMELINE.md](docs/DEVELOPMENT_TIMELINE.md)** - Development progression from theory to implementation
- **[IMPLEMENTATION_EXAMPLES.md](docs/IMPLEMENTATION_EXAMPLES.md)** - Live feature demonstrations and code examples
- **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - Comprehensive development status and roadmap
- **[eleuscript.md](docs/eleuscript.md)** - EleuScript DSL specification
- **[schema.md](docs/schema.md)** - Data model documentation

## 🏛️ Governance

Governance of the repo is transparent — see [GOVERNANCE.md](GOVERNANCE.md).

This project is licensed under the Apache 2.0 License - see the [LICENSE](LICENSE) file for details.

## 🌱 Mission

Eleutherios is maintained under the Aletheon Foundation, with the mission of advancing Prior Unity / Tino Rangatiratanga as a living governance protocol.

Eleutherios is both:
- A technical stack (IAAS → PAAS → SAAS → Hardware), and
- A cultural protocol for humankind to organise around Prior Unity

## 📧 Contact

Maintained by Aletheon Foundation.
Contact: [rob.kara@gmail.com](mailto:rob.kara@gmail.com)

---

**Status**: Production-ready foundation with user authentication, data standardization, and admin tooling. Ready for policy creation interface development.