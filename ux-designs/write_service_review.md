# UX Design Brief: Write Service Review

**Screen:** Write a Service Review  
**Example:** Reviewing a Food Provision service (e.g., Braeburn Apples).  

---

## Purpose
The **Write Service Review** screen allows stakeholders, participants, and consumers to give feedback on services they have used.  
This feedback loop is critical for **trust, accountability, and continuous improvement** across Eleutherios services.  

---

## Key Components

1. **Header**
   - Title: **Write a Review**  
   - Service being reviewed: Name + Category.  
   - Link back to **Service Detail** screen.  

2. **Rating**
   - Quick star slider (1–5).  
   - Emoji option for accessibility (🙂 😐 🙁).  
   - Required field.  

3. **Review Text**
   - Large text area for open comments.  
   - Example placeholder: *“How was your experience?”*.  
   - Word count helper (max 1,000 chars).  

4. **Optional Metadata**
   - Date of service.  
   - Location (if relevant).  
   - Tags (e.g., “housing”, “food safety”, “staff kindness”).  

5. **Privacy Controls**
   - Post review as:  
     - **Public** (visible to all users).  
     - **Stakeholder-only** (visible only inside policy forums).  
     - **Anonymous**.  

6. **Call to Action**
   - **Submit Review** → saves to DB and updates Service Detail.  
   - Confirmation toast: *“Thank you for your feedback.”*  

---

## User Flow
1. User clicks “Write Review” on a Service Detail screen.  
2. They rate the service and add optional text + metadata.  
3. On submit, review is stored and linked to that service’s forums + policies.  
4. Other users can view reviews (with visibility rules applied).  

---

## Backend Considerations
- **Firestore Document Type:** `ServiceReview`  
- **Schema Reference:** `schema.md > ServiceReviews`  
- Must store:  
  - UserID (or anonymous flag).  
  - ServiceRef.  
  - Rating (numeric).  
  - ReviewText.  
  - DateCreated.  
  - Visibility setting.  
- **Moderation**: Reviews may be flagged/reported for abuse.  

---

## Future Extensions
- Verified user/service interactions (proof user actually consumed).  
- AI summarisation of reviews → “Common themes” (trustworthiness, quality).  
- Gamification: badges for reviewers.  
- Whānau/community bulk reviews.  

---

**Status:** MVP recommended.  
Reviews are the **feedback engine** for Eleutherios, closing the loop between **Policy → Service → Forum → Data**.  
