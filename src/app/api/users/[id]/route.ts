import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';

/**
 * GET /api/users/[id]
 * Get a specific user by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const userRef = doc(db, 'users', id);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      return NextResponse.json(
        {
          success: false,
          error: 'User not found',
        },
        { status: 404 }
      );
    }

    const userData = userDoc.data();
    return NextResponse.json({
      success: true,
      data: {
        id: userDoc.id,
        ...userData,
        createdAt: userData.createdAt?.toDate?.()?.toISOString() || userData.createdAt,
        updatedAt: userData.updatedAt?.toDate?.()?.toISOString() || userData.updatedAt,
      },
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch user',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/users/[id]
 * Update a user's profile
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    // Remove fields that shouldn't be updated directly
    const { id: _, createdAt, certScore, ...updateData } = body;

    // Add updated timestamp
    updateData.updatedAt = Timestamp.now();

    // Handle CERT score updates separately with validation
    if (certScore) {
      const validatedCertScore: any = {
        lastUpdated: new Date().toISOString(),
      };

      // Validate and clamp CERT score values (0-100)
      if (typeof certScore.cooperation === 'number') {
        validatedCertScore.cooperation = Math.max(0, Math.min(100, certScore.cooperation));
      }
      if (typeof certScore.engagement === 'number') {
        validatedCertScore.engagement = Math.max(0, Math.min(100, certScore.engagement));
      }
      if (typeof certScore.retention === 'number') {
        validatedCertScore.retention = Math.max(0, Math.min(100, certScore.retention));
      }
      if (typeof certScore.trust === 'number') {
        validatedCertScore.trust = Math.max(0, Math.min(100, certScore.trust));
      }

      // Calculate total
      const scores = [
        validatedCertScore.cooperation,
        validatedCertScore.engagement,
        validatedCertScore.retention,
        validatedCertScore.trust,
      ].filter((s) => typeof s === 'number');

      if (scores.length > 0) {
        validatedCertScore.total = scores.reduce((a, b) => a + b, 0) / scores.length;
      }

      updateData.certScore = validatedCertScore;
    }

    const userRef = doc(db, 'users', id);

    // Check if user exists
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) {
      return NextResponse.json(
        {
          success: false,
          error: 'User not found',
        },
        { status: 404 }
      );
    }

    // Update user
    await updateDoc(userRef, updateData);

    // Fetch updated document
    const updatedDoc = await getDoc(userRef);
    const updatedData = updatedDoc.data();

    // Create governance event for user update
    const { addDoc, collection } = await import('firebase/firestore');
    await addDoc(collection(db, 'governance_events'), {
      type: 'user_updated',
      triggeredBy: id,
      timestamp: Timestamp.now(),
      details: {
        userId: id,
        updatedFields: Object.keys(updateData).filter(k => k !== 'updatedAt'),
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: updatedDoc.id,
        ...updatedData,
        createdAt: updatedData?.createdAt?.toDate?.()?.toISOString() || updatedData?.createdAt,
        updatedAt: updatedData?.updatedAt?.toDate?.()?.toISOString() || updatedData?.updatedAt,
      },
      message: 'User updated successfully',
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update user',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
