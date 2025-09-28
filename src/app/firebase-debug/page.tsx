'use client'

import { useState } from 'react'
import { db } from '@/lib/firebase'
import { doc, setDoc, addDoc, collection } from 'firebase/firestore'

export default function FirebaseDebug() {
  const [results, setResults] = useState<string[]>([])
  const [testing, setTesting] = useState(false)

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const testWrites = async () => {
    setTesting(true)
    setResults([])
    
    try {
      addResult('Starting write tests...')
      
      // Test 1: Simple document write with setDoc
      addResult('Test 1: setDoc with specific ID...')
      await setDoc(doc(db, 'debug', 'test1'), {
        message: 'Hello from setDoc',
        timestamp: new Date().toISOString()
      })
      addResult('✓ setDoc successful')
      
      // Test 2: Auto-generated ID with addDoc
      addResult('Test 2: addDoc with auto ID...')
      const docRef = await addDoc(collection(db, 'debug'), {
        message: 'Hello from addDoc',
        timestamp: new Date().toISOString()
      })
      addResult(`✓ addDoc successful, ID: ${docRef.id}`)
      
      // Test 3: User creation
      addResult('Test 3: Creating test user...')
      await setDoc(doc(db, 'users', 'debug_user'), {
        displayName: 'Debug User',
        email: 'debug@test.com',
        role: 'TestUser',
        createdAt: new Date().toISOString()
      })
      addResult('✓ User creation successful')
      
      addResult('All write tests passed!')
      
    } catch (error) {
      addResult(`❌ Write failed: ${error}`)
      console.error('Write error details:', error)
    }
    
    setTesting(false)
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Firebase Write Debug</h1>
      
      <button 
        onClick={testWrites}
        disabled={testing}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 mb-4"
      >
        {testing ? 'Testing...' : 'Test Firebase Writes'}
      </button>
      
      <div className="space-y-1 font-mono text-sm">
        {results.map((result, index) => (
          <div key={index} className={
            result.includes('✓') ? 'text-green-600' : 
            result.includes('❌') ? 'text-red-600' : 
            'text-gray-600'
          }>
            {result}
          </div>
        ))}
      </div>
      
      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded">
        <h3 className="font-semibold">Environment Check:</h3>
        <p>Project ID: {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}</p>
        <p>Auth Domain: {process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN}</p>
        <p>API Key: {process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? 'Present' : 'Missing'}</p>
      </div>
    </div>
  )
}
