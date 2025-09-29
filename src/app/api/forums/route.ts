// src/app/api/forums/[forumId]/route.ts

import { NextRequest, NextResponse } from 'next/server';

const FIREBASE_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'eleutherios-mvp-3c717';
const DATABASE_URL = `https://${FIREBASE_PROJECT_ID}.firebaseio.com`;

export async function GET(
  request: NextRequest,
  { params }: { params: { forumId: string } }
) {
  try {
    const response = await fetch(
      `${DATABASE_URL}/forums/${params.forumId}.json`,
      { method: 'GET' }
    );
    
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Forum not found' },
        { status: 404 }
      );
    }
    
    const forum = await response.json();
    
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
    
    const response = await fetch(
      `${DATABASE_URL}/forums/${params.forumId}.json`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to update forum');
    }
    
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