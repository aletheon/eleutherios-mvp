import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, orderBy, Timestamp, limit } from 'firebase/firestore';

/**
 * GET /api/forums/[id]/messages
 * List all messages in a forum
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const searchParams = request.nextUrl.searchParams;
    const limitCount = parseInt(searchParams.get('limit') || '100');

    const messagesRef = collection(db, 'forums', id, 'messages');
    const messagesQuery = query(
      messagesRef,
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );

    const snapshot = await getDocs(messagesQuery);
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate?.()?.toISOString() || doc.data().timestamp,
    }));

    return NextResponse.json({
      success: true,
      data: messages.reverse(), // Return in chronological order
      count: messages.length,
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch messages',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/forums/[id]/messages
 * Add a message to a forum
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { userId, userName, content, type } = body;

    // Validate required fields
    if (!userId || !userName || !content) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
          details: 'userId, userName, and content are required',
        },
        { status: 400 }
      );
    }

    // Create message document
    const messageData = {
      userId,
      userName,
      content,
      type: type || 'message', // 'message', 'system', 'action', etc.
      timestamp: Timestamp.now(),
      edited: false,
    };

    const messagesRef = collection(db, 'forums', id, 'messages');
    const docRef = await addDoc(messagesRef, messageData);

    return NextResponse.json(
      {
        success: true,
        data: {
          id: docRef.id,
          ...messageData,
          timestamp: messageData.timestamp.toDate().toISOString(),
        },
        message: 'Message added successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding message:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to add message',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
