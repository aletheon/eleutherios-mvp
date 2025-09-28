'use client'

import { useEffect, useState } from 'react'
import { FirebaseREST } from '@/lib/firebase-rest'

export default function DemoLivePage() {
  const [users, setUsers] = useState<any[]>([])
  const [selectedUser, setSelectedUser] = useState('')
  const [instantiation, setInstantiation] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await FirebaseREST.listDocuments('users')
        setUsers(usersData)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching users:', error)
        setError('Failed to load users')
        setLoading(false)
      }
    }
    fetchUsers()
  }, [])

  const instantiatePolicy = async () => {
    if (!selectedUser) {
      alert('Please select a person needing housing')
      return
    }
    
    setProcessing(true)
    setError('')
    
    try {
      console.log('Starting policy instantiation for user:', selectedUser)
      
      const applicant = users.find(u => u.id === selectedUser)
      const caseWorker = users.find(u => u.role === 'MSDCaseWorker')
      const koRep = users.find(u => u.role === 'KORepresentative')
      
      console.log('Found stakeholders:', { applicant, caseWorker, koRep })
      
      if (!applicant || !caseWorker || !koRep) {
        throw new Error('Missing required stakeholders')
      }
      
      // Create forum via REST API
      const forumId = `forum_${Date.now()}`
      console.log('Creating forum with ID:', forumId)
      
      const forumData = {
        name: `Emergency Housing - ${applicant.displayName}`,
        policyId: 'emergency_housing_policy',
        stakeholders: [
          { userId: selectedUser, role: 'Applicant', name: applicant.displayName },
          { userId: caseWorker.id, role: 'CaseWorker', name: caseWorker.displayName },
          { userId: koRep.id, role: 'KORepresentative', name: koRep.displayName }
        ],
        status: 'active',
        createdAt: new Date().toISOString()
      }
      
      console.log('Forum data to create:', forumData)
      
      const result = await FirebaseREST.setDocument('forums', forumId, forumData)
      console.log('Forum creation result:', result)
      
      setInstantiation({
        forumId,
        applicant: applicant.displayName,
        caseWorker: caseWorker.displayName,
        koRep: koRep.displayName
      })
      
      console.log('Policy instantiation completed successfully')
      
    } catch (error) {
      console.error('Error instantiating policy:', error)
      setError(`Failed to create forum: ${error}`)
    } finally {
      setProcessing(false)
    }
  }

  if (loading) return <div className="p-8">Loading stakeholders...</div>

  if (instantiation) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8">Policy Instantiated Successfully!</h1>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-green-800 mb-4">Emergency Housing Coordination Active</h2>
          <div className="space-y-2 text-green-700">
            <p><strong>Applicant:</strong> {instantiation.applicant}</p>
            <p><strong>MSD Case Worker:</strong> {instantiation.caseWorker}</p>
            <p><strong>KO Representative:</strong> {instantiation.koRep}</p>
            <p><strong>Forum ID:</strong> {instantiation.forumId}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold text-blue-600">1. Policy Layer</h3>
            <p className="text-sm text-gray-600">EmergencyHousingPolicy executed</p>
          </div>
          <div className="p-4 border rounded-lg bg-blue-50">
            <h3 className="font-semibold text-blue-600">2. Forum Layer</h3>
            <p className="text-sm text-gray-600">Coordination forum created</p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold text-blue-600">3. Service Layer</h3>
            <p className="text-sm text-gray-600">Ready for eligibility & housing search</p>
          </div>
        </div>

        <div className="space-x-4">
          <button 
            onClick={() => setInstantiation(null)}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Reset Demo
          </button>
          <a 
            href="/rest-test" 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 inline-block"
          >
            View All Data
          </a>
        </div>
      </div>
    )
  }

  const homelessUsers = users.filter(u => u.role === 'HomelessPerson')
  const msdUsers = users.filter(u => u.role === 'MSDCaseWorker')
  const koUsers = users.filter(u => u.role === 'KORepresentative')

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Live PFSD Protocol Demo</h1>
      <p className="text-gray-600 mb-8">
        Real social housing coordination using live data
      </p>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}
      
      <div className="grid md:grid-cols-3 gap-8 mb-8">
        <div>
          <h2 className="text-lg font-semibold mb-4">Homeless Individuals ({homelessUsers.length})</h2>
          {homelessUsers.map(user => (
            <div key={user.id} className="p-3 border rounded-lg mb-2">
              <div className="font-medium">{user.displayName}</div>
              <div className="text-sm text-gray-600">{user.email}</div>
            </div>
          ))}
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">MSD Case Workers ({msdUsers.length})</h2>
          {msdUsers.map(user => (
            <div key={user.id} className="p-3 border rounded-lg mb-2">
              <div className="font-medium">{user.displayName}</div>
              <div className="text-sm text-gray-600">{user.email}</div>
            </div>
          ))}
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">KO Representatives ({koUsers.length})</h2>
          {koUsers.map(user => (
            <div key={user.id} className="p-3 border rounded-lg mb-2">
              <div className="font-medium">{user.displayName}</div>
              <div className="text-sm text-gray-600">{user.email}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 border-2 border-blue-200 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Instantiate Emergency Housing Policy</h2>
        
        <select 
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          className="border rounded px-3 py-2 w-full mb-4"
        >
          <option value="">Select person needing housing...</option>
          {homelessUsers.map(user => (
            <option key={user.id} value={user.id}>{user.displayName}</option>
          ))}
        </select>
        
        <button 
          onClick={instantiatePolicy}
          disabled={!selectedUser || processing}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 disabled:opacity-50 w-full"
        >
          {processing ? 'Creating Forum...' : 'Create Housing Coordination Forum'}
        </button>
      </div>
    </div>
  )
}
