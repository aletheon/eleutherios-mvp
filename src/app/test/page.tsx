'use client'

import { useEffect, useState } from 'react'
import { db } from '@/lib/firebase'
import { collection, getDocs } from 'firebase/firestore'

export default function TestPage() {
  const [users, setUsers] = useState<any[]>([])
  const [policies, setPolicies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Starting to fetch data...')
        
        // Fetch users with error handling
        console.log('Fetching users...')
        const usersSnapshot = await getDocs(collection(db, 'users'))
        console.log('Users snapshot:', usersSnapshot)
        console.log('Users docs count:', usersSnapshot.docs.length)
        
        const usersData = usersSnapshot.docs.map(doc => {
          console.log('User doc:', doc.id, doc.data())
          return { id: doc.id, ...doc.data() }
        })
        console.log('Users data:', usersData)
        setUsers(usersData)

        // Fetch policies with error handling
        console.log('Fetching policies...')
        const policiesSnapshot = await getDocs(collection(db, 'policies'))
        console.log('Policies snapshot:', policiesSnapshot)
        console.log('Policies docs count:', policiesSnapshot.docs.length)
        
        const policiesData = policiesSnapshot.docs.map(doc => {
          console.log('Policy doc:', doc.id, doc.data())
          return { id: doc.id, ...doc.data() }
        })
        console.log('Policies data:', policiesData)
        setPolicies(policiesData)

        setLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error)
        setError(`Error: ${error}`)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <div className="p-8">Loading data...</div>
  }

  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Error</h1>
        <p className="text-red-600">{error}</p>
        <p className="mt-4">Check browser console for details.</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">PFSD Protocol Test</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Users ({users.length})</h2>
          <div className="space-y-3">
            {users.length === 0 ? (
              <p className="text-gray-500">No users found in database</p>
            ) : (
              users.map(user => (
                <div key={user.id} className="p-4 border rounded-lg">
                  <div className="font-medium">{user.displayName}</div>
                  <div className="text-sm text-gray-600">{user.role}</div>
                  <div className="text-sm text-gray-600">{user.email}</div>
                  <div className="text-xs text-gray-400">ID: {user.id}</div>
                </div>
              ))
            )}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Policies ({policies.length})</h2>
          <div className="space-y-3">
            {policies.length === 0 ? (
              <p className="text-gray-500">No policies found in database</p>
            ) : (
              policies.map(policy => (
                <div key={policy.id} className="p-4 border rounded-lg">
                  <div className="font-medium">{policy.name}</div>
                  <div className="text-sm text-gray-600">{policy.description}</div>
                  <div className="text-sm text-gray-600">Category: {policy.category}</div>
                  <div className="text-xs text-gray-400">ID: {policy.id}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-800">Debug Info</h3>
        <p className="text-blue-700">Users found: {users.length}</p>
        <p className="text-blue-700">Policies found: {policies.length}</p>
        <p className="text-blue-700">Check browser console for detailed logs</p>
      </div>
    </div>
  )
}
