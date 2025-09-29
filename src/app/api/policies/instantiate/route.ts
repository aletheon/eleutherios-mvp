// src/app/api/policies/instantiate/route.ts

import { NextRequest, NextResponse } from 'next/server';

const FIREBASE_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'eleutherios-mvp-3c717';
const DATABASE_URL = `https://${FIREBASE_PROJECT_ID}.firebaseio.com`;

// POST - Instantiate a policy rule into a forum
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { policyId, ruleName, userId } = body;
    
    if (!policyId || !ruleName || !userId) {
      return NextResponse.json(
        { error: 'policyId, ruleName, and userId are required' },
        { status: 400 }
      );
    }
    
    // Fetch the policy
    const policyResponse = await fetch(
      `${DATABASE_URL}/policies/${policyId}.json`,
      { method: 'GET' }
    );
    
    if (!policyResponse.ok) {
      return NextResponse.json(
        { error: 'Policy not found' },
        { status: 404 }
      );
    }
    
    const policy = await policyResponse.json();
    
    if (!policy) {
      return NextResponse.json(
        { error: 'Policy not found' },
        { status: 404 }
      );
    }
    
    // Find the rule
    const rule = policy.rules?.find((r: any) => r.name === ruleName);
    
    if (!rule) {
      return NextResponse.json(
        { error: 'Rule not found in policy' },
        { status: 404 }
      );
    }
    
    // Check if rule type is Forum
    if (rule.type !== 'Forum') {
      return NextResponse.json(
        { error: 'This rule does not instantiate a forum' },
        { status: 400 }
      );
    }
    
    // Create the forum based on the rule
    const forumData = {
      name: rule.target || `${policy.name} - ${ruleName}`,
      description: rule.description || `Forum instantiated from ${policy.name} policy`,
      policyId: policyId,
      policyRuleName: ruleName,
      stakeholders: [{
        userId: userId,
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
      }],
      settings: {
        isPublic: policy.visibility === 'public',
        requiresApproval: policy.visibility !== 'public',
        allowFileUploads: true,
        maxFileSize: 10,
        allowedFileTypes: ['pdf', 'doc', 'docx', 'txt', 'jpg', 'png']
      },
      metadata: {
        createdBy: userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messageCount: 0,
        fileCount: 0
      },
      status: 'active'
    };
    
    // Save the forum
    const forumResponse = await fetch(
      `${DATABASE_URL}/forums.json`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(forumData)
      }
    );
    
    if (!forumResponse.ok) {
      throw new Error('Failed to create forum');
    }
    
    const forumResult = await forumResponse.json();
    const newForumId = forumResult.name;
    
    // Update the policy rule with the instantiated forum ID
    const ruleIndex = policy.rules.indexOf(rule);
    await fetch(
      `${DATABASE_URL}/policies/${policyId}/rules/${ruleIndex}.json`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instantiatedForumId: newForumId,
          instantiatedAt: new Date().toISOString()
        })
      }
    );
    
    // Add to user's activities
    await fetch(
      `${DATABASE_URL}/users/${userId}/activities/forums.json`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          forumId: newForumId,
          role: 'owner',
          joinedAt: new Date().toISOString(),
          fromPolicy: policyId
        })
      }
    );
    
    return NextResponse.json({
      success: true,
      forumId: newForumId,
      forum: {
        id: newForumId,
        ...forumData
      }
    });
    
  } catch (error) {
    console.error('Error instantiating policy rule:', error);
    return NextResponse.json(
      { error: 'Failed to instantiate policy rule' },
      { status: 500 }
    );
  }
}