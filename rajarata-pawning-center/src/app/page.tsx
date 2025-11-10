'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

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
    <main className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-[#1f1508] via-[#3b2f1e] to-[#2a1d0b] text-white">
      {loading && (
        <div className="text-center">
          {/* --- LOGO --- */}
          <div className="flex justify-center mb-6">
            <Image
              src="/images/logo/Logo.webp" 
              alt="Rajarata Pawning Center Logo"
              width={120}
              height={120}
              className="rounded-full shadow-lg bg-white p-2"
            />
          </div>

          {/* --- TEXT --- */}
          <h1 className="text-3xl font-extrabold text-white drop-shadow-md">
            Welcome to Rajarata Pawning Center
          </h1>
          <p className="text-yellow-200 mt-2 text-lg">Loading your experience...</p>

          {/* --- LOADING ANIMATION --- */}
          <div className="mt-6">
            <div className="w-12 h-12 border-4 border-yellow-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        </div>
      )}
    </main>
  )
}
