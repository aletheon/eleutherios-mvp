// app/api/payments/execute/route.ts - Fixed imports
import { NextRequest, NextResponse } from 'next/server';
import { EleuScriptPaymentParser } from '../../../../lib/eleuScript/payment-parser';
import { PaymentExecutor } from '../../../../lib/stripe/payment-executor';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { rule, userId, mockMode = true } = body;

    console.log('Payment execution request:', { rule, userId, mockMode }); // Debug log

    // Validate input
    if (!rule || typeof rule !== 'string') {
      return NextResponse.json(
        { error: 'Rule is required and must be a string' },
        { status: 400 }
      );
    }

    if (!userId || typeof userId !== 'string') {
      return NextResponse.json(
        { error: 'UserId is required for authorization' },
        { status: 400 }
      );
    }

    // Parse the EleuScript rule
    const paymentRule = EleuScriptPaymentParser.parsePaymentRule(rule);
    
    if (!paymentRule) {
      return NextResponse.json(
        { error: 'Invalid payment rule syntax' },
        { status: 400 }
      );
    }

    console.log('Parsed payment rule:', paymentRule); // Debug log

    // Authorization check - user can only initiate payments from their own account
    if (paymentRule.payerId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized: Cannot initiate payment for another user' },
        { status: 403 }
      );
    }

    // Validate payment rule for execution
    const validation = PaymentExecutor.validateForExecution(paymentRule);
    if (!validation.valid) {
      return NextResponse.json(
        { 
          error: 'Payment validation failed',
          validationErrors: validation.errors,
          rule: paymentRule
        },
        { status: 400 }
      );
    }

    console.log(`Executing payment in ${mockMode ? 'mock' : 'real'} mode`); // Debug log

    // Execute payment (mock mode for testing, real mode for production)
    const executionResult = mockMode 
      ? await PaymentExecutor.mockPaymentExecution(paymentRule)
      : await PaymentExecutor.executePaymentRule(paymentRule);

    console.log('Execution result:', executionResult); // Debug log

    if (!executionResult.success) {
      return NextResponse.json(
        {
          error: 'Payment execution failed',
          details: executionResult.error,
          rule: paymentRule
        },
        { status: 400 }
      );
    }

    // Success response
    return NextResponse.json({
      success: true,
      message: `Payment ${mockMode ? 'simulated' : 'created'} successfully`,
      rule: paymentRule,
      payment: executionResult,
      mockMode
    });

  } catch (error) {
    console.error('Payment execution API error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}