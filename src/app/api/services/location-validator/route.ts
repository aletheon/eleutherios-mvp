// app/api/services/location-validator/route.ts

import { NextRequest, NextResponse } from 'next/server';

interface LocationPoint {
  lat: number;
  lng: number;
}

interface LocationValidatorRequest {
  customerLocation: LocationPoint;
  serviceLocation?: LocationPoint;
  maxDistance?: number;
  unit?: 'km' | 'miles';
}

interface LocationValidatorResponse {
  success: boolean;
  data?: {
    distance: number;
    maxDistance: number;
    withinRange: boolean;
    unit: string;
    customerLocation: LocationPoint;
    serviceLocation: LocationPoint;
  };
  message: string;
  error?: string;
}

const DEFAULT_SERVICE_LOCATION: LocationPoint = {
  lat: -41.2865,
  lng: 174.7762
};

export async function POST(request: NextRequest): Promise<NextResponse<LocationValidatorResponse>> {
  try {
    const body: LocationValidatorRequest = await request.json();
    const { 
      customerLocation, 
      serviceLocation = DEFAULT_SERVICE_LOCATION,
      maxDistance = 10,
      unit = 'km'
    } = body;

    if (!customerLocation || !customerLocation.lat || !customerLocation.lng) {
      return NextResponse.json({
        success: false,
        message: 'Missing or invalid customer location',
        error: 'customerLocation must include lat and lng coordinates'
      }, { status: 400 });
    }

    if (customerLocation.lat < -90 || customerLocation.lat > 90) {
      return NextResponse.json({
        success: false,
        message: 'Invalid latitude',
        error: 'Latitude must be between -90 and 90'
      }, { status: 400 });
    }

    if (customerLocation.lng < -180 || customerLocation.lng > 180) {
      return NextResponse.json({
        success: false,
        message: 'Invalid longitude',
        error: 'Longitude must be between -180 and 180'
      }, { status: 400 });
    }

    const distance = calculateDistance(customerLocation, serviceLocation, unit);
    const withinRange = distance <= maxDistance;

    console.log('Location validation:', {
      customerLocation,
      serviceLocation,
      distance,
      maxDistance,
      withinRange,
      unit
    });

    const responseData = {
      distance: Math.round(distance * 100) / 100,
      maxDistance,
      withinRange,
      unit,
      customerLocation,
      serviceLocation
    };

    if (withinRange) {
      return NextResponse.json({
        success: true,
        data: responseData,
        message: `Location valid. Customer is ${responseData.distance}${unit} away (within ${maxDistance}${unit} limit)`
      });
    } else {
      return NextResponse.json({
        success: false,
        data: responseData,
        message: `Outside delivery area. Customer is ${responseData.distance}${unit} away, maximum distance is ${maxDistance}${unit}`
      });
    }

  } catch (error) {
    console.error('Location validator error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Location validation failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    service: 'LocationValidator',
    status: 'available',
    defaultServiceLocation: DEFAULT_SERVICE_LOCATION,
    supportedUnits: ['km', 'miles'],
    description: 'Validates if customer location is within service delivery area',
    timestamp: new Date().toISOString()
  });
}

function calculateDistance(
  point1: LocationPoint, 
  point2: LocationPoint, 
  unit: 'km' | 'miles' = 'km'
): number {
  const R = unit === 'km' ? 6371 : 3959;
  
  const dLat = toRadians(point2.lat - point1.lat);
  const dLng = toRadians(point2.lng - point1.lng);
  
  const lat1Rad = toRadians(point1.lat);
  const lat2Rad = toRadians(point2.lat);
  
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLng / 2) * Math.sin(dLng / 2) * 
    Math.cos(lat1Rad) * Math.cos(lat2Rad);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  return R * c;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}