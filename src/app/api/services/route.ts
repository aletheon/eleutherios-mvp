import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, where, orderBy, Timestamp } from 'firebase/firestore';
import type { Service } from '@/types/types';

/**
 * GET /api/services
 * List all services with optional filtering
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type');
    const visibility = searchParams.get('visibility');
    const providerId = searchParams.get('providerId');

    const servicesRef = collection(db, 'services');
    let servicesQuery = query(servicesRef, orderBy('createdAt', 'desc'));

    // Apply filters
    const constraints = [];
    if (type) {
      constraints.push(where('type', '==', type));
    }
    if (visibility) {
      constraints.push(where('visibility', '==', visibility));
    }
    if (providerId) {
      constraints.push(where('provider.userId', '==', providerId));
    }

    if (constraints.length > 0) {
      servicesQuery = query(servicesRef, ...constraints, orderBy('createdAt', 'desc'));
    }

    const snapshot = await getDocs(servicesQuery);
    const services = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt,
      updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || doc.data().updatedAt,
    }));

    return NextResponse.json({
      success: true,
      data: services,
      count: services.length,
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch services',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/services
 * Create/register a new service
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      type,
      visibility,
      visibilityConfig,
      pricing,
      provider,
      attributes,
      governanceRules,
      complianceRequirements,
    } = body;

    // Validate required fields
    if (!title || !type || !provider) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
          details: 'title, type, and provider are required',
        },
        { status: 400 }
      );
    }

    // Validate type
    const validTypes = ['human', 'ai', 'api', 'product'];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid service type',
          details: `type must be one of: ${validTypes.join(', ')}`,
        },
        { status: 400 }
      );
    }

    // Initialize CERT score for new service
    const certScore = {
      cooperation: 50,
      engagement: 50,
      retention: 50,
      trust: 50,
      total: 50,
      lastUpdated: new Date().toISOString(),
    };

    // Create service document
    const serviceData: Omit<Service, 'id'> = {
      title,
      description: description || '',
      type,
      visibility: visibility || 'public',
      visibilityConfig: visibilityConfig || {
        searchableBy: ['*'],
        viewableBy: ['*'],
        orderableBy: ['*'],
      },
      pricing: pricing || {
        basePrice: 0,
        currency: 'USD',
        billingModel: 'free',
      },
      provider: {
        userId: provider.userId,
        name: provider.name,
        licenseNumber: provider.licenseNumber,
        verified: provider.verified || false,
      },
      attributes: attributes || {},
      governanceRules: governanceRules || [],
      complianceRequirements: complianceRequirements || {},
      certScore,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const servicesRef = collection(db, 'services');
    const docRef = await addDoc(servicesRef, {
      ...serviceData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          id: docRef.id,
          ...serviceData,
        },
        message: 'Service created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create service',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
