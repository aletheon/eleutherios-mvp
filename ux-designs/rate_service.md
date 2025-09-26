# UX Design Brief: Rate a Service

**Screen:** Rate Service  
**Example:** User providing a quick rating after consuming a housing or food service.  

---

## Purpose
The **Rate Service** screen allows stakeholders, participants, and consumers to quickly leave a **numeric/emoji rating** for services.  
This is a lightweight alternative to full written reviews, ensuring **fast feedback capture**.  

---

## Key Components

1. **Header**
   - Title: **Rate This Service**  
   - Service name + category (e.g., **Temporary Housing**).  

2. **Rating Control**
   - Stars (1–5) OR hearts/thumbs.  
   - Alternative emoji slider for accessibility.  
   - One-click input → auto-save.  

3. **Optional Notes**
   - Small text box (max 250 chars).  
   - Placeholder: *“Anything you’d like to add?”*  

4. **Confirmation**
   - Message: *“Thank you for rating this service.”*  
   - Option to: **Write a Full Review** → deep link to `write_service_review.md`.  

---

## User Flow
1. User finishes using a service.  
2. Prompt: *“Would you like to rate your experience?”*  
3. User selects a star rating.  
4. Optionally adds a short note.  
5. Result is saved and aggregated into service’s profile.  

---

## Backend Considerations
- **Firestore Document Type:** `ServiceRating`  
- **Schema Reference:** `schema.md > ServiceRatings`  
- Must store:  
  - UserID (or anonymous flag).  
  - ServiceRef.  
  - Rating (1–5).  
  - Optional note.  
  - DateCreated.  

- Ratings aggregate into **Service Detail → Average Rating**.  
- Link to `ServiceReview` if user expands feedback later.  

---

## Future Extensions
- Weighted ratings by stakeholder type (policy managers, consumers, IoT sensors).  
- AI sentiment analysis on short notes.  
- Cross-service comparison dashboards.  
- Incentives: badges for frequent raters.  

---

**Status:** MVP optional but highly recommended.  
Quick ratings make it easy to build trust metrics for services without requiring long reviews.  

