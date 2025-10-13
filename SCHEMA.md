# Eleutherios Data Model Specification

This document defines the complete data model for the Eleutherios platform, including the revolutionary service visibility system and governance-enabled shopping cart.

## Core Entities

### Users
Users are the primary actors in the governance system, with policy assignments and role-based permissions.

```json
{
  "users": {
    "userId": {
      "profile": {
        "name": "Dr. Sarah Chen",
        "email": "sarah.chen@hospital.com",
        "role": "doctor",
        "licenseNumber": "MD12345",
        "verified": true,
        "createdAt": "2025-01-01T00:00:00Z",
        "updatedAt": "2025-01-15T10:30:00Z"
      },
      "certScore": {
        "cooperation": 85,
        "engagement": 92,
        "retention": 78,
        "trust": 88,
        "lastCalculated": "2025-01-15T00:00:00Z"
      },
      "policyList": [
        "AIMemoryGovernance",
        "HealthcareCoordination", 
        "PaymentProcessing",
        "PrivacyPreferences"
      ],
      "shoppingCart": [
        {
          "serviceId": "medication_amoxicillin_500mg",
          "addedBy": "pharmacist456",
          "quantity": 21,
          "price": 25.00,
          "currency": "NZD",
          "authorized": true,
          "forumContext": "patient_consultation_789",
          "timestamp": "2025-01-15T14:30:00Z",
          "notes": "10 days, take with food"
        }
      ],
      "forumPermissions": {
        "can_add_to_cart": ["pharmacist", "doctor"],
        "can_view_history": ["caseworker", "healthcare_provider"],
        "can_modify_policies": ["user", "privacy_officer"],
        "can_search_private_services": ["doctor", "pharmacist"]
      },
      "activities": [
        {
          "forumId": "emergency_housing_coordination",
          "role": "stakeholder",
          "permissions": ["view", "post", "invite"]
        }
      ]
    }
  }
}
```

### Policies
Policies define governance rules through EleuScript, with user ownership and version control.

```json
{
  "policies": {
    "policyId": {
      "title": "Healthcare Coordination Policy",
      "description": "Governs multi-stakeholder patient care coordination",
      "category": "healthcare",
      "visibility": "public",
      "version": "1.2",
      "rules": [
        {
          "id": "rule_001",
          "ruleName": "CreateConsultation",
          "ruleType": "forum",
          "forumTitle": "Patient Care Coordination",
          "stakeholders": ["Patient", "Doctor", "Pharmacist"],
          "permissions": {
            "Doctor": ["create", "invite", "prescribe"],
            "Pharmacist": ["view", "add_medication", "comment"],
            "Patient": ["view", "approve", "request"]
          },
          "description": "Creates coordination space for patient care"
        },
        {
          "id": "rule_002",
          "ruleName": "MedicationAccess",
          "ruleType": "service",
          "serviceTarget": "MedicationDirectory",
          "visibility": "private",
          "authorizedRoles": ["Pharmacist", "Doctor"],
          "requiresLicense": true,
          "auditLevel": "full"
        }
      ],
      "eleuscript": "policy HealthcareCoordination {\n  rule CreateConsultation -> Forum(\"Patient Care Coordination\", stakeholders=[\"Patient\", \"Doctor\", \"Pharmacist\"])\n  rule MedicationAccess -> Service(\"MedicationDirectory\", visibility=\"private\", authorized_roles=[\"Pharmacist\", \"Doctor\"])\n}",
      "createdBy": "userId",
      "createdAt": "2025-01-01T00:00:00Z",
      "updatedAt": "2025-01-15T10:00:00Z",
      "appliedToUsers": ["patient123", "doctor456"],
      "complianceRequirements": ["HIPAA", "GDPR"]
    }
  }
}
```

### Services (Revolutionary Visibility Model)
Services represent coordination capabilities with sophisticated visibility and access controls.

```json
{
  "services": {
    "serviceId": {
      "title": "Amoxicillin 500mg Capsules",
      "description": "Antibiotic medication for bacterial infections",
      "category": "prescription_medication",
      "visibility": "private",
      "visibilityConfig": {
        "searchableBy": ["Pharmacist", "Doctor"],
        "viewableBy": ["Pharmacist", "Doctor", "Patient"],
        "orderableBy": ["Pharmacist"],
        "approvableBy": ["Patient"]
      },
      "provider": {
        "userId": "pharmacy_central_001",
        "name": "Central City Pharmacy",
        "licenseNumber": "PHARM-2024-001",
        "verified": true
      },
      "pricing": {
        "basePrice": 25.00,
        "currency": "NZD",
        "billingModel": "per_prescription",
        "revenueShare": {
          "pharmacy": 80,
          "platform": 15,
          "regulation_compliance": 5
        }
      },
      "attributes": {
        "dosage": "500mg",
        "form": "capsules",
        "quantity": 21,
        "prescriptionRequired": true,
        "controlledSubstance": false,
        "refrigerated": false,
        "expiryMonths": 24
      },
      "complianceRequirements": {
        "requiresPrescription": true,
        "requiresLicense": ["Pharmacist"],
        "ageRestrictions": "none",
        "regulatoryApprovals": ["FDA", "Medsafe"]
      },
      "governanceRules": [
        {
          "rule": "prescription_required",
          "condition": "must_have_valid_prescription",
          "enforced_by": "pharmacist_verification"
        },
        {
          "rule": "patient_consent",
          "condition": "patient_must_approve_cart",
          "enforced_by": "payment_gateway"
        }
      ],
      "auditTrail": [
        {
          "action": "service_created",
          "actor": "pharmacy_central_001",
          "timestamp": "2025-01-01T00:00:00Z"
        },
        {
          "action": "added_to_cart",
          "actor": "pharmacist456",
          "targetUser": "patient123",
          "forumContext": "consultation_789",
          "timestamp": "2025-01-15T14:30:00Z"
        }
      ],
      "certScore": {
        "cooperation": 95,
        "engagement": 88,
        "retention": 92,
        "trust": 96
      },
      "createdAt": "2025-01-01T00:00:00Z",
      "updatedAt": "2025-01-15T12:00:00Z"
    }
  }
}
```

### Forums (Multi-Stakeholder Coordination)
Forums enable real-time coordination with governance context and permissions.

```json
{
  "forums": {
    "forumId": {
      "title": "Patient Care Coordination - John Smith",
      "description": "Multi-disciplinary care coordination for patient treatment",
      "category": "healthcare_coordination",
      "policyId": "healthcare_coordination_policy",
      "createdBy": "doctor456",
      "participants": [
        {
          "userId": "patient123",
          "role": "Patient",
          "permissions": ["view", "approve", "request"],
          "joinedAt": "2025-01-15T10:00:00Z"
        },
        {
          "userId": "doctor456", 
          "role": "Doctor",
          "permissions": ["create", "invite", "prescribe", "add_to_cart"],
          "joinedAt": "2025-01-15T10:00:00Z"
        },
        {
          "userId": "pharmacist789",
          "role": "Pharmacist", 
          "permissions": ["view", "add_medication", "add_to_cart"],
          "joinedAt": "2025-01-15T11:30:00Z"
        }
      ],
      "shoppingCartContext": {
        "targetUserId": "patient123",
        "authorizedAdders": ["doctor456", "pharmacist789"],
        "requiresApproval": true,
        "paymentMethod": "patient_controlled"
      },
      "governanceSettings": {
        "consensusRequired": false,
        "auditLevel": "full",
        "complianceMode": "HIPAA",
        "dataRetention": "7years"
      },
      "status": "active",
      "createdAt": "2025-01-15T10:00:00Z",
      "lastActivity": "2025-01-15T14:45:00Z"
    }
  }
}
```

### Shopping Carts (Governance-Enabled)
Shopping carts with multi-stakeholder coordination and governance controls.

```json
{
  "shopping_carts": {
    "userId": {
      "items": [
        {
          "id": "cart_item_001",
          "serviceId": "medication_amoxicillin_500mg",
          "quantity": 21,
          "addedBy": {
            "userId": "pharmacist789",
            "role": "Pharmacist",
            "name": "Maria Rodriguez"
          },
          "addedAt": "2025-01-15T14:30:00Z",
          "forumContext": {
            "forumId": "patient_consultation_789",
            "messageId": "messageId2",
            "policyId": "healthcare_coordination_policy"
          },
          "authorization": {
            "authorized": true,
            "authorizedBy": "policy_rule_002",
            "permissionValidated": true,
            "validatedAt": "2025-01-15T14:30:00Z"
          },
          "approval": {
            "required": true,
            "status": "pending",
            "approver": "patient123"
          },
          "pricing": {
            "unitPrice": 25.00,
            "totalPrice": 25.00,
            "currency": "NZD",
            "priceValidUntil": "2025-01-16T14:30:00Z"
          },
          "notes": "10-day course, take with food to reduce stomach irritation"
        }
      ],
      "summary": {
        "totalItems": 1,
        "totalPrice": 25.00,
        "currency": "NZD",
        "requiresApproval": true,
        "lastModified": "2025-01-15T14:30:00Z"
      },
      "governanceInfo": {
        "applicablePolicies": ["healthcare_coordination_policy"],
        "complianceValidated": true,
        "auditTrail": ["cart_modification_001"]
      }
    }
  }
}
```

## Service Visibility Model

### Visibility Types

1. **Public Services**
   - Discoverable by any authenticated user
   - Examples: Transportation, general coordination services
   - No special role requirements

2. **Private Services**
   - Only searchable by specific roles
   - Examples: Prescription medications, professional tools
   - Requires role validation and often licensing

3. **Restricted Services**
   - Role-based access plus additional policy requirements
   - Examples: Controlled substances, sensitive data services
   - Requires multiple authorization layers

### Access Control Matrix

| User Role | Public Services | Private Services | Restricted Services |
|-----------|----------------|------------------|-------------------|
| Patient | Search, Order | View (if added to cart) | View (if authorized) |
| Doctor | Search, Order | Search, Order | Search, Order (with policy) |
| Pharmacist | Search, Order | Search, Order | Search, Order (with license) |
| Caseworker | Search, Order | View (context dependent) | View (policy dependent) |
| Admin | Full Access | Full Access | Full Access |

## Governance-Enabled Shopping Cart

### Multi-Stakeholder Cart Management

The shopping cart system enables authorized stakeholders to add services on behalf of others, with complete governance transparency:

1. **Permission Validation**: All cart additions validated against forum policies
2. **Audit Trail**: Complete record of who added what, when, and why
3. **Approval Workflow**: Target users approve all items added by others
4. **Payment Coordination**: Multi-party payment processing with revenue splits
5. **Compliance Integration**: Regulatory requirements enforced at cart level

### Cart Action Types

- **self_add**: User adds service to their own cart
- **authorized_add**: Authorized stakeholder adds service to another's cart
- **bulk_add**: Multiple services added via policy template
- **emergency_add**: Urgent services with expedited approval process

## Compliance and Auditing

### Audit Trail Structure
```json
{
  "audit_trail": {
    "eventId": {
      "event": "service_added_to_cart",
      "actor": "pharmacist789",
      "target": "patient123",
      "resource": "medication_amoxicillin_500mg",
      "forumContext": "patient_consultation_789",
      "policyValidation": "healthcare_coordination_policy_rule_002",
      "timestamp": "2025-01-15T14:30:00Z",
      "ipAddress": "192.168.1.1",
      "userAgent": "Mozilla/5.0...",
      "complianceFlags": ["HIPAA", "prescription_required"]
    }
  }
}
```

### Compliance Requirements
- **HIPAA**: Healthcare data protection and patient consent
- **GDPR**: European privacy regulations for data processing
- **Pharmacy Regulations**: Prescription medication handling requirements
- **Financial Regulations**: Multi-party payment processing compliance

## Platform Integration

### Firebase Integration
- **Firestore**: Users, policies, services (structured queries)
- **Realtime Database**: Forums, messages, live coordination
- **Storage**: Document attachments, audit logs
- **Functions**: Policy validation, payment processing

### External Integrations
- **Stripe**: Multi-party payment processing with revenue splits
- **Identity Verification**: Professional license validation
- **Compliance Services**: HIPAA, GDPR compliance monitoring
- **Notification Services**: Real-time coordination updates

This data model enables the revolutionary governance-enabled shopping cart while maintaining complete compliance transparency and stakeholder coordination capabilities.