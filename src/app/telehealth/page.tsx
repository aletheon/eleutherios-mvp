'use client';

import { DashboardLayout } from '@/components/DashboardLayout';
import { TelehealthDashboard } from '@/components/TelehealthDashboard';
import { useAuth } from '@/contexts/AuthContext';

// Mock user data - replace with your actual user data
const getMockUser = (authUser: any) => ({
  id: authUser?.uid || 'mock-id',
  email: authUser?.email || 'test@example.com',
  role: authUser?.email?.includes('dr.') ? 'doctor' as const
      : authUser?.email?.includes('pharmacy') ? 'pharmacist' as const
      : 'patient' as const,
  profile: {
    name: authUser?.email?.includes('dr.') ? 'Dr. Sarah Johnson'
        : authUser?.email?.includes('pharmacy') ? 'PharmaCorp Staff'
        : 'Alex Patient'
  },
  certScore: {
    cooperation: 85,
    engagement: 92,
    retention: 78,
    trust: 88
  }
});

export default function TelehealthPage() {
  const { user } = useAuth();
  
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Please log in</h2>
          <p className="text-gray-600">You need to be logged in to access telehealth services.</p>
        </div>
      </div>
    );
  }

  const mockUser = getMockUser(user);

  return (
    <DashboardLayout
      title="Telehealth Dashboard"
      subtitle={`${mockUser.role.charAt(0).toUpperCase() + mockUser.role.slice(1)} Portal`}
    >
      <TelehealthDashboard user={mockUser} />
    </DashboardLayout>
  );
}