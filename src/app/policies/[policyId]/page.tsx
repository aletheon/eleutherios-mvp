// src/app/policies/[policyId]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/Logo';

interface Policy {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  creatorId: string;
  creatorEmail: string;
  policymakers: string[];
  rules: Rule[];
  createdAt: string;
}

interface Rule {
  id: string;
  title: string;
  description: string;
  createdAt: string;
}

export default function PolicyDetailPage({ params }: { params: { policyId: string } }) {
  const { user } = useAuth();
  const router = useRouter();
  const [policy, setPolicy] = useState<Policy | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddRule, setShowAddRule] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [newRule, setNewRule] = useState({ title: '', description: '' });
  const [inviteEmail, setInviteEmail] = useState('');

  useEffect(() => {
    if (user) {
      fetchPolicy();
    }
  }, [user, params.policyId]);

  const fetchPolicy = async () => {
    try {
      const token = await user?.getIdToken();
      const response = await fetch(
        `https://eleutherios-mvp-3c717-default-rtdb.asia-southeast1.firebasedatabase.app/policies/${params.policyId}.json?auth=${token}`
      );

      if (response.ok) {
        const data = await response.json();
        if (data) {
          setPolicy({ id: params.policyId, ...data });
        }
      }
    } catch (error) {
      console.error('Error fetching policy:', error);
    } finally {
      setLoading(false);
    }
  };

  // src/app/policies/[policyId]/page.tsx
// Update the addRule function:

const addRule = async () => {
  if (!newRule.title.trim()) return;

  try {
    const token = await user?.getIdToken();
    const ruleId = Date.now().toString();
    const rule = {
      id: ruleId,
      ...newRule,
      createdAt: new Date().toISOString(),
    };

    const updatedRules = [...(policy?.rules || []), rule];

    // Save the rule
    const ruleResponse = await fetch(
      `https://eleutherios-mvp-3c717-default-rtdb.asia-southeast1.firebasedatabase.app/policies/${params.policyId}/rules.json?auth=${token}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedRules),
      }
    );

    if (ruleResponse.ok) {
      // Automatically create a forum for this rule
      const forumId = `forum-${ruleId}`;
      const forum = {
        id: forumId,
        policyId: params.policyId,
        ruleId: ruleId,
        title: newRule.title,
        description: newRule.description,
        status: 'active',
        participantCount: 0,
        postCount: 0,
        createdAt: new Date().toISOString(),
      };

      await fetch(
        `https://eleutherios-mvp-3c717-default-rtdb.asia-southeast1.firebasedatabase.app/forums/${forumId}.json?auth=${token}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(forum),
        }
      );

      setNewRule({ title: '', description: '' });
      setShowAddRule(false);
      alert(`Rule and forum created for "${newRule.title}"`);
      fetchPolicy();
    }
  } catch (error) {
    console.error('Error adding rule:', error);
  }
};

  const invitePolicymaker = async () => {
    if (!inviteEmail.trim()) return;

    try {
      const token = await user?.getIdToken();
      
      // Note: In a real app, you'd look up the user by email to get their UID
      // For MVP, we'll just store the email for now
      const updatedPolicymakers = [...(policy?.policymakers || []), inviteEmail];

      const response = await fetch(
        `https://eleutherios-mvp-3c717-default-rtdb.asia-southeast1.firebasedatabase.app/policies/${params.policyId}/policymakers.json?auth=${token}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedPolicymakers),
        }
      );

      if (response.ok) {
        alert(`Invitation sent to ${inviteEmail}`);
        setInviteEmail('');
        setShowInvite(false);
        fetchPolicy();
      }
    } catch (error) {
      console.error('Error inviting policymaker:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!policy) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Policy not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-1">
              <Logo className="w-8 h-8 text-gray-800" />
              <h1 className="text-xl font-bold">Eleutherios</h1>
            </div>
            <button
              onClick={() => router.push('/dashboard')}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Policy Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-3xl font-bold mb-2">{policy.title}</h2>
              <p className="text-gray-600 mb-4">{policy.description}</p>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded">
                  {policy.category}
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded">
                  {policy.status}
                </span>
              </div>
            </div>
          </div>

          <div className="border-t pt-4 mt-4">
            <p className="text-sm text-gray-500">
              Created by {policy.creatorEmail} on{' '}
              {new Date(policy.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Policymakers Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">
              Policymakers ({policy.policymakers?.length || 1})
            </h3>
            <button
              onClick={() => setShowInvite(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
            >
              + Invite Policymaker
            </button>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
              <span className="text-sm">{policy.creatorEmail}</span>
              <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded">
                Creator
              </span>
            </div>
            {policy.policymakers?.filter(pm => pm !== user?.uid).map((pm, idx) => (
              <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                <span className="text-sm">{pm}</span>
              </div>
            ))}
          </div>

          {/* Invite Modal */}
          {showInvite && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="text-lg font-semibold mb-4">Invite Policymaker</h3>
                <input
                  type="email"
                  placeholder="Enter email address"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
                />
                <div className="flex gap-2">
                  <button
                    onClick={invitePolicymaker}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Send Invite
                  </button>
                  <button
                    onClick={() => setShowInvite(false)}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Rules Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">
              Rules ({policy.rules?.length || 0})
            </h3>
            <button
              onClick={() => setShowAddRule(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
            >
              + Add Rule
            </button>
          </div>

          {policy.rules && policy.rules.length > 0 ? (
            <div className="space-y-3">
              {policy.rules.map((rule, idx) => (
                <div key={rule.id} className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold mb-1">{rule.title}</h4>
                  <p className="text-sm text-gray-600">{rule.description}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    Added {new Date(rule.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-8">
              No rules yet. Add your first rule to get started.
            </p>
          )}

          {/* Add Rule Modal */}
          {showAddRule && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="text-lg font-semibold mb-4">Add Rule</h3>
                <input
                  type="text"
                  placeholder="Rule title (e.g., Eligibility Criteria)"
                  value={newRule.title}
                  onChange={(e) => setNewRule({ ...newRule, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md mb-3"
                />
                <textarea
                  placeholder="Rule description"
                  value={newRule.description}
                  onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
                />
                <div className="flex gap-2">
                  <button
                    onClick={addRule}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Add Rule
                  </button>
                  <button
                    onClick={() => setShowAddRule(false)}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}