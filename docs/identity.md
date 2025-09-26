# Identity & Authentication

## Purpose
Define how Eleutherios MVP handles user identity and authentication in a way that is secure, scalable, and aligned with both early adopters (e.g., MSD, Kāinga Ora) and end users (e.g., homeless individuals, social workers).

---

## Phase 1 (MVP Launch)
Authentication providers:
- **Google Login** (Firebase built-in)
- **Facebook Login** (Firebase built-in)
- **Email + Password** (Firebase built-in)

UX:
- Login screen presents Google, Facebook, and Email buttons.
- Clean UI aligned with provided UX mockups.

---

## Phase 2 (Extended Adoption)
Authentication providers:
- **RealMe Integration** (NZ Government identity service)  
  - Required for MSD, Kāinga Ora, and other government partnerships.  
  - Implement as **Custom SAML Provider** within Firebase Authentication.  
  - Must handle both production + test environments.  

Optional future providers:
- LinkedIn
- Apple ID
- Other government/NGO identity federations.

---

## Core Requirements
1. **Single User Identity**
   - Users may link multiple login methods to the same account.
   - One canonical user ID across providers.

2. **Role Awareness**
   - User roles stored in Firestore (e.g., homeless person, MSD staff, KO officer).
   - Roles connected to **Policy → Forum → Service** interactions.

3. **Security**
   - Enforce HTTPS everywhere.
   - Apply Firestore security rules by role.
   - Follow Firebase Authentication best practices.

4. **Scalability**
   - Authentication must be modular to support adding new providers without major refactors.

5. **UX**
   - Placeholder button for RealMe during MVP.  
   - Swap to active integration in Phase 2.

---

## Deliverables
- Firebase Authentication set up with Google, Facebook, Email.  
- Account linking implemented (multiple providers → one user).  
- Firestore schema updated for user roles + provider metadata.  
- Documented steps for adding RealMe.  
- Login UI matching UX mockups.  

---
