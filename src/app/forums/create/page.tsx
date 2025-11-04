// src/app/forums/create/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { doc, setDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Navigation from '@/components/Navigation';

interface ForumForm {
  title: string;
  description: string;
  category: 'healthcare' | 'housing' | 'food' | 'general';
  patientEmail: string;
  additionalStakeholders: string[];
}

export default function CreateForumPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [formData, setFormData] = useState<ForumForm>({
    title: '',
    description: '',
    category: 'healthcare',
    patientEmail: '',
    additionalStakeholders: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.title || formData.title.trim().length < 3) {
      errors.title = 'Title must be at least 3 characters';
    }

    if (!formData.description || formData.description.trim().length < 10) {
      errors.description = 'Description must be at least 10 characters';
    }

    if (!formData.patientEmail) {
      errors.patientEmail = 'Patient email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.patientEmail)) {
      errors.patientEmail = 'Invalid email address';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const findUserByEmail = async (email: string) => {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    return {
      id: querySnapshot.docs[0].id,
      ...querySnapshot.docs[0].data()
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    if (!user || (user.profile?.role !== 'doctor' && user.profile?.role !== 'admin')) {
      setError('Only doctors can create forums');
      return;
    }

    try {
      setLoading(true);

      // Find patient by email
      const patient = await findUserByEmail(formData.patientEmail);
      if (!patient) {
        setError(`No patient found with email: ${formData.patientEmail}`);
        setLoading(false);
        return;
      }

      if (patient.role !== 'patient') {
        setError('The specified user is not registered as a patient');
        setLoading(false);
        return;
      }

      // Create forum
      const forumId = `forum-${Date.now()}`;
      const forum = {
        id: forumId,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        createdBy: user.uid,
        createdByName: user.profile?.name || 'Unknown Doctor',
        createdByRole: user.profile?.role || 'doctor',
        patientId: patient.id,
        patientName: patient.name,
        participants: [
          {
            userId: user.uid,
            name: user.profile?.name || 'Unknown',
            role: 'doctor',
            permissions: ['create', 'invite', 'prescribe', 'add_to_cart'],
            joinedAt: new Date().toISOString()
          },
          {
            userId: patient.id,
            name: patient.name,
            role: 'patient',
            permissions: ['view', 'approve', 'request'],
            joinedAt: new Date().toISOString()
          }
        ],
        stakeholders: ['Doctor', 'Patient'],
        status: 'active',
        policyId: patient.defaultPolicies?.[0] || null, // Link to patient's default policy
        rules: [],
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const forumRef = doc(db, 'forums', forumId);
      await setDoc(forumRef, forum);

      console.log('✓ Created forum:', forumId);

      // Redirect to forum page
      router.push(`/forums/${forumId}`);
    } catch (err: any) {
      console.error('Forum creation error:', err);
      setError(err.message || 'Failed to create forum');
    } finally {
      setLoading(false);
    }
  };

  // Auto-fill for doctors
  if (user?.profile?.role === 'doctor') {
    // Could pre-populate from recent patients
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8 ml-16 pt-16">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Create Forum
          </h1>
          <p className="mt-2 text-gray-600">
            Start a new healthcare coordination space with your patient
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Forum Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Forum Title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleInputChange}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                  validationErrors.title ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="e.g., Diabetes Management Forum"
              />
              {validationErrors.title && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.title}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                  validationErrors.description ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Describe the purpose of this forum..."
              />
              {validationErrors.description && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.description}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="healthcare">Healthcare - Medical coordination</option>
                <option value="housing">Housing - Accommodation coordination</option>
                <option value="food">Food - Nutrition support</option>
                <option value="general">General - Other coordination</option>
              </select>
            </div>

            {/* Patient Email */}
            <div>
              <label htmlFor="patientEmail" className="block text-sm font-medium text-gray-700">
                Patient Email Address
              </label>
              <input
                id="patientEmail"
                name="patientEmail"
                type="email"
                value={formData.patientEmail}
                onChange={handleInputChange}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                  validationErrors.patientEmail ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="patient@example.com"
              />
              {validationErrors.patientEmail && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.patientEmail}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Patient must be registered on the platform
              </p>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <p className="text-sm text-blue-800">
                <strong>✓ This forum will include:</strong>
              </p>
              <ul className="mt-2 text-xs text-blue-700 space-y-1 ml-4">
                <li>• You (doctor) with full coordination permissions</li>
                <li>• The patient with view and approval permissions</li>
                <li>• Patient's default healthcare policy as governance framework</li>
                <li>• Ability to invite pharmacists via EleuScript rules</li>
                <li>• Shopping cart for medication coordination</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4">
              <Link
                href="/forums"
                className="text-gray-600 hover:text-gray-900 font-medium text-sm"
              >
                ← Back to Forums
              </Link>

              <button
                type="submit"
                disabled={loading || (user?.profile?.role !== 'doctor' && user?.profile?.role !== 'admin')}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
              >
                {loading ? 'Creating Forum...' : 'Create Forum'}
              </button>
            </div>
          </form>
        </div>

        {/* Next Steps Info */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Next Steps After Creation</h3>
          <ol className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start">
              <span className="font-bold text-blue-600 mr-2">1.</span>
              <span>Forum will be created with you and the patient as participants</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold text-blue-600 mr-2">2.</span>
              <span>Use EleuScript rules to invite pharmacists: <code className="bg-gray-100 px-1 rounded text-xs">rule add pharmacy -&gt; Policy(...)</code></span>
            </li>
            <li className="flex items-start">
              <span className="font-bold text-blue-600 mr-2">3.</span>
              <span>Coordinate care through real-time messaging and service activation</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold text-blue-600 mr-2">4.</span>
              <span>Add medications to patient's shopping cart with governance controls</span>
            </li>
          </ol>
        </div>
      </div>
    </div>
    </>
  );
}
