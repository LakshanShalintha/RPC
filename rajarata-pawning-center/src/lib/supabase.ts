import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Slider = {
  id: number
  image_url: string
  order_index: number
  created_at: string
}

export type Branch = {
  id: number
  title: string
  description: string
  title_si: string
  description_si: string
  address?: string
  address_si?: string
  contact_number?: string
  map_url?: string
  is_coming_soon: boolean
  order_index: number
  created_at: string
}

export type Service = {
  id: number
  title: string
  description: string
  title_si: string
  description_si: string
  order_index: number
  created_at: string
}

export type News = {
  id: number
  title: string
  title_si: string
  description: string
  description_si: string
  date: string
  image_url?: string
  order_index?: number
  created_at: string
}
