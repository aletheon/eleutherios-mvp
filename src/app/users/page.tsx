'use client';

import { DashboardLayout } from '@/components/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface User {
  id: string;
  email: string;
  displayName?: string;
  joinDate: string;
  certScore: {
    cooperation: number;
    engagement: number;
    retention: number;
    trust: number;
  };
  publicPolicies: Policy[];
  publicServices: Service[];
  publicForums: Forum[];
}

interface Policy {
  id: string;
  title: string;
  category: string;
  isPublic: boolean;
}

interface Service {
  id: string;
  title: string;
  category: string;
  isPublic: boolean;
}

interface Forum {
  id: string;
  title: string;
  category: string;
  isPublic: boolean;
}

// Simple Pie Chart Component
const PieChart = ({ data, size = 60 }: { data: { label: string; value: number; color: string }[]; size?: number }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  if (total === 0) return <div className={`w-${size} h-${size} bg-gray-200 rounded-full`}></div>;
  
  let cumulativePercentage = 0;
  const radius = size / 2;
  const centerX = radius;
  const centerY = radius;
  
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {data.map((item, index) => {
          const percentage = (item.value / total) * 100;
          const strokeDasharray = `${percentage} ${100 - percentage}`;
          const strokeDashoffset = -cumulativePercentage;
          cumulativePercentage += percentage;
          
          return (
            <circle
              key={index}
              cx={centerX}
              cy={centerY}
              r={radius - 4}
              fill="transparent"
              stroke={item.color}
              strokeWidth="8"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-500"
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-bold text-gray-800">{total}</span>
      </div>
    </div>
  );
};

// CERT Score Radar Chart Component (simplified as bars)
const CertScoreBars = ({ certScore, size = 'sm' }: { certScore: User['certScore']; size?: 'sm' | 'lg' }) => {
  const scores = [
    { label: 'C', value: certScore.cooperation, color: 'bg-blue-500' },
    { label: 'E', value: certScore.engagement, color: 'bg-green-500' },
    { label: 'R', value: certScore.retention, color: 'bg-yellow-500' },
    { label: 'T', value: certScore.trust, color: 'bg-purple-500' },
  ];
  
  const barHeight = size === 'lg' ? 'h-20' : 'h-12';
  const textSize = size === 'lg' ? 'text-sm' : 'text-xs';
  
  return (
    <div className="flex items-end space-x-2">
      {scores.map((score, index) => (
        <div key={index} className="flex flex-col items-center">
          <div className={`w-6 ${barHeight} bg-gray-200 rounded-t relative`}>
            <div 
              className={`${score.color} rounded-t absolute bottom-0 w-full transition-all duration-500`}
              style={{ height: `${score.value}%` }}
            ></div>
          </div>
          <span className={`${textSize} font-medium text-gray-600 mt-1`}>{score.label}</span>
          <span className={`${textSize} text-gray-500`}>{score.value}</span>
        </div>
      ))}
    </div>
  );
};

// User Card Component - FIXED WITH NAVIGATION
const UserCard = ({ user }: { user: User }) => {
  const getAverageCertScore = (certScore: User['certScore']) => {
    return Math.round((certScore.cooperation + certScore.engagement + certScore.retention + certScore.trust) / 4);
  };
  
  const contributionData = [
    { label: 'Policies', value: user.publicPolicies.length, color: '#3b82f6' },
    { label: 'Services', value: user.publicServices.length, color: '#10b981' },
    { label: 'Forums', value: user.publicForums.length, color: '#8b5cf6' },
  ];
  
  return (
    <Link href={`/users/${user.id}`} className="block">
      <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer">
        <div className="flex items-start justify-between mb-4">
          {/* User Info */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-lg">
                {(user.displayName || user.email).charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {user.displayName || user.email.split('@')[0]}
              </h3>
              <p className="text-sm text-gray-600">{user.email}</p>
              <p className="text-xs text-gray-500">
                Joined {new Date(user.joinDate).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          {/* CERT Score Badge */}
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {getAverageCertScore(user.certScore)}
            </div>
            <div className="text-xs text-gray-500">CERT</div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-6">
          {/* CERT Score Visualization */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">CERT Breakdown</h4>
            <CertScoreBars certScore={user.certScore} />
          </div>
          
          {/* Contributions Pie Chart */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Contributions</h4>
            <div className="flex items-center space-x-3">
              <PieChart data={contributionData} size={60} />
              <div className="space-y-1">
                {contributionData.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-xs text-gray-600">
                      {item.label}: {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Quick Links */}
        {(user.publicPolicies.length > 0 || user.publicServices.length > 0 || user.publicForums.length > 0) && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex flex-wrap gap-2">
              {user.publicPolicies.slice(0, 2).map((policy) => (
                <span
                  key={policy.id}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
                  onClick={(e) => e.stopPropagation()}
                >
                  {policy.title}
                </span>
              ))}
              {user.publicServices.slice(0, 2).map((service) => (
                <span
                  key={service.id}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800"
                  onClick={(e) => e.stopPropagation()}
                >
                  {service.title}
                </span>
              ))}
              {user.publicForums.slice(0, 1).map((forum) => (
                <span
                  key={forum.id}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800"
                  onClick={(e) => e.stopPropagation()}
                >
                  {forum.title}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </Link>
  );
};

export default function UsersPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'cert' | 'policies' | 'services'>('cert');

  useEffect(() => {
    if (user) {
      fetchUsers();
    }
  }, [user]);

  const fetchUsers = async () => {
    try {
      // Mock data for demonstration
      const mockUsers: User[] = [
        {
          id: '1',
          email: 'alex@patient.com',
          displayName: 'Alex Patient',
          joinDate: '2024-01-15',
          certScore: { cooperation: 85, engagement: 92, retention: 78, trust: 88 },
          publicPolicies: [],
          publicServices: [
            { id: 's1', title: 'Health Tracker', category: 'healthcare', isPublic: true }
          ],
          publicForums: []
        },
        {
          id: '2',
          email: 'dr.johnson@clinic.com',
          displayName: 'Dr. Sarah Johnson',
          joinDate: '2024-01-10',
          certScore: { cooperation: 95, engagement: 88, retention: 90, trust: 96 },
          publicPolicies: [
            { id: 'p1', title: 'Consultation Protocol', category: 'healthcare', isPublic: true },
            { id: 'p2', title: 'Prescription Guidelines', category: 'healthcare', isPublic: true }
          ],
          publicServices: [
            { id: 's2', title: 'Telehealth Service', category: 'healthcare', isPublic: true }
          ],
          publicForums: [
            { id: 'f1', title: 'Medical Q&A', category: 'healthcare', isPublic: true }
          ]
        },
        {
          id: '3',
          email: 'pharmacy@local.com',
          displayName: 'PharmaCorp',
          joinDate: '2024-01-12',
          certScore: { cooperation: 88, engagement: 85, retention: 92, trust: 89 },
          publicPolicies: [
            { id: 'p3', title: 'Rx Fulfillment', category: 'pharmacy', isPublic: true }
          ],
          publicServices: [
            { id: 's3', title: 'Med Delivery', category: 'pharmacy', isPublic: true },
            { id: 's4', title: 'Drug Check', category: 'pharmacy', isPublic: true }
          ],
          publicForums: []
        },
        {
          id: '4',
          email: 'housing@social.org',
          displayName: 'Housing Coordinator',
          joinDate: '2024-02-01',
          certScore: { cooperation: 92, engagement: 79, retention: 85, trust: 91 },
          publicPolicies: [
            { id: 'p4', title: 'Social Housing', category: 'housing', isPublic: true }
          ],
          publicServices: [
            { id: 's5', title: 'Housing App', category: 'housing', isPublic: true }
          ],
          publicForums: [
            { id: 'f2', title: 'Housing Support', category: 'housing', isPublic: true }
          ]
        }
      ];

      setUsers(mockUsers);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };

  const getAverageCertScore = (certScore: User['certScore']) => {
    return Math.round((certScore.cooperation + certScore.engagement + certScore.retention + certScore.trust) / 4);
  };

  const filteredAndSortedUsers = users
    .filter(u => 
      u.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a.displayName || a.email).localeCompare(b.displayName || b.email);
        case 'cert':
          return getAverageCertScore(b.certScore) - getAverageCertScore(a.certScore);
        case 'policies':
          return b.publicPolicies.length - a.publicPolicies.length;
        case 'services':
          return b.publicServices.length - a.publicServices.length;
        default:
          return 0;
      }
    });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Please log in</h2>
          <p className="text-gray-600">You need to be logged in to view users.</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout
      title="Network Users"
      subtitle="Discover users, their CERT scores, and public contributions"
    >
      <div className="space-y-6">
        {/* Search and Filter Controls */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="cert">Sort by CERT Score</option>
                <option value="name">Sort by Name</option>
                <option value="policies">Sort by Policies</option>
                <option value="services">Sort by Services</option>
              </select>
            </div>
          </div>
        </div>

        {/* Network Statistics with Visual Elements */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="material-icons text-blue-600" style={{ fontSize: '32px' }}>people_alt</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Total Users</h3>
            <p className="text-3xl font-bold text-blue-600">{users.length}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="material-icons text-green-600" style={{ fontSize: '32px' }}>account_balance</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Public Policies</h3>
            <p className="text-3xl font-bold text-green-600">
              {users.reduce((sum, user) => sum + user.publicPolicies.length, 0)}
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Public Services</h3>
            <p className="text-3xl font-bold text-purple-600">
              {users.reduce((sum, user) => sum + user.publicServices.length, 0)}
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-8 h-8 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Avg CERT Score</h3>
            <p className="text-3xl font-bold text-orange-600">
              {users.length > 0 
                ? Math.round(users.reduce((sum, user) => sum + getAverageCertScore(user.certScore), 0) / users.length)
                : 0
              }
            </p>
          </div>
        </div>

        {/* Users Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {loading ? (
            <div className="col-span-full p-8 text-center">
              <div className="text-lg">Loading users...</div>
            </div>
          ) : (
            filteredAndSortedUsers.map((user) => (
              <UserCard key={user.id} user={user} />
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}