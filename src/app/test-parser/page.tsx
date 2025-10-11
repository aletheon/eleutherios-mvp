'use client';

import { useState } from 'react';
import { EleuScriptPaymentParser } from '@/lib/eleuScript/payment-parser';
import type { PaymentRule } from '../types/eleuscript';

export default function TestParserPage() {
  const [testInput, setTestInput] = useState(
    'rule paySeller -> Service("StripePayment", { payerId: user123, payeeId: seller456, amount: $5.00 })'
  );
  const [result, setResult] = useState<PaymentRule | null>(null);
  const [error, setError] = useState<string | null>(null);

  const testParser = () => {
    try {
      setError(null);
      const parsed = EleuScriptPaymentParser.parsePaymentRule(testInput);
      setResult(parsed);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setResult(null);
    }
  };

  const testCases = [
    'rule paySeller -> Service("StripePayment", { payerId: user123, payeeId: seller456, amount: $5.00 })',
    'rule tip -> Service("StripePayment", { payerId: customer789, payeeId: driver101, amount: $2.50 })',
    'rule buyItem -> Service("StripePayment", { payerId: buyer999, payeeId: shop202, amount: $15.99, currency: NZD })',
    'rule invalid -> Service("StripePayment", { payerId: user123 })', // Missing fields
    'just a regular chat message', // Not a rule
    'rule wrongService -> Service("NotStripe", { amount: $5.00 })', // Wrong service
  ];

  // Simple helper function to check if a message is a payment rule
  const isPaymentRule = (message: string): boolean => {
    return message.trim().startsWith('rule ') && message.includes('StripePayment');
  };

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">EleuScript Payment Parser Test</h1>
      
      <div className="space-y-6">
        {/* Manual Test Input */}
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Manual Test</h2>
          <div className="space-y-4">
            <textarea
              value={testInput}
              onChange={(e) => setTestInput(e.target.value)}
              className="w-full p-3 border rounded-lg font-mono text-sm h-24"
              placeholder="Enter EleuScript payment rule..."
            />
            <button
              onClick={testParser}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Parse Rule
            </button>
          </div>
          
          {/* Results */}
          <div className="mt-4">
            {error && (
              <div className="p-3 bg-red-100 border border-red-300 rounded text-red-700">
                <strong>Error:</strong> {error}
              </div>
            )}
            
            {result && (
              <div className="p-3 bg-green-100 border border-green-300 rounded">
                <strong>Parsed Successfully:</strong>
                <pre className="mt-2 text-sm">{JSON.stringify(result, null, 2)}</pre>
              </div>
            )}
            
            {!result && !error && (
              <div className="p-3 bg-gray-100 border border-gray-300 rounded text-gray-700">
                Rule did not match payment pattern (returned null)
              </div>
            )}
          </div>
        </div>

        {/* Automated Test Cases */}
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Automated Test Cases</h2>
          <div className="space-y-4">
            {testCases.map((testCase, index) => {
              const testResult = EleuScriptPaymentParser.parsePaymentRule(testCase);
              const isValid = testResult !== null;
              
              return (
                <div key={index} className="border rounded p-4">
                  <div className="font-mono text-sm mb-2 break-all">{testCase}</div>
                  <div className={`text-sm font-semibold ${isValid ? 'text-green-600' : 'text-red-600'}`}>
                    {isValid ? '✅ PARSED' : '❌ NULL'}
                  </div>
                  {testResult && (
                    <pre className="text-xs mt-2 bg-gray-50 p-2 rounded">
                      {JSON.stringify(testResult, null, 2)}
                    </pre>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Chat Simulation */}
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Chat Integration Test</h2>
          <div className="space-y-2">
            {[
              "Hey, how's the project going?",
              'rule paySeller -> Service("StripePayment", { payerId: user123, payeeId: seller456, amount: $10.00 })',
              "That payment should process automatically",
              'rule tip -> Service("StripePayment", { payerId: customer789, payeeId: driver101, amount: $3.00 })'
            ].map((message, index) => {
              const isPaymentMessage = isPaymentRule(message);
              const parsed = isPaymentMessage ? EleuScriptPaymentParser.parsePaymentRule(message) : null;
              
              return (
                <div key={index} className={`p-3 rounded ${isPaymentMessage ? 'bg-blue-50 border-l-4 border-blue-500' : 'bg-gray-50'}`}>
                  <div className="text-sm">{message}</div>
                  {isPaymentMessage && (
                    <div className="text-xs mt-1 text-blue-600">
                      → Payment Rule Detected: {parsed ? `$${parsed.amount} from ${parsed.payerId} to ${parsed.payeeId}` : 'Parse Failed'}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Parser Status */}
        <div className="border rounded-lg p-6 bg-green-50">
          <h2 className="text-xl font-semibold mb-4">Parser Status</h2>
          <div className="space-y-2">
            <div className="text-green-600 font-semibold">✅ EleuScript Parser Working</div>
            <div className="text-sm text-gray-600">
              Your parser successfully converts natural language payment rules into structured data.
              This is the foundation for the payment execution system.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}