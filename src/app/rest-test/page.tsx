'use client'

import { useEffect, useState } from 'react'
import { FirebaseREST } from '@/lib/firebase-rest'

export default function RestTestPage() {
  const [users, setUsers] = useState<any[]>([])
  const [policies, setPolicies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching users via REST API...')
        const usersData = await FirebaseREST.listDocuments('users')
        console.log('Users from REST:', usersData)
        setUsers(usersData)

        console.log('Fetching policies via REST API...')
        const policiesData = await FirebaseREST.listDocuments('policies')
        console.log('Policies from REST:', policiesData)
        setPolicies(policiesData)

        setLoading(false)
      } catch (err) {
        console.error('REST API error:', err)
        setError(String(err))
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const createTestUser = async () => {
    try {
      await FirebaseREST.setDocument('users', 'test_user_' + Date.now(), {
        displayName: 'Test User',
        email: 'test@example.com',
        role: 'TestRole',
        isActive: true,
        createdAt: new Date().toISOString()
      })
      
      // Refresh data
      const usersData = await FirebaseREST.listDocuments('users')
      setUsers(usersData)
      
      alert('Test user created via REST API!')
    } catch (error) {
      alert('Error creating user: ' + error)
    }
  }

  if (loading) return <div className="p-8">Loading via REST API...</div>
  if (error) return <div className="p-8 text-red-600">REST API Error: {error}</div>

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">REST API Data Test</h1>
      
      <div className="mb-6">
        <button 
          onClick={createTestUser}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Create Test User via REST
        </button>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Users ({users.length})</h2>
          <div className="space-y-3">
            {users.length === 0 ? (
              <p className="text-gray-500">No users found</p>
            ) : (
              users.map(user => (
                <div key={user.id} className="p-4 border rounded-lg bg-green-50">
                  <div className="font-medium">{user.displayName}</div>
                  <div className="text-sm text-gray-600">{user.role}</div>
                  <div className="text-sm text-gray-600">{user.email}</div>
                </div>
              ))
            )}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Policies ({policies.length})</h2>
          <div className="space-y-3">
            {policies.length === 0 ? (
              <p className="text-gray-500">No policies found</p>
            ) : (
              policies.map(policy => (
                <div key={policy.id} className="p-4 border rounded-lg bg-blue-50">
                  <div className="font-medium">{policy.name}</div>
                  <div className="text-sm text-gray-600">{policy.description}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {(users.length > 0 || policies.length > 0) && (
        <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="font-semibold text-green-800">REST API Working!</h3>
          <p className="text-green-700">Successfully reading and writing data via Firebase REST API</p>
        </div>
      )}
    </div>
  )
}
