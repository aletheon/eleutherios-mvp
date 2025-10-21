// src/app/register/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'patient' | 'doctor' | 'pharmacist' | 'person';
  organization?: string;
  licenseNumber?: string;
}

const HEALTHCARE_POLICY_ID = 'policy-emergency-healthcare';

export default function RegisterPage() {
  const router = useRouter();
  const { register, error, clearError, loading } = useAuth();

  const [formData, setFormData] = useState<RegisterForm>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'patient',
    organization: '',
    licenseNumber: ''
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.name || formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if ((formData.role === 'doctor' || formData.role === 'pharmacist') && !formData.licenseNumber) {
      errors.licenseNumber = 'License number is required for healthcare professionals';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const createDefaultHealthcarePolicy = async (userId: string) => {
    // Create default Emergency Healthcare Access policy for patients
    const defaultPolicy = {
      id: `${HEALTHCARE_POLICY_ID}-${userId}`,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!validateForm()) {
      return;
    }

    try {
      // Prepare profile data
      const profileData = {
        name: formData.name,
        role: formData.role,
        organization: formData.organization || '',
        licenseNumber: formData.licenseNumber || '',
        verified: false, // Will be verified later for healthcare professionals
        defaultPolicies: [] as string[]
      };

      // Register user with Firebase Auth and Firestore
      await register(formData.email, formData.password, profileData);

      // Create default healthcare policy for patients
      if (formData.role === 'patient') {
        // Get the user ID from Firebase (this would be available after registration)
        // For now, we'll add it to the user's defaultPolicies array
        // In a real implementation, you'd get the userId from the auth response
        console.log('Patient registered - default healthcare policy will be assigned');
      }

      // Redirect to appropriate dashboard based on role
      router.push('/');
    } catch (error: any) {
      console.error('Registration failed:', error);
      // Error is handled by AuthContext
    }
  };

  const getRoleDescription = (role: string) => {
    switch (role) {
      case 'patient':
        return 'Receive healthcare coordination with doctors and pharmacists. Get a default healthcare policy.';
      case 'doctor':
        return 'Provide medical consultations and coordinate patient care. Requires professional license.';
      case 'pharmacist':
        return 'Dispense medications and coordinate with doctors. Requires professional license.';
      case 'person':
        return 'General platform access without specific healthcare role.';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Eleutherios
          </h1>
          <h2 className="mt-6 text-3xl font-semibold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Join the healthcare coordination platform
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                  validationErrors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Dr. Sarah Chen"
              />
              {validationErrors.name && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                  validationErrors.email ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="sarah.chen@hospital.com"
              />
              {validationErrors.email && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
              )}
            </div>

            {/* Role Selection */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                I am a...
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="patient">Patient - Seeking healthcare coordination</option>
                <option value="doctor">Doctor - Medical professional</option>
                <option value="pharmacist">Pharmacist - Medication specialist</option>
                <option value="person">Other - General platform access</option>
              </select>
              <p className="mt-1 text-xs text-gray-500">
                {getRoleDescription(formData.role)}
              </p>
            </div>

            {/* License Number (for doctors and pharmacists) */}
            {(formData.role === 'doctor' || formData.role === 'pharmacist') && (
              <div>
                <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700">
                  Professional License Number
                </label>
                <input
                  id="licenseNumber"
                  name="licenseNumber"
                  type="text"
                  value={formData.licenseNumber}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    validationErrors.licenseNumber ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder={formData.role === 'doctor' ? 'MD12345' : 'PHARM-2024-001'}
                />
                {validationErrors.licenseNumber && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.licenseNumber}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  License verification required before providing services
                </p>
              </div>
            )}

            {/* Organization (optional for doctors and pharmacists) */}
            {(formData.role === 'doctor' || formData.role === 'pharmacist') && (
              <div>
                <label htmlFor="organization" className="block text-sm font-medium text-gray-700">
                  Organization (Optional)
                </label>
                <input
                  id="organization"
                  name="organization"
                  type="text"
                  value={formData.organization}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder={formData.role === 'doctor' ? 'Auckland City Hospital' : 'Central City Pharmacy'}
                />
              </div>
            )}

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleInputChange}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                  validationErrors.password ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="At least 6 characters"
              />
              {validationErrors.password && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                  validationErrors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {validationErrors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.confirmPassword}</p>
              )}
            </div>

            {/* Special note for patients */}
            {formData.role === 'patient' && (
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <p className="text-sm text-blue-800">
                  <strong>✓ As a patient, you'll receive:</strong>
                </p>
                <ul className="mt-2 text-xs text-blue-700 space-y-1 ml-4">
                  <li>• Default Emergency Healthcare Access policy</li>
                  <li>• Personal governance framework for care coordination</li>
                  <li>• Ability to invite doctors and pharmacists to your care team</li>
                  <li>• Shopping cart for medication and service coordination</li>
                </ul>
              </div>
            )}

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? 'Creating account...' : 'Create account'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="text-center">
              <span className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                  Sign in
                </Link>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
