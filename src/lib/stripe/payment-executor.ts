// lib/stripe/payment-executor.ts - TypeScript Safe Version
import { stripe } from './config';
import type { PaymentRule } from '@/app/types/eleuscript';

export interface PaymentExecutionResult {
  success: boolean;
  paymentIntentId?: string;
  clientSecret?: string;
  error?: string;
  amount?: number;
  currency?: string;
  status?: string;
}

export class PaymentExecutor {
  // Execute a payment rule - creates real Stripe Payment Intent
  static async executePaymentRule(rule: PaymentRule): Promise<PaymentExecutionResult> {
    try {
      const amountInCents = Math.round(rule.amount * 100);

      // Create payment intent with Stripe
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInCents,
        currency: rule.currency.toLowerCase(),
        automatic_payment_methods: {
          enabled: true,
        },
        description: `EleuScript Payment: ${rule.payerId} to ${rule.payeeId}`,
        metadata: {
          eleuscript_rule: 'true',
          payer_id: rule.payerId,
          payee_id: rule.payeeId,
          original_amount: rule.amount.toString(),
        }
      });

      // Explicitly handle the response
      const result: PaymentExecutionResult = {
        success: true,
        paymentIntentId: paymentIntent.id,
        amount: rule.amount,
        currency: rule.currency,
        status: paymentIntent.status
      };

      // Only add clientSecret if it exists
      if (paymentIntent.client_secret) {
        result.clientSecret = paymentIntent.client_secret;
      }

      return result;

    } catch (error) {
      console.error('Payment execution failed:', error);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment execution failed',
        amount: rule.amount,
        currency: rule.currency
      };
    }
  }

  // Mock payment for testing
  static async mockPaymentExecution(rule: PaymentRule): Promise<PaymentExecutionResult> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Basic validation
    if (rule.amount < 0.50) {
      return {
        success: false,
        error: 'Amount must be at least $0.50',
        amount: rule.amount,
        currency: rule.currency
      };
    }

    if (rule.amount > 10000) {
      return {
        success: false,
        error: 'Amount cannot exceed $10,000',
        amount: rule.amount,
        currency: rule.currency
      };
    }

    // Mock success response
    return {
      success: true,
      paymentIntentId: `pi_mock_${Date.now()}`,
      clientSecret: `pi_mock_${Date.now()}_secret`,
      amount: rule.amount,
      currency: rule.currency,
      status: 'requires_payment_method'
    };
  }

  // Validate payment rule
  static validateForExecution(rule: PaymentRule): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (rule.amount < 0.50) {
      errors.push('Amount must be at least $0.50');
    }

    if (rule.amount > 10000) {
      errors.push('Amount cannot exceed $10,000');
    }

    const supportedCurrencies = ['USD', 'NZD', 'AUD', 'EUR', 'GBP'];
    if (!supportedCurrencies.includes(rule.currency.toUpperCase())) {
      errors.push(`Currency must be one of: ${supportedCurrencies.join(', ')}`);
    }

    if (!rule.payerId || rule.payerId.trim().length < 3) {
      errors.push('PayerId must be at least 3 characters');
    }

    if (!rule.payeeId || rule.payeeId.trim().length < 3) {
      errors.push('PayeeId must be at least 3 characters');
    }

    if (rule.payerId === rule.payeeId) {
      errors.push('Cannot pay yourself');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  // Get payment status
  static async getPaymentStatus(paymentIntentId: string): Promise<{
    status: string;
    amount?: number;
    currency?: string;
    error?: string;
  }> {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      return {
        status: paymentIntent.status,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency.toUpperCase()
      };
    } catch (error) {
      return {
        status: 'error',
        error: error instanceof Error ? error.message : 'Failed to retrieve payment status'
      };
    }
  }
}

// Simple exports for easy import
export async function executePaymentRule(rule: PaymentRule): Promise<PaymentExecutionResult> {
  return PaymentExecutor.executePaymentRule(rule);
}

export async function mockExecutePaymentRule(rule: PaymentRule): Promise<PaymentExecutionResult> {
  return PaymentExecutor.mockPaymentExecution(rule);
}