// src/scripts/migrateUserData.ts
// Run this script to standardize user data in Firestore

import { collection, getDocs, doc, updateDoc, writeBatch } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface OldUserData {
  displayName?: string;
  name?: string;
  email?: string;
  role?: string;
  isActive?: boolean;
  organization?: string;
  bio?: string;
  location?: string;
  website?: string;
  certScore?: {
    cooperation?: number;
    engagement?: number;
    retention?: number;
    trust?: number;
  };
  activities?: {
    policies?: string[];
    forums?: string[];
    services?: string[];
  };
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any; // Allow any other fields
}

interface StandardUserData {
  name: string;
  role: 'person' | 'caseworker' | 'housing-officer' | 'healthcare-provider' | 'admin';
  organization: string;
  bio: string;
  location: string;
  website: string;
  certScore: {
    cooperation: number;
    engagement: number;
    retention: number;
    trust: number;
  };
  activities: {
    policies: string[];
    forums: string[];
    services: string[];
  };
  createdAt: string;
  updatedAt: string;
}

// Map old role values to new standardized roles
const roleMapping: Record<string, StandardUserData['role']> = {
  'HomelessPerson': 'person',
  'homeless_person': 'person',
  'person': 'person',
  'caseworker': 'caseworker',
  'CaseWorker': 'caseworker',
  'housing-officer': 'housing-officer',
  'housing_officer': 'housing-officer',
  'HousingOfficer': 'housing-officer',
  'healthcare-provider': 'healthcare-provider',
  'healthcare_provider': 'healthcare-provider',
  'HealthcareProvider': 'healthcare-provider',
  'doctor': 'healthcare-provider',
  'nurse': 'healthcare-provider',
  'admin': 'admin',
  'administrator': 'admin'
};

const standardizeUserData = (oldData: OldUserData): StandardUserData => {
  // Extract name from various possible fields
  const name = oldData.name || oldData.displayName || oldData.email?.split('@')[0] || 'Unknown User';
  
  // Standardize role
  const rawRole = oldData.role?.toLowerCase() || 'person';
  const role = roleMapping[rawRole] || 'person';
  
  // Ensure CERT score structure
  const certScore = {
    cooperation: oldData.certScore?.cooperation || 0,
    engagement: oldData.certScore?.engagement || 0,
    retention: oldData.certScore?.retention || 0,
    trust: oldData.certScore?.trust || 0
  };
  
  // Ensure activities structure
  const activities = {
    policies: oldData.activities?.policies || [],
    forums: oldData.activities?.forums || [],
    services: oldData.activities?.services || []
  };
  
  // Use existing timestamps or create new ones
  const now = new Date().toISOString();
  const createdAt = oldData.createdAt || now;
  const updatedAt = now;
  
  return {
    name,
    role,
    organization: oldData.organization || '',
    bio: oldData.bio || '',
    location: oldData.location || '',
    website: oldData.website || '',
    certScore,
    activities,
    createdAt,
    updatedAt
  };
};

export const migrateUserData = async () => {
  console.log('🚀 Starting user data migration...');
  
  try {
    // Get all users from Firestore
    const usersCollection = collection(db, 'users');
    const querySnapshot = await getDocs(usersCollection);
    
    if (querySnapshot.empty) {
      console.log('📭 No users found to migrate.');
      return;
    }
    
    console.log(`📋 Found ${querySnapshot.size} users to migrate.`);
    
    // Use batch for efficient updates
    const batch = writeBatch(db);
    let migrationCount = 0;
    
    querySnapshot.forEach((docSnapshot) => {
      const userId = docSnapshot.id;
      const oldData = docSnapshot.data() as OldUserData;
      
      console.log(`🔄 Migrating user: ${userId}`);
      console.log(`   Old name: ${oldData.displayName || oldData.name || 'N/A'}`);
      console.log(`   Old role: ${oldData.role || 'N/A'}`);
      
      // Standardize the data
      const standardData = standardizeUserData(oldData);
      
      console.log(`   New name: ${standardData.name}`);
      console.log(`   New role: ${standardData.role}`);
      
      // Add to batch update
      const userDocRef = doc(db, 'users', userId);
      batch.set(userDocRef, standardData); // Use set instead of update to overwrite
      migrationCount++;
    });
    
    // Execute all updates
    await batch.commit();
    
    console.log(`✅ Successfully migrated ${migrationCount} users!`);
    console.log('🎉 Migration complete. All users now have standardized data structure.');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
};

// Alternative: Individual update function for testing
export const migrateIndividualUser = async (userId: string) => {
  console.log(`🔄 Migrating individual user: ${userId}`);
  
  try {
    const usersCollection = collection(db, 'users');
    const querySnapshot = await getDocs(usersCollection);
    
    const userDoc = querySnapshot.docs.find(doc => doc.id === userId);
    const userData = userDoc?.data() as OldUserData;
    
    if (!userData) {
      console.log(`❌ User ${userId} not found.`);
      return;
    }
    
    const standardData = standardizeUserData(userData);
    const userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, standardData as any);
    
    console.log(`✅ Successfully migrated user ${userId}`);
    
  } catch (error) {
    console.error(`❌ Failed to migrate user ${userId}:`, error);
    throw error;
  }
};

// Preview function to see what changes would be made without applying them
export const previewMigration = async () => {
  console.log('👀 Previewing migration changes...');
  
  try {
    const usersCollection = collection(db, 'users');
    const querySnapshot = await getDocs(usersCollection);
    
    querySnapshot.forEach((docSnapshot) => {
      const userId = docSnapshot.id;
      const oldData = docSnapshot.data() as OldUserData;
      const standardData = standardizeUserData(oldData);
      
      console.log(`\n📋 User: ${userId}`);
      console.log('📥 BEFORE:');
      console.log(`   name: ${oldData.name || oldData.displayName || 'N/A'}`);
      console.log(`   role: ${oldData.role || 'N/A'}`);
      console.log(`   certScore: ${JSON.stringify(oldData.certScore) || 'N/A'}`);
      console.log(`   activities: ${JSON.stringify(oldData.activities) || 'N/A'}`);
      
      console.log('📤 AFTER:');
      console.log(`   name: ${standardData.name}`);
      console.log(`   role: ${standardData.role}`);
      console.log(`   certScore: ${JSON.stringify(standardData.certScore)}`);
      console.log(`   activities: ${JSON.stringify(standardData.activities)}`);
    });
    
  } catch (error) {
    console.error('❌ Preview failed:', error);
  }
};