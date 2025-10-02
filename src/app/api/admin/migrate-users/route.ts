// src/app/api/admin/migrate-users/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Starting Firestore user data migration...');
    
    // Check if required environment variables exist
    if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
      throw new Error('NEXT_PUBLIC_FIREBASE_PROJECT_ID environment variable is not set');
    }
    
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/users`;
    
    console.log('Fetching from Firestore:', firestoreUrl);
    
    // Fetch all users from Firestore
    const response = await fetch(firestoreUrl);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Firestore response error:', response.status, errorText);
      throw new Error(`Failed to fetch users from Firestore: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const responseData = await response.json();
    
    if (!responseData.documents || responseData.documents.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No users found in Firestore database - nothing to migrate',
        usersProcessed: 0
      });
    }
    
    let processedCount = 0;
    let errorCount = 0;
    const errors: string[] = [];
    let migrationDetails = 'FIRESTORE MIGRATION EXECUTION LOG:\n\n';
    
    for (const doc of responseData.documents) {
      try {
        const userId = doc.name.split('/').pop();
        const userData = convertFirestoreFields(doc.fields);
        const originalUser = { ...userData };
        let hasChanges = false;
        const changes = [];
        
        // 1. Convert displayName to name
        if (userData.displayName && !userData.name) {
          userData.name = userData.displayName;
          delete userData.displayName;
          hasChanges = true;
          changes.push('displayName → name');
        }
        
        // 2. Normalize role
        if (userData.role) {
          const normalizedRole = normalizeRole(userData.role);
          if (normalizedRole !== userData.role) {
            userData.role = normalizedRole;
            hasChanges = true;
            changes.push(`role normalized to "${normalizedRole}"`);
          }
        }
        
        // 3. Ensure certScore exists
        if (!userData.certScore) {
          userData.certScore = {
            cooperation: 0,
            engagement: 0,
            retention: 0,
            trust: 0,
            total: 0,
            lastUpdated: new Date().toISOString()
          };
          hasChanges = true;
          changes.push('added certScore');
        }
        
        // 4. Ensure activities exists
        if (!userData.activities) {
          userData.activities = {
            forums: [],
            policies: [],
            services: [],
            lastActivity: new Date().toISOString()
          };
          hasChanges = true;
          changes.push('added activities');
        }
        
        // 5. Ensure timestamps exist
        const now = new Date().toISOString();
        if (!userData.createdAt) {
          userData.createdAt = now;
          hasChanges = true;
          changes.push('added createdAt');
        }
        if (!userData.updatedAt) {
          userData.updatedAt = now;
          hasChanges = true;
          changes.push('added updatedAt');
        }
        
        // 6. Ensure required fields
        if (!userData.email) {
          userData.email = `user${userId}@example.com`; // Placeholder email
          hasChanges = true;
          changes.push('added placeholder email');
        }
        
        if (!userData.isActive && userData.isActive !== false) {
          userData.isActive = true;
          hasChanges = true;
          changes.push('set isActive to true');
        }
        
        // Update user if changes were made
        if (hasChanges) {
          userData.updatedAt = new Date().toISOString();
          
          // Convert data to Firestore format
          const firestoreData = convertToFirestoreFields(userData);
          
          const updateResponse = await fetch(
            `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/users/${userId}`,
            {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                fields: firestoreData
              }),
            }
          );
          
          if (!updateResponse.ok) {
            const errorText = await updateResponse.text();
            throw new Error(`Failed to update user ${userId}: ${updateResponse.statusText} - ${errorText}`);
          }
          
          migrationDetails += `✅ User ${userId}: ${changes.join(', ')}\n`;
          processedCount++;
        } else {
          migrationDetails += `⏭️  User ${userId}: No changes needed\n`;
        }
        
      } catch (userError) {
        const errorMsg = `Failed to process user: ${userError instanceof Error ? userError.message : 'Unknown error'}`;
        errors.push(errorMsg);
        migrationDetails += `❌ ${errorMsg}\n`;
        errorCount++;
      }
    }
    
    migrationDetails += `\n=== MIGRATION SUMMARY ===\n`;
    migrationDetails += `Total users: ${responseData.documents.length}\n`;
    migrationDetails += `Successfully migrated: ${processedCount}\n`;
    migrationDetails += `Errors: ${errorCount}\n`;
    migrationDetails += `Migration completed: ${new Date().toISOString()}`;
    
    console.log('✅ Firestore migration completed:', {
      totalUsers: responseData.documents.length,
      processed: processedCount,
      errors: errorCount
    });
    
    return NextResponse.json({
      success: errorCount === 0,
      message: errorCount === 0 
        ? `Successfully migrated ${processedCount} users in Firestore!` 
        : `Migration completed with ${errorCount} errors. ${processedCount} users migrated successfully.`,
      usersProcessed: processedCount,
      details: migrationDetails,
      errors: errors.length > 0 ? errors : undefined
    });
    
  } catch (error) {
    console.error('Firestore migration error:', error);
    return NextResponse.json({
      success: false,
      message: `Migration failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    }, { status: 500 });
  }
}

function normalizeRole(role: string): string {
  const roleMap: { [key: string]: string } = {
    'HomelessPerson': 'person',
    'CaseWorker': 'caseworker', 
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

function convertToFirestoreFields(data: any): any {
  const result: any = {};
  
  for (const [key, value] of Object.entries(data)) {
    if (value === null || value === undefined) {
      result[key] = { nullValue: null };
    } else if (typeof value === 'string') {
      result[key] = { stringValue: value };
    } else if (typeof value === 'boolean') {
      result[key] = { booleanValue: value };
    } else if (typeof value === 'number') {
      if (Number.isInteger(value)) {
        result[key] = { integerValue: value.toString() };
      } else {
        result[key] = { doubleValue: value };
      }
    } else if (Array.isArray(value)) {
      result[key] = {
        arrayValue: {
          values: value.map(item => {
            if (typeof item === 'string') return { stringValue: item };
            if (typeof item === 'object') return { mapValue: { fields: convertToFirestoreFields(item) } };
            return { stringValue: String(item) };
          })
        }
      };
    } else if (typeof value === 'object') {
      result[key] = {
        mapValue: {
          fields: convertToFirestoreFields(value)
        }
      };
    } else {
      result[key] = { stringValue: String(value) };
    }
  }
  
  return result;
}