'use client'

import { useEffect, useState } from 'react'
import { db } from '@/lib/firebase'
import { collection, getDocs } from 'firebase/firestore'

export default function VerifyPage() {
  const [users, setUsers] = useState<any[]>([])
  const [policies, setPolicies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching users...')
        const usersSnapshot = await getDocs(collection(db, 'users'))
        const usersData = usersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        console.log('Users found:', usersData)
        setUsers(usersData)

        console.log('Fetching policies...')
        const policiesSnapshot = await getDocs(collection(db, 'policies'))
        const policiesData = policiesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        console.log('Policies found:', policiesData)
        setPolicies(policiesData)

        setLoading(false)
      } catch (err) {
        console.error('Error fetching data:', err)
        setError(String(err))
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) return <div className="p-8">Loading data...</div>
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Data Verification</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Users ({users.length})</h2>
          <div className="space-y-3">
            {users.map(user => (
              <div key={user.id} className="p-4 border rounded-lg bg-green-50">
                <div className="font-medium">{user.displayName}</div>
                <div className="text-sm text-gray-600">{user.role}</div>
                <div className="text-sm text-gray-600">{user.email}</div>
                <div className="text-xs text-gray-400">Status: {user.isActive ? 'Active' : 'Inactive'}</div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Policies ({policies.length})</h2>
          <div className="space-y-3">
            {policies.map(policy => (
              <div key={policy.id} className="p-4 border rounded-lg bg-blue-50">
                <div className="font-medium">{policy.name}</div>
                <div className="text-sm text-gray-600">{policy.description}</div>
                <div className="text-sm text-gray-600">Version: {policy.version}</div>
                <div className="text-xs text-gray-400">Status: {policy.status}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {users.length > 0 && policies.length > 0 && (
        <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="font-semibold text-green-800">Database Status: Working!</h3>
          <p className="text-green-700">Firebase reads are working. Data exists and is accessible.</p>
          <div className="mt-4 space-x-4">
            <a href="/demo" className="text-blue-500 hover:underline">
              → Test Demo with Real Data
            </a>
            <a href="/" className="text-blue-500 hover:underline">
              → Back to Home
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
