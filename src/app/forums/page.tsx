// src/app/forums/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/Navigation';

interface Forum {
  id: string;
  policyId: string;
  ruleId: string;
  title: string;
  description: string;
  status: string;
  participantCount: number;
  postCount: number;
  createdAt: string;
}

type ViewMode = 'list' | 'grid';

export default function ForumsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [forums, setForums] = useState<Forum[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  useEffect(() => {
    if (user) {
      fetchForums();
    }
  }, [user]);

  const fetchForums = async () => {
    try {
      const token = await user?.getIdToken();
      const response = await fetch(
        `https://eleutherios-mvp-3c717-default-rtdb.asia-southeast1.firebasedatabase.app/forums.json?auth=${token}`
      );

      if (response.ok) {
        const data = await response.json();
        if (data) {
          const forumsList = Object.entries(data).map(([id, forum]: [string, any]) => ({
            id,
            ...forum,
          }));
          setForums(forumsList);
        }
      }
    } catch (error) {
      console.error('Error fetching forums:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation onMenuClick={() => {}} onActivitiesClick={() => {}} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Forums</h2>
          
          {/* View Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md ${
                viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
              title="List view"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md ${
                viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
              title="Grid view"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
          </div>
        </div>

        {forums.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <p className="text-gray-600">No forums yet. Create a policy and add rules to generate forums.</p>
          </div>
        ) : (
          <div className={viewMode === 'list' ? 'space-y-4' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'}>
            {forums.map((forum) => (
              <div
                key={forum.id}
                onClick={() => router.push(`/forums/${forum.id}`)}
                className={`bg-white p-6 rounded-lg shadow hover:shadow-md transition cursor-pointer ${
                  viewMode === 'list' ? 'w-full' : ''
                }`}
              >
                <h3 className="font-semibold text-lg mb-2">{forum.title}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{forum.description}</p>
                <div className="flex gap-2 mb-3">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                    {forum.participantCount} participants
                  </span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">
                    {forum.postCount} posts
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  Created {new Date(forum.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}