import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { executePolicyRules } from '@/lib/eleuScript/policyExecutor';

/**
 * POST /api/policies/[id]/execute
 * Execute a policy's rules
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { forumId, executedBy, context } = body;

    // Validate required fields
    if (!executedBy) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
          details: 'executedBy is required',
        },
        { status: 400 }
      );
    }

    // Fetch the policy
    const policyRef = doc(db, 'policies', id);
    const policyDoc = await getDoc(policyRef);

    if (!policyDoc.exists()) {
      return NextResponse.json(
        {
          success: false,
          error: 'Policy not found',
        },
        { status: 404 }
      );
    }

    const policyData = policyDoc.data();

    // Check if policy is active
    if (policyData.status !== 'active') {
      return NextResponse.json(
        {
          success: false,
          error: 'Policy is not active',
          details: `Policy status is '${policyData.status}'. Only active policies can be executed.`,
        },
        { status: 400 }
      );
    }

    // Execute the policy
    const executionResult = await executePolicyRules(
      id,
      policyData.rules,
      forumId,
      executedBy,
      context || {}
    );

    return NextResponse.json({
      success: true,
      data: executionResult,
      message: 'Policy executed successfully',
    });
  } catch (error) {
    console.error('Error executing policy:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to execute policy',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
