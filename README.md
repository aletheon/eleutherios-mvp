# Eleutherios MVP

Eleutherios is the **policy substrate** that turns the principle of **Prior Unity** into a living, programmable system.  
It provides a shared governance protocol where **Policies, Forums, Services, and Data** interconnect to enable humans, AIs, IoT, and institutions to co-create solutions.

> **Tagline:** *Governance through love in action*

---

## Repository Structure

- **`README.md`** — Project overview (this file)  
- **`schema.md`** — Data and entity schema for Firestore/Postgres  
- **`roadmap.md`** — MVP → OS/IAAS → Hardware chip trajectory  
- **`CONTRIBUTING.md`** — Contribution guidelines  
- **`GOVERNANCE.md`** — Open source + foundation governance structure  
- **`identity.md`** — Eleutherios identity, values, and purpose  
- **`ux_designs/`** — UX briefs and mockups

---

## Architecture Overview

Eleutherios is defined by a four-layer stack:

1. **Policy** — The root of governance; rules and references.  
2. **Forum** — Instantiation of rules into conversation/action.  
3. **Service** — Execution of rules as outcomes or functions.  
4. **Data** — Underlying records, events, and metrics.

Together, these layers form a **Policy–Forum–Service–Data (PFSD)** substrate.  
They can be instantiated in software or hardware, scaling from **MVP prototypes** to **dedicated chips** that embody governance at the protocol level.

---

## UX Designs

The MVP includes carefully considered UX designs to demonstrate how users (humans or non-humans) engage with PFSD.  

All briefs and mockups are stored in the [`/ux_designs`](./ux_designs/index.md) folder.

### Available UX Briefs
- [Create Policy](./ux_designs/create_policy.md)  
- [Create Forum](./ux_designs/create_forum.md)  
- [Create Service](./ux_designs/create_service.md)  
- [Create Data](./ux_designs/create_data.md)  

Each brief contains:
- **Purpose** — Why the screen exists.  
- **Key Components** — Inputs, buttons, and linked entities.  
- **User Flow** — Step-by-step interaction process.  
- **Backend Considerations** — Firestore schema references, entity relationships.  
- **Future Extensions** — Roadmap for growth beyond MVP.

### Mockups
Visual mockups are stored in `/ux_designs/images/`.  
Each brief links to its screenshot for developer reference. Example:

```markdown
![Create Forum Mockup](./ux_designs/images/create_forum.png)
```

---

## Roadmap

- **Phase 1 (0–6 months):** Build MVP on Firebase/Firestore, prove PFSD works.  
- **Phase 2 (6–24 months):** Scale to OS/IAAS layer, with policy editor/compiler.  
- **Phase 3 (2–5 years):** Hardware integration (chips, protocols, low-level stack).  

See [`roadmap.md`](./roadmap.md) for full details.

---

## License

Open source under the **MIT License** (or alternative once finalised).  
Maintained by the **Aletheon Foundation**.
