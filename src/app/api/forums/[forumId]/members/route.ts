// src/app/api/forums/[forumId]/members/route.ts

import { NextRequest, NextResponse } from 'next/server';

const FIREBASE_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'eleutherios-mvp-3c717';
const DATABASE_URL = `https://${FIREBASE_PROJECT_ID}.firebaseio.com`;

// POST add a member to the forum
export async function POST(
  request: NextRequest,
  { params }: { params: { forumId: string } }
) {
  try {
    const body = await request.json();
    const { userId, requesterId, role = 'member' } = body;
    
    if (!userId || !requesterId) {
      return NextResponse.json(
        { error: 'userId and requesterId are required' },
        { status: 400 }
      );
    }
    
    // Fetch the forum first
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
    
    const requesterStakeholder = forum.stakeholders?.find((s: any) => s.userId === requesterId);
    
    if (!requesterStakeholder || !requesterStakeholder.permissions.canAddMembers) {
      return NextResponse.json(
        { error: 'You do not have permission to add members' },
        { status: 403 }
      );
    }
    
    // Check if user is already a member
    if (forum.stakeholders?.some((s: any) => s.userId === userId)) {
      return NextResponse.json(
        { error: 'User is already a member' },
        { status: 400 }
      );
    }
    
    // Create new stakeholder
    const newStakeholder = {
      userId,
      role,
      permissions: {
        canAddMembers: role === 'moderator' || role === 'owner',
        canRemoveMembers: role === 'moderator' || role === 'owner',
        canCreateSubForums: role === 'owner',
        canPost: true,
        canRemoveMessages: role === 'moderator' || role === 'owner',
        canUploadFiles: true,
        canRemoveFiles: false
      },
      joinedAt: new Date().toISOString()
    };
    
    // Add stakeholder to forum
    const stakeholders = [...(forum.stakeholders || []), newStakeholder];
    
    // Update forum with new stakeholder
    const updateResponse = await fetch(
      `${DATABASE_URL}/forums/${params.forumId}.json`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stakeholders,
          'metadata/updatedAt': new Date().toISOString()
        })
      }
    );
    
    if (!updateResponse.ok) {
      throw new Error('Failed to update forum');
    }
    
    // Add forum to user's activities
    await fetch(
      `${DATABASE_URL}/users/${userId}/activities/forums.json`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          forumId: params.forumId,
          role,
          joinedAt: new Date().toISOString()
        })
      }
    );
    
    return NextResponse.json({ 
      success: true,
      stakeholder: newStakeholder 
    });
    
  } catch (error) {
    console.error('Error adding member:', error);
    return NextResponse.json(
      { error: 'Failed to add member' },
      { status: 500 }
    );
  }
}