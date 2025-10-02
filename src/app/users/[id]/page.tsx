'use client';

import { DashboardLayout } from '@/components/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface User {
  id: string;
  email: string;
  displayName?: string;
  joinDate: string;
  bio?: string;
  location?: string;
  website?: string;
  certScore: {
    cooperation: number;
    engagement: number;
    retention: number;
    trust: number;
  };
  publicPolicies: Policy[];
  publicServices: Service[];
  publicForums: Forum[];
  stats: {
    totalConnections: number;
    totalRatings: number;
    responseTime: string;
    completionRate: number;
  };
}

interface Policy {
  id: string;
  title: string;
  description: string;
  category: string;
  isPublic: boolean;
  createdDate: string;
  stakeholders: number;
  status: 'draft' | 'active' | 'archived';
}

interface Service {
  id: string;
  title: string;
  description: string;
  category: string;
  isPublic: boolean;
  price?: number;
  currency?: string;
  rating: number;
  totalUsers: number;
  status: 'active' | 'paused' | 'discontinued';
}

interface Forum {
  id: string;
  title: string;
  description: string;
  category: string;
  isPublic: boolean;
  memberCount: number;
  messageCount: number;
  lastActivity: string;
}

// CERT Score Detailed Component
const CertScoreDetailed = ({ certScore }: { certScore: User['certScore'] }) => {
  const scores = [
    { 
      label: 'Cooperation', 
      key: 'C',
      value: certScore.cooperation, 
      color: 'bg-blue-500',
      description: 'How often you collaborate with others'
    },
    { 
      label: 'Engagement', 
      key: 'E',
      value: certScore.engagement, 
      color: 'bg-green-500',
      description: 'Responsiveness and interaction quality'
    },
    { 
      label: 'Retention', 
      key: 'R',
      value: certScore.retention, 
      color: 'bg-yellow-500',
      description: 'User loyalty and repeat interactions'
    },
    { 
      label: 'Trust', 
      key: 'T',
      value: certScore.trust, 
      color: 'bg-purple-500',
      description: 'Community endorsements and reputation'
    },
  ];

  const averageScore = Math.round((certScore.cooperation + certScore.engagement + certScore.retention + certScore.trust) / 4);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">CERT Score Breakdown</h3>
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-600">{averageScore}</div>
          <div className="text-sm text-gray-500">Overall Score</div>
        </div>
      </div>
      
      <div className="space-y-4">
        {scores.map((score, index) => (
          <div key={index}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 ${score.color} rounded-full flex items-center justify-center text-white font-bold text-sm`}>
                  {score.key}
                </div>
                <div>
                  <div className="font-medium text-gray-900">{score.label}</div>
                  <div className="text-xs text-gray-500">{score.description}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-gray-900">{score.value}</div>
                <div className="text-xs text-gray-500">/ 100</div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className={`${score.color} h-3 rounded-full transition-all duration-500`}
                style={{ width: `${score.value}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function UserDetailPage() {
  const { user } = useAuth();
  const params = useParams();
  const userId = params.id as string;
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'policies' | 'services' | 'forums'>('policies');

  useEffect(() => {
    if (user && userId) {
      fetchUserProfile();
    }
  }, [user, userId]);

  const fetchUserProfile = async () => {
    try {
      // Mock data - in real implementation, fetch from your API
      const mockUsers: { [key: string]: User } = {
        '1': {
          id: '1',
          email: 'alex@patient.com',
          displayName: 'Alex Patient',
          joinDate: '2024-01-15',
          bio: 'Healthcare consumer focused on preventive care and wellness tracking.',
          location: 'Christchurch, New Zealand',
          website: 'https://alexpatient.blog',
          certScore: { cooperation: 85, engagement: 92, retention: 78, trust: 88 },
          publicPolicies: [],
          publicServices: [
            { 
              id: 's1', 
              title: 'Personal Health Tracker', 
              description: 'Track daily health metrics and share with healthcare providers',
              category: 'healthcare', 
              isPublic: true,
              price: 0,
              rating: 4.2,
              totalUsers: 150,
              status: 'active'
            }
          ],
          publicForums: [],
          stats: {
            totalConnections: 12,
            totalRatings: 25,
            responseTime: '2 hours',
            completionRate: 95
          }
        },
        '2': {
          id: '2',
          email: 'dr.johnson@clinic.com',
          displayName: 'Dr. Sarah Johnson',
          joinDate: '2024-01-10',
          bio: 'General practitioner with 15 years experience. Specializing in preventive care, chronic disease management, and telehealth consultations.',
          location: 'Auckland, New Zealand',
          website: 'https://drjohnsoncare.nz',
          certScore: { cooperation: 95, engagement: 88, retention: 90, trust: 96 },
          publicPolicies: [
            { 
              id: 'p1', 
              title: 'Consultation Protocol', 
              description: 'Standardized approach to telehealth consultations ensuring quality care',
              category: 'healthcare', 
              isPublic: true,
              createdDate: '2024-01-12',
              stakeholders: 45,
              status: 'active'
            },
            { 
              id: 'p2', 
              title: 'Prescription Guidelines', 
              description: 'Evidence-based prescribing protocols for common conditions',
              category: 'healthcare', 
              isPublic: true,
              createdDate: '2024-01-20',
              stakeholders: 28,
              status: 'active'
            }
          ],
          publicServices: [
            { 
              id: 's2', 
              title: 'Telehealth Consultation', 
              description: 'Professional medical consultations via secure video platform',
              category: 'healthcare', 
              isPublic: true,
              price: 80,
              currency: 'NZD',
              rating: 4.8,
              totalUsers: 320,
              status: 'active'
            }
          ],
          publicForums: [
            { 
              id: 'f1', 
              title: 'Medical Questions Forum', 
              description: 'Community space for general health questions and education',
              category: 'healthcare', 
              isPublic: true,
              memberCount: 156,
              messageCount: 892,
              lastActivity: '2024-02-01'
            }
          ],
          stats: {
            totalConnections: 180,
            totalRatings: 156,
            responseTime: '30 minutes',
            completionRate: 98
          }
        },
        '3': {
          id: '3',
          email: 'pharmacy@local.com',
          displayName: 'PharmaCorp Staff',
          joinDate: '2024-01-12',
          bio: 'Local pharmacy providing prescription fulfillment, medication delivery, and pharmaceutical consultations.',
          location: 'Wellington, New Zealand',
          certScore: { cooperation: 88, engagement: 85, retention: 92, trust: 89 },
          publicPolicies: [
            { 
              id: 'p3', 
              title: 'Prescription Fulfillment Protocol', 
              description: 'Quality assurance process for prescription verification and dispensing',
              category: 'pharmacy', 
              isPublic: true,
              createdDate: '2024-01-15',
              stakeholders: 12,
              status: 'active'
            }
          ],
          publicServices: [
            { 
              id: 's3', 
              title: 'Medication Delivery', 
              description: 'Same-day prescription delivery service within Wellington region',
              category: 'pharmacy', 
              isPublic: true,
              price: 15,
              currency: 'NZD',
              rating: 4.6,
              totalUsers: 89,
              status: 'active'
            },
            { 
              id: 's4', 
              title: 'Drug Interaction Check', 
              description: 'Comprehensive medication interaction screening service',
              category: 'pharmacy', 
              isPublic: true,
              price: 0,
              rating: 4.9,
              totalUsers: 234,
              status: 'active'
            }
          ],
          publicForums: [],
          stats: {
            totalConnections: 67,
            totalRatings: 89,
            responseTime: '1 hour',
            completionRate: 97
          }
        }
      };

      const userData = mockUsers[userId];
      if (userData) {
        setProfileUser(userData);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Please log in</h2>
          <p className="text-gray-600">You need to be logged in to view user profiles.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <DashboardLayout title="User Profile">
        <div className="flex items-center justify-center py-12">
          <div className="text-lg">Loading user profile...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (!profileUser) {
    return (
      <DashboardLayout title="User Not Found">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">User not found</h2>
          <p className="text-gray-600 mb-4">The user profile you're looking for doesn't exist.</p>
          <Link href="/users" className="text-blue-600 hover:text-blue-800">
            Back to Users Directory
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title={profileUser.displayName || profileUser.email}
      subtitle="User Profile"
    >
      <div className="space-y-6">
        {/* User Header */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-start space-x-6">
            {/* Avatar */}
            <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-2xl">
                {(profileUser.displayName || profileUser.email).charAt(0).toUpperCase()}
              </span>
            </div>
            
            {/* User Info */}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {profileUser.displayName || profileUser.email}
              </h1>
              <p className="text-gray-600 mb-2">{profileUser.email}</p>
              {profileUser.bio && (
                <p className="text-gray-700 mb-3">{profileUser.bio}</p>
              )}
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>Joined {new Date(profileUser.joinDate).toLocaleDateString()}</span>
                {profileUser.location && <span>• {profileUser.location}</span>}
                {profileUser.website && (
                  <a href={profileUser.website} target="_blank" rel="noopener noreferrer" 
                     className="text-blue-600 hover:text-blue-800">
                    Website
                  </a>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="text-right">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-semibold text-gray-900">{profileUser.stats.totalConnections}</div>
                  <div className="text-gray-500">Connections</div>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{profileUser.stats.totalRatings}</div>
                  <div className="text-gray-500">Ratings</div>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{profileUser.stats.responseTime}</div>
                  <div className="text-gray-500">Avg Response</div>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{profileUser.stats.completionRate}%</div>
                  <div className="text-gray-500">Completion</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* CERT Score */}
          <div className="lg:col-span-1">
            <CertScoreDetailed certScore={profileUser.certScore} />
          </div>

          {/* Public Contributions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Public Contributions</h3>
              
              {/* Tab Navigation */}
              <div className="flex space-x-1 mb-6">
                <button
                  onClick={() => setActiveTab('policies')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    activeTab === 'policies' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Policies ({profileUser.publicPolicies.length})
                </button>
                <button
                  onClick={() => setActiveTab('services')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    activeTab === 'services' 
                      ? 'bg-green-100 text-green-700' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Services ({profileUser.publicServices.length})
                </button>
                <button
                  onClick={() => setActiveTab('forums')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    activeTab === 'forums' 
                      ? 'bg-purple-100 text-purple-700' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Forums ({profileUser.publicForums.length})
                </button>
              </div>

              {/* Tab Content */}
              <div className="space-y-4">
                {activeTab === 'policies' && (
                  <>
                    {profileUser.publicPolicies.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">No public policies yet</p>
                    ) : (
                      profileUser.publicPolicies.map((policy) => (
                        <div key={policy.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900">{policy.title}</h4>
                              <p className="text-gray-600 text-sm mt-1">{policy.description}</p>
                              <div className="flex items-center space-x-4 mt-3 text-xs text-gray-500">
                                <span>Created {new Date(policy.createdDate).toLocaleDateString()}</span>
                                <span>• {policy.stakeholders} stakeholders</span>
                                <span className={`px-2 py-1 rounded-full ${
                                  policy.status === 'active' ? 'bg-green-100 text-green-800' :
                                  policy.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {policy.status}
                                </span>
                              </div>
                            </div>
                            <Link 
                              href={`/policies/${policy.id}`}
                              className="ml-4 text-blue-600 hover:text-blue-800 text-sm"
                            >
                              View Policy
                            </Link>
                          </div>
                        </div>
                      ))
                    )}
                  </>
                )}

                {activeTab === 'services' && (
                  <>
                    {profileUser.publicServices.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">No public services yet</p>
                    ) : (
                      profileUser.publicServices.map((service) => (
                        <div key={service.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900">{service.title}</h4>
                              <p className="text-gray-600 text-sm mt-1">{service.description}</p>
                              <div className="flex items-center space-x-4 mt-3 text-xs text-gray-500">
                                {service.price !== undefined && (
                                  <span>
                                    {service.price === 0 ? 'Free' : `${service.currency} $${service.price}`}
                                  </span>
                                )}
                                <span>• ⭐ {service.rating.toFixed(1)}</span>
                                <span>• {service.totalUsers} users</span>
                                <span className={`px-2 py-1 rounded-full ${
                                  service.status === 'active' ? 'bg-green-100 text-green-800' :
                                  service.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {service.status}
                                </span>
                              </div>
                            </div>
                            <Link 
                              href={`/services/${service.id}`}
                              className="ml-4 text-green-600 hover:text-green-800 text-sm"
                            >
                              View Service
                            </Link>
                          </div>
                        </div>
                      ))
                    )}
                  </>
                )}

                {activeTab === 'forums' && (
                  <>
                    {profileUser.publicForums.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">No public forums yet</p>
                    ) : (
                      profileUser.publicForums.map((forum) => (
                        <div key={forum.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900">{forum.title}</h4>
                              <p className="text-gray-600 text-sm mt-1">{forum.description}</p>
                              <div className="flex items-center space-x-4 mt-3 text-xs text-gray-500">
                                <span>{forum.memberCount} members</span>
                                <span>• {forum.messageCount} messages</span>
                                <span>• Last active {new Date(forum.lastActivity).toLocaleDateString()}</span>
                              </div>
                            </div>
                            <Link 
                              href={`/forums/${forum.id}`}
                              className="ml-4 text-purple-600 hover:text-purple-800 text-sm"
                            >
                              Join Forum
                            </Link>
                          </div>
                        </div>
                      ))
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}