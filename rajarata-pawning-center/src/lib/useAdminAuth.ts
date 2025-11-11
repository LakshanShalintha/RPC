'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export function useAdminAuth() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = localStorage.getItem('adminAuthenticated')
      const loginTime = localStorage.getItem('adminLoginTime')
      
      if (authenticated === 'true' && loginTime) {
        // Check if session is still valid (24 hours)
        const now = new Date().getTime()
        const loginTimestamp = parseInt(loginTime)
        const hoursSinceLogin = (now - loginTimestamp) / (1000 * 60 * 60)
        
        if (hoursSinceLogin < 24) {
          setIsAuthenticated(true)
        } else {
          // Session expired
          logout()
        }
      } else {
        router.push('/admin/login')
      }
      
      setIsLoading(false)
    }

    checkAuth()
  }, [router])

  const logout = () => {
    localStorage.removeItem('adminAuthenticated')
    localStorage.removeItem('adminLoginTime')
    router.push('/admin/login')
  }

  return { isAuthenticated, isLoading, logout }
}
