'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Forum {
  id: string;
  title: string;
  description: string;
  participants?: any[];
  created_at?: any;
  updated_at?: any;
  status: string;
}

export default function ForumsPage() {
  const [forums, setForums] = useState<Forum[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchForums = async () => {
      try {
        const forumsRef = collection(db, 'forums');
        const q = query(forumsRef, orderBy('created_at', 'desc'));
        const querySnapshot = await getDocs(q);

        const fetchedForums = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Forum[];

        setForums(fetchedForums);
      } catch (error) {
        console.error('Error fetching forums:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchForums();
  }, []);

  const getForumStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTimeAgo = (timestamp: any) => {
    if (!timestamp) return 'Unknown';

    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  };

  return (
    <>
      <Navigation />
      <main className="ml-16 pt-16 p-6 min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8 mt-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Forums</h1>
              <p className="text-gray-600 mt-2">
                Forums are instantiated from Policies and provide real-time coordination spaces where stakeholders can collaborate and make decisions.
              </p>
            </div>
            <Link href="/forums/create" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
              <span className="material-icons text-lg">add</span>
              <span>Create Forum</span>
            </Link>
          </div>

          {/* Forums List */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading forums...</p>
            </div>
          ) : forums.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <p className="text-gray-500 mb-4">No forums found. Create your first forum to get started!</p>
              <Link
                href="/forums/create"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
              >
                Create Forum
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {forums.map((forum) => (
                <div key={forum.id} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <Link
                          href={`/forums/${forum.id}`}
                          className="text-xl font-semibold text-gray-900 hover:text-blue-600"
                        >
                          {forum.title}
                        </Link>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getForumStatusColor(forum.status)}`}>
                          {forum.status}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4">{forum.description}</p>
                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <span>👥 {forum.participants?.length || 0} participants</span>
                        <span>🕒 {getTimeAgo(forum.updated_at || forum.created_at)}</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <Link
                        href={`/forums/${forum.id}`}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
                      >
                        Join Discussion
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Forum Info */}
          <div className="mt-8 bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">About Forums</h3>
            <p className="text-blue-800 text-sm">
              Forums are instantiated from Policies and provide real-time coordination spaces where 
              stakeholders can collaborate, make decisions, and activate services. Each forum defines 
              its own permissions and member roles.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}