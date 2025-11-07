'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RootPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
      router.push('/home')
    }, 2000) // 2 seconds delay
    return () => clearTimeout(timer)
  }, [router])

  return (
    <main className="flex items-center justify-center h-screen bg-gray-100">
      {loading && (
        <div className="text-center">
          <h1 className="text-2xl font-bold text-blue-700">Welcome to Rajarata Pawning Center</h1>
          <p className="text-gray-600 mt-2">Loading your experience...</p>
        </div>
      )}
    </main>
  )
}
