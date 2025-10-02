'use client';

import React, { useState, useEffect } from 'react';

// SVG Icons (matching your existing style)
const CalendarIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
  </svg>
);

const FileTextIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
  </svg>
);

const MessageSquareIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
  </svg>
);

const UsersIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A3.01 3.01 0 0 0 16.04 6c-.8 0-1.54.37-2.01.97l-2.66 3.37a2 2 0 0 0-.37 1.17v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-2.59l2.5-3.17L17.5 16H14v6h2v-4h4v4h2zm-7.5-10.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5S11 9.17 11 10.5s.67 1.5 1.5 1.5zM5.5 6c1.11 0 2-.89 2-2s-.89-2-2-2-2 .89-2 2 .89 2 2 2zm1.5 16v-7H9l1.5-7.27c.32-1.54-.87-3-2.46-2.73-.8.14-1.42.75-1.56 1.56L5 14H3v8h1v-6h2v6h1z"/>
  </svg>
);

const ClockIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M16.2,16.2L11,13V7H12.5V12.2L17,14.9L16.2,16.2Z"/>
  </svg>
);

const CheckCircleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z"/>
  </svg>
);

const HeartIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5 2,5.42 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.42 22,8.5C22,12.27 18.6,15.36 13.45,20.04L12,21.35Z"/>
  </svg>
);

const PillIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M4.22,11.29L11.29,4.22C13.64,1.87 17.43,1.87 19.78,4.22C22.13,6.57 22.13,10.36 19.78,12.71L12.71,19.78C10.36,22.13 6.57,22.13 4.22,19.78C1.87,17.43 1.87,13.64 4.22,11.29M5.64,12.71C4.59,13.75 4.24,15.24 4.64,16.57L10.47,10.74L5.64,12.71M19.36,11.29C18.31,10.24 16.82,9.89 15.49,10.29L9.66,16.12L19.36,11.29Z"/>
  </svg>
);

// User type for better TypeScript support
interface User {
  id: string;
  email: string;
  role: 'patient' | 'doctor' | 'pharmacist';
  profile: {
    name: string;
  };
  certScore: {
    cooperation: number;
    engagement: number;
    retention: number;
    trust: number;
  };
}

// Dashboard Card Component
interface DashboardCardProps {
  title: string;
  icon: React.ReactNode;
  description: string;
  action: string;
  color: string;
  onClick?: () => void;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ 
  title, 
  icon, 
  description, 
  action, 
  color, 
  onClick 
}) => (
  <div 
    className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
    onClick={onClick}
  >
    <div className={`${color} w-12 h-12 rounded-lg flex items-center justify-center text-white mb-4`}>
      {icon}
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600 mb-4">{description}</p>
    <button className="text-blue-600 hover:text-blue-800 font-medium">
      {action} →
    </button>
  </div>
);

// Main Telehealth Dashboard Component
interface TelehealthDashboardProps {
  user: User;
}

export const TelehealthDashboard: React.FC<TelehealthDashboardProps> = ({ user }) => {
  const [recentActivity] = useState([
    {
      id: '1',
      description: "Prescription for Paracetamol ready for pickup",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      type: 'prescription',
      isRead: false
    },
    {
      id: '2',
      description: "Consultation with Dr. Johnson completed",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      type: 'consultation',
      isRead: true
    }
  ]);

  const getDashboardContent = () => {
    switch (user.role) {
      case 'patient':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DashboardCard
              title="Book Consultation"
              icon={<CalendarIcon />}
              description="Schedule appointment with your doctor"
              action="Book Now"
              color="bg-blue-500"
              onClick={() => console.log('Navigate to booking')}
            />
            <DashboardCard
              title="Active Prescriptions"
              icon={<FileTextIcon />}
              description="View and manage your prescriptions"
              action="View All"
              color="bg-green-500"
              onClick={() => console.log('Navigate to prescriptions')}
            />
            <DashboardCard
              title="Consultation History"
              icon={<ClockIcon />}
              description="Previous consultations and records"
              action="View History"
              color="bg-purple-500"
              onClick={() => console.log('Navigate to history')}
            />
          </div>
        );
      case 'doctor':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DashboardCard
              title="Today's Consultations"
              icon={<UsersIcon />}
              description="8 scheduled appointments"
              action="View Schedule"
              color="bg-blue-500"
              onClick={() => console.log('Navigate to schedule')}
            />
            <DashboardCard
              title="Pending Prescriptions"
              icon={<FileTextIcon />}
              description="3 prescriptions awaiting review"
              action="Review"
              color="bg-orange-500"
              onClick={() => console.log('Navigate to prescriptions')}
            />
            <DashboardCard
              title="Patient Forums"
              icon={<MessageSquareIcon />}
              description="5 active patient communications"
              action="View Messages"
              color="bg-green-500"
              onClick={() => console.log('Navigate to forums')}
            />
          </div>
        );
      case 'pharmacist':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DashboardCard
              title="New Prescriptions"
              icon={<FileTextIcon />}
              description="12 prescriptions ready for fulfillment"
              action="Process"
              color="bg-blue-500"
              onClick={() => console.log('Navigate to new prescriptions')}
            />
            <DashboardCard
              title="In Progress"
              icon={<ClockIcon />}
              description="8 prescriptions being prepared"
              action="Update Status"
              color="bg-yellow-500"
              onClick={() => console.log('Navigate to in progress')}
            />
            <DashboardCard
              title="Ready for Pickup"
              icon={<CheckCircleIcon />}
              description="5 prescriptions ready"
              action="Mark Collected"
              color="bg-green-500"
              onClick={() => console.log('Navigate to ready')}
            />
          </div>
        );
      default:
        return <div>Unknown user role</div>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header with role-specific greeting */}
      <div className="text-center">
        <div className="flex justify-center mb-4">
          {user.role === 'patient' && (
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <HeartIcon />
            </div>
          )}
          {user.role === 'doctor' && (
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <UsersIcon />
            </div>
          )}
          {user.role === 'pharmacist' && (
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
              <PillIcon />
            </div>
          )}
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome, {user.profile.name}
        </h2>
        <p className="text-gray-600">
          {user.role === 'patient' && 'Manage your healthcare journey'}
          {user.role === 'doctor' && 'Manage your practice and patients'}
          {user.role === 'pharmacist' && 'Manage prescription fulfillment'}
        </p>
      </div>

      {/* Role-specific dashboard content */}
      {getDashboardContent()}
      
      {/* Bottom section with activity and CERT score */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivityFeed activities={recentActivity} />
        <CERTScore score={user.certScore} />
      </div>
    </div>
  );
};

// Activity Feed Component
interface Activity {
  id: string;
  description: string;
  timestamp: string;
  type: string;
  isRead: boolean;
}

interface ActivityFeedProps {
  activities: Activity[];
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
    <div className="space-y-3">
      {activities.length === 0 ? (
        <p className="text-gray-500">No recent activity</p>
      ) : (
        activities.map((activity) => (
          <div key={activity.id} className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className={`w-2 h-2 rounded-full ${
                activity.isRead ? 'bg-gray-400' : 'bg-blue-500'
              }`}></div>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-800">{activity.description}</p>
              <p className="text-xs text-gray-500">
                {new Date(activity.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  </div>
);

// CERT Score Component
interface CERTScoreProps {
  score: {
    cooperation: number;
    engagement: number;
    retention: number;
    trust: number;
  };
}

const CERTScore: React.FC<CERTScoreProps> = ({ score }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <h3 className="text-lg font-medium text-gray-900 mb-4">CERT Score</h3>
    <div className="space-y-4">
      <div>
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-gray-700">Cooperation</span>
          <span className="text-sm font-bold text-blue-600">{score.cooperation}/100</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
            style={{ width: `${score.cooperation}%` }}
          ></div>
        </div>
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-gray-700">Engagement</span>
          <span className="text-sm font-bold text-green-600">{score.engagement}/100</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-green-600 h-2 rounded-full transition-all duration-500" 
            style={{ width: `${score.engagement}%` }}
          ></div>
        </div>
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-gray-700">Retention</span>
          <span className="text-sm font-bold text-yellow-600">{score.retention}/100</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-yellow-600 h-2 rounded-full transition-all duration-500" 
            style={{ width: `${score.retention}%` }}
          ></div>
        </div>
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-gray-700">Trust</span>
          <span className="text-sm font-bold text-purple-600">{score.trust}/100</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-purple-600 h-2 rounded-full transition-all duration-500" 
            style={{ width: `${score.trust}%` }}
          ></div>
        </div>
      </div>
    </div>
    
    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
      <p className="text-xs text-gray-600">
        Your CERT score measures Cooperation, Engagement, Retention, and Trust 
        within the healthcare network.
      </p>
    </div>
  </div>
);

export default TelehealthDashboard;