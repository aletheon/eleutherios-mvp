// app/test-sub-policy/page.tsx
'use client';

import { useState } from 'react';
import { EleuScriptParser } from '@/lib/eleuScript/parser';
import { PolicyExecutor } from '@/lib/eleuScript/policyExecutor';

export default function SubPolicyTest() {
  const [testRule, setTestRule] = useState('rule AddHealthcare -> Policy("HealthcareAccess", stakeholders=["Patient", "Doctor"], permissions={"Patient": ["join", "message"], "Doctor": ["join", "message", "prescribe"]})');
  const [parseResult, setParseResult] = useState<any>(null);
  const [executionResult, setExecutionResult] = useState<any>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  
  // Mock user and forum for testing
  const mockUserId = 'test-user-123';
  const mockForumId = 'emergency-housing'; // Use existing forum

  const handleParse = () => {
    const result = EleuScriptParser.parseRule(testRule);
    setParseResult(result);
    console.log('Parse result:', result);
  };

  const handleExecute = async () => {
    if (!parseResult?.isValid) {
      alert('Please parse a valid rule first');
      return;
    }

    setIsExecuting(true);
    setExecutionResult(null);

    try {
      const result = await PolicyExecutor.executeRule(
        parseResult,
        mockUserId,
        mockForumId
      );
      
      setExecutionResult(result);
      console.log('Execution result:', result);
    } catch (error) {
      console.error('Execution failed:', error);
      setExecutionResult({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const testRules = [
    {
      name: 'Healthcare Policy',
      rule: 'rule AddHealthcare -> Policy("HealthcareAccess", stakeholders=["Patient", "Doctor"], permissions={"Patient": ["join", "message"], "Doctor": ["join", "message", "prescribe"]})'
    },
    {
      name: 'Transport Service',
      rule: 'rule ActivateTransport -> Service("Transportation", conditions=["urgent_need"], auto_dispatch=true)'
    },
    {
      name: 'Medical Forum',
      rule: 'rule CreateConsultation -> Forum("Medical Consultation", stakeholders=["Patient", "Doctor", "Nurse"])'
    },
    {
      name: 'Financial Support',
      rule: 'rule ProvideSupport -> Service("EmergencyPayment", amount=200, currency="NZD", conditions=["eligibility_verified"])'
    },
    {
      name: 'Complex Policy',
      rule: 'rule ComprehensiveCare -> Policy("IntegratedHealthcare", stakeholders=["Patient", "GP", "Specialist", "Pharmacist"], services=["Consultation", "Prescription", "Payment"], permissions={"Patient": ["join", "message", "upload_files"], "GP": ["join", "message", "diagnose", "prescribe"], "Specialist": ["join", "message", "diagnose"], "Pharmacist": ["join", "message", "dispense"]})'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Sub-Policy Creation Test</h1>
      
      {/* Test Rules Quick Select */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3">Quick Test Rules</h2>
        <div className="grid gap-2">
          {testRules.map((test, index) => (
            <button
              key={index}
              onClick={() => setTestRule(test.rule)}
              className="text-left p-3 border border-gray-200 rounded hover:bg-gray-50"
            >
              <div className="font-medium text-sm">{test.name}</div>
              <div className="text-xs text-gray-600 font-mono mt-1 truncate">
                {test.rule}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Rule Input */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3">EleuScript Rule</h2>
        <textarea
          value={testRule}
          onChange={(e) => setTestRule(e.target.value)}
          className="w-full h-32 p-3 border border-gray-300 rounded font-mono text-sm"
          placeholder="Enter EleuScript rule..."
        />
        <button
          onClick={handleParse}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Parse Rule
        </button>
      </div>

      {/* Parse Results */}
      {parseResult && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Parse Results</h2>
          <div className={`p-4 border rounded ${parseResult.isValid ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
            {parseResult.isValid ? (
              <div>
                <div className="text-green-800 font-medium mb-2">✅ Valid EleuScript Rule</div>
                <div className="space-y-2 text-sm">
                  <div><strong>Rule Name:</strong> {parseResult.ruleName}</div>
                  <div><strong>Target:</strong> {parseResult.ruleTarget}</div>
                  <div><strong>Target Name:</strong> {parseResult.targetName}</div>
                  {parseResult.parameters && Object.keys(parseResult.parameters).length > 0 && (
                    <div>
                      <strong>Parameters:</strong>
                      <pre className="mt-1 p-2 bg-white border rounded text-xs overflow-auto">
                        {JSON.stringify(parseResult.parameters, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
                <button
                  onClick={handleExecute}
                  disabled={isExecuting}
                  className="mt-3 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                >
                  {isExecuting ? 'Executing...' : 'Execute Rule'}
                </button>
              </div>
            ) : (
              <div>
                <div className="text-red-800 font-medium mb-2">❌ Invalid Rule</div>
                <div className="text-sm text-red-600">
                  {parseResult.errors?.join(', ')}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Execution Results */}
      {executionResult && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Execution Results</h2>
          <div className={`p-4 border rounded ${executionResult.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
            <div className={`font-medium mb-2 ${executionResult.success ? 'text-green-800' : 'text-red-800'}`}>
              {executionResult.success ? '✅' : '❌'} {executionResult.message}
            </div>
            
            {executionResult.data && (
              <div className="mt-3">
                <strong>Created Sub-Policy:</strong>
                <pre className="mt-1 p-2 bg-white border rounded text-xs overflow-auto">
                  {JSON.stringify(executionResult.data, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Testing Instructions */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded">
        <h3 className="font-semibold text-blue-800 mb-2">Testing Instructions</h3>
        <ol className="text-sm text-blue-700 space-y-1">
          <li>1. Select a test rule or write your own EleuScript rule</li>
          <li>2. Click "Parse Rule" to validate syntax</li>
          <li>3. If valid, click "Execute Rule" to test sub-policy creation</li>
          <li>4. Check browser console for detailed logs</li>
          <li>5. Verify in Firestore that policy and forum expansion occurred</li>
        </ol>
      </div>

      {/* Expected Behavior */}
      <div className="p-4 bg-gray-50 border border-gray-200 rounded">
        <h3 className="font-semibold text-gray-800 mb-2">Expected Behavior</h3>
        <div className="text-sm text-gray-700 space-y-2">
          <p><strong>Policy Rules:</strong> Should create sub-policy document and expand forum capabilities</p>
          <p><strong>Service Rules:</strong> Should activate service and update forum service status</p>
          <p><strong>Forum Rules:</strong> Should create new forum linked to current policy</p>
          <p><strong>Database Changes:</strong> Check /policies collection for new sub-policies</p>
          <p><strong>Forum Updates:</strong> Check forum document for expanded stakeholders/services</p>
          <p><strong>Audit Trail:</strong> Check /governance_events for execution records</p>
        </div>
      </div>

      {/* Mock Context Info */}
      <div className="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded">
        <h4 className="font-medium text-yellow-800">Mock Test Context</h4>
        <div className="text-sm text-yellow-700 mt-1">
          <p>User ID: {mockUserId}</p>
          <p>Forum ID: {mockForumId}</p>
          <p>Note: Ensure the forum exists in Firestore with proper permissions for testing</p>
        </div>
      </div>
    </div>
  );
}