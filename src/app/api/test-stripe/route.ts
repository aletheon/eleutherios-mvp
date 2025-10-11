// app/api/test-stripe/route.ts
import { NextResponse } from 'next/server';
import { stripe } from '../../../lib/stripe/config';

export async function GET() {
  try {
    // Test Stripe connection by creating a test payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 500, // $5.00 in cents
      currency: 'usd',
      metadata: {
        test: 'true'
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Stripe connected successfully!',
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount / 100,
      currency: paymentIntent.currency
    });

  } catch (error) {
    console.error('Stripe test failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Stripe connection failed'
    }, { status: 500 });
  }
}