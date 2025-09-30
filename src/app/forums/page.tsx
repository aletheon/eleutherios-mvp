// src/app/forums/page.tsx
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { DashboardLayout } from '@/components/DashboardLayout';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Forum {
  id: string;
  title: string;
  description?: string;
  status: string;
  participants: number;
  posts: number;
  createdAt: string;
  createdBy?: string;
}

export default function ForumsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [forums, setForums] = useState<Forum[]>([]);
  const [loadingForums, setLoadingForums] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

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
          const forumsList: Forum[] = Object.entries(data).map(([id, forum]: [string, any]) => ({
            id,
            title: String(forum.title || 'Untitled Forum'),
            description: forum.description ? String(forum.description) : undefined,
            status: String(forum.status || 'active'),
            participants: Number(forum.participants) || 1,
            posts: Number(forum.posts) || 0,
            createdAt: forum.createdAt || new Date().toISOString(),
            createdBy: forum.createdBy ? String(forum.createdBy) : undefined,
          }));
          setForums(forumsList);
        }
      }
    } catch (error) {
      console.error('Error fetching forums:', error);
    } finally {
      setLoadingForums(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <div className="text-lg">Loading...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (!user) return null;

  return (
    <DashboardLayout title="Forums" subtitle="Participate in policy discussions and community forums">
      <div className="space-y-6">
        {loadingForums ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-lg shadow p-6">
                <div className="animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : forums.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500">No forums available yet.</p>
            <button className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
              Create First Forum
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {forums.map((forum) => (
              <Link
                key={forum.id}
                href={`/forums/${forum.id}`}
                className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {forum.title}
                  </h3>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    {forum.status}
                  </span>
                </div>
                
                {forum.description && (
                  <p className="text-gray-600 mb-4">{forum.description}</p>
                )}
                
                <div className="flex items-center text-sm text-gray-500">
                  <span>{forum.participants} participants</span>
                  <span className="mx-2">•</span>
                  <span>{forum.posts} posts</span>
                  <span className="mx-2">•</span>
                  <span>
                    Created {new Date(forum.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}