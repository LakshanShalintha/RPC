'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { SliderService } from '@/lib/sliderService'
import { Slider } from '@/lib/supabase'
import { useLanguage } from '../context/LanguageContext'
import { useAdminAuth } from '@/lib/useAdminAuth'

export default function AdminPanel() {
  const router = useRouter()
  useLanguage()
  const { isAuthenticated, isLoading, logout } = useAdminAuth()
  const [sliders, setSliders] = useState<Slider[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isAuthenticated) {
      loadSliders()
    }
  }, [isAuthenticated])

  const loadSliders = async () => {
    try {
      setLoading(true)
      const data = await SliderService.getAllSliders()
      setSliders(data)
    } catch (err) {
      console.error('Failed to load sliders:', err)
    } finally {
      setLoading(false)
    }
  }

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1f1508] via-[#3b2f1e] to-[#2a1d0b] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-300"></div>
      </div>
    )
  }

  // Don't render admin panel if not authenticated
  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1f1508] via-[#3b2f1e] to-[#2a1d0b] text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-5xl font-bold mb-2">Admin Panel</h1>
          <p className="text-amber-200">Manage your website content</p>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* Image Slider Management Card */}
            <div
              onClick={() => router.push('/admin/slider')}
              className="bg-white/10 backdrop-blur-xl border-2 border-yellow-300/30 rounded-2xl p-6 cursor-pointer hover:border-yellow-500 hover:bg-white/15 hover:scale-105 transition-all group"
            >
              <div className="flex flex-col items-center text-center">
                <div className="bg-yellow-500/20 p-4 rounded-2xl group-hover:bg-yellow-500/30 transition-all mb-4 group-hover:scale-110">
                  <svg className="w-12 h-12 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold mb-2">Home Page Slider</h2>
                <p className="text-amber-200 text-sm mb-4">Upload & manage slider images</p>
                
                

                <div className="flex items-center gap-2 text-yellow-500 group-hover:gap-3 transition-all">
                  <span className="text-sm font-semibold">Manage Images</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Branches Management Card */}
            <div
              onClick={() => router.push('/admin/branches')}
              className="bg-white/10 backdrop-blur-xl border-2 border-yellow-300/30 rounded-2xl p-6 cursor-pointer hover:border-yellow-500 hover:bg-white/15 hover:scale-105 transition-all group"
            >
              <div className="flex flex-col items-center text-center">
                <div className="bg-green-500/20 p-4 rounded-2xl group-hover:bg-green-500/30 transition-all mb-4 group-hover:scale-110">
                  <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold mb-2">Branches</h2>
                <p className="text-amber-200 text-sm mb-4">Manage branch locations</p>
                
                <div className="flex items-center gap-2 text-yellow-500 group-hover:gap-3 transition-all">
                  <span className="text-sm font-semibold">Manage Branches</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Services Management Card */}
            <div
              onClick={() => router.push('/admin/services')}
              className="bg-white/10 backdrop-blur-xl border-2 border-yellow-300/30 rounded-2xl p-6 cursor-pointer hover:border-yellow-500 hover:bg-white/15 hover:scale-105 transition-all group"
            >
              <div className="flex flex-col items-center text-center">
                <div className="bg-purple-500/20 p-4 rounded-2xl group-hover:bg-purple-500/30 transition-all mb-4 group-hover:scale-110">
                  <svg className="w-12 h-12 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold mb-2">Services</h2>
                <p className="text-amber-200 text-sm mb-4">Manage your service offerings</p>
                
                <div className="flex items-center gap-2 text-yellow-500 group-hover:gap-3 transition-all">
                  <span className="text-sm font-semibold">Manage Services</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>
            </div>

            {/* News Management Card */}
            <div
              onClick={() => router.push('/admin/news')}
              className="bg-white/10 backdrop-blur-xl border-2 border-yellow-300/30 rounded-2xl p-6 cursor-pointer hover:border-yellow-500 hover:bg-white/15 hover:scale-105 transition-all group"
            >
              <div className="flex flex-col items-center text-center">
                <div className="bg-blue-500/20 p-4 rounded-2xl group-hover:bg-blue-500/30 transition-all mb-4 group-hover:scale-110">
                  <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold mb-2">News & Updates</h2>
                <p className="text-amber-200 text-sm mb-4">Manage news articles</p>
                
                <div className="flex items-center gap-2 text-yellow-500 group-hover:gap-3 transition-all">
                  <span className="text-sm font-semibold">Manage News</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Placeholder cards for future features */}
            <div className="bg-white/5 backdrop-blur-xl border border-yellow-300/20 rounded-2xl p-6 opacity-50 cursor-not-allowed">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="bg-purple-500/20 p-3 rounded-xl">
                    <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Content Pages</h2>
                    <p className="text-amber-200 text-sm">Coming soon</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
