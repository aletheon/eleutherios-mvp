// src/lib/firebase-rest.ts

export class FirebaseREST {
  private baseUrl: string;
  
  constructor() {
    // Get the project ID from environment variable
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    
    if (!projectId) {
      throw new Error('Firebase Project ID is not configured. Please set NEXT_PUBLIC_FIREBASE_PROJECT_ID in your environment variables.');
    }
    
    this.baseUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents`;
  }

  static async listDocuments(collection: string) {
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    
    if (!projectId || !apiKey) {
      throw new Error('Firebase configuration missing. Please check your environment variables.');
    }
    
    const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/${collection}?key=${apiKey}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    return data.documents || [];
  }
  
  // ... rest of your methods
}