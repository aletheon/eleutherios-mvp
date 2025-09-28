// src/app/api/policies/instantiate/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { database } from '@/app/firebase-admin';

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
    const policyRef = database.ref(`policies/${policyId}`);
    const policySnapshot = await policyRef.once('value');
    const policy = policySnapshot.val();
    
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
    const forumsRef = database.ref('forums');
    const newForumRef = forumsRef.push();
    await newForumRef.set(forumData);
    
    // Add forum reference to the policy rule
    await database.ref(`policies/${policyId}/rules/${policy.rules.indexOf(rule)}`).update({
      instantiatedForumId: newForumRef.key,
      instantiatedAt: new Date().toISOString()
    });
    
    // Add to user's activities
    const userActivitiesRef = database.ref(`users/${userId}/activities/forums`);
    await userActivitiesRef.push({
      forumId: newForumRef.key,
      role: 'owner',
      joinedAt: new Date().toISOString(),
      fromPolicy: policyId
    });
    
    return NextResponse.json({
      success: true,
      forumId: newForumRef.key,
      forum: {
        id: newForumRef.key,
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