// src/app/api/forums/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { database } from '@/app/firebase-admin';
import { Forum, ForumStakeholder } from '@/app/types/forum';

// GET all forums or forums for a specific user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    const forumsRef = database.ref('forums');
    const snapshot = await forumsRef.once('value');
    const forums = snapshot.val() || {};
    
    let forumsArray = Object.entries(forums).map(([id, data]) => ({
      id,
      ...(data as Omit<Forum, 'id'>)
    }));
    
    // Filter by user if userId provided
    if (userId) {
      forumsArray = forumsArray.filter(forum => 
        forum.stakeholders?.some(s => s.userId === userId)
      );
    }
    
    // Only return active forums
    forumsArray = forumsArray.filter(forum => forum.status === 'active');
    
    return NextResponse.json({ forums: forumsArray });
  } catch (error) {
    console.error('Error fetching forums:', error);
    return NextResponse.json(
      { error: 'Failed to fetch forums' },
      { status: 500 }
    );
  }
}

// POST create a new forum
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, createdBy, policyId, policyRuleName, isPublic = false } = body;
    
    if (!name || !description || !createdBy) {
      return NextResponse.json(
        { error: 'Name, description, and createdBy are required' },
        { status: 400 }
      );
    }
    
    // Create the owner stakeholder
    const ownerStakeholder: ForumStakeholder = {
      userId: createdBy,
      role: 'owner',
      permissions: {
        canAddMembers: true,
        canRemoveMembers: true,
        canCreateSubForums: true,
        canPost: true,
        canRemoveMessages: true,
        canUploadFiles: true,
        canRemoveFiles: true
      },
      joinedAt: new Date()
    };
    
    // Create the forum
    const forum: Omit<Forum, 'id'> = {
      name,
      description,
      policyId,
      policyRuleName,
      stakeholders: [ownerStakeholder],
      settings: {
        isPublic,
        requiresApproval: !isPublic,
        allowFileUploads: true,
        maxFileSize: 10, // 10MB default
        allowedFileTypes: ['pdf', 'doc', 'docx', 'txt', 'jpg', 'png']
      },
      metadata: {
        createdBy,
        createdAt: new Date(),
        updatedAt: new Date(),
        messageCount: 0,
        fileCount: 0
      },
      status: 'active'
    };
    
    // Save to database
    const forumsRef = database.ref('forums');
    const newForumRef = forumsRef.push();
    await newForumRef.set(forum);
    
    // Also add this forum to the user's activities
    const userActivitiesRef = database.ref(`users/${createdBy}/activities/forums`);
    await userActivitiesRef.push({
      forumId: newForumRef.key,
      role: 'owner',
      joinedAt: new Date().toISOString()
    });
    
    return NextResponse.json({ 
      id: newForumRef.key,
      ...forum 
    });
    
  } catch (error) {
    console.error('Error creating forum:', error);
    return NextResponse.json(
      { error: 'Failed to create forum' },
      { status: 500 }
    );
  }
}