import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

/**
 * GET /api/events/[id]
 * Get a specific event by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const eventRef = doc(db, 'governance_events', id);
    const eventDoc = await getDoc(eventRef);

    if (!eventDoc.exists()) {
      return NextResponse.json(
        {
          success: false,
          error: 'Event not found',
        },
        { status: 404 }
      );
    }

    const eventData = eventDoc.data();
    return NextResponse.json({
      success: true,
      data: {
        id: eventDoc.id,
        ...eventData,
        timestamp: eventData.timestamp?.toDate?.()?.toISOString() || eventData.timestamp,
      },
    });
  } catch (error) {
    console.error('Error fetching event:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch event',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
