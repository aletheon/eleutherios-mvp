# Eleutherios MVP - PFSD Protocol Implementation
**Project Summary for Claude (Future Sessions)**

## Project Overview
Building a governance platform called **Eleutherios** that implements the **Policy-Forum-Service-Data (PFSD) protocol**. This system enables homeless people to immediately access emergency housing, healthcare, and food security through unified public policies.

**GitHub**: https://github.com/aletheon/eleutherios-mvp  
**Vercel**: https://eleutherios-mvp.vercel.app (or similar)  
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
- Deploy to Vercel
- Create landing page explaining PFSD transformation
- Add authentication
- Connect to real Firebase database
- Build policy creation/editing interface

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
```
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
```

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

## Important Architectural Decisions

1. **No localStorage/sessionStorage**: These don't work in Claude artifacts, so all state uses React useState
2. **Person as Service**: The homeless person creates a "service" that consumes policies - this is the key conceptual innovation
3. **Public Policies**: Policies are public by default, anyone can consume them
4. **Auto-forum Creation**: Forums are automatically instantiated when policies are consumed
5. **Real-time Status**: Service status updates are reflected immediately in all forums

## Policy Update Strategy (Discussed)

When a policy is updated, we discussed spawning a new forum with the updated rules rather than forcing existing consumers to migrate. This preserves:
- Consumer choice (opt-in to new version)
- Continuity (existing consumers not disrupted)
- Evolution (system can improve without breaking existing cases)

## Philosophical Context

The project is motivated by "Prior Unity" principles - the idea that shared governance systems should reflect interconnectedness. However, for adoption by government agencies (MSD, KO), we focus on practical benefits:
- Reduced bureaucracy
- Better coordination
- Faster service delivery
- Transparency and accountability
- Cost savings

## Next Steps for Demo

1. **Deploy to Vercel**
   ```bash
   git add .
   git commit -m "Add PFSD onboarding and forum coordination demo"
   git push origin main
   ```

2. **Create Landing Page** (Optional)
   - Explain PFSD transformation
   - Show before/after diagrams
   - Big buttons: "Start as Homeless Person" and "View Forums"

3. **Test Full Flow**
   - Onboarding → Policy consumption → Forum coordination
   - Verify all stakeholder perspectives work
   - Check service status updates display correctly

4. **Prepare for KO/MSD Presentation**
   - Focus on practical benefits
   - Emphasize 24-hour coordination vs weeks in old system
   - Show transparency and accountability features

## Known Issues / Notes

- TypeScript strict mode causes some type errors with `policy` possibly being undefined - fixed with type guards
- Material Icons need to be imported in layout.tsx with `<link>` tag
- No actual authentication yet - user switcher is for demo only
- All data is static demo data - not connected to real Firebase yet
- Forum messages are pre-populated - no real-time messaging yet

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
cat > filename << 'EOF'  # Create file with content
```

## Contact & Maintenance

- **Maintainer**: Rob Kara (rob.kara@gmail.com)
- **Organization**: Aletheon Foundation
- **Mission**: Advancing Prior Unity / Tino Rangatiratanga as living governance protocol

---

**To Future Claude**: This person is building a real, practical system to help homeless people access housing faster through better inter-agency coordination. The PFSD protocol is the technical implementation. Focus on making it work well and deploy successfully.