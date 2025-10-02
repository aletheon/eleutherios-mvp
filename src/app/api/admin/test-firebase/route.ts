// src/app/api/admin/test-firebase/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('Testing Firebase connection...');
    
    // Check environment variables
    const firebaseUrl = process.env.FIREBASE_DATABASE_URL;
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    
    if (!firebaseUrl) {
      return NextResponse.json({
        success: false,
        error: 'FIREBASE_DATABASE_URL environment variable is not set'
      });
    }
    
    if (!projectId) {
      return NextResponse.json({
        success: false,
        error: 'NEXT_PUBLIC_FIREBASE_PROJECT_ID environment variable is not set'
      });
    }
    
    console.log('Firebase URL:', firebaseUrl);
    console.log('Project ID:', projectId);
    
    // Test Realtime Database connection
    const testUrl = `${firebaseUrl}/.json`;
    console.log('Testing Realtime Database URL:', testUrl);
    
    const response = await fetch(testUrl);
    console.log('Realtime Database response status:', response.status);
    
    const responseText = await response.text();
    
    if (!response.ok) {
      return NextResponse.json({
        success: false,
        error: `Realtime Database request failed: ${response.status} ${response.statusText}`,
        responseText,
        url: testUrl
      });
    }
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      return NextResponse.json({
        success: false,
        error: 'Failed to parse Realtime Database JSON response',
        parseError: parseError instanceof Error ? parseError.message : 'Unknown parse error',
        responseText: responseText.substring(0, 500)
      });
    }
    
    // Test users endpoint specifically in Realtime Database
    const usersUrl = `${firebaseUrl}/users.json`;
    const usersResponse = await fetch(usersUrl);
    const usersText = await usersResponse.text();
    
    let usersData;
    try {
      usersData = JSON.parse(usersText);
    } catch (parseError) {
      usersData = null;
    }
    
    // Test Firestore connection (where users actually are)
    console.log('Testing Firestore connection...');
    const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/users`;
    console.log('Firestore URL:', firestoreUrl);
    
    const firestoreResponse = await fetch(firestoreUrl);
    console.log('Firestore response status:', firestoreResponse.status);
    
    const firestoreText = await firestoreResponse.text();
    console.log('Firestore raw response:', firestoreText.substring(0, 200));
    
    let firestoreData;
    let firestoreError = null;
    try {
      firestoreData = JSON.parse(firestoreText);
    } catch (parseError) {
      firestoreError = parseError instanceof Error ? parseError.message : 'Unknown parse error';
      firestoreData = null;
    }
    
    return NextResponse.json({
      success: true,
      realtimeDatabase: {
        url: firebaseUrl,
        testUrl,
        responseStatus: response.status,
        rootData: data,
        usersData: usersData,
        hasUsers: !!usersData
      },
      firestore: {
        url: firestoreUrl,
        projectId,
        responseStatus: firestoreResponse.status,
        responseText: firestoreText.substring(0, 500),
        parsedData: firestoreData,
        parseError: firestoreError,
        userCount: firestoreData?.documents?.length || 0,
        hasUsers: !!(firestoreData?.documents?.length),
        isPermissionError: firestoreResponse.status === 401 || firestoreResponse.status === 403
      },
      conclusion: {
        realtimeHasUsers: !!usersData,
        firestoreHasUsers: !!(firestoreData?.documents?.length),
        recommendedApproach: !!(firestoreData?.documents?.length) 
          ? 'Use Firestore migration' 
          : firestoreResponse.status === 401 || firestoreResponse.status === 403
            ? 'Firestore permission error - need authentication'
            : 'Check Firestore permissions or add test data'
      },
      message: 'Complete Firebase connection test'
    });
    
  } catch (error) {
    console.error('Test failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
  }
}