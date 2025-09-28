'use client'

import { useState } from 'react'
import { FirebaseREST } from '@/lib/firebase-rest'

export default function SeedRestPage() {
  const [results, setResults] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const addResult = (message: string) => {
    setResults(prev => [...prev, message])
  }

  const seedWithREST = async () => {
    setLoading(true)
    setResults([])
    
    try {
      addResult('Starting REST API seeding...')
      
      // Create homeless person using setDocument (not createDocument)
      await FirebaseREST.setDocument('users', 'homeless_person_1', {
        displayName: 'John Smith',
        email: 'john.smith@example.com',
        role: 'HomelessPerson',
        isActive: true,
        createdAt: new Date().toISOString()
      })
      addResult('✓ Created homeless person: John Smith')
      
      addResult('🎉 Database seeded successfully!')
      
    } catch (error) {
      addResult(`❌ Error: ${error}`)
      console.error('Seeding error:', error)
    }
    
    setLoading(false)
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">REST API Database Seeding</h1>
      
      <button 
        onClick={seedWithREST}
        disabled={loading}
        className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 disabled:opacity-50"
      >
        {loading ? 'Seeding...' : 'Seed Database via REST API'}
      </button>
      
      {results.length > 0 && (
        <div className="mt-6 p-4 bg-gray-50 border rounded-lg">
          <div className="space-y-1 text-sm font-mono">
            {results.map((result, index) => (
              <div key={index}>{result}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
