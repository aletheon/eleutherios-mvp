// src/app/admin/migrate/page.tsx
'use client';

import { useState } from 'react';

interface MigrationResult {
  success: boolean;
  message: string;
  details?: string;
  usersProcessed?: number;
  errors?: string[];
}

export default function MigrationPage() {
  const [loading, setLoading] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [result, setResult] = useState<MigrationResult | null>(null);
  const [previewResult, setPreviewResult] = useState<any>(null);

  const handlePreview = async () => {
    setPreviewLoading(true);
    setPreviewResult(null);
    
    try {
      const response = await fetch('/api/admin/preview-migration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      setPreviewResult(data);
    } catch (error) {
      setPreviewResult({
        success: false,
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleMigrate = async () => {
    const confirmed = window.confirm(
      '🚨 Are you sure you want to migrate all user data?\n\n' +
      'This will update ALL users in your Firestore database with:\n' +
      '• Standardized field names (displayName → name)\n' +
      '• Normalized roles (HomelessPerson → person)\n' +
      '• Added missing certScore and activities objects\n\n' +
      'This action cannot be undone. Continue?'
    );
    
    if (!confirmed) return;
    
    setLoading(true);
    setResult(null);
    
    try {
      const response = await fetch('/api/admin/migrate-users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="border-b border-gray-200 pb-6 mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">User Data Migration</h1>
            <p className="text-gray-600">
              Standardize inconsistent user data structure in Firestore database
            </p>
          </div>

          {/* Problem Description */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-yellow-800 mb-3">🔧 What This Migration Fixes:</h2>
            <ul className="space-y-2 text-yellow-700">
              <li>• <strong>Field names:</strong> Converts <code>displayName</code> → <code>name</code></li>
              <li>• <strong>Role normalization:</strong> <code>"HomelessPerson"</code> → <code>"person"</code>, <code>"CaseWorker"</code> → <code>"caseworker"</code></li>
              <li>• <strong>Missing data:</strong> Adds <code>certScore</code> and <code>activities</code> objects where missing</li>
              <li>• <strong>Timestamps:</strong> Standardizes <code>createdAt</code> and <code>updatedAt</code> fields</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <button
              onClick={handlePreview}
              disabled={previewLoading || loading}
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {previewLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Analyzing...
                </div>
              ) : (
                '🔍 Preview Changes'
              )}
            </button>
            
            <button
              onClick={handleMigrate}
              disabled={loading || previewLoading}
              className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Migrating...
                </div>
              ) : (
                '🚀 Execute Migration'
              )}
            </button>
          </div>

          {/* Preview Results */}
          {previewResult && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 Preview Results</h3>
              <div className={`p-6 rounded-lg border ${
                previewResult.success 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-red-50 border-red-200'
              }`}>
                <div className="mb-4">
                  <p className={`font-medium ${
                    previewResult.success ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {previewResult.message}
                  </p>
                </div>
                
                {previewResult.usersToMigrate && (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600">
                      <strong>Users requiring migration:</strong> {previewResult.usersToMigrate.length}
                    </p>
                    <div className="bg-white p-4 rounded border max-h-96 overflow-y-auto">
                      <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                        {JSON.stringify(previewResult.usersToMigrate, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
                
                {previewResult.details && (
                  <div className="mt-4">
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap bg-white p-4 rounded border">
                      {previewResult.details}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Migration Results */}
          {result && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {result.success ? '✅ Migration Results' : '❌ Migration Failed'}
              </h3>
              <div className={`p-6 rounded-lg border ${
                result.success 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-red-50 border-red-200'
              }`}>
                <div className="mb-4">
                  <p className={`font-medium ${
                    result.success ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {result.message}
                  </p>
                  {result.usersProcessed && (
                    <p className="text-sm text-gray-600 mt-2">
                      Users processed: <strong>{result.usersProcessed}</strong>
                    </p>
                  )}
                </div>
                
                {result.details && (
                  <div className="mb-4">
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap bg-white p-4 rounded border max-h-64 overflow-y-auto">
                      {result.details}
                    </pre>
                  </div>
                )}
                
                {result.errors && result.errors.length > 0 && (
                  <div>
                    <h4 className="font-medium text-red-800 mb-2">Errors:</h4>
                    <ul className="text-sm text-red-700 space-y-1">
                      {result.errors.map((error, index) => (
                        <li key={index}>• {error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex flex-wrap gap-4 text-sm">
              <a href="/directory" className="text-blue-600 hover:text-blue-800 hover:underline">
                → View User Directory
              </a>
              <a href="/admin" className="text-blue-600 hover:text-blue-800 hover:underline">
                → Admin Dashboard
              </a>
              <a href="/" className="text-blue-600 hover:text-blue-800 hover:underline">
                → Home Page
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}