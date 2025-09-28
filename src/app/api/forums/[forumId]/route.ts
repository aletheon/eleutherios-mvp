// src/app/api/forums/[forumId]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { database } from '@/app/firebase-admin';

export async function GET(
  request: NextRequest,
  { params }: { params: { forumId: string } }
) {
  try {
    const forumRef = database.ref(`forums/${params.forumId}`);
    const snapshot = await forumRef.once('value');
    const forum = snapshot.val();
    
    if (!forum) {
      return NextResponse.json(
        { error: 'Forum not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      id: params.forumId,
      ...forum 
    });
  } catch (error) {
    console.error('Error fetching forum:', error);
    return NextResponse.json(
      { error: 'Failed to fetch forum' },
      { status: 500 }
    );
  }
}

// PATCH update forum
export async function PATCH(
  request: NextRequest,
  { params }: { params: { forumId: string } }
) {
  try {
    const body = await request.json();
    const updates = {
      ...body,
      'metadata/updatedAt': new Date().toISOString()
    };
    
    const forumRef = database.ref(`forums/${params.forumId}`);
    await forumRef.update(updates);
    
    return NextResponse.json({ 
      success: true,
      forumId: params.forumId 
    });
  } catch (error) {
    console.error('Error updating forum:', error);
    return NextResponse.json(
      { error: 'Failed to update forum' },
      { status: 500 }
    );
  }
}