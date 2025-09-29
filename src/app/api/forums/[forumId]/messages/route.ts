// src/app/api/forums/[forumId]/messages/route.ts

import { NextRequest, NextResponse } from 'next/server';

const FIREBASE_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'eleutherios-mvp-3c717';
const DATABASE_URL = `https://${FIREBASE_PROJECT_ID}.firebaseio.com`;

// GET all messages for a forum
export async function GET(
  request: NextRequest,
  { params }: { params: { forumId: string } }
) {
  try {
    const response = await fetch(
      `${DATABASE_URL}/messages/${params.forumId}.json`,
      { method: 'GET' }
    );
    
    if (!response.ok) {
      return NextResponse.json({ messages: [] });
    }
    
    const messages = await response.json() || {};
    
    const messagesArray = Object.entries(messages)
      .map(([id, data]: [string, any]) => ({
        id,
        ...data
      }))
      .filter(msg => !msg.deletedAt)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    
    return NextResponse.json({ messages: messagesArray });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

// POST create a new message
export async function POST(
  request: NextRequest,
  { params }: { params: { forumId: string } }
) {
  try {
    const body = await request.json();
    const { authorId, authorName, content, replyTo, attachments } = body;
    
    if (!authorId || !authorName || !content) {
      return NextResponse.json(
        { error: 'Author and content are required' },
        { status: 400 }
      );
    }
    
    // First check if forum exists and user has permission
    const forumResponse = await fetch(
      `${DATABASE_URL}/forums/${params.forumId}.json`,
      { method: 'GET' }
    );
    
    if (!forumResponse.ok) {
      return NextResponse.json(
        { error: 'Forum not found' },
        { status: 404 }
      );
    }
    
    const forum = await forumResponse.json();
    
    if (!forum) {
      return NextResponse.json(
        { error: 'Forum not found' },
        { status: 404 }
      );
    }
    
    const stakeholder = forum.stakeholders?.find((s: any) => s.userId === authorId);
    
    if (!forum.settings?.isPublic && !stakeholder) {
      return NextResponse.json(
        { error: 'You are not a member of this forum' },
        { status: 403 }
      );
    }
    
    if (stakeholder && !stakeholder.permissions?.canPost) {
      return NextResponse.json(
        { error: 'You do not have permission to post in this forum' },
        { status: 403 }
      );
    }
    
    // Create the message
    const message = {
      forumId: params.forumId,
      authorId,
      authorName,
      content,
      createdAt: new Date().toISOString(),
      replyTo,
      attachments: attachments || []
    };
    
    // Save message
    const messageResponse = await fetch(
      `${DATABASE_URL}/messages/${params.forumId}.json`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(message)
      }
    );
    
    if (!messageResponse.ok) {
      throw new Error('Failed to create message');
    }
    
    const messageResult = await messageResponse.json();
    
    // Update forum metadata
    const currentMessageCount = forum.metadata?.messageCount || 0;
    await fetch(
      `${DATABASE_URL}/forums/${params.forumId}/metadata.json`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messageCount: currentMessageCount + 1,
          lastActivityAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
      }
    );
    
    return NextResponse.json({ 
      id: messageResult.name,
      ...message 
    });
    
  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json(
      { error: 'Failed to create message' },
      { status: 500 }
    );
  }
}