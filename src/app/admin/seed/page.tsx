'use client'

import { useState } from 'react'
import { db } from '@/lib/firebase'
import { collection, doc, setDoc, Timestamp } from 'firebase/firestore'

export default function SeedPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')

  const seedData = async () => {
    setLoading(true)
    setResult('🌱 Seeding database...\n')
    
    try {
      // Create test users
      const users = [
        {
          id: 'user_1',
          displayName: 'John Smith',
          email: 'john.smith@example.com',
          role: 'HomelessPerson',
          profile: {
            age: 34,
            currentSituation: 'sleeping_rough',
            preferredRegion: 'Christchurch',
            bedroomNeeds: 1,
            accessibilityNeeds: false,
            maxAffordableRent: 300
          },
          isActive: true,
          publicProfile: true
        },
        {
          id: 'user_2', 
          displayName: 'Sarah Jones',
          email: 'sarah.jones@msd.govt.nz',
          role: 'MSDCaseWorker',
          department: 'MSD',
          region: 'Canterbury',
          isActive: true,
          publicProfile: false
        },
        {
          id: 'user_3',
          displayName: 'Mike Wilson', 
          email: 'mike.wilson@kaingaora.govt.nz',
          role: 'KORepresentative',
          department: 'KO',
          region: 'Canterbury',
          isActive: true,
          publicProfile: false
        }
      ]

      for (const user of users) {
        await setDoc(doc(db, 'users', user.id), {
          ...user,
          createdAt: Timestamp.now(),
          lastLoginAt: Timestamp.now()
        })
        setResult(prev => prev + `✓ Created user: ${user.displayName}\n`)
      }
      
      // Create test policy
      await setDoc(doc(db, 'policies', 'policy_1'), {
        name: 'EmergencyHousingPolicy',
        description: 'Rapid housing placement for people in crisis',
        version: '1.0.0',
        author: 'user_2',
        authorName: 'Sarah Jones',
        visibility: 'public',
        category: 'emergency_housing',
        tags: ['emergency', 'housing', 'crisis', 'nz'],
        status: 'active',
        script: 'policy EmergencyHousingPolicy {\n  stakeholder Applicant\n  stakeholder EmergencyCaseWorker\n  stakeholder KOEmergencyTeam\n}',
        instantiationCount: 0,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      })
      
      setResult(prev => prev + '✓ Created policy: EmergencyHousingPolicy\n')
      setResult(prev => prev + '\n🎉 Database seeded successfully!\n')
      
    } catch (error) {
      setResult(prev => prev + `\n❌ Error: ${error}\n`)
      console.error('Seeding error:', error)
    }
    
    setLoading(false)
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">🔧 Database Seeding</h1>
      <p className="text-gray-600 mb-6">
        This will create test data for the social housing workflow
      </p>
      
      <button 
        onClick={seedData}
        disabled={loading}
        className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? '🌱 Seeding...' : '🌱 Seed Database'}
      </button>
      
      {result && (
        <div className="mt-6 p-4 bg-gray-50 border rounded-lg">
          <pre className="whitespace-pre-wrap text-sm">{result}</pre>
        </div>
      )}
      
      <div className="mt-8 space-x-4">
        <a href="/test" className="text-blue-500 hover:underline">
          → Test Page (verify data)
        </a>
        <a href="/" className="text-blue-500 hover:underline">
          → Home Page
        </a>
      </div>
    </div>
  )
}
