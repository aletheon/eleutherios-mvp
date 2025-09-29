// src/app/policies/create/page.tsx
'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function CreatePolicyPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'housing',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!user) {
        setError('You must be logged in to create a policy');
        setLoading(false);
        return;
      }

      const policyId = Date.now().toString();
      const policy = {
        ...formData,
        id: policyId,
        creatorId: user.uid,
        creatorEmail: user.email,
        policymakers: [user.uid], // Creator is automatically a policymaker
        status: 'draft',
        createdAt: new Date().toISOString(),
        rules: [],
      };

      const token = await user.getIdToken();

      const response = await fetch(
        `https://eleutherios-mvp-3c717-default-rtdb.asia-southeast1.firebasedatabase.app/policies/${policyId}.json?auth=${token}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(policy),
        }
      );

      if (response.ok) {
        alert('Policy created successfully!');
        router.push('/dashboard');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to create policy');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🏠</span>
              <h1 className="text-xl font-bold">Eleutherios</h1>
            </div>
            <button
              onClick={() => router.push('/dashboard')}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold mb-6">Create Policy</h2>

        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Policy Title
            </label>
            <input
              type="text"
              id="title"
              required
              placeholder="e.g., Social Housing, Tenancy Takeover, Housing First"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              rows={6}
              required
              placeholder="Describe the purpose and scope of this policy..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="housing">Housing</option>
              <option value="tenancy">Tenancy</option>
              <option value="support">Support Services</option>
              <option value="health">Health & Wellbeing</option>
              <option value="employment">Employment</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="bg-blue-50 border border-blue-200 p-4 rounded-md">
            <p className="text-sm text-blue-800">
              After creating this policy, you'll be able to add rules and invite other policymakers (like MSD case workers or homeless individuals) to collaborate.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Policy'}
          </button>
        </form>
      </main>
    </div>
  );
}