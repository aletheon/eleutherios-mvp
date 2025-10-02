// src/app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('Fetching users from Firestore...');
    
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    if (!projectId) {
      throw new Error('NEXT_PUBLIC_FIREBASE_PROJECT_ID not set');
    }
    
    const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/users`;
    console.log('Firestore URL:', firestoreUrl);
    
    const response = await fetch(firestoreUrl);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Firestore error:', response.status, errorText);
      throw new Error(`Failed to fetch users: ${response.status} ${response.statusText}`);
    }
    
    const responseData = await response.json();
    console.log('Firestore response received, documents:', responseData.documents?.length || 0);
    
    const documents = responseData.documents || [];
    
    const users = documents.map((doc: any) => {
      const userId = doc.name.split('/').pop();
      const userData = convertFirestoreFields(doc.fields || {});
      return {
        id: userId,
        ...userData
      };
    });
    
    console.log('Processed users:', users.length);
    
    return NextResponse.json({ 
      users,
      total: users.length,
      message: 'Users fetched successfully'
    });
    
  } catch (error) {
    console.error('Users API error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Unknown error',
        users: []
      },
      { status: 500 }
    );
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