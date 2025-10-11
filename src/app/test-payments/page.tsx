'use client';

import { useState } from 'react';

interface PaymentResult {
  success: boolean;
  message?: string;
  rule?: any;
  payment?: any;
  error?: string;
  validationErrors?: string[];
  mockMode?: boolean;
}

interface TestCase {
  name: string;
  rule: string;
  userId: string;
  expectSuccess: boolean;
}

export default function TestPaymentsPage() {
  const [testInput, setTestInput] = useState(
    'rule paySeller -> Service("StripePayment", { payerId: user123, payeeId: seller456, amount: $5.00 })'
  );
  const [userId, setUserId] = useState('user123');
  const [mockMode, setMockMode] = useState(false);
  const [result, setResult] = useState<PaymentResult | null>(null);
  const [loading, setLoading] = useState(false);

  const executePayment = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/payments/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rule: testInput,
          userId: userId,
          mockMode: mockMode
        }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Network error'
      });
    } finally {
      setLoading(false);
    }
  };

  const testCases: TestCase[] = [
    {
      name: 'Valid Payment',
      rule: 'rule paySeller -> Service("StripePayment", { payerId: user123, payeeId: seller456, amount: $5.00 })',
      userId: 'user123',
      expectSuccess: true
    },
    {
      name: 'Unauthorized User',
      rule: 'rule paySeller -> Service("StripePayment", { payerId: user123, payeeId: seller456, amount: $5.00 })',
      userId: 'hacker999',
      expectSuccess: false
    },
    {
      name: 'Amount Too Small',
      rule: 'rule paySeller -> Service("StripePayment", { payerId: user123, payeeId: seller456, amount: $0.25 })',
      userId: 'user123',
      expectSuccess: false
    },
    {
      name: 'Amount Too Large',
      rule: 'rule paySeller -> Service("StripePayment", { payerId: user123, payeeId: seller456, amount: $15000.00 })',
      userId: 'user123',
      expectSuccess: false
    },
    {
      name: 'Pay Self (Invalid)',
      rule: 'rule paySeller -> Service("StripePayment", { payerId: user123, payeeId: user123, amount: $5.00 })',
      userId: 'user123',
      expectSuccess: false
    }
  ];

  const runAutomatedTests = async () => {
    setLoading(true);
    
    for (const testCase of testCases) {
      console.log(`Running test: ${testCase.name}`);
      
      try {
        const response = await fetch('/api/payments/execute', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            rule: testCase.rule,
            userId: testCase.userId,
            mockMode: mockMode
          }),
        });

        const data = await response.json();
        const passed = data.success === testCase.expectSuccess;
        
        console.log(`${testCase.name}: ${passed ? 'PASS' : 'FAIL'}`, data);
      } catch (error) {
        console.log(`${testCase.name}: ERROR`, error);
      }
    }
    
    setLoading(false);
    console.log('All automated tests completed - check console for results');
  };

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Complete Payment Flow Test</h1>
      
      <div className="space-y-8">
        {/* Mode Toggle */}
        <div className="border rounded-lg p-6 bg-blue-50">
          <h2 className="text-xl font-semibold mb-4">Testing Mode</h2>
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                checked={mockMode}
                onChange={() => setMockMode(true)}
                className="mr-2"
              />
              Mock Mode (Simulation)
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                checked={!mockMode}
                onChange={() => setMockMode(false)}
                className="mr-2"
              />
              Real Stripe Mode
            </label>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {mockMode 
              ? "Mock mode simulates payments without hitting Stripe"
              : "Real mode creates actual Stripe payment intents"
            }
          </p>
        </div>

        {/* Manual Payment Test */}
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Manual Payment Execution</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">User ID</label>
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full p-3 border rounded-lg"
                placeholder="user123"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">EleuScript Payment Rule</label>
              <textarea
                value={testInput}
                onChange={(e) => setTestInput(e.target.value)}
                className="w-full p-3 border rounded-lg font-mono text-sm h-24"
                placeholder="Enter EleuScript payment rule..."
              />
            </div>
            
            <button
              onClick={executePayment}
              disabled={loading}
              className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
            >
              {loading ? 'Executing...' : `Execute Payment (${mockMode ? 'Mock' : 'Real'})`}
            </button>
          </div>
          
          {/* Results */}
          {result && (
            <div className={`mt-6 p-4 rounded-lg border ${
              result.success 
                ? 'bg-green-50 border-green-300' 
                : 'bg-red-50 border-red-300'
            }`}>
              <h3 className="font-semibold mb-2">
                {result.success ? 'Success' : 'Failed'}
              </h3>
              
              {result.success && result.payment && (
                <div className="space-y-2 text-sm">
                  <p><strong>Payment ID:</strong> {result.payment.paymentIntentId}</p>
                  <p><strong>Amount:</strong> ${result.payment.amount}</p>
                  <p><strong>Status:</strong> {result.payment.status}</p>
                </div>
              )}
              
              {result.error && (
                <div className="text-red-700">
                  <p><strong>Error:</strong> {result.error}</p>
                </div>
              )}
              
              <details className="mt-3">
                <summary className="cursor-pointer text-sm">Show Details</summary>
                <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </details>
            </div>
          )}
        </div>

        {/* Automated Tests */}
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Automated Tests</h2>
          
          <button
            onClick={runAutomatedTests}
            disabled={loading}
            className="px-6 py-3 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:bg-gray-400 mb-4"
          >
            {loading ? 'Running Tests...' : 'Run All Tests'}
          </button>
          
          <div className="space-y-2">
            {testCases.map((testCase, index) => (
              <div key={index} className="border rounded p-3 text-sm">
                <div className="font-medium">{testCase.name}</div>
                <div className="text-gray-600 font-mono text-xs">{testCase.rule}</div>
                <div className="text-xs text-gray-500">
                  Expected: {testCase.expectSuccess ? 'SUCCESS' : 'FAILURE'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}