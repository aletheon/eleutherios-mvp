import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';

/**
 * GET /api/policies/[id]
 * Get a specific policy by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
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
    return NextResponse.json({
      success: true,
      data: {
        id: policyDoc.id,
        ...policyData,
        created_at: policyData.created_at?.toDate?.()?.toISOString() || policyData.created_at,
        last_executed: policyData.last_executed?.toDate?.()?.toISOString() || policyData.last_executed,
      },
    });
  } catch (error) {
    console.error('Error fetching policy:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch policy',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/policies/[id]
 * Update a policy
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    // Remove fields that shouldn't be updated
    const { created_by, created_at, id: _, execution_history, ...updateData } = body;

    const policyRef = doc(db, 'policies', id);

    // Check if policy exists
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

    await updateDoc(policyRef, updateData);

    // Fetch updated document
    const updatedDoc = await getDoc(policyRef);
    const updatedData = updatedDoc.data();

    return NextResponse.json({
      success: true,
      data: {
        id: updatedDoc.id,
        ...updatedData,
        created_at: updatedData?.created_at?.toDate?.()?.toISOString() || updatedData?.created_at,
        last_executed: updatedData?.last_executed?.toDate?.()?.toISOString() || updatedData?.last_executed,
      },
      message: 'Policy updated successfully',
    });
  } catch (error) {
    console.error('Error updating policy:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update policy',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/policies/[id]
 * Archive a policy (soft delete by setting status to 'archived')
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const searchParams = request.nextUrl.searchParams;
    const hardDelete = searchParams.get('hard') === 'true';

    const policyRef = doc(db, 'policies', id);

    // Check if policy exists
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

    if (hardDelete) {
      // Hard delete - permanently remove the document
      await deleteDoc(policyRef);
      return NextResponse.json({
        success: true,
        message: 'Policy permanently deleted',
      });
    } else {
      // Soft delete - archive the policy
      await updateDoc(policyRef, {
        status: 'archived',
      });

      return NextResponse.json({
        success: true,
        message: 'Policy archived successfully',
      });
    }
  } catch (error) {
    console.error('Error deleting policy:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete policy',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
