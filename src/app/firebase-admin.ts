// src/app/firebase-admin.ts

import admin from 'firebase-admin';

// Initialize Firebase Admin if it hasn't been initialized yet
if (!admin.apps.length) {
  try {
    // Get the service account key from environment variable
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    
    if (serviceAccount) {
      const serviceAccountKey = JSON.parse(serviceAccount);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccountKey),
        databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL
      });
    } else {
      // Initialize with application default credentials (for local development)
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL
      });
    }
  } catch (error) {
    console.error('Firebase admin initialization error:', error);
  }
}

// Export the database reference
export const database = admin.database();
export const auth = admin.auth();
export const firestore = admin.firestore();
export default admin;