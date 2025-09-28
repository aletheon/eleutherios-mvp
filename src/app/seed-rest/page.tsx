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
      
      // Create homeless person
      await FirebaseREST.createDocument('users', 'homeless_person_1', {
        displayName: 'John Smith',
        email: 'john.smith@example.com',
        role: 'HomelessPerson',
        isActive: true,
        createdAt: new Date().toISOString()
      })
      addResult('✓ Created homeless person: John Smith')
      
      // Create MSD case worker
      await FirebaseREST.createDocument('users', 'msd_caseworker_1', {
        displayName: 'Sarah Jones',
        email: 'sarah.jones@msd.govt.nz',
        role: 'MSDCaseWorker',
        department: 'MSD',
        isActive: true,
        createdAt: new Date().toISOString()
      })
      addResult('✓ Created MSD case worker: Sarah Jones')
      
      // Create KO representative
      await FirebaseREST.createDocument('users', 'ko_representative_1', {
        displayName: 'Mike Wilson',
        email: 'mike.wilson@kaingaora.govt.nz',
        role: 'KORepresentative',
        department: 'KO',
        isActive: true,
        createdAt: new Date().toISOString()
      })
      addResult('✓ Created KO representative: Mike Wilson')
      
      // Create emergency housing policy
      await FirebaseREST.createDocument('policies', 'emergency_housing_policy', {
        name: 'EmergencyHousingPolicy',
        description: 'Rapid housing placement for people in crisis',
        version: '1.0.0',
        author: 'msd_caseworker_1',
        status: 'active',
        createdAt: new Date().toISOString()
      })
      addResult('✓ Created policy: EmergencyHousingPolicy')
      
      addResult('')
      addResult('🎉 Database seeded successfully!')
      addResult('Check Firebase Console to verify data creation')
      
    } catch (error) {
      addResult(`❌ Error: ${error}`)
      console.error('Seeding error:', error)
    }
    
    setLoading(false)
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">REST API Database Seeding</h1>
      <p className="text-gray-600 mb-6">
        Using Firebase REST API to create social housing test data
      </p>
      
      <button 
        onClick={seedWithREST}
        disabled={loading}
        className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 disabled:opacity-50"
      >
        {loading ? 'Seeding with REST API...' : 'Seed Database via REST API'}
      </button>
      
      {results.length > 0 && (
        <div className="mt-6 p-4 bg-gray-50 border rounded-lg">
          <div className="space-y-1 text-sm font-mono">
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
        </div>
      )}
      
      {results.some(r => r.includes('🎉 Database seeded successfully!')) && (
        <div className="mt-6 space-x-4">
          <a href="/test" className="text-blue-500 hover:underline">
            → Test Data Reading
          </a>
          <a href="/demo" className="text-blue-500 hover:underline">
            → Demo with Real Data
          </a>
        </div>
      )}
    </div>
  )
}
