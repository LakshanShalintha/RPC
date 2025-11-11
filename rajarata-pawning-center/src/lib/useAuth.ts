// Optional: Authentication Hook for Admin Panel
// Uncomment and use when you want to add authentication

'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    return { data, error }
  }

  return {
    user,
    loading,
    signIn,
    signOut,
    signUp,
  }
}

// Example usage in admin page:
// 
// import { useAuth } from '@/lib/useAuth'
// 
// export default function AdminPanel() {
//   const { user, loading, signOut } = useAuth()
//   
//   if (loading) return <div>Loading...</div>
//   if (!user) return <LoginForm />
//   
//   return (
//     <div>
//       <button onClick={signOut}>Sign Out</button>
//       {/* Admin content */}
//     </div>
//   )
// }
