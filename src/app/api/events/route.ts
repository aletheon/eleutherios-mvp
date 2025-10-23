import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, where, orderBy, limit, Timestamp } from 'firebase/firestore';

/**
 * GET /api/events
 * Query governance events with filtering
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type');
    const forumId = searchParams.get('forumId');
    const policyId = searchParams.get('policyId');
    const triggeredBy = searchParams.get('triggeredBy');
    const limitCount = parseInt(searchParams.get('limit') || '100');

    const eventsRef = collection(db, 'governance_events');

    // Build query constraints
    const constraints = [];
    if (type) {
      constraints.push(where('type', '==', type));
    }
    if (forumId) {
      constraints.push(where('forumId', '==', forumId));
    }
    if (policyId) {
      constraints.push(where('policyId', '==', policyId));
    }
    if (triggeredBy) {
      constraints.push(where('triggeredBy', '==', triggeredBy));
    }

    // Add ordering and limit
    constraints.push(orderBy('timestamp', 'desc'));
    constraints.push(limit(limitCount));

    const eventsQuery = query(eventsRef, ...constraints);
    const snapshot = await getDocs(eventsQuery);

    const events = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate?.()?.toISOString() || doc.data().timestamp,
    }));

    return NextResponse.json({
      success: true,
      data: events,
      count: events.length,
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch events',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/events
 * Create a new governance event
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      type,
      forumId,
      policyId,
      triggeredBy,
      details,
      ipAddress,
      userAgent,
    } = body;

    // Validate required fields
    if (!type || !triggeredBy) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
          details: 'type and triggeredBy are required',
        },
        { status: 400 }
      );
    }

    // Validate event type
    const validTypes = [
      'sub_policy_created',
      'service_activated',
      'forum_expanded',
      'stakeholder_added',
      'policy_executed',
      'forum_created',
      'service_registered',
      'user_created',
      'user_updated',
      'payment_processed',
      'cart_checkout',
      'action_executed',
    ];

    if (!validTypes.includes(type)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid event type',
          details: `type must be one of: ${validTypes.join(', ')}`,
        },
        { status: 400 }
      );
    }

    // Create event document
    const eventData = {
      type,
      forumId: forumId || null,
      policyId: policyId || null,
      triggeredBy,
      timestamp: Timestamp.now(),
      details: details || {},
      ipAddress: ipAddress || null,
      userAgent: userAgent || null,
    };

    const eventsRef = collection(db, 'governance_events');
    const docRef = await addDoc(eventsRef, eventData);

    return NextResponse.json(
      {
        success: true,
        data: {
          id: docRef.id,
          ...eventData,
          timestamp: eventData.timestamp.toDate().toISOString(),
        },
        message: 'Event created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create event',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
