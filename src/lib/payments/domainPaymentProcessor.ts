// lib/payments/domainPaymentProcessor.ts

export interface DomainPayment {
  domain: 'healthcare' | 'housing' | 'food' | 'education' | 'utilities' | 'transport' | 'other';
  serviceType: string; // 'consultation', 'rent', 'groceries', 'tuition', 'electricity', etc.
  amount: number;
  currency: 'NZD' | 'USD' | 'EUR' | 'GBP';
  payerId: string;
  providerId: string;
  facilitatorId?: string; // For multi-party coordination
  description?: string;
  metadata: {
    forumId: string;
    policyId: string;
    domain: string;
    serviceType: string;
    [key: string]: any; // Domain-specific metadata
  };
}

export interface PaymentResult {
  success: boolean;
  paymentIntentId?: string;
  message: string;
  error?: string;
  amount?: number;
  currency?: string;
}

export class DomainPaymentProcessor {
  // Remove direct Stripe dependency to avoid import errors
  // Payment processing will be handled through API calls instead

  constructor() {
    console.log('DomainPaymentProcessor initialized without direct Stripe dependency');
  }

  async processDomainPayment(payment: DomainPayment): Promise<PaymentResult> {
    try {
      console.log('Processing domain payment:', payment);

      // Use fetch to call our Stripe API endpoint instead of direct Stripe import
      const response = await fetch('/api/services/stripe-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId: payment.payerId,
          businessId: payment.providerId,
          amount: payment.amount,
          currency: payment.currency,
          description: payment.description || `${payment.domain} service payment`,
          metadata: payment.metadata
        })
      });

      if (!response.ok) {
        throw new Error(`Payment API request failed: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        return {
          success: true,
          paymentIntentId: result.data?.paymentIntentId,
          message: result.message,
          amount: payment.amount,
          currency: payment.currency
        };
      } else {
        return {
          success: false,
          message: 'Payment processing failed',
          error: result.error || result.message
        };
      }

    } catch (error) {
      console.error('Domain payment processing failed:', error);
      return {
        success: false,
        message: 'Payment processing failed',
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  async createHealthcarePayment(
    amount: number,
    patientId: string,
    providerId: string,
    serviceType: string,
    forumId: string,
    policyId: string
  ): Promise<PaymentResult> {
    const payment: DomainPayment = {
      domain: 'healthcare',
      serviceType,
      amount,
      currency: 'NZD',
      payerId: patientId,
      providerId,
      description: `Healthcare payment: ${serviceType}`,
      metadata: {
        forumId,
        policyId,
        domain: 'healthcare',
        serviceType,
        patientId,
        providerId
      }
    };

    return await this.processDomainPayment(payment);
  }

  async createHousingPayment(
    amount: number,
    tenantId: string,
    landlordId: string,
    serviceType: string,
    forumId: string,
    policyId: string
  ): Promise<PaymentResult> {
    const payment: DomainPayment = {
      domain: 'housing',
      serviceType,
      amount,
      currency: 'NZD',
      payerId: tenantId,
      providerId: landlordId,
      description: `Housing payment: ${serviceType}`,
      metadata: {
        forumId,
        policyId,
        domain: 'housing',
        serviceType,
        tenantId,
        landlordId
      }
    };

    return await this.processDomainPayment(payment);
  }

  async createFoodPayment(
    amount: number,
    customerId: string,
    providerId: string,
    serviceType: string,
    forumId: string,
    policyId: string
  ): Promise<PaymentResult> {
    const payment: DomainPayment = {
      domain: 'food',
      serviceType,
      amount,
      currency: 'NZD',
      payerId: customerId,
      providerId,
      description: `Food service payment: ${serviceType}`,
      metadata: {
        forumId,
        policyId,
        domain: 'food',
        serviceType,
        customerId,
        providerId
      }
    };

    return await this.processDomainPayment(payment);
  }

  async refundPayment(
    paymentIntentId: string,
    amount?: number,
    reason?: string
  ): Promise<PaymentResult> {
    try {
      // Call refund API endpoint
      const response = await fetch('/api/services/stripe-refund', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentIntentId,
          amount,
          reason: reason || 'Requested by customer'
        })
      });

      if (!response.ok) {
        throw new Error(`Refund API request failed: ${response.status}`);
      }

      const result = await response.json();
      return result;

    } catch (error) {
      console.error('Refund processing failed:', error);
      return {
        success: false,
        message: 'Refund processing failed',
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  async getPaymentStatus(paymentIntentId: string): Promise<{
    status: string;
    amount: number;
    currency: string;
    description?: string;
  } | null> {
    try {
      const response = await fetch(`/api/services/stripe-status/${paymentIntentId}`);
      
      if (!response.ok) {
        throw new Error(`Status API request failed: ${response.status}`);
      }

      const result = await response.json();
      return result.success ? result.data : null;

    } catch (error) {
      console.error('Payment status check failed:', error);
      return null;
    }
  }

  // Utility methods for domain-specific payment logic
  calculateHealthcareFee(serviceType: string, duration?: number): number {
    const baseFees: Record<string, number> = {
      'consultation': 75,
      'prescription': 25,
      'specialist': 150,
      'emergency': 200
    };

    const baseFee = baseFees[serviceType] || 50;
    return duration ? baseFee + (duration * 2) : baseFee; // $2/minute for extended consultations
  }

  calculateHousingFee(serviceType: string, amount: number): number {
    const fees: Record<string, number> = {
      'application': 25,
      'inspection': 150,
      'deposit': amount, // Full amount for deposits
      'rent': amount,    // Full amount for rent
      'bond': amount     // Full amount for bond
    };

    return fees[serviceType] || amount;
  }

  validatePaymentAmount(domain: string, serviceType: string, amount: number): boolean {
    // Basic validation rules by domain
    const limits: Record<string, { min: number; max: number }> = {
      healthcare: { min: 5, max: 1000 },
      housing: { min: 10, max: 5000 },
      food: { min: 1, max: 500 },
      education: { min: 10, max: 2000 },
      utilities: { min: 5, max: 1000 },
      transport: { min: 1, max: 200 }
    };

    const limit = limits[domain] || { min: 1, max: 10000 };
    return amount >= limit.min && amount <= limit.max;
  }
}

export const domainPaymentProcessor = new DomainPaymentProcessor();