'use client';

import React, { useState } from 'react';
import { CheckCircle, Home, Heart, Utensils, ArrowRight, Users } from 'lucide-react';

export default function HomelessPersonOnboarding() {
  const [step, setStep] = useState(1);
  const [personName, setPersonName] = useState('');
  const [serviceCreated, setServiceCreated] = useState(false);
  const [policiesConsumed, setPoliciesConsumed] = useState<string[]>([]);
  const [forumsCreated, setForumsCreated] = useState<string[]>([]);

  const publicPolicies = [
    {
      id: 'policy-emergency-housing',
      title: 'Emergency Social Housing',
      description: 'Immediate access to emergency housing through MSD and Kāinga Ora coordination',
      icon: Home,
      color: 'bg-blue-500',
      benefits: [
        'Immediate eligibility assessment (24 hours)',
        'Financial support for accommodation',
        'Emergency housing placement',
        'Coordination forum with MSD & KO',
        'Digital tenancy agreement',
        'Wraparound support services'
      ]
    },
    {
      id: 'policy-emergency-healthcare',
      title: 'Emergency Healthcare Access',
      description: 'Free healthcare, dental care, mental health support, and prescriptions',
      icon: Heart,
      color: 'bg-red-500',
      benefits: [
        'Free primary healthcare & GP visits',
        'Emergency dental care',
        'Mental health & addiction support',
        'Subsidized prescriptions ($5/item)',
        'Healthcare coordination forum'
      ]
    },
    {
      id: 'policy-food-security',
      title: 'Food Security & Nutrition',
      description: 'Access to food banks, community meals, and food grants',
      icon: Utensils,
      color: 'bg-green-500',
      benefits: [
        'Weekly food bank access',
        'Daily community meals (2 per day)',
        'Food grants up to $200',
        'Nutrition support coordination'
      ]
    }
  ];

  const handleCreateService = () => {
    if (!personName.trim()) {
      alert('Please enter your name');
      return;
    }
    
    setServiceCreated(true);
    setStep(2);
  };

  const handleConsumePolicy = (policyId: string, policyTitle: string) => {
    if (!policiesConsumed.includes(policyId)) {
      setPoliciesConsumed([...policiesConsumed, policyId]);
      
      const forumName = `${policyTitle} - ${personName}`;
      setForumsCreated([...forumsCreated, forumName]);
    }
  };

  const handleConsumeAll = () => {
    const allPolicyIds = publicPolicies.map(p => p.id);
    setPoliciesConsumed(allPolicyIds);
    
    const allForums = publicPolicies.map(p => `${p.title} - ${personName}`);
    setForumsCreated(allForums);
    
    setStep(3);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Basic Human Rights Access Portal
          </h1>
          <p className="text-xl text-gray-600">
            Immediate access to housing, healthcare, and food through the PFSD Protocol
          </p>
        </div>

        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center justify-center w-12 h-12 rounded-full ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>
              1
            </div>
            <div className={`w-24 h-1 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`} />
            <div className={`flex items-center justify-center w-12 h-12 rounded-full ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>
              2
            </div>
            <div className={`w-24 h-1 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-300'}`} />
            <div className={`flex items-center justify-center w-12 h-12 rounded-full ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>
              3
            </div>
          </div>
        </div>

        {step === 1 && (
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Step 1: Create Your Service Request
            </h2>
            <p className="text-gray-600 mb-8">
              In the PFSD protocol, you are a "Service" that consumes policies. 
              By creating your service, you can immediately access public policies 
              that guarantee your basic human rights.
            </p>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  value={personName}
                  onChange={(e) => setPersonName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">What happens next?</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Your service will be registered in the system</li>
                  <li>• You can consume public policies for housing, healthcare, and food</li>
                  <li>• Coordination forums will be automatically created</li>
                  <li>• MSD, KO, and healthcare providers will be notified</li>
                  <li>• You'll gain immediate access to support services</li>
                </ul>
              </div>

              <button
                onClick={handleCreateService}
                className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
              >
                Create My Service Request
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full mb-4">
                <CheckCircle size={20} />
                Service Created: {personName}
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Step 2: Consume Public Policies
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto mb-4">
                These policies are publicly available and guarantee your basic human rights.
                Click on each policy to consume it and gain immediate access.
              </p>
              <button
                onClick={handleConsumeAll}
                className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
              >
                Consume All Policies (Recommended)
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {publicPolicies.map((policy) => {
                const Icon = policy.icon;
                const isConsumed = policiesConsumed.includes(policy.id);
                
                return (
                  <div
                    key={policy.id}
                    className={`bg-white rounded-xl shadow-lg overflow-hidden transition ${
                      isConsumed ? 'ring-4 ring-green-400' : ''
                    }`}
                  >
                    <div className={`${policy.color} p-6 text-white`}>
                      <Icon size={48} className="mb-4" />
                      <h3 className="text-xl font-bold mb-2">{policy.title}</h3>
                      <p className="text-sm opacity-90">{policy.description}</p>
                    </div>
                    
                    <div className="p-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Benefits:</h4>
                      <ul className="space-y-2 mb-6">
                        {policy.benefits.map((benefit, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                            <CheckCircle size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                      
                      <button
                        onClick={() => handleConsumePolicy(policy.id, policy.title)}
                        disabled={isConsumed}
                        className={`w-full py-3 rounded-lg font-semibold transition ${
                          isConsumed
                            ? 'bg-green-100 text-green-800 cursor-not-allowed'
                            : 'bg-gray-900 text-white hover:bg-gray-800'
                        }`}
                      >
                        {isConsumed ? (
                          <span className="flex items-center justify-center gap-2">
                            <CheckCircle size={20} />
                            Policy Consumed
                          </span>
                        ) : (
                          'Consume Policy'
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {policiesConsumed.length > 0 && (
              <div className="text-center mt-8">
                <button
                  onClick={() => setStep(3)}
                  className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2 mx-auto"
                >
                  Continue to Your Coordination Forums
                  <ArrowRight size={20} />
                </button>
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-6 py-3 rounded-full mb-4">
                <CheckCircle size={24} />
                <span className="font-semibold">All Policies Consumed Successfully!</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Your Active Coordination Forums
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Forums have been automatically created for each policy. You can now coordinate 
                with MSD case workers, KO housing officers, healthcare providers, and support services.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {forumsCreated.map((forum, idx) => {
                const policy = publicPolicies[idx];
                if (!policy) return null;
                
                const Icon = policy.icon;
                
                return (
                  <div key={forum} className="bg-white rounded-xl shadow-lg p-6">
                    <div className={`${policy.color} w-16 h-16 rounded-full flex items-center justify-center mb-4`}>
                      <Icon size={32} className="text-white" />
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{forum}</h3>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users size={16} />
                        <span>Active Stakeholders:</span>
                      </div>
                      <div className="pl-6 space-y-1 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                          <span>You ({personName})</span>
                        </div>
                        {policy.id === 'policy-emergency-housing' && (
                          <>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full" />
                              <span>Sarah Jones (MSD Case Worker)</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full" />
                              <span>Mike Wilson (KO Housing Officer)</span>
                            </div>
                          </>
                        )}
                        {policy.id === 'policy-emergency-healthcare' && (
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full" />
                            <span>Dr. Anjali Patel (Healthcare Provider)</span>
                          </div>
                        )}
                        {policy.id === 'policy-food-security' && (
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full" />
                            <span>Sarah Jones (MSD Case Worker)</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <a 
                      href="/forums/coordination"
                      className="block w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition text-center"
                    >
                      Enter Forum
                    </a>
                  </div>
                );
              })}
            </div>

            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl shadow-xl p-8 text-white text-center mt-12">
              <h3 className="text-2xl font-bold mb-4">
                Congratulations! You now have access to:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div className="bg-white/10 rounded-lg p-4">
                  <Home size={32} className="mx-auto mb-2" />
                  <h4 className="font-semibold mb-1">Emergency Housing</h4>
                  <p className="text-sm opacity-90">Immediate placement & support</p>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <Heart size={32} className="mx-auto mb-2" />
                  <h4 className="font-semibold mb-1">Healthcare Access</h4>
                  <p className="text-sm opacity-90">Free medical & dental care</p>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <Utensils size={32} className="mx-auto mb-2" />
                  <h4 className="font-semibold mb-1">Food Security</h4>
                  <p className="text-sm opacity-90">Daily meals & food support</p>
                </div>
              </div>
              <p className="mt-6 text-lg">
                All coordination is happening in real-time with government agencies and support services.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}