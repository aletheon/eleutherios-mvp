
# EleuScript Examples

This file provides **ready-to-use EleuScript snippets** to help developers and stakeholders understand how to model policies, services, and forums in practice.  
EleuScript code compiles governance concepts (Policy, Forum, Service, Data) into programmable objects.

---

## 1. Basic Policy: Housing Example

```eleuscript
policy HousingPolicy {
  rule TenancyAgreement -> Forum("Tenancy Forum", defaultStakeholders = ["Tenant", "KO"])
  rule RentPayment -> Service("StripePayment", currency="NZD")
  rule IdentityVerification -> Service("RealMeAuth")
}
```

---

## 2. Service Attributes: T-Shirt Example

```eleuscript
policy TshirtPolicy {
  rule Price -> Service("PriceCapture", default = 29.99, currency="USD")
  rule Size -> Service("SizeSelector", options = ["S","M","L","XL"])
  rule Color -> Service("ColorSelector", options = ["Black","White","Red"])
  rule Quantity -> Service("StockManager", available = 500)
}
```

---

## 3. Free vs Paid Service

```eleuscript
policy HealthcarePolicy {
  rule ClinicVisit -> Service("DoctorConsult", cost="Free")
  rule TelehealthVisit -> Service("DoctorConsult", provider="StripePayment", cost=49.00, currency="NZD")
}
```

---

## 4. Stakeholder Joins a Forum

```eleuscript
policy FoodPolicy {
  rule Distribution -> Forum("Food Pantry Forum", defaultStakeholders = ["Volunteer", "Farmer"])
}
```

---

## 5. Policy → Policy Linking

```eleuscript
policy ParentPolicy {
  rule ChildHousing -> Policy("HousingPolicy")
}
```

---

## 6. CERT Ranking in Action

```eleuscript
policy CERTExample {
  rule Engagement -> Service("MeasureEngagement", metrics = ["responseTime", "positiveReviews"])
  rule Retention -> Service("MeasureRetention", mode="free")   // or mode="paid"
  rule Trust -> Service("FollowerCount")
  rule Cooperation -> Service("CrossPolicyParticipation")
}
```

---

## Notes

- **Instantiation:** Rules do not create objects until a service *consumes* the policy.  
- **Flexibility:** Any rule must resolve to *Forum*, *Service*, or *Policy* to be useful.  
- **Future Extensions:** IoT, APIs, AI models, or humans are all valid **Service** implementations.


<!-- Policy ConsultationPolicy {
	rule BookAppointment -> Forum("Consultation Room", stakeholders = ["Patient", "Doctor"],permissions = {"Patient", ["join", "message", "upload_files"], "Doctor": ["join", "message", "upload_files", "end_session"]})
	rule DocumentConsultation -> Service("ConsultationNotes", required_fields = ["symptoms", "diagnosis", "recommendations"])
	rule CreatePrescription -> Policy("PrescriptionPolicy", conditions = ["consultation_completed", "doctor_verified"])	
}

PrescriptionPolicy {
	rule VerifyPrescription -> Service("PrescriptionValidation",
		stakeholders = [],
		required_data = ["patient_id", "medication",
			"dosage",
			"duration"
			]
	)

	rule FulfillPrescription -> Forum("Pharmacy Fulfillment", stakeholders = ["Patient", "Pharmacist"],
	permissions = {
		"Patient": ["view", "confirm_pickup"],
		"Pharmacist": ["view", "update_status", "message"]
	})
	
	rule PaymentProcessing -> Service("StripePayment", currency = "NZD", conditions = ["prescription_verified", "insurance_checked"]
	)
} -->
