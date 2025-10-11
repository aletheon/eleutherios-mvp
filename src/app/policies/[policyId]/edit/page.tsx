'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface ForumRule {
  ruleName: string;
  forumTitle: string;
  stakeholders: string[];
  description?: string;
}

interface Policy {
  id: string;
  title: string;
  description?: string;
  category: string;
  status: string;
  createdAt: string;
  authorId?: string;
  rules?: ForumRule[];
  eleuscript?: string;
}

export default function EditPolicyPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const policyId = params?.policyId as string;
  
  const [isActivitiesExpanded, setIsActivitiesExpanded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [policy, setPolicy] = useState<Policy | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'housing',
    status: 'draft'
  });

  // EleuScript rule management
  const [rules, setRules] = useState<ForumRule[]>([]);
  const [currentRule, setCurrentRule] = useState<ForumRule>({
    ruleName: '',
    forumTitle: '',
    stakeholders: [],
    description: ''
  });
  const [stakeholderInput, setStakeholderInput] = useState('');
  const [showEleuScript, setShowEleuScript] = useState(false);
  const [generatedEleuScript, setGeneratedEleuScript] = useState('');

  // Mock activities and users data
  const activities = [
    { id: '1', type: 'forum', title: 'Emergency Housing', status: 'active' },
    { id: '2', type: 'policy', title: 'Healthcare Policy', status: 'pending' },
    { id: '3', type: 'service', title: 'Food Bank', status: 'completed' }
  ];

  const users = [
    { id: '1', name: 'Sarah Chen', avatar: '👩‍💼', status: 'online' },
    { id: '2', name: 'Marcus Johnson', avatar: '👨‍⚕️', status: 'busy' },
    { id: '3', name: 'Elena Rodriguez', avatar: '👩‍🏫', status: 'away' }
  ];

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchPolicy();
  }, [policyId, user]);

  const fetchPolicy = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `https://eleutherios-mvp-3c717-default-rtdb.asia-southeast1.firebasedatabase.app/policies/${policyId}.json`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch policy');
      }

      const policyData = await response.json();
      
      if (!policyData) {
        throw new Error('Policy not found');
      }

      // Check ownership
      if (policyData.creatorId !== user?.uid && policyData.authorId !== user?.uid) {
        setError('You do not have permission to edit this policy');
        return;
      }

      const fetchedPolicy: Policy = {
        id: policyId,
        title: policyData.title || '',
        description: policyData.description || '',
        category: policyData.category || 'housing',
        status: policyData.status || 'draft',
        createdAt: policyData.createdAt || new Date().toISOString(),
        authorId: policyData.creatorId || policyData.authorId,
        rules: policyData.rules || [],
        eleuscript: policyData.eleuscript || ''
      };

      setPolicy(fetchedPolicy);
      
      // Set form data
      setFormData({
        title: fetchedPolicy.title,
        description: fetchedPolicy.description || '',
        category: fetchedPolicy.category,
        status: fetchedPolicy.status
      });

      // Set rules
      setRules(fetchedPolicy.rules || []);
      
      // Generate EleuScript
      if (fetchedPolicy.rules && fetchedPolicy.rules.length > 0) {
        const script = generateEleuScript(fetchedPolicy.rules);
        setGeneratedEleuScript(script);
      }

    } catch (error) {
      console.error('Error fetching policy:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const addStakeholder = () => {
    if (stakeholderInput.trim() && !currentRule.stakeholders.includes(stakeholderInput.trim())) {
      setCurrentRule({
        ...currentRule,
        stakeholders: [...currentRule.stakeholders, stakeholderInput.trim()]
      });
      setStakeholderInput('');
    }
  };

  const removeStakeholder = (stakeholder: string) => {
    setCurrentRule({
      ...currentRule,
      stakeholders: currentRule.stakeholders.filter(s => s !== stakeholder)
    });
  };

  const generateEleuScript = (rulesList: ForumRule[]): string => {
    if (rulesList.length === 0) return '';
    
    const ruleStrings = rulesList.map(rule => {
      const stakeholdersList = rule.stakeholders.length > 0 
        ? `, stakeholders=[${rule.stakeholders.map(s => `"${s}"`).join(', ')}]`
        : '';
      
      return `  rule ${rule.ruleName} -> Forum("${rule.forumTitle}"${stakeholdersList})`;
    });

    return `policy ${formData.title.replace(/\s+/g, '')} {
${ruleStrings.join('\n')}
}`;
  };

  const addRule = () => {
    if (!currentRule.ruleName || !currentRule.forumTitle) {
      setError('Rule name and forum title are required');
      return;
    }

    const newRules = [...rules, currentRule];
    setRules(newRules);
    
    // Generate EleuScript
    const script = generateEleuScript(newRules);
    setGeneratedEleuScript(script);

    // Reset current rule
    setCurrentRule({
      ruleName: '',
      forumTitle: '',
      stakeholders: [],
      description: ''
    });
    setError('');
  };

  const removeRule = (index: number) => {
    const newRules = rules.filter((_, i) => i !== index);
    setRules(newRules);
    const script = generateEleuScript(newRules);
    setGeneratedEleuScript(script);
  };

  const handleSave = async () => {
    if (!user || !policy) return;

    try {
      setSaving(true);
      setError(null);

      const updatedPolicy = {
        ...policy,
        ...formData,
        rules: rules,
        eleuscript: generatedEleuScript,
        updatedAt: new Date().toISOString()
      };

      const token = (user as any).accessToken;

      const response = await fetch(
        `https://eleutherios-mvp-3c717-default-rtdb.asia-southeast1.firebasedatabase.app/policies/${policyId}.json?auth=${token}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedPolicy),
        }
      );

      if (response.ok) {
        alert('Policy updated successfully!');
        router.push(`/policies/${policyId}`);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to update policy');
      }
    } catch (err) {
      console.error('Error updating policy:', err);
      setError('An error occurred while saving');
    } finally {
      setSaving(false);
    }
  };

  const handleLogoClick = () => {
    setIsActivitiesExpanded(!isActivitiesExpanded);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'forum': return '💬';
      case 'policy': return '📋';
      case 'service': return '🔧';
      default: return '📄';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'completed': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading policy...</p>
          </div>
        </div>
      </>
    );
  }

  if (error || !policy) {
    return (
      <>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">❌</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Cannot Edit Policy</h1>
            <p className="text-gray-600 mb-4">{error || 'The policy you are trying to edit is not available.'}</p>
            <Link href="/policies" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Back to Policies
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Material Icons Font */}
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
      
      {/* Activities Panel */}
      <div 
        className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 z-50 transition-all duration-300 ${
          isActivitiesExpanded ? 'w-80' : 'w-16'
        }`}
      >
        <div 
          className="h-16 flex items-center justify-center cursor-pointer hover:bg-gray-50 border-b border-gray-200"
          onClick={handleLogoClick}
        >
        </div>

        <div className="flex-1 overflow-y-auto">
          {isActivitiesExpanded ? (
            <div className="p-4">
              <h3 className="text-sm font-semibold text-gray-600 mb-3">Recent Activities</h3>
              <div className="space-y-3">
                {activities.map((activity) => (
                  <div key={activity.id} className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 cursor-pointer">
                    <div className="flex items-start space-x-3">
                      <div className="text-lg">{getActivityIcon(activity.type)}</div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-medium text-gray-900">{activity.title}</h4>
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(activity.status)}`}></div>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          {activity.type === 'forum' ? 'Active discussion' : 
                           activity.type === 'policy' ? 'Review pending' : 'Completed successfully'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <h3 className="text-sm font-semibold text-gray-600 mb-3 mt-6">Active Users</h3>
              <div className="space-y-2">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                    <div className="text-2xl">{user.avatar}</div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="py-4">
              {users.slice(0, 3).map((user, index) => (
                <div key={user.id} className="flex justify-center py-2">
                  <div className="text-2xl">{user.avatar}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Full Width Navigation Background */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-gradient-to-r from-purple-600 to-blue-600 z-30"></div>

      {/* Home Icon - Left Edge */}
      <div 
        className={`fixed top-0 h-16 z-40 transition-all duration-300 flex items-center ${
          isActivitiesExpanded ? 'left-80 w-20' : 'left-16 w-20'
        }`}
      >
        <Link href="/" className="flex flex-col items-center space-y-1 px-3 py-2 mx-auto rounded-lg text-white/80 hover:text-white hover:bg-white/10">
          <span className="material-icons text-2xl">home</span>
          <span className="text-xs font-medium">Home</span>
        </Link>
      </div>

      {/* Main Navigation Bar */}
      <nav 
        className={`fixed top-0 right-0 h-16 z-40 transition-all duration-300 ${
          isActivitiesExpanded ? 'left-96' : 'left-36'
        }`}
      >
        <div className="h-full flex items-center justify-between px-6">
          <div className="flex-1 flex justify-center">
            <div className="flex items-center space-x-8">
              <Link href="/forums" className="flex flex-col items-center space-y-1 px-3 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10">
                <span className="material-icons text-2xl">forum</span>
                <span className="text-xs font-medium">Forums</span>
              </Link>

              <Link href="/services" className="flex flex-col items-center space-y-1 px-3 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10">
                <span className="material-icons text-2xl">build</span>
                <span className="text-xs font-medium">Services</span>
              </Link>

              <Link href="/policies" className="flex flex-col items-center space-y-1 px-3 py-2 rounded-lg bg-white/20 text-white">
                <span className="material-icons text-2xl">account_balance</span>
                <span className="text-xs font-medium">Policies</span>
              </Link>

              <Link href="/users" className="flex flex-col items-center space-y-1 px-3 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10">
                <span className="material-icons text-2xl">people_alt</span>
                <span className="text-xs font-medium">Users</span>
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="text-white/80 hover:text-white p-2 rounded-lg hover:bg-white/10">
              <span className="material-icons text-2xl">shopping_cart</span>
            </button>

            <div className="flex items-center space-x-2 text-white/80 hover:text-white p-2 rounded-lg hover:bg-white/10">
              <span className="material-icons text-2xl">account_circle</span>
              <span className="text-sm font-medium">RK</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main 
        className={`transition-all duration-300 ${
          isActivitiesExpanded ? 'ml-80' : 'ml-16'
        } pt-16 p-6 min-h-screen bg-gray-50`}
      >
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6 mt-8">
            <Link href={`/policies/${policyId}`} className="text-blue-600 hover:text-blue-800">
              ← Back to Policy
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Policy</h1>
            <p className="text-gray-600">Update policy information and EleuScript rules</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <div className="space-y-6">
            {/* Basic Policy Information */}
            <div className="bg-white shadow-md rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Policy Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Policy Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="housing">Housing</option>
                    <option value="tenancy">Tenancy</option>
                    <option value="support">Support Services</option>
                    <option value="health">Health & Wellbeing</option>
                    <option value="employment">Employment</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  id="description"
                  rows={4}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            {/* EleuScript Rule Builder */}
            <div className="bg-white shadow-md rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Add Forum Rules (EleuScript)</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rule Name *
                  </label>
                  <input
                    type="text"
                    value={currentRule.ruleName}
                    onChange={(e) => setCurrentRule({ ...currentRule, ruleName: e.target.value })}
                    placeholder="e.g., CreateCoordinationForum"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Forum Title *
                  </label>
                  <input
                    type="text"
                    value={currentRule.forumTitle}
                    onChange={(e) => setCurrentRule({ ...currentRule, forumTitle: e.target.value })}
                    placeholder="e.g., Emergency Housing Coordination"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stakeholders
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={stakeholderInput}
                    onChange={(e) => setStakeholderInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addStakeholder())}
                    placeholder="e.g., Caseworker, Housing Officer, Person"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <button
                    type="button"
                    onClick={addStakeholder}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>

                {currentRule.stakeholders.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {currentRule.stakeholders.map((stakeholder, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                      >
                        {stakeholder}
                        <button
                          type="button"
                          onClick={() => removeStakeholder(stakeholder)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rule Description (Optional)
                </label>
                <textarea
                  value={currentRule.description}
                  onChange={(e) => setCurrentRule({ ...currentRule, description: e.target.value })}
                  rows={2}
                  placeholder="Describe what this rule does..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <button
                type="button"
                onClick={addRule}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Add Forum Rule
              </button>
            </div>

            {/* Current Rules List */}
            {rules.length > 0 && (
              <div className="bg-white shadow-md rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Current Rules ({rules.length})</h3>
                
                {rules.map((rule, index) => (
                  <div key={index} className="border border-gray-200 rounded-md p-4 mb-4 last:mb-0">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900">{rule.ruleName}</h4>
                      <button
                        type="button"
                        onClick={() => removeRule(index)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                    
                    <p className="text-gray-600 mb-2">Creates Forum: "{rule.forumTitle}"</p>
                    
                    {rule.stakeholders.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        <span className="text-sm text-gray-500">Stakeholders:</span>
                        {rule.stakeholders.map((stakeholder, sIndex) => (
                          <span
                            key={sIndex}
                            className="inline-block px-2 py-1 rounded text-xs bg-gray-100 text-gray-700"
                          >
                            {stakeholder}
                          </span>
                        ))}
                      </div>
                    )}

                    {rule.description && (
                      <p className="text-sm text-gray-600">{rule.description}</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* EleuScript Preview */}
            {generatedEleuScript && (
              <div className="bg-white shadow-md rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Generated EleuScript</h3>
                  <button
                    type="button"
                    onClick={() => setShowEleuScript(!showEleuScript)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                  >
                    {showEleuScript ? 'Hide' : 'Show'} Code
                  </button>
                </div>
                
                {showEleuScript && (
                  <pre className="bg-gray-50 border border-gray-200 rounded-md p-4 overflow-x-auto text-sm">
                    <code className="text-purple-600">{generatedEleuScript}</code>
                  </pre>
                )}
              </div>
            )}

            {/* Save Actions */}
            <div className="flex justify-end gap-4">
              <Link
                href={`/policies/${policyId}`}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                Cancel
              </Link>
              
              <button
                type="button"
                onClick={handleSave}
                disabled={saving || !formData.title || !formData.description}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Update Policy'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}