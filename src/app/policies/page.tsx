// src/app/policies/page.tsx
'use client';

import { useState, useEffect } from 'react';

interface PolicyRule {
  name: string;
  type: 'Forum' | 'Service' | 'Policy';
  target: string;
  description?: string;
  instantiatedForumId?: string;
  instantiatedAt?: string;
}

interface Policy {
  id: string;
  name: string;
  description: string;
  visibility: 'public' | 'private';
  rules: PolicyRule[];
  createdAt: string;
}

export default function PoliciesPage() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const [newPolicyName, setNewPolicyName] = useState('');
  const [newPolicyDesc, setNewPolicyDesc] = useState('');
  const [newRuleName, setNewRuleName] = useState('');
  const [newRuleType, setNewRuleType] = useState<'Forum' | 'Service' | 'Policy'>('Forum');
  const [newRuleTarget, setNewRuleTarget] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'list' | 'create' | 'view'>('list');

  // Fetch all policies
  const fetchPolicies = async () => {
    try {
      const res = await fetch('/api/rest/policies');
      const data = await res.json();
      setPolicies(data.policies || []);
    } catch (error) {
      console.error('Error fetching policies:', error);
    }
  };

  // Create new policy
  const createPolicy = async () => {
    if (!newPolicyName || !newPolicyDesc || !newRuleName) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/rest/policies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newPolicyName,
          description: newPolicyDesc,
          visibility: 'public',
          rules: [{
            name: newRuleName,
            type: newRuleType,
            target: newRuleTarget || `${newRuleName} Forum`,
            description: `${newRuleType} for ${newPolicyName}`
          }]
        })
      });

      if (res.ok) {
        setNewPolicyName('');
        setNewPolicyDesc('');
        setNewRuleName('');
        setNewRuleTarget('');
        fetchPolicies();
        setActiveTab('list');
        alert('Policy created successfully!');
      }
    } catch (error) {
      console.error('Error creating policy:', error);
      alert('Failed to create policy');
    } finally {
      setLoading(false);
    }
  };

  // Instantiate a forum from a policy rule
  const instantiateForum = async (policy: Policy, rule: PolicyRule) => {
    if (rule.instantiatedForumId) {
      alert('This rule has already been instantiated');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/policies/instantiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          policyId: policy.id,
          ruleName: rule.name,
          userId: 'test-user-123' // In production, get from auth
        })
      });

      if (res.ok) {
        const data = await res.json();
        alert(`Forum created! Forum ID: ${data.forumId}`);
        fetchPolicies(); // Refresh to show instantiation
      } else {
        const error = await res.json();
        alert('Error: ' + error.error);
      }
    } catch (error) {
      console.error('Error instantiating forum:', error);
      alert('Failed to instantiate forum');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8">Policies (PFSD Model)</h1>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-800">
          <strong>EleuScript:</strong> Policies define rules that can be instantiated into Forums, 
          connected to Services, or reference other Policies. This creates the governance layer 
          of the PFSD model.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-4 mb-6 border-b">
        <button
          onClick={() => setActiveTab('list')}
          className={`pb-2 px-1 ${activeTab === 'list' 
            ? 'border-b-2 border-purple-600 text-purple-600' 
            : 'text-gray-600'}`}
        >
          All Policies ({policies.length})
        </button>
        <button
          onClick={() => setActiveTab('create')}
          className={`pb-2 px-1 ${activeTab === 'create' 
            ? 'border-b-2 border-purple-600 text-purple-600' 
            : 'text-gray-600'}`}
        >
          Create Policy
        </button>
        {selectedPolicy && (
          <button
            onClick={() => setActiveTab('view')}
            className={`pb-2 px-1 ${activeTab === 'view' 
              ? 'border-b-2 border-purple-600 text-purple-600' 
              : 'text-gray-600'}`}
          >
            {selectedPolicy.name}
          </button>
        )}
      </div>

      {/* Policies List */}
      {activeTab === 'list' && (
        <div className="space-y-4">
          {policies.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <p className="text-gray-500 mb-4">No policies created yet</p>
              <button
                onClick={() => setActiveTab('create')}
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
              >
                Create First Policy
              </button>
            </div>
          ) : (
            policies.map(policy => (
              <div key={policy.id} className="bg-white border rounded-lg p-4 hover:shadow-md">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-1">{policy.name}</h3>
                    <p className="text-gray-600 mb-2">{policy.description}</p>
                    <div className="flex gap-4 text-sm">
                      <span className="text-gray-500">
                        {policy.rules?.length || 0} rules
                      </span>
                      <span className="text-gray-500">
                        {policy.visibility === 'public' ? '🌐 Public' : '🔒 Private'}
                      </span>
                    </div>
                    
                    {/* Show rules */}
                    {policy.rules && policy.rules.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {policy.rules.map((rule, idx) => (
                          <div key={idx} className="bg-gray-50 rounded p-2 flex justify-between items-center">
                            <div className="text-sm">
                              <span className="font-medium">{rule.name}</span>
                              <span className="mx-2">→</span>
                              <span className="text-gray-600">{rule.type}({rule.target})</span>
                              {rule.instantiatedForumId && (
                                <span className="ml-2 text-green-600">✓ Instantiated</span>
                              )}
                            </div>
                            {rule.type === 'Forum' && !rule.instantiatedForumId && (
                              <button
                                onClick={() => instantiateForum(policy, rule)}
                                disabled={loading}
                                className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:opacity-50"
                              >
                                Instantiate Forum
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      setSelectedPolicy(policy);
                      setActiveTab('view');
                    }}
                    className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 ml-4"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Create Policy */}
      {activeTab === 'create' && (
        <div className="bg-white border rounded-lg p-6 max-w-2xl">
          <h2 className="text-2xl font-semibold mb-4">Create New Policy</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Policy Name</label>
              <input
                type="text"
                value={newPolicyName}
                onChange={(e) => setNewPolicyName(e.target.value)}
                className="w-full border rounded px-3 py-2"
                placeholder="e.g., HousingPolicy"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={newPolicyDesc}
                onChange={(e) => setNewPolicyDesc(e.target.value)}
                className="w-full border rounded px-3 py-2 h-24"
                placeholder="Describe what this policy governs..."
              />
            </div>

            <div className="border-t pt-4">
              <h3 className="font-medium mb-3">Add First Rule</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Rule Name</label>
                  <input
                    type="text"
                    value={newRuleName}
                    onChange={(e) => setNewRuleName(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                    placeholder="e.g., TenancyAgreement"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Rule Type</label>
                  <select
                    value={newRuleType}
                    onChange={(e) => setNewRuleType(e.target.value as any)}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="Forum">Forum (Creates discussion space)</option>
                    <option value="Service">Service (Connects to service)</option>
                    <option value="Policy">Policy (References another policy)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Target</label>
                  <input
                    type="text"
                    value={newRuleTarget}
                    onChange={(e) => setNewRuleTarget(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                    placeholder={`e.g., ${newRuleType === 'Forum' ? 'Tenancy Forum' : 'PaymentService'}`}
                  />
                </div>
              </div>
            </div>

            <div className="bg-purple-50 p-3 rounded">
              <p className="text-sm text-purple-800">
                💡 Example EleuScript:
                <code className="block mt-1 bg-white p-2 rounded text-xs">
                  policy HousingPolicy {'{'}<br/>
                  &nbsp;&nbsp;rule TenancyAgreement → Forum("Tenancy Forum")<br/>
                  {'}'}
                </code>
              </p>
            </div>

            <button
              onClick={createPolicy}
              disabled={loading}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Policy'}
            </button>
          </div>
        </div>
      )}

      {/* View Policy Details */}
      {activeTab === 'view' && selectedPolicy && (
        <div className="bg-white border rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-2">{selectedPolicy.name}</h2>
          <p className="text-gray-600 mb-4">{selectedPolicy.description}</p>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Policy Rules</h3>
              {selectedPolicy.rules && selectedPolicy.rules.length > 0 ? (
                <div className="space-y-2">
                  {selectedPolicy.rules.map((rule, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{rule.name}</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            Type: {rule.type} → {rule.target}
                          </p>
                          {rule.description && (
                            <p className="text-sm text-gray-500 mt-1">{rule.description}</p>
                          )}
                          {rule.instantiatedForumId && (
                            <p className="text-sm text-green-600 mt-2">
                              ✓ Forum instantiated on {new Date(rule.instantiatedAt!).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        {rule.type === 'Forum' && !rule.instantiatedForumId && (
                          <button
                            onClick={() => instantiateForum(selectedPolicy, rule)}
                            disabled={loading}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                          >
                            Instantiate Forum
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No rules defined</p>
              )}
            </div>
            
            <div className="border-t pt-4">
              <p className="text-sm text-gray-500">
                Created: {new Date(selectedPolicy.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}