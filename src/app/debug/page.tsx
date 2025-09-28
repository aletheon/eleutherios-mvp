'use client'

import { useEffect, useState } from 'react'
import { db } from '@/lib/firebase'
import { doc, setDoc, getDoc, Timestamp } from 'firebase/firestore'

export default function DebugPage() {
  const [status, setStatus] = useState('Testing Firebase...')
  const [testResults, setTestResults] = useState<string[]>([])

  const addResult = (result: string) => {
    setTestResults(prev => [...prev, result])
    setStatus(result)
  }

  useEffect(() => {
    const runTests = async () => {
      try {
        addResult('🔥 Firebase SDK loaded')
        
        // Test 1: Try to write a document
        addResult('📝 Testing write to Firestore...')
        const testDocRef = doc(db, 'test', 'connection-test')
        await setDoc(testDocRef, {
          message: 'Hello from Eleutherios!',
          timestamp: Timestamp.now(),
          testId: Date.now()
        })
        addResult('✅ Write successful!')
        
        // Test 2: Try to read the document back
        addResult('📖 Testing read from Firestore...')
        const docSnap = await getDoc(testDocRef)
        if (docSnap.exists()) {
          addResult('✅ Read successful!')
          addResult(`📄 Data: ${JSON.stringify(docSnap.data())}`)
        } else {
          addResult('❌ Document not found after write')
        }
        
        addResult('🎉 All tests passed! Firebase is working!')
        
      } catch (error) {
        addResult(`❌ Error: ${error}`)
        console.error('Firebase test error:', error)
      }
    }
    
    runTests()
  }, [])

  const createTestUser = async () => {
    try {
      addResult('👤 Creating test user...')
      
      const userRef = doc(db, 'users', 'test-user-' + Date.now())
      await setDoc(userRef, {
        displayName: 'John Smith',
        email: 'john.smith@example.com',
        role: 'HomelessPerson',
        isActive: true,
        createdAt: Timestamp.now()
      })
      
      addResult('✅ Test user created successfully!')
      
    } catch (error) {
      addResult(`❌ Error creating user: ${error}`)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">🔧 Firebase Connection Test</h1>
      
      <div className="space-y-4">
        <div className="p-4 border rounded">
          <h3 className="font-semibold">Current Status:</h3>
          <p className="text-lg">{status}</p>
        </div>
        
        <div className="p-4 border rounded">
          <h3 className="font-semibold">Test Results:</h3>
          <div className="space-y-1 text-sm">
            {testResults.map((result, index) => (
              <div key={index} className="font-mono">{result}</div>
            ))}
          </div>
        </div>

        {status.includes('🎉 All tests passed') && (
          <div className="p-4 bg-green-50 border border-green-200 rounded">
            <h3 className="font-semibold text-green-800">🎉 Firebase is Working!</h3>
            <p className="text-green-700 mb-4">Ready to create test data for social housing workflow.</p>
            
            <button 
              onClick={createTestUser}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              🧪 Create Test User
            </button>
            
            <div className="mt-4 space-x-4">
              <a href="/test" className="text-blue-500 hover:underline">
                → Go to Test Page
              </a>
              <a href="/" className="text-blue-500 hover:underline">
                → Back to Home
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
