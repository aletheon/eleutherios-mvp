'use client'

import { useState } from 'react'
import { FirebaseREST } from '@/lib/firebase-rest'

export default function CreatePolicyPage() {
  const [creating, setCreating] = useState(false)
  const [result, setResult] = useState('')

  const createPolicy = async () => {
    setCreating(true)
    try {
      await FirebaseREST.setDocument('policies', 'emergency_housing_policy', {
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
    urgency = "critical"
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
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      
      setResult('Policy created successfully! Check the REST API test page to verify.')
    } catch (error) {
      setResult(`Error creating policy: ${error}`)
    }
    setCreating(false)
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Create Emergency Housing Policy</h1>
      
      <button 
        onClick={createPolicy}
        disabled={creating}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {creating ? 'Creating Policy...' : 'Create EmergencyHousingPolicy'}
      </button>
      
      {result && (
        <div className="mt-4 p-4 border rounded">
          <p>{result}</p>
        </div>
      )}
      
      <div className="mt-6">
        <a href="/rest-test" className="text-blue-500 hover:underline">
          → Check REST API Test Page
        </a>
      </div>
    </div>
  )
}
