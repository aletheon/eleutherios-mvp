// src/app/api/admin/preview-migration/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('Starting Firestore migration preview...');
    
    // Check if required environment variables exist
    if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
      throw new Error('NEXT_PUBLIC_FIREBASE_PROJECT_ID environment variable is not set');
    }
    
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/users`;
    
    console.log('Fetching from Firestore:', firestoreUrl);
    
    const response = await fetch(firestoreUrl);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Firestore response error:', response.status, errorText);
      throw new Error(`Failed to fetch users from Firestore: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const responseData = await response.json();
    console.log('Firestore response received');
    
    if (!responseData.documents || responseData.documents.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No users found in Firestore database',
        usersToMigrate: []
      });
    }
    
    const usersToMigrate = [];
    let analysisDetails = 'FIRESTORE MIGRATION PREVIEW:\n\n';
    
    for (const doc of responseData.documents) {
      const userId = doc.name.split('/').pop();
      const userData = convertFirestoreFields(doc.fields);
      
      const changes = [];
      
      // Check for displayName -> name conversion
      if (userData.displayName && !userData.name) {
        changes.push(`displayName "${userData.displayName}" → name`);
      }
      
      // Check for role normalization
      if (userData.role) {
        const normalizedRole = normalizeRole(userData.role);
        if (normalizedRole !== userData.role) {
          changes.push(`role "${userData.role}" → "${normalizedRole}"`);
        }
      }
      
      // Check for missing certScore
      if (!userData.certScore) {
        changes.push('Add missing certScore object');
      }
      
      // Check for missing activities
      if (!userData.activities) {
        changes.push('Add missing activities object');
      }
      
      // Check for missing timestamps
      if (!userData.createdAt) {
        changes.push('Add createdAt timestamp');
      }
      if (!userData.updatedAt) {
        changes.push('Add updatedAt timestamp');
      }
      
      if (changes.length > 0) {
        const migrationInfo = {
          userId,
          currentData: userData,
          changes,
          willBeUpdated: true
        };
        usersToMigrate.push(migrationInfo);
        
        analysisDetails += `User ${userId}:\n`;
        analysisDetails += `  Current: ${JSON.stringify(userData, null, 2)}\n`;
        analysisDetails += `  Changes: ${changes.join(', ')}\n\n`;
      }
    }
    
    analysisDetails += `\nTOTAL USERS TO MIGRATE: ${usersToMigrate.length}\n`;
    analysisDetails += `TOTAL USERS IN DATABASE: ${responseData.documents.length}`;
    
    return NextResponse.json({
      success: true,
      message: `Found ${usersToMigrate.length} users that need migration out of ${responseData.documents.length} total users`,
      usersToMigrate,
      details: analysisDetails
    });
    
  } catch (error) {
    console.error('Preview migration error:', error);
    return NextResponse.json({
      success: false,
      message: `Failed to preview migration: ${error instanceof Error ? error.message : 'Unknown error'}`
    }, { status: 500 });
  }
}

function normalizeRole(role: string): string {
  const roleMap: { [key: string]: string } = {
    'HomelessPerson': 'person',
    'CaseWorker': 'caseworker',
    'KORepresentative': 'korepresentative',
    'MSDCaseWorker': 'msdcaseworker',
    'Administrator': 'admin',
    'ServiceProvider': 'provider'
  };
  
  return roleMap[role] || role.toLowerCase();
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