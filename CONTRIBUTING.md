# Contributing to Eleutherios

Kia ora! Thank you for your interest in contributing to **Eleutherios**.  
This project is open source and guided by the principle of **“Governance through Love in Action”**. Contributions are welcome from all who wish to help humankind (and non-humankind) recognise Prior Unity through this protocol.

---

## Ground Rules
- Be respectful — this is a kaupapa grounded in **Tino Rangatiratanga** and **Prior Unity**.
- Keep commits clean and descriptive.
- Discuss big changes in an Issue before starting work.
- Document all new code (inline comments + relevant docs).

---

## Development Workflow
1. **Fork** the repository (if external) or branch off `main` (if internal).
2. Create a feature branch:
   ```bash
   git checkout -b feature/policy-editor-ui
   ```
   Branch naming convention:
   - `feature/...` for new features  
   - `fix/...` for bug fixes  
   - `docs/...` for documentation-only changes  
   - `infra/...` for infrastructure/deployment updates  

3. Make your changes, commit with a clear message:
   ```bash
   git commit -m "Add housing policy rule instantiation to forum"
   ```
4. Push and open a **Pull Request (PR)** to `main`.

---

## Code Standards
- **Frontend**: React/Next.js, with functional components and hooks.  
- **Backend**: Firebase Cloud Functions, Firestore for data.  
- **Infra**: Firebase config + IaC templates (expandable later).  
- **Testing**: Write minimal tests where possible (e.g. for rule instantiation logic).  

---

## Documentation
- Update `README.md` for top-level changes.  
- Update `SCHEMA.md` if data models are altered.  
- Update `ROADMAP.md` if work shifts priorities.  

---

## Community / Governance
- Major architectural decisions are logged in `docs/GOVERNANCE.md`.  
- Aletheon Foundation oversees stewardship and alignment with Prior Unity.  

---

### Example Contribution Flow
- Homelessness demo service (MVP):  
  - Add Firestore schema updates to `SCHEMA.md`  
  - Implement Cloud Function in `backend/functions/`  
  - Wire UI in `frontend/pages/demo.tsx`  
  - Update `README.md` with usage example  

---
