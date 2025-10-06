// app/api/services/stripe-payment/route.ts

import { NextRequest, NextResponse } from 'next/server';

// Mock Stripe for testing - replace with real Stripe in production
const MOCK_MODE = true; // Set to false when you have Stripe API keys

interface StripePaymentRequest {
  customerId: string;
  businessId: string;
  amount: number;
  currency?: string;
  description?: string;
  metadata?: Record<string, any>;
}

interface StripePaymentResponse {
  success: boolean;
  data?: {
    paymentIntentId: string;
    status: string;
    amount: number;
    currency: string;
  };
  message: string;
  error?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<StripePaymentResponse>> {
  try {
    const body: StripePaymentRequest = await request.json();
    const { customerId, businessId, amount, currency = 'NZD', description, metadata } = body;

    // Validate required parameters
    if (!customerId || !businessId || !amount) {
      return NextResponse.json({
        success: false,
        message: 'Missing required parameters: customerId, businessId, amount',
        error: 'Invalid request parameters'
      }, { status: 400 });
    }

    // Validate amount
    if (amount <= 0 || amount > 10000) {
      return NextResponse.json({
        success: false,
        message: 'Invalid amount. Must be between $0.01 and $10,000',
        error: 'Amount out of range'
      }, { status: 400 });
    }

    if (MOCK_MODE) {
      // Mock Stripe payment for testing
      console.log('Processing mock Stripe payment:', {
        customerId,
        businessId,
        amount,
        currency,
        description
      });

      // Simulate some processing time
      await new Promise(resolve => setTimeout(resolve, 500));

      // Mock success response
      const mockPaymentIntentId = `pi_mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      return NextResponse.json({
        success: true,
        data: {
          paymentIntentId: mockPaymentIntentId,
          status: 'succeeded',
          amount: amount,
          currency: currency.toUpperCase()
        },
        message: `Mock payment of $${amount} ${currency.toUpperCase()} processed successfully`
      });

    } else {
      // Real Stripe implementation
      const Stripe = require('stripe');
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

      if (!process.env.STRIPE_SECRET_KEY) {
        return NextResponse.json({
          success: false,
          message: 'Stripe not configured',
          error: 'STRIPE_SECRET_KEY environment variable not set'
        }, { status: 500 });
      }

      try {
        // Create payment intent
        const paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(amount * 100), // Convert to cents
          currency: currency.toLowerCase(),
          customer: customerId,
          description: description || `Payment from ${customerId} to ${businessId}`,
          metadata: {
            businessId,
            customerId,
            ...metadata
          },
          // For multi-party payments, you would use transfer_data
          // transfer_data: {
          //   destination: businessId // This should be a Stripe Connect account ID
          // }
        });

        return NextResponse.json({
          success: true,
          data: {
            paymentIntentId: paymentIntent.id,
            status: paymentIntent.status,
            amount: paymentIntent.amount / 100, // Convert back to dollars
            currency: paymentIntent.currency.toUpperCase()
          },
          message: `Payment of $${amount} ${currency.toUpperCase()} processed successfully`
        });

      } catch (stripeError: any) {
        console.error('Stripe payment error:', stripeError);
        
        return NextResponse.json({
          success: false,
          message: 'Payment processing failed',
          error: stripeError.message || 'Unknown Stripe error'
        }, { status: 500 });
      }
    }

  } catch (error) {
    console.error('Payment endpoint error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Handle GET requests for testing
export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    service: 'StripePayment',
    status: 'available',
    mode: MOCK_MODE ? 'mock' : 'production',
    timestamp: new Date().toISOString()
  });
}