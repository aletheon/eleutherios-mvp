import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';

/**
 * GET /api/actions/[id]
 * Get action status and details
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const actionRef = doc(db, 'actions', id);
    const actionDoc = await getDoc(actionRef);

    if (!actionDoc.exists()) {
      return NextResponse.json(
        {
          success: false,
          error: 'Action not found',
        },
        { status: 404 }
      );
    }

    const actionData = actionDoc.data();
    return NextResponse.json({
      success: true,
      data: {
        id: actionDoc.id,
        ...actionData,
        createdAt: actionData.createdAt?.toDate?.()?.toISOString() || actionData.createdAt,
        startedAt: actionData.startedAt?.toDate?.()?.toISOString() || actionData.startedAt,
        completedAt: actionData.completedAt?.toDate?.()?.toISOString() || actionData.completedAt,
      },
    });
  } catch (error) {
    console.error('Error fetching action:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch action',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/actions/[id]
 * Update action status (used by action execution system)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { status, result, error } = body;

    // Validate status
    const validStatuses = ['pending', 'running', 'completed', 'failed', 'cancelled'];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid status',
          details: `status must be one of: ${validStatuses.join(', ')}`,
        },
        { status: 400 }
      );
    }

    const actionRef = doc(db, 'actions', id);

    // Check if action exists
    const actionDoc = await getDoc(actionRef);
    if (!actionDoc.exists()) {
      return NextResponse.json(
        {
          success: false,
          error: 'Action not found',
        },
        { status: 404 }
      );
    }

    // Build update data
    const updateData: any = {};
    if (status) {
      updateData.status = status;
      if (status === 'running' && !actionDoc.data().startedAt) {
        updateData.startedAt = Timestamp.now();
      }
      if (status === 'completed' || status === 'failed' || status === 'cancelled') {
        updateData.completedAt = Timestamp.now();
      }
    }
    if (result !== undefined) {
      updateData.result = result;
    }
    if (error !== undefined) {
      updateData.error = error;
    }

    await updateDoc(actionRef, updateData);

    // Fetch updated document
    const updatedDoc = await getDoc(actionRef);
    const updatedData = updatedDoc.data();

    return NextResponse.json({
      success: true,
      data: {
        id: updatedDoc.id,
        ...updatedData,
        createdAt: updatedData?.createdAt?.toDate?.()?.toISOString() || updatedData?.createdAt,
        startedAt: updatedData?.startedAt?.toDate?.()?.toISOString() || updatedData?.startedAt,
        completedAt: updatedData?.completedAt?.toDate?.()?.toISOString() || updatedData?.completedAt,
      },
      message: 'Action updated successfully',
    });
  } catch (error) {
    console.error('Error updating action:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update action',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
