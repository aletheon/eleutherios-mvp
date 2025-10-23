import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';

/**
 * GET /api/forums/[id]
 * Get a specific forum by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const forumRef = doc(db, 'forums', id);
    const forumDoc = await getDoc(forumRef);

    if (!forumDoc.exists()) {
      return NextResponse.json(
        {
          success: false,
          error: 'Forum not found',
        },
        { status: 404 }
      );
    }

    const forumData = forumDoc.data();
    return NextResponse.json({
      success: true,
      data: {
        id: forumDoc.id,
        ...forumData,
        created_at: forumData.created_at?.toDate?.()?.toISOString() || forumData.created_at,
        updated_at: forumData.updated_at?.toDate?.()?.toISOString() || forumData.updated_at,
      },
    });
  } catch (error) {
    console.error('Error fetching forum:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch forum',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/forums/[id]
 * Update a forum
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    // Remove fields that shouldn't be updated
    const { created_by, created_at, id: _, ...updateData } = body;

    // Add updated_at timestamp
    updateData.updated_at = Timestamp.now();

    const forumRef = doc(db, 'forums', id);

    // Check if forum exists
    const forumDoc = await getDoc(forumRef);
    if (!forumDoc.exists()) {
      return NextResponse.json(
        {
          success: false,
          error: 'Forum not found',
        },
        { status: 404 }
      );
    }

    await updateDoc(forumRef, updateData);

    // Fetch updated document
    const updatedDoc = await getDoc(forumRef);
    const updatedData = updatedDoc.data();

    return NextResponse.json({
      success: true,
      data: {
        id: updatedDoc.id,
        ...updatedData,
        created_at: updatedData?.created_at?.toDate?.()?.toISOString() || updatedData?.created_at,
        updated_at: updatedData?.updated_at?.toDate?.()?.toISOString() || updatedData?.updated_at,
      },
      message: 'Forum updated successfully',
    });
  } catch (error) {
    console.error('Error updating forum:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update forum',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/forums/[id]
 * Archive a forum (soft delete by setting status to 'archived')
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const searchParams = request.nextUrl.searchParams;
    const hardDelete = searchParams.get('hard') === 'true';

    const forumRef = doc(db, 'forums', id);

    // Check if forum exists
    const forumDoc = await getDoc(forumRef);
    if (!forumDoc.exists()) {
      return NextResponse.json(
        {
          success: false,
          error: 'Forum not found',
        },
        { status: 404 }
      );
    }

    if (hardDelete) {
      // Hard delete - permanently remove the document
      await deleteDoc(forumRef);
      return NextResponse.json({
        success: true,
        message: 'Forum permanently deleted',
      });
    } else {
      // Soft delete - archive the forum
      await updateDoc(forumRef, {
        status: 'archived',
        updated_at: Timestamp.now(),
      });

      return NextResponse.json({
        success: true,
        message: 'Forum archived successfully',
      });
    }
  } catch (error) {
    console.error('Error deleting forum:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete forum',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
