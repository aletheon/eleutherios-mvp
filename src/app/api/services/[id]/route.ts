import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';

/**
 * GET /api/services/[id]
 * Get a specific service by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const serviceRef = doc(db, 'services', id);
    const serviceDoc = await getDoc(serviceRef);

    if (!serviceDoc.exists()) {
      return NextResponse.json(
        {
          success: false,
          error: 'Service not found',
        },
        { status: 404 }
      );
    }

    const serviceData = serviceDoc.data();
    return NextResponse.json({
      success: true,
      data: {
        id: serviceDoc.id,
        ...serviceData,
        createdAt: serviceData.createdAt?.toDate?.()?.toISOString() || serviceData.createdAt,
        updatedAt: serviceData.updatedAt?.toDate?.()?.toISOString() || serviceData.updatedAt,
      },
    });
  } catch (error) {
    console.error('Error fetching service:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch service',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/services/[id]
 * Update a service
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    // Remove fields that shouldn't be updated
    const { createdAt, id: _, ...updateData } = body;

    // Add updated timestamp
    updateData.updatedAt = Timestamp.now();

    const serviceRef = doc(db, 'services', id);

    // Check if service exists
    const serviceDoc = await getDoc(serviceRef);
    if (!serviceDoc.exists()) {
      return NextResponse.json(
        {
          success: false,
          error: 'Service not found',
        },
        { status: 404 }
      );
    }

    await updateDoc(serviceRef, updateData);

    // Fetch updated document
    const updatedDoc = await getDoc(serviceRef);
    const updatedData = updatedDoc.data();

    return NextResponse.json({
      success: true,
      data: {
        id: updatedDoc.id,
        ...updatedData,
        createdAt: updatedData?.createdAt?.toDate?.()?.toISOString() || updatedData?.createdAt,
        updatedAt: updatedData?.updatedAt?.toDate?.()?.toISOString() || updatedData?.updatedAt,
      },
      message: 'Service updated successfully',
    });
  } catch (error) {
    console.error('Error updating service:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update service',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/services/[id]
 * Delete a service
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const serviceRef = doc(db, 'services', id);

    // Check if service exists
    const serviceDoc = await getDoc(serviceRef);
    if (!serviceDoc.exists()) {
      return NextResponse.json(
        {
          success: false,
          error: 'Service not found',
        },
        { status: 404 }
      );
    }

    // Delete the service
    await deleteDoc(serviceRef);

    return NextResponse.json({
      success: true,
      message: 'Service deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting service:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete service',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
