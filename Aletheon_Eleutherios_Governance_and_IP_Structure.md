# Aletheon Foundation ↔ Eleutherios Limited  
**Governance & IP Structure (Draft for Discussion)**  
_Prepared 2025-10-07 — Not legal advice._

---

## TL;DR
- **Aletheon Foundation** (charitable trust) **owns** the core PFSD/EleuScript IP & trademarks and stewards them for public benefit.
- **Eleutherios Limited** (for‑profit) builds products/services on top under a **non‑exclusive, arm’s‑length licence** and contributes improvements upstream.
- Core is **open‑core** (Apache‑2.0 recommended). Commercial add‑ons/hosting live in the company. Foundation does **not** deliver paid customer projects.

---

## One‑page structure diagram

```mermaid
graph TD
  A[Aletheon Foundation<br/>(Charitable Trust)]:::f
  E[Eleutherios Limited<br/>(NZ Company)]:::c
  O[PFSD Spec + EleuScript + Reference Libs<br/>(Open Source: Apache-2.0)]:::o
  M[Trademark Registry:<br/>PFSD, EleuScript, Aletheon]:::t
  U[Community / Other Companies / Researchers]:::u
  X[Customers & Pilot Partners]:::x

  A -->|owns & stewards| O
  A -->|owns| M
  A -->|non-exclusive IP + trademark licence| E
  E -->|contributes improvements (PRs)| O
  U -->|contribute / reuse| O
  X -->|contracts for deployments & support| E
  E -.->|sponsorship/donation| A

  classDef f fill:#e9f5ff,stroke:#2b6cb0,color:#1a365d;
  classDef c fill:#e6fffa,stroke:#2c7a7b,color:#285e61;
  classDef o fill:#fdf6b2,stroke:#b7791f,color:#744210;
  classDef t fill:#fde8e8,stroke:#c53030,color:#742a2a;
  classDef u fill:#f7fee7,stroke:#65a30d,color:#3f6212;
  classDef x fill:#f3e8ff,stroke:#6b46c1,color:#4c2889;
```

**Key principles**
- **Non‑exclusive** licensing to avoid private benefit issues; fair, arm’s‑length terms.
- Clear **trademark policy**: quality control, no implied endorsement.
- Foundation board has **independent majority**; company recuses on related‑party decisions.

---

## Roles & responsibilities

**Aletheon Foundation (charity)**
- Steward PFSD/EleuScript spec, reference implementations, and trademarks.
- Maintain open‑source repos (governance, contribution, security policies).
- Publish roadmaps and community standards; run community processes (RFCs).
- Receive sponsorship/donations; fund open, non‑customer‑specific work.

**Eleutherios Limited (company)**
- Build commercial deployments, hosting, integrations, and enterprise features.
- Contribute fixes/features upstream where practical; honour licence & trademark policy.
- Contract with customers; carry delivery, privacy, and security obligations.
- Optionally sponsor the Foundation; no control over Foundation decisions.

---

## Trust‑Deed: Draft **Purposes** Clause (NZ Charitable Trust)

> **Primary charitable purpose:** to advance education and other purposes beneficial to the community by stewarding open, privacy‑respecting digital governance technologies for public benefit.
>
> **In particular, the Trust shall:**  
> (a) develop, publish, and maintain the **PFSD** (Policy–Forum–Service–Data) specification, the **EleuScript** language, and related open resources;  
> (b) promote education and capacity‑building through documentation, workshops, and freely accessible materials;  
> (c) operate open‑source repositories and contribution programmes that enable individuals, communities, and organisations to adopt and improve PFSD/EleuScript;  
> (d) uphold Māori data sovereignty and culturally appropriate governance practices, and encourage responsible, equitable use of the technologies;  
> (e) license intellectual property on **non‑exclusive** terms consistent with these charitable purposes, ensuring that no private benefit arises other than that which is merely incidental to carrying out the Trust’s purposes; and  
> (f) do any lawful thing incidental or conducive to the attainment of the above charitable purposes.
>
> **No private pecuniary profit.** No Trustee shall derive any personal financial benefit from the Trust other than reimbursement of reasonable expenses, and any related‑party transactions must be on arm’s‑length terms, transparently documented, and in accordance with applicable charity law.

_Add standard clauses for powers, trustee appointments/removals, conflicts, winding‑up (assets to another charity with similar purposes), and indemnities._

---

## Licensing model (recommended)

- **Open‑core licence:** Apache‑2.0 for the PFSD spec, EleuScript, and reference libraries (grants patent rights; adoption‑friendly).  
- **Trademark policy:** Foundation owns marks (e.g., “PFSD”, “EleuScript”, “Aletheon”). Third‑party use requires compliance with quality and attribution rules; no implication of endorsement.  
- **Commercial modules/hosted service:** kept in Eleutherios Limited. Where modules are general‑purpose and not customer‑specific, aim to contribute interfaces back to the open core.

---

## Foundation ↔ Company IP & Trademark Licence  
*(Skeleton, non‑exclusive; adapt with counsel before signing)*

**1. Parties & term**  
- **Licensor:** Aletheon Foundation (the “Foundation”).  
- **Licensee:** Eleutherios Limited (the “Company”).  
- **Term:** 3 years from Effective Date, auto‑renewing yearly unless terminated under §12.

**2. Definitions**  
“Core IP” = PFSD spec, EleuScript, reference libraries and documentation as published by the Foundation.  
“Trademarks” = Foundation marks listed in Schedule A.  
“Licensed Products/Services” = Company offerings that implement or interoperate with Core IP.

**3. Grant of licence (IP)**  
3.1 **Non‑exclusive, worldwide** licence to use, reproduce, modify, and distribute Core IP solely to develop and provide Licensed Products/Services, subject to the Open‑Source Licence (Apache‑2.0) terms.  
3.2 This Agreement **adds no restrictions** to the Open‑Source Licence; in case of conflict, the Open‑Source Licence prevails.  
3.3 Company will not assert any patents **necessarily infringed** by its contributed improvements against the Foundation or users of the open‑core (“patent non‑aggression”).

**4. Trademark licence**  
4.1 Non‑exclusive, revocable right to use the Trademarks solely to describe compatibility or community participation, per the **Trademark Policy** (Schedule B).  
4.2 No co‑branding or implication of endorsement without prior written consent.  
4.3 Foundation may require reasonable **quality control** samples; failure to comply is grounds for suspension.

**5. Consideration**  
5.1 Arms‑length consideration to reflect fair value, structured as one or more of:  
  (a) annual sponsorship to support open‑core maintenance; and/or  
  (b) professional‑services vouchers for community work; and/or  
  (c) royalty of _x_% of net licence/hosting revenue attributable to Licensed Products (if any).  
5.2 Consideration must not create **private benefit** inconsistent with the Foundation’s charitable purposes.

**6. Contributions upstream**  
6.1 Company will propose generic fixes/features via pull requests and RFCs.  
6.2 Customer‑specific or secret material is excluded, but interfaces enabling interoperability should be proposed upstream when feasible.

**7. Compliance & reporting**  
7.1 Semi‑annual report: summary of usage, contributions, security issues disclosed, and sponsorship paid.  
7.2 Company complies with the open‑source security policy and promptly discloses material vulnerabilities.

**8. Confidentiality**  
Mutual protection for non‑public information exchanged under this Agreement.

**9. Data & ethics**  
Company commits to privacy‑by‑design and, in Aotearoa, alignment with Māori data sovereignty principles (e.g., Te Mana Raraunga).

**10. Warranties & liability**  
Core IP is provided “as is”. Neither party is liable for indirect or consequential loss. Liability caps can be inserted here (e.g., fees paid in 12 months).

**11. Conflicts & related‑party transactions**  
Any decision of the Foundation that affects this Agreement must be made without participation by any conflicted Trustee associated with the Company; minutes will record recusals.

**12. Suspension & termination**  
Foundation may suspend trademark use immediately for quality/brand misuse. Either party may terminate for uncured material breach (30 days’ notice). Trademark use ceases at termination; open‑source rights survive per Apache‑2.0.

**13. Publicity**  
Press releases or public announcements referencing the Foundation require prior written approval.

**14. Governing law & venue**  
New Zealand law; forum specified here. Disputes may use mediation before litigation.

**Schedule A — Trademarks**  
List marks, classes, jurisdictions.

**Schedule B — Trademark Policy (summary)**  
- Use marks only to describe compatibility or accurate affiliation (“Community Member”, not “Official”).  
- Follow visual guidelines; no modification of marks.  
- No use in domain names, company names, or app names without consent.  
- Foundation may audit usage; non‑compliant use must cease on request.

---

## Implementation checklist
1) Register **Aletheon Foundation** (charitable trust) and appoint an independent‑majority board.  
2) Assign PFSD/EleuScript IP to the Foundation; publish under **Apache‑2.0**; add `SECURITY.md`, `CONTRIBUTING.md`, and **Trademark Policy**.  
3) Incorporate **Eleutherios Limited**; adopt **ESOP (10–15%)**; set board/consent rules.  
4) Execute the **IP & Trademark Licence** and, separately, a **Sponsorship/Services Agreement** (if applicable).  
5) Document **conflicts policy** and recusal practice for related‑party matters.  
6) Publish a **public charter** explaining how the Foundation and the Company interact.

---

## FAQ
**Can the Company get an exclusive licence?** Not from the Foundation; exclusivity risks private‑benefit issues for a charity. Use speed, brand, and services as differentiators.  
**Who owns improvements?** Contributions to open‑core are owned under project terms; customer‑specific modules remain with the Company unless contributed.  
**Can others commercialise?** Yes—non‑exclusive model encourages an ecosystem and protects charitable status.

---

## Disclaimer
This document is a **draft** to speed conversations with counsel. It is **not legal advice**. Engage a NZ charity/governance lawyer before adopting.
