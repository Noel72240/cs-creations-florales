import { getAdminPasswordFromEnv } from './adminAuth.js'
import { getSupabaseServiceClient } from './supabaseService.js'

export function getAdminHealthStatus() {
  const sb = getSupabaseServiceClient()
  const url = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').trim()
  return {
    ok: true,
    supabaseUrlConfigured: Boolean(url),
    supabaseServiceConfigured: Boolean(sb),
    adminPasswordConfigured: Boolean(getAdminPasswordFromEnv()),
    storageBucketConfigured: Boolean(
      (process.env.SUPABASE_STORAGE_BUCKET || process.env.VITE_SUPABASE_STORAGE_BUCKET || '').trim(),
    ),
  }
}
