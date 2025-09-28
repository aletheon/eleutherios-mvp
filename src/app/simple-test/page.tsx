'use client'

import { useEffect, useState } from 'react'

export default function SimpleTest() {
  const [status, setStatus] = useState('Starting test...')

  useEffect(() => {
    const test = async () => {
      try {
        setStatus('Importing Firebase...')
        const { initializeApp } = await import('firebase/app')
        const { getFirestore, doc, setDoc } = await import('firebase/firestore')
        
        const config = {
          projectId: "eleutherios-mvp-3c717",
          apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
          authDomain: "eleutherios-mvp-3c717.firebaseapp.com"
        }
        
        setStatus('Initializing app...')
        const app = initializeApp(config)
        const db = getFirestore(app)
        
        setStatus('Writing test document...')
        
        // Set a timeout to catch hanging writes
        const writePromise = setDoc(doc(db, 'test', 'simple'), {
          message: 'test',
          time: new Date().toISOString()
        })
        
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Write timeout after 10 seconds')), 10000)
        )
        
        await Promise.race([writePromise, timeoutPromise])
        setStatus('SUCCESS: Write completed!')
        
      } catch (error) {
        setStatus(`ERROR: ${error}`)
      }
    }
    
    test()
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Simple Firebase Test</h1>
      <p className="text-lg">{status}</p>
    </div>
  )
}
