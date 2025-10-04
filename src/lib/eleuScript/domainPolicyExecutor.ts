// lib/eleuScript/domainPolicyExecutor.ts
import { PolicyExecutor, ParsedRule, ExecutionResult } from './policyExecutor';
import { DomainPaymentProcessor } from '../payments/domainPaymentProcessor';
import { db } from '../firebase';
import { collection, doc, addDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

export interface DomainContext {
  userId: string;
  userName: string;
  domain: string;
  urgencyLevel: 'routine' | 'urgent' | 'emergency';
  location?: string;
  preferences?: Record<string, any>;
  capabilities?: string[];
}

export interface DomainPolicy {
  id: string;
  domain: string;
  policyType: string;
  forumId: string;
  stakeholders: string[];
  services: string[];
  status: 'active' | 'completed' | 'cancelled';
  metadata: Record<string, any>;
  createdAt: any;
  createdBy: string;
}

export class DomainPolicyExecutor extends PolicyExecutor {
  
  /**
   * Execute domain-agnostic EleuScript rules
   */
  static async executeDomainRule(
    rule: ParsedRule,
    stakeholderId: string,
    forumId: string,
    context?: DomainContext
  ): Promise<ExecutionResult> {
    
    console.log(`Executing rule: ${rule.ruleName} -> ${rule.ruleTarget}(${rule.targetName})`);
    
    try {
      // Detect domain from rule content
      const detectedDomain = this.detectDomain(rule, context);
      
      switch (rule.ruleTarget) {
        case 'Policy':
          return await this.executeDomainPolicy(rule, stakeholderId, forumId, detectedDomain, context);
        case 'Service':
          return await this.executeDomainService(rule, stakeholderId, forumId, detectedDomain, context);
        case 'Forum':
          return await this.executeDomainForum(rule, stakeholderId, forumId, detectedDomain, context);
        default:
          // Fall back to base PolicyExecutor for non-domain rules
          return await super.executeRule(rule, stakeholderId, forumId);
      }
    } catch (error) {
      console.error('Domain rule execution failed:', error);
      return {
        success: false,
        error: error.message,
        ruleId: rule.ruleName
      };
    }
  }

  /**
   * Detect domain from rule content and context
   */
  private static detectDomain(rule: ParsedRule, context?: DomainContext): string {
    if (context?.domain) return context.domain;

    // Domain detection patterns
    const domainPatterns: Record<string, RegExp[]> = {
      healthcare: [
        /health|medical|doctor|patient|gp|consultation|prescription|pharmacy|nurse/i,
        /clinic|hospital|diagnosis|treatment|medicine|vaccine/i
      ],
      housing: [
        /housing|rent|landlord|tenant|accommodation|property|lease|deposit/i,
        /kainga|kaingarora|emergency.housing|temporary.housing/i
      ],
      food: [
        /food|grocery|meal|nutrition|pantry|distribution|cooking|restaurant/i,
        /hunger|eating|diet|kitchen|supermarket|cafe/i
      ],
      education: [
        /education|school|university|learning|student|teacher|tuition|course/i,
        /study|classroom|degree|training|skill|knowledge/i
      ],
      utilities: [
        /electricity|power|water|gas|internet|phone|utility|connection/i,
        /bill|usage|meter|provider|outage/i
      ],
      transport: [
        /transport|travel|bus|train|taxi|uber|car|bike|walking/i,
        /journey|trip|route|public.transport|mobility/i
      ],
      employment: [
        /job|work|employment|career|employer|interview|wage|salary/i,
        /resume|skill|training|workplace|profession/i
      ],
      finance: [
        /money|payment|bank|budget|loan|debt|savings|investment/i,
        /income|expense|financial|credit|insurance/i
      ]
    };

    const ruleText = `${rule.ruleName} ${rule.targetName} ${JSON.stringify(rule.parameters || {})}`.toLowerCase();
    
    for (const [domain, patterns] of Object.entries(domainPatterns)) {
      if (patterns.some(pattern => pattern.test(ruleText))) {
        return domain;
      }
    }

    return 'general';
  }

  /**
   * Execute domain policy creation
   */
  private static async executeDomainPolicy(
    rule: ParsedRule,
    stakeholderId: string,
    forumId: string,
    domain: string,
    context?: DomainContext
  ): Promise<ExecutionResult> {
    
    const policyType = rule.targetName;
    const stakeholders = rule.parameters?.stakeholders || this.getDefaultStakeholders(domain);
    const services = rule.parameters?.services || this.getDefaultServices(domain, policyType);

    // Create domain policy document
    const domainPolicy: DomainPolicy = {
      id: `${domain}_${policyType}_${Date.now()}`,
      domain,
      policyType,
      forumId,
      stakeholders,
      services,
      status: 'active',
      metadata: {
        ...(rule.parameters || {}),
        urgencyLevel: context?.urgencyLevel || 'routine',
        location: context?.location,
        createdBy: stakeholderId
      },
      createdAt: serverTimestamp(),
      createdBy: stakeholderId
    };

    // Save to Firestore
    const policyRef = await addDoc(collection(db, 'domainPolicies'), domainPolicy);

    // Expand forum with domain-specific stakeholders
    await this.expandForumWithDomainStakeholders(forumId, domain, stakeholders, {
      policyType,
      policyId: policyRef.id,
      services
    });

    // Add domain services to forum
    await this.addDomainServices(forumId, domain, services);

    return {
      success: true,
      policyId: policyRef.id,
      message: `${domain} policy "${policyType}" created with ${stakeholders.length} stakeholders`,
      nextActions: this.getNextActions(domain, policyType),
      domain,
      services
    };
  }

  /**
   * Execute domain service activation
   */
  private static async executeDomainService(
    rule: ParsedRule,
    stakeholderId: string,
    forumId: string,
    domain: string,
    context?: DomainContext
  ): Promise<ExecutionResult> {
    
    const serviceName = rule.targetName;
    const serviceParams = rule.parameters || {};

    // Handle payment services
    if (serviceName === 'StripePayment' || serviceName.includes('Payment')) {
      return await this.processDomainPayment(rule, stakeholderId, forumId, domain, context);
    }

    // Handle domain-specific services
    const serviceResult = await this.activateDomainService(
      domain, 
      serviceName, 
      serviceParams, 
      stakeholderId, 
      forumId
    );

    // Update forum with service status
    await this.updateForumServiceStatus(forumId, serviceName, 'active', {
      domain,
      activatedBy: stakeholderId,
      serviceParams,
      result: serviceResult
    });

    return {
      success: true,
      serviceId: serviceResult.id,
      message: `${domain} service "${serviceName}" activated`,
      nextActions: serviceResult.nextActions || [],
      domain
    };
  }

  /**
   * Process payment for any domain service
   */
  private static async processDomainPayment(
    rule: ParsedRule,
    stakeholderId: string,
    forumId: string,
    domain: string,
    context?: DomainContext
  ): Promise<ExecutionResult> {
    
    const amount = rule.parameters?.amount || this.getDefaultAmount(domain, rule.parameters?.serviceType);
    const currency = rule.parameters?.currency || 'NZD';
    const serviceType = rule.parameters?.serviceType || rule.parameters?.type || 'service';
    const providerId = rule.parameters?.providerId || 'default_provider';
    const description = rule.parameters?.description || `${domain} ${serviceType}`;

    try {
      const paymentIntent = await DomainPaymentProcessor.processServicePayment(
        domain,
        serviceType,
        amount,
        currency,
        stakeholderId, // payer
        providerId,
        forumId,
        rule.parameters?.policyId || 'unknown',
        {
          ruleName: rule.ruleName,
          urgencyLevel: context?.urgencyLevel,
          location: context?.location
        }
      );

      // Update forum with payment information
      await this.updateForumServiceStatus(forumId, 'Payment', 'pending', {
        paymentIntentId: paymentIntent.id,
        amount,
        currency,
        domain,
        serviceType,
        status: 'awaiting_payment'
      });

      return {
        success: true,
        serviceId: paymentIntent.id,
        message: `${domain} payment initiated - $${amount} ${currency}`,
        paymentUrl: `payment_url_for_${paymentIntent.id}`,
        nextActions: ['complete_payment', 'await_confirmation'],
        domain,
        amount,
        currency
      };
    } catch (error) {
      console.error(`${domain} payment failed:`, error);
      return {
        success: false,
        error: `Payment processing failed: ${error.message}`,
        nextActions: ['retry_payment', 'contact_support'],
        domain
      };
    }
  }

  /**
   * Activate domain-specific service
   */
  private static async activateDomainService(
    domain: string,
    serviceName: string,
    serviceParams: Record<string, any>,
    stakeholderId: string,
    forumId: string
  ): Promise<any> {
    
    const serviceId = `${domain}_${serviceName}_${Date.now()}`;
    
    // Domain-specific service activation logic
    const serviceConfig = {
      id: serviceId,
      domain,
      serviceName,
      parameters: serviceParams,
      activatedBy: stakeholderId,
      forumId,
      status: 'active',
      activatedAt: serverTimestamp()
    };

    // Save service activation to database
    const serviceRef = await addDoc(collection(db, 'domainServices'), serviceConfig);

    return {
      id: serviceRef.id,
      status: 'activated',
      nextActions: this.getServiceNextActions(domain, serviceName)
    };
  }

  /**
   * Get default stakeholders for a domain
   */
  private static getDefaultStakeholders(domain: string): string[] {
    const defaultStakeholders: Record<string, string[]> = {
      healthcare: ['Patient', 'Doctor'],
      housing: ['Tenant', 'Landlord', 'CaseWorker'],
      food: ['Recipient', 'Provider', 'Coordinator'],
      education: ['Student', 'Teacher', 'Administrator'],
      utilities: ['Consumer', 'Provider', 'Coordinator'],
      transport: ['User', 'Provider', 'Coordinator'],
      employment: ['JobSeeker', 'Employer', 'Coordinator'],
      finance: ['User', 'Advisor', 'Institution'],
      general: ['User', 'Provider', 'Coordinator']
    };
    return defaultStakeholders[domain] || defaultStakeholders['general'];
  }

  /**
   * Get default services for a domain and policy type
   */
  private static getDefaultServices(domain: string, policyType: string): string[] {
    const domainServices: Record<string, Record<string, string[]>> = {
      healthcare: {
        'HealthcareAccess': ['Consultation', 'Prescription', 'Payment'],
        'ConsultationPolicy': ['Appointment', 'Notes', 'Payment'],
        'PrescriptionPolicy': ['Validation', 'Dispensing', 'Payment']
      },
      housing: {
        'HousingAccess': ['Search', 'Application', 'Payment'],
        'RentalPolicy': ['Agreement', 'Payment', 'Maintenance'],
        'EmergencyHousing': ['Placement', 'Support', 'Coordination']
      },
      food: {
        'FoodAccess': ['Distribution', 'Delivery', 'Coordination'],
        'MealPlan': ['Planning', 'Preparation', 'Payment'],
        'Grocery': ['Shopping', 'Payment', 'Delivery']
      },
      education: {
        'EducationAccess': ['Enrollment', 'Materials', 'Payment'],
        'Learning': ['Instruction', 'Assessment', 'Support'],
        'Training': ['Skills', 'Certification', 'Placement']
      },
      utilities: {
        'UtilityAccess': ['Connection', 'Billing', 'Maintenance'],
        'PowerPolicy': ['Supply', 'Meter', 'Payment'],
        'WaterPolicy': ['Supply', 'Quality', 'Payment']
      }
    };

    return domainServices[domain]?.[policyType] || ['Service', 'Coordination', 'Payment'];
  }

  /**
   * Get default payment amount for domain service
   */
  private static getDefaultAmount(domain: string, serviceType?: string): number {
    const defaultAmounts: Record<string, Record<string, number>> = {
      healthcare: { consultation: 75, prescription: 25, specialist: 150 },
      housing: { rent: 400, deposit: 800, application: 50 },
      food: { groceries: 100, meal: 15, weekly_plan: 75 },
      education: { tuition: 200, materials: 50, course: 500 },
      utilities: { electricity: 150, water: 80, internet: 70 },
      transport: { monthly_pass: 120, taxi_voucher: 30, fuel: 60 }
    };

    return defaultAmounts[domain]?.[serviceType || 'service'] || 50;
  }

  /**
   * Get next actions for domain policy
   */
  private static getNextActions(domain: string, policyType: string): string[] {
    const actionMap: Record<string, Record<string, string[]>> = {
      healthcare: {
        'HealthcareAccess': ['book_appointment', 'verify_eligibility', 'setup_payment'],
        'ConsultationPolicy': ['schedule_appointment', 'prepare_consultation', 'process_payment']
      },
      housing: {
        'HousingAccess': ['submit_application', 'verify_eligibility', 'arrange_viewing'],
        'EmergencyHousing': ['assess_urgency', 'find_accommodation', 'coordinate_support']
      },
      food: {
        'FoodAccess': ['assess_needs', 'locate_providers', 'arrange_distribution'],
        'MealPlan': ['plan_meals', 'shop_groceries', 'schedule_delivery']
      }
    };

    return actionMap[domain]?.[policyType] || ['activate_services', 'coordinate_stakeholders'];
  }

  /**
   * Get next actions for domain service
   */
  private static getServiceNextActions(domain: string, serviceName: string): string[] {
    const actionMap: Record<string, Record<string, string[]>> = {
      healthcare: {
        'GPBooking': ['confirm_appointment', 'prepare_consultation'],
        'PrescriptionValidation': ['verify_prescription', 'contact_pharmacy']
      },
      housing: {
        'HousingSearch': ['review_options', 'arrange_viewing'],
        'RentPayment': ['confirm_payment', 'update_tenancy']
      }
    };

    return actionMap[domain]?.[serviceName] || ['monitor_progress', 'coordinate_next_step'];
  }

  /**
   * Expand forum with domain-specific stakeholders and permissions
   */
  private static async expandForumWithDomainStakeholders(
    forumId: string,
    domain: string,
    stakeholders: string[],
    domainContext: any
  ) {
    const domainPermissions = this.getDomainPermissions(domain);
    
    // Expand forum capabilities using base PolicyExecutor
    await super.expandForumCapabilities(forumId, {
      stakeholders,
      permissions: domainPermissions,
      services: domainContext.services,
      metadata: {
        domain,
        ...domainContext
      }
    } as any, 'domain_system');
  }

  /**
   * Get domain-specific permissions
   */
  private static getDomainPermissions(domain: string): Record<string, string[]> {
    const permissionMap: Record<string, Record<string, string[]>> = {
      healthcare: {
        'Patient': ['join', 'message', 'view_records', 'book_appointments', 'pay'],
        'Doctor': ['join', 'message', 'diagnose', 'prescribe', 'access_records'],
        'Nurse': ['join', 'message', 'assist', 'update_records'],
        'Pharmacist': ['join', 'message', 'validate_prescription', 'dispense']
      },
      housing: {
        'Tenant': ['join', 'message', 'request_maintenance', 'pay_rent'],
        'Landlord': ['join', 'message', 'manage_property', 'collect_rent'],
        'CaseWorker': ['join', 'message', 'coordinate', 'approve_support'],
        'PropertyManager': ['join', 'message', 'manage_applications', 'schedule_viewings']
      },
      food: {
        'Recipient': ['join', 'message', 'request_food', 'provide_feedback'],
        'Provider': ['join', 'message', 'manage_inventory', 'coordinate_distribution'],
        'Coordinator': ['join', 'message', 'manage_distribution', 'track_needs']
      },
      education: {
        'Student': ['join', 'message', 'access_materials', 'submit_work'],
        'Teacher': ['join', 'message', 'provide_instruction', 'assess_progress'],
        'Administrator': ['join', 'message', 'manage_enrollment', 'coordinate_resources']
      }
    };

    return permissionMap[domain] || {
      'User': ['join', 'message', 'request_service'],
      'Provider': ['join', 'message', 'provide_service'],
      'Coordinator': ['join', 'message', 'coordinate', 'manage']
    };
  }

  /**
   * Add domain services to forum
   */
  private static async addDomainServices(forumId: string, domain: string, services: string[]) {
    await this.updateForumServiceStatus(forumId, 'DomainServices', 'active', {
      domain,
      availableServices: services,
      coordinationType: domain
    });
  }

  /**
   * Update forum service status
   */
  private static async updateForumServiceStatus(
    forumId: string,
    serviceName: string,
    status: string,
    metadata: any
  ) {
    try {
      const forumRef = doc(db, 'forums', forumId);
      await updateDoc(forumRef, {
        [`serviceStatus.${serviceName}`]: {
          status,
          lastUpdated: serverTimestamp(),
          metadata
        }
      });
    } catch (error) {
      console.error('Failed to update forum service status:', error);
    }
  }

  /**
   * Get domain-specific UI messages for rule execution
   */
  static getDomainExecutionMessage(result: ExecutionResult, domain: string): string {
    if (!result.success) {
      return `❌ ${domain} coordination failed: ${result.error}`;
    }

    const domainEmojis: Record<string, string> = {
      healthcare: '🏥',
      housing: '🏠',
      food: '🍽️',
      education: '📚',
      utilities: '⚡',
      transport: '🚌',
      employment: '💼',
      finance: '💰',
      general: '🔧'
    };

    const emoji = domainEmojis[domain] || domainEmojis['general'];
    
    if (result.message) {
      return `${emoji} ${result.message}`;
    }

    return `${emoji} ${domain} coordination updated`;
  }
}