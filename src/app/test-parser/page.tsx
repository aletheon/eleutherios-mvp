// Replace app/test-parser/page.tsx with this version

'use client';

import React, { useState } from 'react';

// Import with error handling
let EleuScriptParser: any = null;
try {
  EleuScriptParser = require('@/lib/eleuScript/parser').EleuScriptParser;
} catch (error) {
  console.error('Failed to import EleuScriptParser:', error);
}

export default function ParserTestPage() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testRules = [
    'rule AddHealthcare -> Policy("HealthcareAccess")',
    'rule ActivateTransport -> Service("TransportCoordination")',
    'rule CreateConsultation -> Forum("Medical Consultation")',
    'rule InvalidSyntax -> WrongTarget("test")',
    'regular chat message'
  ];

  const testInput = (testRule: string) => {
    setError(null);
    setResult(null);
    
    try {
      console.log('Testing input:', testRule);
      
      if (!EleuScriptParser) {
        throw new Error('EleuScriptParser not available - check import');
      }
      
      // Test detection
      const isEleuScript = EleuScriptParser.isEleuScriptRule(testRule);
      console.log('Detection result:', isEleuScript);
      
      // Test parsing
      const parsed = EleuScriptParser.parseRule(testRule);
      console.log('Parse result:', parsed);
      
      setResult({
        input: testRule,
        isDetected: isEleuScript,
        parsed: parsed
      });
      
    } catch (err) {
      console.error('Test error:', err);
      setError(`Error testing parser: ${err}`);
    }
  };

  const testCurrentInput = () => {
    if (!input.trim()) {
      setError('Please enter some text to test');
      return;
    }
    testInput(input);
  };

  // Simple inline parser for testing if import fails
  const testWithInlineParser = (testRule: string) => {
    setError(null);
    
    // Simple detection
    const isEleuScript = testRule.includes('rule ') && 
                        testRule.includes(' -> ') && 
                        (testRule.includes('Service(') || 
                         testRule.includes('Forum(') || 
                         testRule.includes('Policy('));
    
    // Simple parsing
    const rulePattern = /rule\s+(\w+)\s+->\s+(Service|Forum|Policy)\("([^"]+)"/;
    const match = testRule.match(rulePattern);
    
    const parsed = match ? {
      isValid: true,
      ruleName: match[1],
      ruleTarget: match[2],
      targetName: match[3],
      parameters: {},
      rawText: testRule
    } : {
      isValid: false,
      errors: ['Invalid EleuScript syntax'],
      rawText: testRule
    };
    
    setResult({
      input: testRule,
      isDetected: isEleuScript,
      parsed: parsed,
      usingInlineParser: true
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          EleuScript Parser Test
        </h1>

        {/* Import Status */}
        <div className={`p-4 rounded-lg mb-6 ${
          EleuScriptParser 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-red-50 border border-red-200'
        }`}>
          <h2 className="font-semibold mb-2">Parser Import Status:</h2>
          {EleuScriptParser ? (
            <p className="text-green-700">✅ EleuScriptParser imported successfully</p>
          ) : (
            <div className="text-red-700">
              <p>❌ EleuScriptParser import failed</p>
              <p className="text-sm mt-1">Will use inline parser for testing</p>
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-red-800">Error:</h3>
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Manual Input Test */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Manual Input Test</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter EleuScript Rule:
              </label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                rows={3}
                placeholder="rule RuleName -> Target(&quot;name&quot;)"
              />
            </div>
            
            <div className="flex space-x-4">
              <button
                onClick={testCurrentInput}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Test with Parser
              </button>
              
              <button
                onClick={() => input.trim() && testWithInlineParser(input.trim())}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Test with Inline Parser
              </button>
            </div>
          </div>
        </div>

        {/* Predefined Test Cases */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Predefined Test Cases</h2>
          
          <div className="space-y-3">
            {testRules.map((rule, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="flex space-x-2">
                  <button
                    onClick={() => testInput(rule)}
                    className="px-3 py-2 bg-purple-600 text-white rounded text-sm hover:bg-purple-700"
                    disabled={!EleuScriptParser}
                  >
                    Parser
                  </button>
                  <button
                    onClick={() => testWithInlineParser(rule)}
                    className="px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                  >
                    Inline
                  </button>
                </div>
                <code className="flex-1 text-sm bg-gray-100 p-2 rounded">
                  {rule}
                </code>
              </div>
            ))}
          </div>
        </div>

        {/* Results Display */}
        {result && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">
              Parser Results 
              {result.usingInlineParser && (
                <span className="text-sm text-blue-600 ml-2">(Using Inline Parser)</span>
              )}
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-700">Input:</h3>
                <code className="block bg-gray-100 p-2 rounded text-sm">
                  {result.input}
                </code>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-700">Detection Result:</h3>
                <span className={`inline-block px-2 py-1 rounded text-sm ${
                  result.isDetected 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {result.isDetected ? 'EleuScript Detected' : 'Not EleuScript'}
                </span>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-700">Parse Result:</h3>
                <div className={`p-3 rounded border ${
                  result.parsed.isValid 
                    ? 'border-green-300 bg-green-50' 
                    : 'border-red-300 bg-red-50'
                }`}>
                  {result.parsed.isValid ? (
                    <div className="space-y-2">
                      <div><strong>Rule Name:</strong> {result.parsed.ruleName}</div>
                      <div><strong>Target:</strong> {result.parsed.ruleTarget}</div>
                      <div><strong>Target Name:</strong> {result.parsed.targetName}</div>
                      <div><strong>Parameters:</strong> {JSON.stringify(result.parsed.parameters)}</div>
                    </div>
                  ) : (
                    <div>
                      <strong>Errors:</strong>
                      <ul className="list-disc list-inside mt-1">
                        {result.parsed.errors?.map((error: string, i: number) => (
                          <li key={i} className="text-red-700">{error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-700">Full Parse Object:</h3>
                <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto">
                  {JSON.stringify(result.parsed, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}
        
        {/* Debug Info */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-8">
          <h3 className="font-medium text-yellow-900 mb-2">Debug Info:</h3>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>• Check browser console (F12) for error messages</li>
            <li>• Parser available: {EleuScriptParser ? 'Yes' : 'No'}</li>
            <li>• If parser import fails, inline parser will be used</li>
            <li>• Try both test buttons to compare results</li>
          </ul>
        </div>
      </div>
    </div>
  );
}