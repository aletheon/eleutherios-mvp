import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, where, orderBy, Timestamp } from 'firebase/firestore';
import type { Forum } from '@/types/types';

/**
 * GET /api/forums
 * List all forums with optional filtering
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const policyId = searchParams.get('policyId');
    const status = searchParams.get('status');
    const createdBy = searchParams.get('createdBy');

    const forumsRef = collection(db, 'forums');
    let forumsQuery = query(forumsRef, orderBy('created_at', 'desc'));

    // Apply filters
    const constraints = [];
    if (policyId) {
      constraints.push(where('policyId', '==', policyId));
    }
    if (status) {
      constraints.push(where('status', '==', status));
    }
    if (createdBy) {
      constraints.push(where('created_by', '==', createdBy));
    }

    if (constraints.length > 0) {
      forumsQuery = query(forumsRef, ...constraints, orderBy('created_at', 'desc'));
    }

    const snapshot = await getDocs(forumsQuery);
    const forums = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      created_at: doc.data().created_at?.toDate?.()?.toISOString() || doc.data().created_at,
      updated_at: doc.data().updated_at?.toDate?.()?.toISOString() || doc.data().updated_at,
    }));

    return NextResponse.json({
      success: true,
      data: forums,
      count: forums.length,
    });
  } catch (error) {
    console.error('Error fetching forums:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch forums',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/forums
 * Create a new forum
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, policyId, participants, permissions, created_by, connectedPolicies } = body;

    // Validate required fields
    if (!name || !policyId || !created_by) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
          details: 'name, policyId, and created_by are required',
        },
        { status: 400 }
      );
    }

    // Create forum document
    const forumData: Omit<Forum, 'id'> = {
      name,
      description: description || '',
      policyId,
      connectedPolicies: connectedPolicies || [],
      participants: participants || [],
      permissions: permissions || {},
      serviceStatus: [],
      status: 'active',
      created_by,
      created_at: Timestamp.now(),
      updated_at: Timestamp.now(),
    };

    const forumsRef = collection(db, 'forums');
    const docRef = await addDoc(forumsRef, forumData);

    return NextResponse.json(
      {
        success: true,
        data: {
          id: docRef.id,
          ...forumData,
          created_at: forumData.created_at.toDate().toISOString(),
          updated_at: forumData.updated_at.toDate().toISOString(),
        },
        message: 'Forum created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating forum:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create forum',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
