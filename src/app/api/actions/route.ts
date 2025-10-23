import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, where, orderBy, limit, Timestamp } from 'firebase/firestore';

/**
 * GET /api/actions
 * List actions with optional filtering
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const executedBy = searchParams.get('executedBy');
    const policyId = searchParams.get('policyId');
    const limitCount = parseInt(searchParams.get('limit') || '100');

    const actionsRef = collection(db, 'actions');

    // Build query constraints
    const constraints = [];
    if (type) {
      constraints.push(where('type', '==', type));
    }
    if (status) {
      constraints.push(where('status', '==', status));
    }
    if (executedBy) {
      constraints.push(where('executedBy', '==', executedBy));
    }
    if (policyId) {
      constraints.push(where('policyId', '==', policyId));
    }

    // Add ordering and limit
    constraints.push(orderBy('createdAt', 'desc'));
    constraints.push(limit(limitCount));

    const actionsQuery = query(actionsRef, ...constraints);
    const snapshot = await getDocs(actionsQuery);

    const actions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt,
      startedAt: doc.data().startedAt?.toDate?.()?.toISOString() || doc.data().startedAt,
      completedAt: doc.data().completedAt?.toDate?.()?.toISOString() || doc.data().completedAt,
    }));

    return NextResponse.json({
      success: true,
      data: actions,
      count: actions.length,
    });
  } catch (error) {
    console.error('Error fetching actions:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch actions',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/actions
 * Execute an action
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      type,
      parameters,
      executedBy,
      policyId,
      forumId,
      serviceId,
    } = body;

    // Validate required fields
    if (!type || !executedBy) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
          details: 'type and executedBy are required',
        },
        { status: 400 }
      );
    }

    // Validate action type
    const validTypes = [
      'create_forum',
      'create_policy',
      'activate_service',
      'add_stakeholder',
      'send_notification',
      'process_payment',
      'update_cert_score',
      'approve_request',
      'deny_request',
    ];

    if (!validTypes.includes(type)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid action type',
          details: `type must be one of: ${validTypes.join(', ')}`,
        },
        { status: 400 }
      );
    }

    // Create action document
    const actionData = {
      type,
      parameters: parameters || {},
      executedBy,
      policyId: policyId || null,
      forumId: forumId || null,
      serviceId: serviceId || null,
      status: 'pending',
      result: null,
      error: null,
      createdAt: Timestamp.now(),
      startedAt: null,
      completedAt: null,
      retryCount: 0,
      maxRetries: 3,
    };

    const actionsRef = collection(db, 'actions');
    const docRef = await addDoc(actionsRef, actionData);

    // Execute action asynchronously (in a real implementation, this would be a background job)
    // For now, we'll just return the pending action
    // TODO: Implement action execution logic

    return NextResponse.json(
      {
        success: true,
        data: {
          id: docRef.id,
          ...actionData,
          createdAt: actionData.createdAt.toDate().toISOString(),
        },
        message: 'Action queued for execution',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating action:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create action',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
