// types/eleuscript.ts
export interface PaymentRule {
  type: 'StripePayment';
  payerId: string;
  payeeId: string;
  amount: number;
  currency: string;
  metadata?: Record<string, string>;
}

export interface PaymentValidationResult {
  valid: boolean;
  errors: string[];
}

export interface PaymentExecutionResult {
  success: boolean;
  paymentIntentId?: string;
  error?: string;
  amount?: number;
  currency?: string;
}

// Chat message types for integration
export interface ChatMessage {
  id: string;
  userId: string;
  message: string;
  timestamp: Date;
  type: 'text' | 'eleuscript' | 'payment_result';
  paymentRule?: PaymentRule;
}

// Stripe Connect types
export interface ConnectedAccount {
  userId: string;
  stripeAccountId: string;
  isVerified: boolean;
  canReceivePayments: boolean;
}