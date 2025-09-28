// src/app/api/forums/[forumId]/messages/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { database } from '@/app/firebase-admin';
import { ForumMessage } from '@/app/types/forum';

// GET all messages for a forum
export async function GET(
  request: NextRequest,
  { params }: { params: { forumId: string } }
) {
  try {
    const messagesRef = database.ref(`messages/${params.forumId}`);
    const snapshot = await messagesRef.once('value');
    const messages = snapshot.val() || {};
    
    const messagesArray = Object.entries(messages)
      .map(([id, data]) => ({
        id,
        ...(data as Omit<ForumMessage, 'id'>)
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
    
    // First check if user has permission to post
    const forumRef = database.ref(`forums/${params.forumId}`);
    const forumSnapshot = await forumRef.once('value');
    const forum = forumSnapshot.val();
    
    if (!forum) {
      return NextResponse.json(
        { error: 'Forum not found' },
        { status: 404 }
      );
    }
    
    const stakeholder = forum.stakeholders?.find((s: any) => s.userId === authorId);
    
    if (!forum.settings.isPublic && !stakeholder) {
      return NextResponse.json(
        { error: 'You are not a member of this forum' },
        { status: 403 }
      );
    }
    
    if (stakeholder && !stakeholder.permissions.canPost) {
      return NextResponse.json(
        { error: 'You do not have permission to post in this forum' },
        { status: 403 }
      );
    }
    
    // Create the message
    const message: Omit<ForumMessage, 'id'> = {
      forumId: params.forumId,
      authorId,
      authorName,
      content,
      createdAt: new Date(),
      replyTo,
      attachments: attachments || []
    };
    
    // Save message
    const messagesRef = database.ref(`messages/${params.forumId}`);
    const newMessageRef = messagesRef.push();
    await newMessageRef.set(message);
    
    // Update forum metadata
    await forumRef.update({
      'metadata/messageCount': (forum.metadata?.messageCount || 0) + 1,
      'metadata/lastActivityAt': new Date().toISOString(),
      'metadata/updatedAt': new Date().toISOString()
    });
    
    return NextResponse.json({ 
      id: newMessageRef.key,
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