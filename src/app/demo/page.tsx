'use client'

import { useState } from 'react'

// Mock data for PFSD protocol demonstration
const mockUsers = [
  {
    id: 'homeless_person_1',
    displayName: 'John Smith',
    email: 'john.smith@example.com',
    role: 'HomelessPerson',
    profile: {
      age: 34,
      currentSituation: 'sleeping_rough',
      preferredRegion: 'Christchurch',
      bedroomNeeds: 1
    }
  },
  {
    id: 'msd_caseworker_1', 
    displayName: 'Sarah Jones',
    email: 'sarah.jones@msd.govt.nz',
    role: 'MSDCaseWorker',
    department: 'MSD',
    region: 'Canterbury'
  },
  {
    id: 'ko_representative_1',
    displayName: 'Mike Wilson', 
    email: 'mike.wilson@kaingaora.govt.nz',
    role: 'KORepresentative',
    department: 'KO',
    region: 'Canterbury'
  }
]

const mockPolicy = {
  id: 'emergency_housing_policy',
  name: 'EmergencyHousingPolicy',
  description: 'Rapid housing placement for people in crisis',
  version: '1.0.0',
  author: 'msd_caseworker_1',
  status: 'active'
}

export default function DemoPage() {
  const [selectedUser, setSelectedUser] = useState('')
  const [instantiating, setInstantiating] = useState(false)

  const instantiatePolicy = () => {
    setInstantiating(true)
    // Simulate policy instantiation
    setTimeout(() => {
      setInstantiating(false)
      alert('Emergency Housing Policy instantiated! Forum created for stakeholder coordination.')
    }, 2000)
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">PFSD Protocol Demo</h1>
      <p className="text-gray-600 mb-8">
        Demonstrating social housing coordination using Policy-Forum-Service-Data architecture
      </p>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Stakeholders ({mockUsers.length})</h2>
          <div className="space-y-3">
            {mockUsers.map(user => (
              <div key={user.id} className="p-4 border rounded-lg">
                <div className="font-medium">{user.displayName}</div>
                <div className="text-sm text-gray-600">{user.role}</div>
                <div className="text-sm text-gray-600">{user.email}</div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Available Policies</h2>
          <div className="p-4 border rounded-lg">
            <div className="font-medium">{mockPolicy.name}</div>
            <div className="text-sm text-gray-600">{mockPolicy.description}</div>
            <div className="text-sm text-gray-600">Version: {mockPolicy.version}</div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium mb-2">
                Select Applicant:
              </label>
              <select 
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="border rounded px-3 py-2 w-full"
              >
                <option value="">Choose applicant...</option>
                {mockUsers.filter(u => u.role === 'HomelessPerson').map(user => (
                  <option key={user.id} value={user.id}>{user.displayName}</option>
                ))}
              </select>
            </div>
            
            <button 
              onClick={instantiatePolicy}
              disabled={!selectedUser || instantiating}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {instantiating ? 'Creating Forum...' : 'Instantiate Policy'}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
        <h3 className="font-semibold text-green-800">PFSD Protocol Flow</h3>
        <ol className="text-green-700 mt-2 space-y-1">
          <li>1. <strong>Policy:</strong> EmergencyHousingPolicy defines governance rules</li>
          <li>2. <strong>Forum:</strong> Creates coordination space for John, Sarah (MSD), Mike (KO)</li>
          <li>3. <strong>Service:</strong> Integrates eligibility checking and housing search</li>
          <li>4. <strong>Data:</strong> All interactions stored and auditable</li>
        </ol>
      </div>
    </div>
  )
}
