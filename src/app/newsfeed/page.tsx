// src/app/newsfeed/page.tsx
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useDashboard } from '@/contexts/DashboardContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface NewsItem {
  id: string;
  type: 'forum_post' | 'policy_update' | 'service_announcement' | 'community_update';
  title: string;
  content: string;
  author: string;
  timestamp: string;
  sourceId?: string;
  sourceName?: string;
}

export default function NewsfeedPage() {
  const { user, loading } = useAuth();
  const { addActivity } = useDashboard();
  const router = useRouter();
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loadingNews, setLoadingNews] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      // Simulate loading news items
      setTimeout(() => {
        setNewsItems([
          {
            id: '1',
            type: 'forum_post',
            title: 'New Discussion in House Walk-Through',
            content: 'A new conversation has started about housing policy implementation...',
            author: 'Community Member',
            timestamp: new Date().toISOString(),
            sourceName: 'House Walk-Through Forum'
          },
          {
            id: '2',
            type: 'policy_update',
            title: 'Social Housing Policy Updated',
            content: 'The social housing policy has been revised with new guidelines...',
            author: 'Policy Team',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            sourceName: 'Policy Updates'
          },
          {
            id: '3',
            type: 'service_announcement',
            title: 'New Homeless Support Service Available',
            content: 'A new service has been added to help connect homeless individuals with resources...',
            author: 'Service Provider',
            timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
            sourceName: 'Community Services'
          },
          {
            id: '4',
            type: 'community_update',
            title: 'Welcome to Eleutherios Platform',
            content: 'Join our community-driven platform for policy collaboration and service coordination...',
            author: 'Eleutherios Team',
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            sourceName: 'Platform Updates'
          }
        ]);
        setLoadingNews(false);
      }, 1000);
    }
  }, [user]);

  const getNewsIcon = (type: string) => {
    switch (type) {
      case 'forum_post':
        return (
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-600">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
            </svg>
          </div>
        );
      case 'policy_update':
        return (
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-purple-600">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14,2 14,8 20,8"/>
              <line x1="16" x2="8" y1="13" y2="13"/>
              <line x1="16" x2="8" y1="17" y2="17"/>
            </svg>
          </div>
        );
      case 'service_announcement':
        return (
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-600">
              <circle cx="12" cy="12" r="3"/>
              <path d="m12 1 4 4-4 4-4-4 4-4"/>
              <path d="m12 23-4-4 4-4 4 4-4 4"/>
              <path d="m1 12 4-4 4 4-4 4-4-4"/>
              <path d="m23 12-4 4-4-4 4-4 4 4"/>
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-600">
              <circle cx="12" cy="12" r="10"/>
              <path d="m9 12 2 2 4-4"/>
            </svg>
          </div>
        );
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now.getTime() - time.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      return `${diffDays}d ago`;
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
    <DashboardLayout 
      title="Newsfeed" 
      subtitle="Stay updated with the latest discussions, policy changes, and community activities"
    >
      <div className="space-y-6">
        {/* Filter Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button className="border-b-2 border-purple-500 text-purple-600 whitespace-nowrap py-2 px-1 text-sm font-medium">
              All Updates
            </button>
            <button className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-2 px-1 text-sm font-medium">
              Forums
            </button>
            <button className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-2 px-1 text-sm font-medium">
              Policies
            </button>
            <button className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-2 px-1 text-sm font-medium">
              Services
            </button>
          </nav>
        </div>

        {loadingNews ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white rounded-lg shadow p-6">
                <div className="animate-pulse flex items-start gap-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {newsItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6">
                <div className="flex items-start gap-4">
                  {getNewsIcon(item.type)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                      <span className="text-sm text-gray-500">{getTimeAgo(item.timestamp)}</span>
                    </div>
                    <p className="text-gray-700 mb-3">{item.content}</p>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">by {item.author}</span>
                        {item.sourceName && (
                          <>
                            <span className="text-gray-400">•</span>
                            <span className="text-purple-600">{item.sourceName}</span>
                          </>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <button className="text-gray-500 hover:text-purple-600 flex items-center gap-1">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M7 10v12l5-3 5 3V10"/>
                            <path d="M7 10V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v4"/>
                          </svg>
                          Save
                        </button>
                        <button className="text-gray-500 hover:text-purple-600 flex items-center gap-1">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6 6 18"/>
                            <path d="m6 6 12 12"/>
                          </svg>
                          Share
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load More Button */}
        <div className="text-center pt-6">
          <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700">
            Load More Updates
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}