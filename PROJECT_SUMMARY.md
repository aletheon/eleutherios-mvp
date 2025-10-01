# Eleutherios MVP - PFSD Protocol Implementation
**Project Summary for Claude (Future Sessions)**

## Project Overview
Building a governance platform called **Eleutherios** that implements the **Policy-Forum-Service-Data (PFSD) protocol**. This system enables homeless people to immediately access emergency housing, healthcare, and food security through unified public policies.

**GitHub**: https://github.com/aletheon/eleutherios-mvp  
**Vercel**: https://eleutherios-mvp.vercel.app  
**Local Dev**: http://localhost:3001

## Core Concept: Transformation from Hierarchical to Shared Governance

### OLD WAY (Hierarchical Silos)
- Homeless person goes to MSD → fills forms → waits
- Same person goes to KO → fills same forms again → waits
- Agencies don't communicate with each other
- Person falls through cracks between systems

### NEW WAY (PFSD Protocol)
- Homeless person creates ONE service request
- Consumes public policies (Housing, Healthcare, Food)
- Forums automatically created with ALL stakeholders
- MSD + KO + Healthcare providers coordinate in same space
- 24 hours from homeless to housed (vs weeks/months)

## The PFSD Model

**P = Policy**: Governance rules (e.g., Emergency Housing Framework)
- Human + machine readable
- Public (anyone can consume) or Private (restricted)
- Contains Rules that instantiate Forums/Services

**F = Forum**: Coordination spaces for stakeholders
- Real-time chat between person, MSD, KO, healthcare providers
- Auto-created when policy is consumed
- Permissions defined by policy rules

**S = Service**: Digital or human agents
- The homeless person IS a service (person-as-service concept)
- Also includes MSD financial support, KO housing placement, etc.
- Services consume policies

**D = Data**: Storage layer with transparency
- All communications logged
- Service status tracked
- Analytics and accountability

## Current Implementation Status

### ✅ COMPLETED
1. **Demo Data** (`src/lib/demo-data.ts`)
   - 3 public policies: Emergency Housing, Healthcare, Food Security
   - 4 demo users: John Smith (person), Sarah Jones (MSD), Mike Wilson (KO), Dr. Patel (healthcare)

2. **Onboarding Flow** (`src/app/onboarding/page.tsx`)
   - Step 1: Create service request (enter name)
   - Step 2: Consume public policies (Housing, Healthcare, Food)
   - Step 3: View automatically created forums with stakeholders

3. **Forum Coordination** (`src/app/forums/coordination/page.tsx`)
   - Real-time chat interface with all stakeholders
   - Service status tracking sidebar
   - User perspective switcher (demo feature)
   - Shows approvals, appointments, next steps

4. **Next.js API Routes** (in `src/app/api/`)
   - `/api/policies` - Get all policies
   - `/api/policies/social-housing` - Get housing policy
   - `/api/policies/healthcare` - Get healthcare policy
   - `/api/policies/food-security` - Get food security policy
   - `/api/users` - Get all users

### 🔲 TODO
- User validation interviews (priority before building more)
- Real Firebase authentication
- Connect to real Firebase database
- Build policy creation/editing interface
- Mobile optimization

## Key Technical Details

**Stack**:
- Next.js 13+ (App Router)
- TypeScript
- React
- Tailwind CSS
- Lucide React (icons)
- Firebase Realtime Database (REST API, no firebase-admin)

**Important Files**:
- `src/lib/demo-data.ts` - Policy and user data
- `src/lib/types.ts` - TypeScript interfaces
- `src/app/onboarding/page.tsx` - Onboarding flow
- `src/app/forums/coordination/page.tsx` - Forum interface
- `src/app/page.tsx` - Homepage (current: shows newsfeed)

**File Structure**:
eleutherios-mvp/
├── src/
│   ├── app/
│   │   ├── onboarding/
│   │   │   └── page.tsx          # 3-step onboarding
│   │   ├── forums/
│   │   │   └── coordination/
│   │   │       └── page.tsx      # Chat interface
│   │   ├── api/
│   │   │   ├── policies/
│   │   │   │   ├── route.ts
│   │   │   │   ├── social-housing/route.ts
│   │   │   │   ├── healthcare/route.ts
│   │   │   │   └── food-security/route.ts
│   │   │   └── users/route.ts
│   │   └── page.tsx              # Homepage
│   └── lib/
│       ├── demo-data.ts          # Policy/user data
│       └── types.ts              # TypeScript types
├── PROJECT_SUMMARY.md            # This file
├── GRANT_PROPOSAL.md             # Grant proposal template
└── INTERVIEW_QUESTIONS.md        # User validation questions

## Demo Use Case: Emergency Housing Coordination

**Personas**:
- **John Smith**: Homeless person seeking emergency housing
- **Sarah Jones**: MSD case worker (approves financial support)
- **Mike Wilson**: KO housing officer (assigns property)
- **Dr. Anjali Patel**: Healthcare provider (enrolls in healthcare)

**Demo Flow**:
1. Go to `/onboarding`
2. Enter name "John Smith"
3. Click "Create My Service Request"
4. Click "Consume All Policies"
5. View 3 forums created automatically
6. Click "Enter Forum" to go to `/forums/coordination`
7. See real-time coordination between all stakeholders
8. Switch user perspectives to see different views
9. Observe service status: Eligibility ✓, Financial Support ✓, Housing Placement ⏳

**The Demonstration Shows**:
- One policy, shared by all agencies
- Instant coordination, no duplicate forms
- Transparent process for the person
- 24-hour housing placement (vs weeks in old system)

## Project Background

**Creator**: Rob Kara, working on this for 10 years
**Original Context**: UN sustainable food systems governance work
**Funding**: $20k grant from UN cohort (currently $10k remaining)
**Current Status**: On benefit, transitioning from caregiving to full-time work on this project
**Motivation**: Believes PFSD protocol could significantly improve inter-agency coordination

## Important Architectural Decisions

1. **No localStorage/sessionStorage**: These don't work in Claude artifacts, so all state uses React useState
2. **Person as Service**: The homeless person creates a "service" that consumes policies - this is the key conceptual innovation
3. **Public Policies**: Policies are public by default, anyone can consume them
4. **Auto-forum Creation**: Forums are automatically instantiated when policies are consumed
5. **Real-time Status**: Service status updates are reflected immediately in all forums

## Policy Update Strategy (Discussed)

When a policy is updated, spawn a new forum with updated rules rather than forcing existing consumers to migrate. This preserves:
- Consumer choice (opt-in to new version)
- Continuity (existing consumers not disrupted)
- Evolution (system can improve without breaking existing cases)

## Next Steps (Current Priority)

**BEFORE BUILDING MORE FEATURES:**
1. **User Validation** - Interview 5 potential users (MSD workers, service providers, homeless people)
2. **Get Commitments** - Find at least ONE MSD worker and ONE service provider willing to trial
3. **Validate Assumptions** - Confirm the coordination problem is real and this solution fits their workflow

**IF VALIDATION SUCCEEDS:**
1. Add Firebase authentication
2. Connect to real database
3. Simplify for actual pilot (might be just one service, not three)
4. Run 2-week trial with 2-3 people

**IF VALIDATION FAILS:**
1. Document what was learned
2. Pivot based on real user feedback
3. Consider different use cases or approaches

## Grant Strategy

**Potential NZ Funders**:
1. Ministry of Social Development - Innovation Fund
2. Callaghan Innovation - R&D grants
3. Wellington Community Trust
4. Tindall Foundation
5. Todd Foundation
6. JR McKenzie Trust
7. Academic partnerships (University research)

**Grant Amount Target**: $80k for 12-month pilot with 20 participants

**Before Applying**:
- Complete user validation interviews
- Get letters of support from potential partners
- May need to register Aletheon as legal entity (but don't spend money on this until necessary)

## Known Issues / Notes

- All data is currently static demo data
- No real authentication system yet
- Forum messages are pre-populated
- Not connected to real Firebase database
- User validation not yet completed (critical next step)

## Commands Reference
```bash
# Development
npm run dev              # Start local server on port 3001

# Deployment
git add .
git commit -m "message"
git push origin main     # Auto-deploys to Vercel

# File operations
mkdir -p src/app/onboarding
touch src/app/onboarding/page.tsx
Contact & Maintenance

Maintainer: Rob Kara (rob.kara@gmail.com)
Organization: Aletheon Foundation (to be registered)
Mission: Advancing Prior Unity / Tino Rangatiratanga as living governance protocol