'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface ForumRule {
  ruleName: string;
  forumTitle: string;
  stakeholders: string[];
  description?: string;
}

export default function CreatePolicyPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'housing',
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!user) {
        setError('You must be logged in to create a policy');
        setLoading(false);
        return;
      }

      const policyId = Date.now().toString();
      const policy = {
        ...formData,
        id: policyId,
        creatorId: user.uid,
        creatorEmail: user.email,
        policymakers: [user.uid],
        status: 'draft',
        createdAt: new Date().toISOString(),
        rules: rules, // Add EleuScript rules
        eleuscript: generatedEleuScript, // Add generated EleuScript
      };

      // Get auth token - access the runtime property
      const token = (user as any).accessToken;

      const response = await fetch(
        `https://eleutherios-mvp-3c717-default-rtdb.asia-southeast1.firebasedatabase.app/policies/${policyId}.json?auth=${token}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(policy),
        }
      );

      if (response.ok) {
        alert('Policy created successfully!');
        router.push('/policies');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to create policy');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🏠</span>
              <h1 className="text-xl font-bold">Eleutherios</h1>
            </div>
            <button
              onClick={() => router.push('/policies')}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              ← Back to Policies
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold mb-6">Create Policy</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

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
                  placeholder="e.g., Social Housing, Tenancy Takeover, Housing First"
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

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                rows={4}
                required
                placeholder="Describe the purpose and scope of this policy..."
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

          <div className="bg-blue-50 border border-blue-200 p-4 rounded-md">
            <p className="text-sm text-blue-800">
              After creating this policy, you'll be able to invite other policymakers (like MSD case workers or homeless individuals) to collaborate. The EleuScript rules you've added will enable automatic forum creation and stakeholder coordination.
            </p>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => router.push('/policies')}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={loading || !formData.title || !formData.description}
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Policy'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}