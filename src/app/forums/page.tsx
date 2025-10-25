'use client';

import Link from 'next/link';
import Navigation from '@/components/Navigation';

export default function ForumsPage() {

  const mockForums = [
    {
      id: 'coordination',
      title: 'Emergency Housing Coordination',
      description: 'Multi-stakeholder coordination for emergency housing situations',
      participants: 4,
      lastActivity: '2 hours ago',
      status: 'active'
    },
    {
      id: 'healthcare',
      title: 'Healthcare Policy Discussion',
      description: 'Community discussion on healthcare access policies',
      participants: 7,
      lastActivity: '5 hours ago',
      status: 'active'
    },
    {
      id: 'food-security',
      title: 'Food Security Forum',
      description: 'Coordination of food distribution and nutrition support',
      participants: 12,
      lastActivity: '1 day ago',
      status: 'archived'
    }
  ];

  const getForumStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
          <div className="space-y-6">
            {mockForums.map((forum) => (
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
                      <span>👥 {forum.participants} participants</span>
                      <span>🕒 {forum.lastActivity}</span>
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