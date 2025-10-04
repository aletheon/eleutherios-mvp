// lib/payments/domainPaymentProcessor.ts
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export interface DomainPayment {
  domain: 'healthcare' | 'housing' | 'food' | 'education' | 'utilities' | 'transport' | 'other';
  serviceType: string; // 'consultation', 'rent', 'groceries', 'tuition', 'electricity', etc.
  amount: number;
  currency: 'NZD' | 'USD' | 'EUR' | 'GBP';
  payerId: string;
  providerId: string;
  facilitatorId?: string; // For multi-party coordination
  description: string;
  metadata: {
    forumId: string;
    policyId: string;
    domain: string;
    serviceType: string;
    [key: string]: any; // Domain-specific metadata
  };
}

export interface PaymentSplit {
  recipientId: string;
  recipientType: 'provider' | 'facilitator' | 'platform';
  amount: number;
  description: string;
}

export class DomainPaymentProcessor {
  
  /**
   * Create payment for any domain service with flexible multi-party splits
   */
  static async createDomainPayment(
    payment: DomainPayment,
    splits: PaymentSplit[]
  ): Promise<Stripe.PaymentIntent> {
    
    const totalAmount = payment.amount;
    const platformFeeRate = this.getPlatformFeeRate(payment.domain);
    const platformFee = Math.round(totalAmount * platformFeeRate);
    
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: totalAmount * 100, // Stripe uses cents
        currency: payment.currency.toLowerCase(),
        description: `${payment.domain}: ${payment.description}`,
        metadata: {
          ...payment.metadata,
          payerId: payment.payerId,
          providerId: payment.providerId,
          ...(payment.facilitatorId && { facilitatorId: payment.facilitatorId }),
          totalSplits: splits.length.toString()
        },
        automatic_payment_methods: {
          enabled: true,
        },
        transfer_group: `${payment.domain}_${payment.metadata.forumId}_${Date.now()}`,
      });

      return paymentIntent;
    } catch (error) {
      console.error(`${payment.domain} payment creation failed:`, error);
      throw new Error(`Payment processing failed: ${error.message}`);
    }
  }

  /**
   * Process payment for any service domain
   */
  static async processServicePayment(
    domain: string,
    serviceType: string,
    amount: number,
    currency: string,
    payerId: string,
    providerId: string,
    forumId: string,
    policyId: string,
    additionalMetadata: Record<string, any> = {}
  ): Promise<Stripe.PaymentIntent> {
    
    const payment: DomainPayment = {
      domain: domain as any,
      serviceType,
      amount,
      currency: currency as any,
      payerId,
      providerId,
      description: `${serviceType} - ${domain}`,
      metadata: {
        forumId,
        policyId,
        domain,
        serviceType,
        ...additionalMetadata
      }
    };

    const splits = this.generatePaymentSplits(domain, serviceType, amount, providerId);
    return await this.createDomainPayment(payment, splits);
  }

  /**
   * Generate payment splits based on domain and service type
   */
  private static generatePaymentSplits(
    domain: string, 
    serviceType: string, 
    amount: number, 
    providerId: string
  ): PaymentSplit[] {
    
    const splits: PaymentSplit[] = [];
    const platformFeeRate = this.getPlatformFeeRate(domain);
    const platformFee = Math.round(amount * platformFeeRate);
    const providerAmount = amount - platformFee;

    // Provider gets the majority
    splits.push({
      recipientId: providerId,
      recipientType: 'provider',
      amount: providerAmount,
      description: `${domain} ${serviceType} service`
    });

    // Platform fee
    if (platformFee > 0) {
      splits.push({
        recipientId: 'platform',
        recipientType: 'platform',
        amount: platformFee,
        description: 'Platform coordination fee'
      });
    }

    return splits;
  }

  /**
   * Get platform fee rate by domain
   */
  private static getPlatformFeeRate(domain: string): number {
    const feeRates: Record<string, number> = {
      'healthcare': 0.05,   // 5% for healthcare coordination
      'housing': 0.03,      // 3% for housing coordination  
      'food': 0.02,         // 2% for food distribution
      'education': 0.04,    // 4% for education services
      'utilities': 0.01,    // 1% for utility coordination
      'transport': 0.03,    // 3% for transport services
      'other': 0.029        // Default Stripe rate
    };
    return feeRates[domain] || feeRates['other'];
  }

  /**
   * Handle successful payment webhook for any domain
   */
  static async handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
    const { metadata } = paymentIntent;
    const { forumId, policyId, domain, serviceType } = metadata;

    // Update forum with payment confirmation
    await this.updateForumPaymentStatus(forumId, paymentIntent.id, 'completed');

    // Execute domain-specific follow-up actions
    await this.executePostPaymentActions(domain, serviceType, metadata);
  }

  /**
   * Execute domain-specific actions after successful payment
   */
  private static async executePostPaymentActions(
    domain: string,
    serviceType: string,
    metadata: Record<string, string>
  ) {
    const { forumId, policyId } = metadata;

    switch (domain) {
      case 'healthcare':
        if (serviceType === 'consultation') {
          await this.triggerHealthcareWorkflow(metadata);
        } else if (serviceType === 'prescription') {
          await this.markPrescriptionPaid(metadata);
        }
        break;

      case 'housing':
        if (serviceType === 'rent') {
          await this.confirmHousingPayment(metadata);
        } else if (serviceType === 'deposit') {
          await this.activateHousingPlacement(metadata);
        }
        break;

      case 'food':
        if (serviceType === 'groceries') {
          await this.scheduleGroceryDelivery(metadata);
        } else if (serviceType === 'meal_plan') {
          await this.activateMealPlan(metadata);
        }
        break;

      case 'education':
        if (serviceType === 'tuition') {
          await this.confirmEnrollment(metadata);
        } else if (serviceType === 'materials') {
          await this.provideEducationMaterials(metadata);
        }
        break;

      case 'utilities':
        if (serviceType === 'electricity') {
          await this.maintainPowerConnection(metadata);
        } else if (serviceType === 'water') {
          await this.maintainWaterConnection(metadata);
        }
        break;

      case 'transport':
        if (serviceType === 'public_transport') {
          await this.activateTransportPass(metadata);
        } else if (serviceType === 'taxi_voucher') {
          await this.provideTaxiVoucher(metadata);
        }
        break;

      default:
        console.log(`Post-payment actions not defined for ${domain}/${serviceType}`);
    }
  }

  /**
   * Update forum payment status in real-time
   */
  private static async updateForumPaymentStatus(
    forumId: string, 
    paymentIntentId: string, 
    status: 'pending' | 'completed' | 'failed'
  ) {
    console.log(`Payment ${paymentIntentId} ${status} for forum ${forumId}`);
    // Implementation would update Firestore forum document
  }

  // Domain-specific post-payment actions
  private static async triggerHealthcareWorkflow(metadata: Record<string, string>) {
    console.log('Triggering healthcare workflow:', metadata);
  }

  private static async markPrescriptionPaid(metadata: Record<string, string>) {
    console.log('Prescription paid:', metadata);
  }

  private static async confirmHousingPayment(metadata: Record<string, string>) {
    console.log('Housing payment confirmed:', metadata);
  }

  private static async activateHousingPlacement(metadata: Record<string, string>) {
    console.log('Housing placement activated:', metadata);
  }

  private static async scheduleGroceryDelivery(metadata: Record<string, string>) {
    console.log('Grocery delivery scheduled:', metadata);
  }

  private static async activateMealPlan(metadata: Record<string, string>) {
    console.log('Meal plan activated:', metadata);
  }

  private static async confirmEnrollment(metadata: Record<string, string>) {
    console.log('Education enrollment confirmed:', metadata);
  }

  private static async provideEducationMaterials(metadata: Record<string, string>) {
    console.log('Education materials provided:', metadata);
  }

  private static async maintainPowerConnection(metadata: Record<string, string>) {
    console.log('Power connection maintained:', metadata);
  }

  private static async maintainWaterConnection(metadata: Record<string, string>) {
    console.log('Water connection maintained:', metadata);
  }

  private static async activateTransportPass(metadata: Record<string, string>) {
    console.log('Transport pass activated:', metadata);
  }

  private static async provideTaxiVoucher(metadata: Record<string, string>) {
    console.log('Taxi voucher provided:', metadata);
  }

  /**
   * Create test accounts for any domain providers
   */
  static async createDomainProviderAccounts(domain: string) {
    const accountConfigs = this.getDomainAccountConfigs(domain);
    const accounts: Record<string, Stripe.Account> = {};

    for (const [providerType, config] of Object.entries(accountConfigs)) {
      accounts[providerType] = await stripe.accounts.create({
        type: 'express',
        country: 'NZ',
        email: config.email,
        business_type: config.businessType,
        ...(config.businessType === 'individual' && {
          individual: {
            first_name: config.firstName,
            last_name: config.lastName,
            email: config.email,
          }
        }),
        ...(config.businessType === 'company' && {
          company: {
            name: config.companyName,
          }
        }),
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
      });
    }

    return accounts;
  }

  /**
   * Get provider account configurations by domain
   */
  private static getDomainAccountConfigs(domain: string) {
    const configs: Record<string, Record<string, any>> = {
      healthcare: {
        doctor: {
          email: 'doctor.test@eleutherios.health',
          businessType: 'individual',
          firstName: 'Dr. Sarah',
          lastName: 'Johnson'
        },
        pharmacy: {
          email: 'pharmacy.test@eleutherios.health', 
          businessType: 'company',
          companyName: 'Test Pharmacy Ltd'
        }
      },
      housing: {
        landlord: {
          email: 'landlord.test@eleutherios.housing',
          businessType: 'individual',
          firstName: 'John',
          lastName: 'Property'
        },
        property_manager: {
          email: 'manager.test@eleutherios.housing',
          businessType: 'company', 
          companyName: 'Property Management Co'
        }
      },
      food: {
        grocery_store: {
          email: 'grocery.test@eleutherios.food',
          businessType: 'company',
          companyName: 'Community Grocery'
        },
        meal_provider: {
          email: 'meals.test@eleutherios.food',
          businessType: 'company',
          companyName: 'Healthy Meals Ltd'
        }
      },
      education: {
        institution: {
          email: 'edu.test@eleutherios.education',
          businessType: 'company',
          companyName: 'Learning Institute'
        },
        tutor: {
          email: 'tutor.test@eleutherios.education',
          businessType: 'individual',
          firstName: 'Jane',
          lastName: 'Teacher'
        }
      },
      utilities: {
        power_company: {
          email: 'power.test@eleutherios.utilities',
          businessType: 'company',
          companyName: 'Power Co Ltd'
        },
        water_company: {
          email: 'water.test@eleutherios.utilities',
          businessType: 'company',
          companyName: 'Water Services Ltd'
        }
      }
    };

    return configs[domain] || {};
  }
}