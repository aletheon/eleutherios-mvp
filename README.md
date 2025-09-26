# Eleutherios MVP

**Tagline:** Governance through love in action  

Eleutherios is the open-source GovTech platform that embodies the principle of **Prior Unity (Tino Rangatiratanga)**.  
It provides a **policy substrate** where every policy rule can instantiate a forum, reference another policy, or call a service.  

The MVP demonstrates how governance can be digitised as a living, recursive system:  

- **Policy Layer** → rules define structure and intent  
- **Forum Layer** → rules instantiate into collaborative spaces  
- **Service Layer** → humans, AI, IoT, APIs act as services within forums  
- **Data Layer** → live data feeds inform and update the above in real time  

---

## MVP Use Case

**Social Housing Access**

1. A user (e.g. someone without stable housing) creates or subscribes to a **Housing Policy**.  
2. A **Rule** inside that policy (e.g. “Retrieve local housing plans”) is instantiated.  
3. That rule becomes a **Forum** (discussion space) or a **Service Call** (data retrieval).  
4. Stakeholders interact to deliver an outcome (e.g. secure accommodation).

---

## Tech Stack

- **Backend:** Firebase + Firestore  
- **Frontend:** React / Next.js  
- **Cloud Functions:** For policy → forum instantiation  
- **Hosting:** Firebase Hosting or Vercel  

---

## Firebase Setup

⚠️ **Note**: Firebase project setup is **not included in this repository yet**.  
This will be completed by the development team. Expected tasks:  

- Initialize Firebase project & Firestore database  
- Configure Firestore collections: `users`, `policies`, `forums`, `services`, `data`  
- Implement Firestore security rules (role-based access: Owner, Stakeholder, Participant, Service)  
- Deploy Cloud Functions for recursive policy–forum creation  

---

## Roadmap

1. ✅ Define architecture (Policy → Forum → Service → Data)  
2. 🚧 Build MVP (Social Housing policy demo)  
3. 🔜 Expand to additional domains: healthcare, food, identity  
4. 🔭 Long-term: Standardize Eleutherios as a **global governance protocol**  

---

## License

[MIT License](LICENSE) — Open source and free to use.

---

## Contact

- **Founder:** Robert Paul Kara  
- **Email:** rob.kara@gmail.com  
- **Mobile (NZ):** 021 120 5061  

