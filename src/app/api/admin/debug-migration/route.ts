// src/app/api/admin/debug-migration/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Debugging migration API...');
    
    // Check environment variable
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    if (!projectId) {
      return NextResponse.json({
        success: false,
        error: 'NEXT_PUBLIC_FIREBASE_PROJECT_ID not set',
        env: {
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          hasProjectId: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
        }
      });
    }
    
    console.log('Project ID found:', projectId);
    
    // Test Firestore connection
    const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/users`;
    console.log('Fetching from:', firestoreUrl);
    
    const response = await fetch(firestoreUrl);
    const responseText = await response.text();
    
    console.log('Response status:', response.status);
    console.log('Response text length:', responseText.length);
    
    if (!response.ok) {
      return NextResponse.json({
        success: false,
        error: `Firestore fetch failed: ${response.status} ${response.statusText}`,
        responseText: responseText.substring(0, 1000),
        url: firestoreUrl
      });
    }
    
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (parseError) {
      return NextResponse.json({
        success: false,
        error: 'JSON parse failed',
        parseError: parseError instanceof Error ? parseError.message : 'Unknown error',
        responseText: responseText.substring(0, 1000)
      });
    }
    
    // Analyze the data
    const documents = responseData.documents || [];
    const usersNeedingMigration = [];
    
    for (const doc of documents) {
      const userId = doc.name.split('/').pop();
      const userData = convertFirestoreFields(doc.fields || {});
      
      const issues = [];
      if (userData.displayName && !userData.name) issues.push('needs displayName→name');
      if (userData.role && ['HomelessPerson', 'CaseWorker', 'KORepresentative', 'MSDCaseWorker'].includes(userData.role)) {
        issues.push('needs role normalization');
      }
      if (!userData.certScore) issues.push('missing certScore');
      if (!userData.activities) issues.push('missing activities');
      
      if (issues.length > 0) {
        usersNeedingMigration.push({
          userId,
          currentData: userData,
          issues
        });
      }
    }
    
    return NextResponse.json({
      success: true,
      projectId,
      firestoreUrl,
      totalUsers: documents.length,
      usersNeedingMigration: usersNeedingMigration.length,
      migrationDetails: usersNeedingMigration,
      rawDocuments: documents.slice(0, 2), // First 2 for debugging
      message: 'Debug analysis complete'
    });
    
  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
  }
}

function convertFirestoreFields(fields: any): any {
  const result: any = {};
  
  for (const [key, value] of Object.entries(fields)) {
    const fieldValue = value as any;
    
    if (fieldValue.stringValue !== undefined) {
      result[key] = fieldValue.stringValue;
    } else if (fieldValue.booleanValue !== undefined) {
      result[key] = fieldValue.booleanValue;
    } else if (fieldValue.integerValue !== undefined) {
      result[key] = parseInt(fieldValue.integerValue);
    } else if (fieldValue.doubleValue !== undefined) {
      result[key] = parseFloat(fieldValue.doubleValue);
    } else if (fieldValue.timestampValue !== undefined) {
      result[key] = fieldValue.timestampValue;
    } else if (fieldValue.mapValue && fieldValue.mapValue.fields) {
      result[key] = convertFirestoreFields(fieldValue.mapValue.fields);
    } else if (fieldValue.arrayValue && fieldValue.arrayValue.values) {
      result[key] = fieldValue.arrayValue.values.map((item: any) => {
        if (item.stringValue !== undefined) return item.stringValue;
        if (item.mapValue) return convertFirestoreFields(item.mapValue.fields);
        return item;
      });
    } else if (fieldValue.nullValue !== undefined) {
      result[key] = null;
    }
  }
  
  return result;
}