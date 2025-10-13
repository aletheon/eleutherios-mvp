# Google Forms Setup Guide: Emergency Accommodation Coordination Survey

## Form Settings
- **Title**: Emergency Accommodation Coordination Assessment
- **Description**: This survey identifies coordination challenges in emergency accommodation systems to validate potential solutions. Responses are confidential and will help improve multi-agency coordination effectiveness.
- **Settings**: 
  - Collect email addresses: Optional
  - Limit to 1 response: Yes
  - Edit after submit: Yes

---

## Section 1: Respondent Information

**Question 1** (Short answer - Required)
- **Question**: Organization Name
- **Type**: Short answer

**Question 2** (Short answer - Required)  
- **Question**: Your Role/Position
- **Type**: Short answer

---

## Section 2: Coordination Frequency and Impact

**Question 3** (Multiple choice - Required)
- **Question**: How often do residents experience delays or complications due to poor coordination between service providers?
- **Type**: Multiple choice
- **Options**:
  - Never (0%)
  - Rarely (1-10% of residents)
  - Sometimes (11-25% of residents)
  - Often (26-50% of residents)
  - Very often (51%+ of residents)

**Question 4** (Multiple choice - Required)
- **Question**: Approximately how many hours per week does your staff spend on coordination activities (phone calls, meetings, paperwork) between different agencies?
- **Type**: Multiple choice
- **Options**:
  - Less than 5 hours
  - 5-10 hours
  - 11-20 hours
  - 21-30 hours
  - More than 30 hours

**Question 5** (Multiple choice - Required)
- **Question**: How often do you receive incomplete information about incoming residents that requires re-doing assessments?
- **Type**: Multiple choice
- **Options**:
  - Never
  - Monthly
  - Weekly
  - Daily
  - Multiple times daily

---

## Section 3: Information Sharing Problems

**Question 6** (Multiple choice - Required)
- **Question**: When a resident has a crisis or incident, how many agencies typically need to be notified?
- **Type**: Multiple choice
- **Options**:
  - 1-2 agencies
  - 3-4 agencies
  - 5-6 agencies
  - 7+ agencies

**Question 7** (Multiple choice - Required)
- **Question**: How often do agencies miss critical information about shared residents?
- **Type**: Multiple choice
- **Options**:
  - Never
  - Rarely
  - Sometimes
  - Often
  - Very often

**Question 8** (Multiple choice - Required)
- **Question**: Do you ever discover other agencies were working with the same resident on issues you weren't aware of?
- **Type**: Multiple choice
- **Options**:
  - Never
  - Monthly
  - Weekly
  - Daily

---

## Section 4: Decision-Making Conflicts

**Question 9** (Multiple choice - Required)
- **Question**: How often do different agencies give conflicting advice to the same person about accommodation or services?
- **Type**: Multiple choice
- **Options**:
  - Never
  - Rarely (less than monthly)
  - Sometimes (monthly)
  - Often (weekly)
  - Very often (daily)

**Question 10** (Multiple choice - Required)
- **Question**: When you have more demand than bed capacity, decision-making conflicts with other agencies occur:
- **Type**: Multiple choice
- **Options**:
  - Never
  - Rarely
  - Sometimes
  - Often
  - Always

---

## Section 5: Discharge and Transition Coordination

**Question 11** (Multiple choice - Required)
- **Question**: What percentage of residents cycle back through emergency accommodation due to poor transition coordination?
- **Type**: Multiple choice
- **Options**:
  - 0-5%
  - 6-15%
  - 16-30%
  - 31-50%
  - 51%+

**Question 12** (Multiple choice - Required)
- **Question**: How often are residents discharged without proper housing lined up due to miscommunication?
- **Type**: Multiple choice
- **Options**:
  - Never
  - Rarely (less than quarterly)
  - Sometimes (monthly)
  - Often (weekly)
  - Very often (daily)

---

## Section 6: Operational Impact

**Question 13** (Multiple choice - Required)
- **Question**: How often do you turn away people who could have been accommodated with better coordination?
- **Type**: Multiple choice
- **Options**:
  - Never
  - Monthly
  - Weekly
  - Daily
  - Multiple times daily

**Question 14** (Multiple choice - Required)
- **Question**: What percentage of referrals come from agencies where the person doesn't actually meet your criteria?
- **Type**: Multiple choice
- **Options**:
  - 0-5%
  - 6-15%
  - 16-30%
  - 31-50%
  - 51%+

---

## Section 7: Current Coordination Methods

**Question 15a-e** (Linear scale 1-5 - Required for each)
- **Question**: Rate the effectiveness of your current coordination tools (1=Very Poor, 5=Excellent)
- **Type**: Linear scale (1-5)
- **Create separate questions for each**:
  - Phone calls
  - Email
  - Face-to-face meetings
  - Shared databases/systems
  - Social media (Facebook, etc.)

**Question 16** (Checkboxes - Required)
- **Question**: Which agencies are most challenging to coordinate with? (Select all that apply)
- **Type**: Checkboxes
- **Options**:
  - WINZ
  - Housing NZ
  - Health services
  - Mental health services
  - Police
  - Other NGOs
  - Community organizations
  - Private service providers

---

## Section 8: Priority Areas for Improvement

**Question 17** (Linear scale 1-6 - Create 6 separate questions)
- **Instructions**: Rank these coordination challenges by impact on your operations (1=Highest Impact, 6=Lowest Impact). Use each number only once.
- **Type**: Linear scale (1-6) for each item
- **Create separate questions**:
  - Information sharing between agencies
  - Decision-making conflicts
  - Intake and referral processes
  - Discharge planning coordination
  - Resource allocation
  - Follow-up and transition support

**Question 18** (Multiple choice - Required)
- **Question**: If a tool could improve one aspect of multi-agency coordination, which would have the biggest impact?
- **Type**: Multiple choice
- **Options**:
  - Real-time information sharing
  - Clear role definitions and responsibilities
  - Standardized assessment processes
  - Improved discharge planning
  - Better resource visibility
  - Conflict resolution mechanisms

---

## Section 9: Validation Questions

**Question 19** (Multiple choice - Required)
- **Question**: Would your organization be willing to pilot new coordination tools if they demonstrated measurable improvements?
- **Type**: Multiple choice
- **Options**:
  - Yes, immediately
  - Yes, with evidence from other organizations
  - Maybe, depends on implementation complexity
  - Unlikely
  - No

**Question 20** (Checkboxes - Required)
- **Question**: What would constitute success in improving coordination? (Select all that apply)
- **Type**: Checkboxes
- **Options**:
  - Reduced staff time on coordination activities
  - Fewer residents cycling through the system
  - Faster placement into permanent housing
  - Fewer service conflicts or gaps
  - Better information sharing
  - Improved resident outcomes

---

## Section 10: Additional Feedback

**Question 21** (Paragraph - Optional)
- **Question**: Describe the most significant coordination failure you've experienced in the past 6 months:
- **Type**: Paragraph

**Question 22** (Paragraph - Optional)
- **Question**: What coordination challenges does this survey not capture?
- **Type**: Paragraph

---

## Logic and Branching Suggestions

### Skip Logic Options:
1. **If Question 3 = "Never"** → Skip to Section 5 (less detailed questions about infrequent problems)
2. **If Question 4 = "Less than 5 hours"** → Add follow-up: "How do you achieve such efficient coordination?"
3. **If Question 19 = "No" or "Unlikely"** → Add follow-up: "What would need to change for you to consider coordination tools?"

### Validation Rules:
- **Ranking questions (17)**: Add validation to ensure each number 1-6 is used exactly once
- **Email collection**: Optional but helpful for follow-up interviews

## Distribution Strategy

1. **Create shareable link** with "Anyone with the link can respond"
2. **Test survey** with colleague before sending
3. **Send with brief email**:
   - Purpose: Research to improve multi-agency coordination
   - Time: 8-10 minutes to complete
   - Confidentiality: Responses anonymous unless email provided
   - Follow-up: Option for interview to discuss findings
4. **Follow-up** after 1 week if no response

## Data Analysis Setup

- **Enable response summary** in Google Forms
- **Export to Google Sheets** for detailed analysis
- **Create charts** for key metrics (coordination time, frequency of problems)
- **Filter responses** by organization type for comparative analysis

This survey structure will provide quantitative validation data about whether coordination failures justify platform development or whether current informal methods are already effective.