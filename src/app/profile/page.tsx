// src/app/profile/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/Navigation';

interface UserProfile {
  userId: string;
  displayName: string;
  username: string;
  email: string;
  paymentProviders: {
    stripe?: {
      accountId: string;
      status: 'connected' | 'pending' | 'disconnected';
      connectedAt: string;
    };
    paypal?: {
      email: string;
      status: 'connected' | 'disconnected';
    };
    bitcoin?: {
      address: string;
      status: 'connected' | 'disconnected';
    };
  };
  createdAt: string;
  lastUpdatedAt: string;
}

export default function ProfilePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  useEffect(() => {
    // Check for Stripe connection success in URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const stripeConnected = urlParams.get('stripe_connected');
    const accountId = urlParams.get('account_id');
    const userId = urlParams.get('user_id');
    const error = urlParams.get('error');

    if (error) {
      alert(`Stripe connection failed: ${error}`);
      // Clean up URL
      window.history.replaceState({}, '', '/profile');
    } else if (stripeConnected === 'true' && accountId && user) {
      // Save to Firebase
      saveStripeConnection(accountId);
      // Clean up URL
      window.history.replaceState({}, '', '/profile');
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const token = await user?.getIdToken();
      const response = await fetch(
        `https://eleutherios-mvp-3c717-default-rtdb.asia-southeast1.firebasedatabase.app/profiles/${user?.uid}.json?auth=${token}`
      );

      if (response.ok) {
        const data = await response.json();
        if (data) {
          setProfile(data);
          setDisplayName(data.displayName || '');
          setUsername(data.username || '');
        } else {
          // Initialize new profile
          const newProfile: UserProfile = {
            userId: user!.uid,
            displayName: user!.displayName || '',
            username: user!.email?.split('@')[0] || '',
            email: user!.email || '',
            paymentProviders: {},
            createdAt: new Date().toISOString(),
            lastUpdatedAt: new Date().toISOString(),
          };
          setProfile(newProfile);
          setDisplayName(newProfile.displayName);
          setUsername(newProfile.username);
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const token = await user.getIdToken();
      const updatedProfile = {
        ...profile,
        displayName,
        username,
        lastUpdatedAt: new Date().toISOString(),
      };

      const response = await fetch(
        `https://eleutherios-mvp-3c717-default-rtdb.asia-southeast1.firebasedatabase.app/profiles/${user.uid}.json?auth=${token}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedProfile),
        }
      );

      if (response.ok) {
        setProfile(updatedProfile as UserProfile);
        alert('Profile updated successfully');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const saveStripeConnection = async (accountId: string) => {
    if (!user) return;
    
    try {
      const token = await user.getIdToken();
      const updatedProfile = {
        ...profile,
        paymentProviders: {
          ...profile?.paymentProviders,
          stripe: {
            accountId,
            status: 'connected' as const,
            connectedAt: new Date().toISOString(),
          },
        },
        lastUpdatedAt: new Date().toISOString(),
      };

      const response = await fetch(
        `https://eleutherios-mvp-3c717-default-rtdb.asia-southeast1.firebasedatabase.app/profiles/${user.uid}.json?auth=${token}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedProfile),
        }
      );

      if (response.ok) {
        setProfile(updatedProfile as UserProfile);
        alert('Stripe connected successfully!');
      }
    } catch (error) {
      console.error('Error saving Stripe connection:', error);
      alert('Failed to save Stripe connection');
    }
  };

  const connectStripe = async () => {
    // This will redirect to Stripe OAuth
    const clientId = process.env.NEXT_PUBLIC_STRIPE_CONNECT_CLIENT_ID;
    const redirectUri = `${window.location.origin}/api/stripe/callback`;
    const state = user?.uid; // Pass user ID to identify after OAuth

    const stripeAuthUrl = `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${clientId}&scope=read_write&redirect_uri=${redirectUri}&state=${state}`;
    
    window.location.href = stripeAuthUrl;
  };

  const disconnectStripe = async () => {
    if (!user || !profile) return;

    if (!confirm('Are you sure you want to disconnect your Stripe account?')) {
      return;
    }

    try {
      const token = await user.getIdToken();
      const updatedProfile = {
        ...profile,
        paymentProviders: {
          ...profile.paymentProviders,
          stripe: undefined,
        },
        lastUpdatedAt: new Date().toISOString(),
      };

      const response = await fetch(
        `https://eleutherios-mvp-3c717-default-rtdb.asia-southeast1.firebasedatabase.app/profiles/${user.uid}.json?auth=${token}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedProfile),
        }
      );

      if (response.ok) {
        setProfile(updatedProfile as UserProfile);
        alert('Stripe disconnected');
      }
    } catch (error) {
      console.error('Error disconnecting Stripe:', error);
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
      <Navigation 
        onMenuClick={() => setShowUserMenu(!showUserMenu)}
        onActivitiesClick={() => {}}
      />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold mb-6">User Profile</h2>

        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your display name"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="username"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="text"
                value={user?.email || ''}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">User ID</label>
              <input
                type="text"
                value={user?.uid || ''}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 text-sm"
              />
            </div>

            <button
              onClick={saveProfile}
              disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </div>

        {/* Payment Providers */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Payment Providers</h3>
          
          <div className="space-y-4">
            {/* Stripe */}
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-md">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-bold">S</span>
                </div>
                <div>
                  <h4 className="font-medium">Stripe</h4>
                  {profile?.paymentProviders?.stripe ? (
                    <div>
                      <p className="text-sm text-green-600">Connected</p>
                      <p className="text-xs text-gray-500">Account: {profile.paymentProviders.stripe.accountId}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">Not connected</p>
                  )}
                </div>
              </div>
              {profile?.paymentProviders?.stripe ? (
                <button
                  onClick={disconnectStripe}
                  className="px-4 py-2 text-red-600 border border-red-600 rounded-md hover:bg-red-50"
                >
                  Disconnect
                </button>
              ) : (
                <button
                  onClick={connectStripe}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                >
                  Connect Stripe
                </button>
              )}
            </div>

            {/* PayPal */}
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-md">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold">P</span>
                </div>
                <div>
                  <h4 className="font-medium">PayPal</h4>
                  <p className="text-sm text-gray-500">Coming soon</p>
                </div>
              </div>
              <button
                disabled
                className="px-4 py-2 bg-gray-300 text-gray-500 rounded-md cursor-not-allowed"
              >
                Connect
              </button>
            </div>

            {/* Bitcoin */}
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-md">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 font-bold">₿</span>
                </div>
                <div>
                  <h4 className="font-medium">Bitcoin</h4>
                  <p className="text-sm text-gray-500">Coming soon</p>
                </div>
              </div>
              <button
                disabled
                className="px-4 py-2 bg-gray-300 text-gray-500 rounded-md cursor-not-allowed"
              >
                Connect
              </button>
            </div>

            {/* Google Pay */}
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-md">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold">G</span>
                </div>
                <div>
                  <h4 className="font-medium">Google Pay</h4>
                  <p className="text-sm text-gray-500">Coming soon</p>
                </div>
              </div>
              <button
                disabled
                className="px-4 py-2 bg-gray-300 text-gray-500 rounded-md cursor-not-allowed"
              >
                Connect
              </button>
            </div>

            {/* Apple Pay */}
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-md">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 font-bold"></span>
                </div>
                <div>
                  <h4 className="font-medium">Apple Pay</h4>
                  <p className="text-sm text-gray-500">Coming soon</p>
                </div>
              </div>
              <button
                disabled
                className="px-4 py-2 bg-gray-300 text-gray-500 rounded-md cursor-not-allowed"
              >
                Connect
              </button>
            </div>
          </div>
        </div>

        {/* Account Info */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Account Information</h3>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Created:</span>
              <span className="font-medium">
                {profile?.createdAt ? new Date(profile.createdAt).toLocaleString() : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Last Updated:</span>
              <span className="font-medium">
                {profile?.lastUpdatedAt ? new Date(profile.lastUpdatedAt).toLocaleString() : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}