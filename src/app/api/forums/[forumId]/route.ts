// src/app/api/forums/[forumId]/route.ts
import { NextRequest, NextResponse } from 'next/server';

const FIREBASE_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const FIREBASE_API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const DATABASE_URL = `https://${FIREBASE_PROJECT_ID}-default-rtdb.firebaseio.com`;

export async function GET(
  request: NextRequest,
  { params }: { params: { forumId: string } }
) {
  try {
    const { forumId } = params;

    const response = await fetch(
      `${DATABASE_URL}/forums/${forumId}.json?auth=${FIREBASE_API_KEY}`
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
      id: forumId,
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

export async function PATCH(
  request: NextRequest,
  { params }: { params: { forumId: string } }
) {
  try {
    const { forumId } = params;
    const body = await request.json();

    const updateData = {
      ...body,
      updatedAt: new Date().toISOString(),
    };

    const response = await fetch(
      `${DATABASE_URL}/forums/${forumId}.json?auth=${FIREBASE_API_KEY}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to update forum' },
        { status: response.status }
      );
    }

    const updatedForum = await response.json();

    return NextResponse.json({
      id: forumId,
      ...updatedForum
    });
  } catch (error) {
    console.error('Error updating forum:', error);
    return NextResponse.json(
      { error: 'Failed to update forum' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { forumId: string } }
) {
  try {
    const { forumId } = params;

    const response = await fetch(
      `${DATABASE_URL}/forums/${forumId}.json?auth=${FIREBASE_API_KEY}`,
      {
        method: 'DELETE',
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to delete forum' },
        { status: response.status }
      );
    }

    return NextResponse.json(
      { message: 'Forum deleted successfully', forumId },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting forum:', error);
    return NextResponse.json(
      { error: 'Failed to delete forum' },
      { status: 500 }
    );
  }
}