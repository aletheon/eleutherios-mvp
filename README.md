# Eleutherios MVP

**Tagline:** Governance through Love in Action  

Eleutherios is a policy substrate and open-source operating system for governance, designed around the principle of **Prior Unity**. It allows humans, AI, services, and organisations to co-create policies and instantiate them into forums, services, and data flows.  

This repository contains the **MVP (Minimum Viable Product)** build plan and starter code for the Eleutherios prototype.

---

## Vision

Eleutherios enables governance as a living, dynamic process rather than static bureaucracy.  
- **Policy → Forum → Service → Data**: the four-layer architecture that defines and coordinates every action.  
- **Prior Unity**: every policy presumes relationship, aligning stakeholders (human and non-human) into cooperative action.  
- **Scalable substrate**: eventually designed to run not only as software, but also at the hardware layer (future chip/protocol standard).  

---

## MVP Goals (12-Week Roadmap)

1. **Backend (Firestore + Functions)**  
   - Define Firestore schema for Policy–Forum–Service–Data.  
   - Cloud Functions to materialize rules into forums.  
   - Security rules for safe policy execution.

2. **Frontend (React / Next.js)**  
   - Policy Editor UI (create, edit, instantiate policies).  
   - Forum View (rules instantiated as live discussions or service calls).  
   - Service Cards (consume or provide policies).

3. **Seed Use Case: Social Housing**  
   - Default policies (Eligibility, Housing Plans).  
   - Demo flow: Homeless person creates a Service, consumes Policy, interacts via Forum.  

---

## Getting Started (for Developers)

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or later)  
- [Firebase CLI](https://firebase.google.com/docs/cli)  
- [Git](https://git-scm.com/)  

### Setup
```bash
# Clone the repository
git clone https://github.com/aletheon/eleutherios-mvp.git
cd eleutherios-mvp

# Install dependencies
npm install

# Run local dev server
npm run dev
