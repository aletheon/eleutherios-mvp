// src/contexts/AuthContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User as FirebaseUser,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc 
} from 'firebase/firestore';
import { auth, db } from '@/lib/firebase'; // You'll need to create this config file

// Extended user interface that includes Firestore profile data
interface User extends FirebaseUser {
  profile?: {
    name: string;
    role: 'person' | 'patient' | 'doctor' | 'pharmacist' | 'caseworker' | 'housing-officer' | 'healthcare-provider' | 'admin';
    organization?: string;
    bio?: string;
    location?: string;
    website?: string;
    licenseNumber?: string; // For doctors and pharmacists
    verified?: boolean; // For professional verification
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
    shoppingCart?: any[]; // Governance-enabled shopping cart
    defaultPolicies?: string[]; // Default policies assigned on registration
    createdAt: string;
    updatedAt: string;
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, profileData: Partial<User['profile']>) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (profileData: Partial<User['profile']>) => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load user profile data from Firestore
  const loadUserProfile = async (firebaseUser: FirebaseUser): Promise<User> => {
    try {
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        return {
          ...firebaseUser,
          profile: userDoc.data() as User['profile']
        };
      } else {
        // Create default profile if it doesn't exist
        const defaultProfile: User['profile'] = {
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
          role: 'person',
          bio: '',
          location: '',
          website: '',
          verified: false,
          certScore: {
            cooperation: 0,
            engagement: 0,
            retention: 0,
            trust: 0
          },
          activities: {
            policies: [],
            forums: [],
            services: []
          },
          shoppingCart: [],
          defaultPolicies: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        await setDoc(userDocRef, defaultProfile);
        
        return {
          ...firebaseUser,
          profile: defaultProfile
        };
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      throw new Error('Failed to load user profile');
    }
  };

  // Create default healthcare policy for patients
  const createDefaultHealthcarePolicy = async (userId: string) => {
    const defaultPolicy = {
      id: `policy-emergency-healthcare-${userId}`,
      userId: userId,
      title: 'Emergency Healthcare Access Framework',
      description: 'Your personal healthcare coordination policy. Enables doctors and pharmacists to coordinate your care.',
      category: 'healthcare',
      version: '1.0',
      status: 'active',
      visibility: 'public',
      rules: [
        {
          id: 'rule-primary-healthcare',
          kind: 'service',
          name: 'Primary Healthcare Enrollment',
          description: 'Free primary healthcare enrollment',
          config: {
            type: 'healthcare',
            provider: 'Public Health',
            cost: 0,
            currency: 'NZD'
          }
        },
        {
          id: 'rule-emergency-dental',
          kind: 'service',
          name: 'Emergency Dental Care',
          description: 'Emergency dental services',
          config: {
            type: 'dental',
            provider: 'Public Dental',
            cost: 0,
            currency: 'NZD'
          }
        },
        {
          id: 'rule-mental-health',
          kind: 'service',
          name: 'Mental Health Support',
          description: 'Access to mental health services',
          config: {
            type: 'mental-health',
            provider: 'Mental Health Services',
            cost: 0,
            currency: 'NZD'
          }
        },
        {
          id: 'rule-prescription-subsidy',
          kind: 'service',
          name: 'Prescription Subsidy',
          description: 'Subsidized prescription medications',
          config: {
            type: 'pharmacy',
            provider: 'Pharmac',
            cost: 5,
            currency: 'NZD',
            note: '$5 per item'
          }
        }
      ],
      stakeholders: ['Patient', 'Doctor', 'Pharmacist'],
      tags: ['healthcare', 'emergency', 'coordination'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: userId
    };

    const policyRef = doc(db, 'policies', defaultPolicy.id);
    await setDoc(policyRef, defaultPolicy);

    return defaultPolicy.id;
  };

  // Register new user
  const register = async (email: string, password: string, profileData: Partial<User['profile']>) => {
    try {
      setError(null);
      setLoading(true);

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Update Firebase Auth profile
      await updateProfile(firebaseUser, {
        displayName: profileData.name || email.split('@')[0]
      });

      // Create default healthcare policy for patients
      let defaultPolicyId: string | null = null;
      if (profileData.role === 'patient') {
        try {
          defaultPolicyId = await createDefaultHealthcarePolicy(firebaseUser.uid);
          console.log('✓ Created default healthcare policy:', defaultPolicyId);
        } catch (policyError) {
          console.error('Failed to create default policy:', policyError);
          // Continue with registration even if policy creation fails
        }
      }

      // Create Firestore profile
      const userProfile: User['profile'] = {
        name: profileData.name || firebaseUser.displayName || email.split('@')[0],
        role: profileData.role || 'person',
        organization: profileData.organization || '',
        bio: profileData.bio || '',
        location: profileData.location || '',
        website: profileData.website || '',
        licenseNumber: profileData.licenseNumber || '',
        verified: profileData.verified || false,
        certScore: {
          cooperation: 0,
          engagement: 0,
          retention: 0,
          trust: 0
        },
        activities: {
          policies: defaultPolicyId ? [defaultPolicyId] : [],
          forums: [],
          services: []
        },
        shoppingCart: [],
        defaultPolicies: defaultPolicyId ? [defaultPolicyId] : (profileData.defaultPolicies || []),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const userDocRef = doc(db, 'users', firebaseUser.uid);
      await setDoc(userDocRef, userProfile);

      // Load complete user data
      const completeUser = await loadUserProfile(firebaseUser);
      setUser(completeUser);
    } catch (error: any) {
      console.error('Registration error:', error);
      setError(error.message || 'Registration failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Login existing user
  const login = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const completeUser = await loadUserProfile(userCredential.user);
      setUser(completeUser);
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.message || 'Login failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = async () => {
    try {
      setError(null);
      await signOut(auth);
      setUser(null);
    } catch (error: any) {
      console.error('Logout error:', error);
      setError(error.message || 'Logout failed');
      throw error;
    }
  };

  // Reset password
  const resetPassword = async (email: string) => {
    try {
      setError(null);
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      console.error('Password reset error:', error);
      setError(error.message || 'Password reset failed');
      throw error;
    }
  };

  // Update user profile
  const updateUserProfile = async (profileData: Partial<User['profile']>) => {
    if (!user) {
      throw new Error('No user logged in');
    }

    try {
      setError(null);
      
      const userDocRef = doc(db, 'users', user.uid);
      const updateData = {
        ...profileData,
        updatedAt: new Date().toISOString()
      };

      await updateDoc(userDocRef, updateData);

      // Update local user state
      setUser(prevUser => {
        if (!prevUser) return null;
        return {
          ...prevUser,
          profile: {
            ...prevUser.profile!,
            ...updateData
          }
        };
      });
    } catch (error: any) {
      console.error('Profile update error:', error);
      setError(error.message || 'Profile update failed');
      throw error;
    }
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        setLoading(true);
        
        if (firebaseUser) {
          const completeUser = await loadUserProfile(firebaseUser);
          setUser(completeUser);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Auth state change error:', error);
        setError('Failed to load user data');
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    resetPassword,
    updateUserProfile,
    error,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};