// src/app/api/forums/[forumId]/members/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { database } from '@/app/firebase-admin';
import { ForumStakeholder } from '@/app/types/forum';

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
    
    // Check if requester has permission to add members
    const forumRef = database.ref(`forums/${params.forumId}`);
    const snapshot = await forumRef.once('value');
    const forum = snapshot.val();
    
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
    const newStakeholder: ForumStakeholder = {
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
      joinedAt: new Date()
    };
    
    // Add stakeholder to forum
    const stakeholders = [...(forum.stakeholders || []), newStakeholder];
    await forumRef.update({ 
      stakeholders,
      'metadata/updatedAt': new Date().toISOString()
    });
    
    // Add forum to user's activities
    const userActivitiesRef = database.ref(`users/${userId}/activities/forums`);
    await userActivitiesRef.push({
      forumId: params.forumId,
      role,
      joinedAt: new Date().toISOString()
    });
    
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