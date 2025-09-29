// src/app/api/forums/route.ts

import { NextRequest, NextResponse } from 'next/server';

const FIREBASE_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const FIREBASE_API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const DATABASE_URL = `https://${FIREBASE_PROJECT_ID}.firebaseio.com`;

// GET all forums
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    const response = await fetch(
      `${DATABASE_URL}/forums.json`,
      { method: 'GET' }
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch forums');
    }
    
    const forums = await response.json() || {};
    
    let forumsArray = Object.entries(forums).map(([id, data]: [string, any]) => ({
      id,
      ...data
    }));
    
    // Filter by user if userId provided
    if (userId) {
      forumsArray = forumsArray.filter(forum => 
        forum.stakeholders?.some((s: any) => s.userId === userId)
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
    const ownerStakeholder = {
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
      joinedAt: new Date().toISOString()
    };
    
    // Create the forum
    const forum = {
      name,
      description,
      policyId,
      policyRuleName,
      stakeholders: [ownerStakeholder],
      settings: {
        isPublic,
        requiresApproval: !isPublic,
        allowFileUploads: true,
        maxFileSize: 10,
        allowedFileTypes: ['pdf', 'doc', 'docx', 'txt', 'jpg', 'png']
      },
      metadata: {
        createdBy,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messageCount: 0,
        fileCount: 0
      },
      status: 'active'
    };
    
    // Save to database using REST API
    const response = await fetch(
      `${DATABASE_URL}/forums.json`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(forum)
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to create forum');
    }
    
    const result = await response.json();
    
    return NextResponse.json({ 
      id: result.name,  // Firebase returns the ID as "name"
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