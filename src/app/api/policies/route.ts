import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, where, orderBy, Timestamp } from 'firebase/firestore';
import type { Policy } from '@/types/types';

/**
 * GET /api/policies
 * List all policies with optional filtering
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const createdBy = searchParams.get('createdBy');
    const parentPolicyId = searchParams.get('parentPolicyId');
    const parentForumId = searchParams.get('parentForumId');

    const policiesRef = collection(db, 'policies');
    let policiesQuery = query(policiesRef, orderBy('created_at', 'desc'));

    // Apply filters
    const constraints = [];
    if (status) {
      constraints.push(where('status', '==', status));
    }
    if (createdBy) {
      constraints.push(where('created_by', '==', createdBy));
    }
    if (parentPolicyId) {
      constraints.push(where('parent_policy_id', '==', parentPolicyId));
    }
    if (parentForumId) {
      constraints.push(where('parent_forum_id', '==', parentForumId));
    }

    if (constraints.length > 0) {
      policiesQuery = query(policiesRef, ...constraints, orderBy('created_at', 'desc'));
    }

    const snapshot = await getDocs(policiesQuery);
    const policies = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      created_at: doc.data().created_at?.toDate?.()?.toISOString() || doc.data().created_at,
      last_executed: doc.data().last_executed?.toDate?.()?.toISOString() || doc.data().last_executed,
    }));

    return NextResponse.json({
      success: true,
      data: policies,
      count: policies.length,
    });
  } catch (error) {
    console.error('Error fetching policies:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch policies',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/policies
 * Create a new policy
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      description,
      rules,
      stakeholders,
      permissions,
      created_by,
      parent_policy_id,
      parent_forum_id,
      status,
    } = body;

    // Validate required fields
    if (!name || !rules || !created_by) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
          details: 'name, rules, and created_by are required',
        },
        { status: 400 }
      );
    }

    // Validate rules is an array
    if (!Array.isArray(rules)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid rules format',
          details: 'rules must be an array of strings',
        },
        { status: 400 }
      );
    }

    // Create policy document
    const policyData: Omit<Policy, 'id'> = {
      name,
      description: description || '',
      parent_policy_id: parent_policy_id || undefined,
      parent_forum_id: parent_forum_id || undefined,
      child_policy_ids: [],
      rules,
      stakeholders: stakeholders || [],
      permissions: permissions || {},
      created_by,
      created_at: Timestamp.now(),
      status: status || 'draft',
      execution_history: [],
    };

    const policiesRef = collection(db, 'policies');
    const docRef = await addDoc(policiesRef, policyData);

    return NextResponse.json(
      {
        success: true,
        data: {
          id: docRef.id,
          ...policyData,
          created_at: policyData.created_at.toDate().toISOString(),
        },
        message: 'Policy created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating policy:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create policy',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
