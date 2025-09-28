'use client'

import { useEffect, useState } from 'react'

export default function NetworkTest() {
  const [results, setResults] = useState<string[]>([])

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  useEffect(() => {
    const testNetwork = async () => {
      addResult('Starting network tests...')
      
      // Test 1: Basic fetch to Google
      try {
        addResult('Testing connection to google.com...')
        const response = await fetch('https://www.google.com', { mode: 'no-cors' })
        addResult('✓ Google connection: OK')
      } catch (error) {
        addResult(`✗ Google connection failed: ${error}`)
      }

      // Test 2: Firebase REST API
      try {
        addResult('Testing Firebase REST API...')
        const response = await fetch(
          `https://firestore.googleapis.com/v1/projects/eleutherios-mvp-3c717/databases/(default)/documents`,
          { method: 'GET' }
        )
        if (response.ok) {
          addResult('✓ Firebase REST API: OK')
        } else {
          addResult(`✗ Firebase REST API failed: ${response.status} ${response.statusText}`)
        }
      } catch (error) {
        addResult(`✗ Firebase REST API error: ${error}`)
      }

      // Test 3: Environment variables
      addResult('Checking environment variables...')
      const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
      const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY
      addResult(`Project ID: ${projectId ? '✓ Present' : '✗ Missing'}`)
      addResult(`API Key: ${apiKey ? '✓ Present' : '✗ Missing'}`)
    }

    testNetwork()
  }, [])

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Network Connectivity Test</h1>
      
      <div className="space-y-2 font-mono text-sm">
        {results.map((result, index) => (
          <div key={index} className={
            result.includes('✓') ? 'text-green-600' : 
            result.includes('✗') ? 'text-red-600' : 
            'text-gray-600'
          }>
            {result}
          </div>
        ))}
      </div>
      
      {results.length === 0 && (
        <div>Running tests...</div>
      )}
    </div>
  )
}
