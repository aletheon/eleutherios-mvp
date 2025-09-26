# UX Design Brief: Write Service Review

**Screen:** Write a Service Review  
**Example:** Community Food Box

---

## Purpose
The **Write Service Review** screen allows stakeholders and participants to leave feedback about their experience with a service.  
Reviews increase transparency, build trust, and inform continuous improvement.  

---

## Key Components

1. **Header**
   - Title: “Review Service: [Service Name]”

2. **Rating**
   - Star rating system (1–5).

3. **Review Text**
   - Text field for free-form comments.  
   - Placeholder: “Tell us about your experience...”

4. **Optional Attachments**
   - Add image or document to support review.

5. **Submit Button**
   - Saves review and links it to the service.  

---

## User Flow
1. User searches for and opens a service detail page.  
2. User clicks **Write a Review**.  
3. User provides star rating, writes feedback, and optionally uploads attachments.  
4. User submits → review is saved, visible under the service detail screen.  

---

## Backend Considerations
- **Firestore Document Type:** `Review`
- **Schema Reference:** See `schema.md > Reviews`
- **Relationships:**
  - `Review -> Service` (one-to-one)
  - `Review -> User` (one-to-one)
- Must store:
  - Rating (integer)
  - Review text (string)
  - Optional attachment URLs
  - Timestamps

---

## Future Extensions
- Weighted reputation (more trusted reviewers’ input counts more).  
- AI-assisted summarisation of reviews.  
- Verified status for reviews (e.g., only stakeholders who actually interacted can leave feedback).

---

**Status:** MVP extension (after base service flow is live).  
