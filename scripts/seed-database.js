require('dotenv').config();
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, doc, setDoc, Timestamp } = require('firebase/firestore');

// Check if environment variables are loaded
if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
  console.error('❌ Firebase environment variables not found!');
  console.log('Make sure .env.local exists with your Firebase config');
  process.exit(1);
}

// Firebase config using environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

console.log('🔥 Connecting to Firebase project:', firebaseConfig.projectId);

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Test users data with proper Firestore timestamp format
const testUsers = [
  {
    email: "john.smith@example.com",
    displayName: "John Smith",
    role: "HomelessPerson",
    profile: {
      age: 34,
      currentSituation: "sleeping_rough",
      preferredRegion: "Christchurch",
      bedroomNeeds: 1,
      accessibilityNeeds: false,
      maxAffordableRent: 300
    },
    certScore: { 
      cooperation: 85, 
      engagement: 90, 
      retention: 75, 
      trust: 80 
    },
    isActive: true,
    publicProfile: true
  },
  {
    email: "sarah.jones@msd.govt.nz",
    displayName: "Sarah Jones", 
    role: "MSDCaseWorker",
    department: "MSD",
    region: "Canterbury",
    specializations: ["emergency_housing", "complex_needs"],
    certScore: { 
      cooperation: 95, 
      engagement: 92, 
      retention: 88, 
      trust: 94 
    },
    isActive: true,
    publicProfile: false
  },
  {
    email: "mike.wilson@kaingaora.govt.nz",
    displayName: "Mike Wilson",
    role: "KORepresentative", 
    department: "KO",
    region: "Canterbury",
    portfolios: ["emergency_housing", "transitional_housing"],
    certScore: { 
      cooperation: 90, 
      engagement: 88, 
      retention: 92, 
      trust: 91 
    },
    isActive: true,
    publicProfile: false
  }
];

// Test policy data with proper format
const testPolicies = [
  {
    name: "EmergencyHousingPolicy",
    description: "Rapid housing placement for people in crisis situations",
    version: "1.0.0",
    author: "msd_caseworker_1",
    authorName: "Sarah Jones",
    visibility: "public",
    category: "emergency_housing",
    tags: ["emergency", "housing", "crisis", "nz", "msd", "ko"],
    status: "active",
    script: "policy EmergencyHousingPolicy {\n  stakeholder Applicant\n  stakeholder EmergencyCaseWorker\n  stakeholder KOEmergencyTeam\n  \n  rule EmergencyApplicationForum -> Forum(\"URGENT: Emergency Housing\", urgency = \"critical\")\n  rule EmergencyEligibilityCheck -> Service(\"MSDEmergencyEligibility\", urgencyLevel = \"critical\")\n}",
    instantiationCount: 0,
    activeInstantiations: 0,
    rating: { 
      average: 0, 
      totalRatings: 0 
    }
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Seeding database with test data...');
    
    // Load test users with generated IDs
    for (let i = 0; i < testUsers.length; i++) {
      const user = testUsers[i];
      const userId = `user_${i + 1}`;
      
      const userData = {
        ...user,
        createdAt: Timestamp.now(),
        lastLoginAt: Timestamp.now()
      };
      
      await setDoc(doc(db, 'users', userId), userData);
      console.log(`✓ Created user: ${user.displayName}`);
    }
    
    // Load test policies with generated IDs
    for (let i = 0; i < testPolicies.length; i++) {
      const policy = testPolicies[i];
      const policyId = `policy_${i + 1}`;
      
      const policyData = {
        ...policy,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };
      
      await setDoc(doc(db, 'policies', policyId), policyData);
      console.log(`✓ Created policy: ${policy.name}`);
    }
    
    console.log('🎉 Database seeded successfully!');
    console.log('\nTest accounts created:');
    console.log('👤 Homeless person: john.smith@example.com');
    console.log('👨‍💼 MSD case worker: sarah.jones@msd.govt.nz');
    console.log('🏢 KO representative: mike.wilson@kaingaora.govt.nz');
    console.log('\n🔗 Visit http://localhost:3000/test to verify the data');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    console.log('\nTroubleshooting:');
    console.log('1. Make sure Firebase project is set up correctly');
    console.log('2. Check that .env.local has the correct Firebase config');
    console.log('3. Ensure Firestore database is created in Firebase console');
  }
}

seedDatabase();
