'use client'

import { useState } from 'react'
import { db } from '@/lib/firebase'
import { doc, setDoc, Timestamp } from 'firebase/firestore'

export default function SeedPage() {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<string[]>([])

  const addResult = (message: string) => {
    setResults(prev => [...prev, message])
  }

  const seedDatabase = async () => {
    setLoading(true)
    setResults([])
    
    try {
      addResult('Starting database seeding...')
      
      // Create homeless person
      await setDoc(doc(db, 'users', 'homeless_person_1'), {
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
        certScore: { cooperation: 85, engagement: 90, retention: 75, trust: 80 },
        isActive: true,
        publicProfile: true,
        createdAt: Timestamp.now(),
        lastLoginAt: Timestamp.now()
      })
      addResult('✓ Created homeless person: John Smith')
      
      // Create MSD case worker
      await setDoc(doc(db, 'users', 'msd_caseworker_1'), {
        displayName: 'Sarah Jones',
        email: 'sarah.jones@msd.govt.nz',
        role: 'MSDCaseWorker',
        department: 'MSD',
        region: 'Canterbury',
        specializations: ['emergency_housing', 'complex_needs'],
        certScore: { cooperation: 95, engagement: 92, retention: 88, trust: 94 },
        isActive: true,
        publicProfile: false,
        createdAt: Timestamp.now(),
        lastLoginAt: Timestamp.now()
      })
      addResult('✓ Created MSD case worker: Sarah Jones')
      
      // Create KO representative
      await setDoc(doc(db, 'users', 'ko_representative_1'), {
        displayName: 'Mike Wilson',
        email: 'mike.wilson@kaingaora.govt.nz',
        role: 'KORepresentative',
        department: 'KO',
        region: 'Canterbury',
        portfolios: ['emergency_housing', 'transitional_housing'],
        certScore: { cooperation: 90, engagement: 88, retention: 92, trust: 91 },
        isActive: true,
        publicProfile: false,
        createdAt: Timestamp.now(),
        lastLoginAt: Timestamp.now()
      })
      addResult('✓ Created KO representative: Mike Wilson')
      
      // Create emergency housing policy
      await setDoc(doc(db, 'policies', 'emergency_housing_policy'), {
        name: 'EmergencyHousingPolicy',
        description: 'Rapid housing placement for people in crisis situations',
        version: '1.0.0',
        author: 'msd_caseworker_1',
        authorName: 'Sarah Jones',
        visibility: 'public',
        category: 'emergency_housing',
        tags: ['emergency', 'housing', 'crisis', 'nz', 'msd', 'ko'],
        status: 'active',
        script: `policy EmergencyHousingPolicy {
  stakeholder Applicant
  stakeholder EmergencyCaseWorker
  stakeholder KOEmergencyTeam
  
  rule EmergencyApplicationForum -> Forum("URGENT: Emergency Housing - {Applicant.name}",
    defaultStakeholders = [Applicant, EmergencyCaseWorker, KOEmergencyTeam],
    urgency = "critical",
    autoEscalate = { timeLimit = 24h, escalateTo = [EmergencyManager] }
  )
  
  rule EmergencyEligibilityCheck -> Service("MSDEmergencyEligibility",
    urgencyLevel = "critical",
    fastTrack = true
  )
  
  rule EmergencyHousingSearch -> Service("KOEmergencyHousing",
    availableTonight = true,
    region = Applicant.currentLocation
  ) requires [EmergencyEligibilityCheck.approved]
}`,
        instantiationCount: 0,
        activeInstantiations: 0,
        rating: { average: 0, totalRatings: 0 },
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      })
      addResult('✓ Created policy: EmergencyHousingPolicy')
      
      // Create test services
      await setDoc(doc(db, 'services', 'msd_emergency_eligibility'), {
        name: 'MSDEmergencyEligibility',
        description: 'Fast-track eligibility checking for emergency housing',
        provider: 'msd_caseworker_1',
        providerName: 'Sarah Jones',
        type: 'api',
        category: 'eligibility_verification',
        status: 'active',
        certScore: { cooperation: 95, engagement: 92, retention: 88, trust: 94 },
        createdAt: Timestamp.now()
      })
      addResult('✓ Created service: MSDEmergencyEligibility')
      
      await setDoc(doc(db, 'services', 'ko_emergency_housing'), {
        name: 'KOEmergencyHousing',
        description: 'Search and allocate emergency accommodation',
        provider: 'ko_representative_1',
        providerName: 'Mike Wilson',
        type: 'api',
        category: 'housing_search',
        status: 'active',
        certScore: { cooperation: 90, engagement: 88, retention: 92, trust: 91 },
        createdAt: Timestamp.now()
      })
      addResult('✓ Created service: KOEmergencyHousing')
      
      addResult('')
      addResult('🎉 Database seeded successfully!')
      addResult('')
      addResult('Test accounts created:')
      addResult('👤 Homeless person: john.smith@example.com')
      addResult('👨‍💼 MSD case worker: sarah.jones@msd.govt.nz')
      addResult('🏢 KO representative: mike.wilson@kaingaora.govt.nz')
      addResult('')
      addResult('Ready to test social housing coordination!')
      
    } catch (error) {
      addResult(`❌ Error: ${error}`)
    }
    
    setLoading(false)
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">🌱 Seed Social Housing Data</h1>
      <p className="text-gray-600 mb-6">
        This will create test data for coordinating housing between homeless individuals, MSD, and KO.
      </p>
      
      <button 
        onClick={seedDatabase}
        disabled={loading}
        className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? 'Seeding Database...' : 'Seed Database'}
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
      
      {results.some(r => r.includes('🎉 Database seeded successfully!')) && (
        <div className="mt-6 space-x-4">
          <a href="/test" className="text-blue-500 hover:underline">
            → View Test Data
          </a>
          <a href="/" className="text-blue-500 hover:underline">
            → Back to Home
          </a>
        </div>
      )}
    </div>
  )
}
