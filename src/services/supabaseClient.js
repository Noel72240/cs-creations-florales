import { createClient } from '@supabase/supabase-js'

const url = (import.meta.env.VITE_SUPABASE_URL || '').trim()
const anonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim()

let client = null

/** Client Supabase si les variables d’environnement sont définies (Vercel / .env). */
export function getSupabase() {
  if (!url || !anonKey) return null
  if (!client) {
    client = createClient(url, anonKey)
  }
  return client
}

export function isSupabaseConfigured() {
  return Boolean(url && anonKey)
}
