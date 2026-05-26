import { verifyAdminPassword } from './adminAuth.js'
import { getSupabaseServiceClient } from './supabaseService.js'

const ROW_ID = 'main'

/** @returns {Promise<{ ok: boolean, error?: string }>} */
export async function saveSiteContentCore(adminPassword, payload) {
  const auth = verifyAdminPassword(adminPassword)
  if (!auth.ok) return { ok: false, error: auth.error }

  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return { ok: false, error: 'payload JSON invalide' }
  }

  const sb = getSupabaseServiceClient()
  if (!sb) {
    return {
      ok: false,
      error: 'Supabase serveur non configuré (SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY).',
    }
  }

  const { error } = await sb.from('site_content').upsert(
    {
      id: ROW_ID,
      payload,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'id' },
  )

  if (error) return { ok: false, error: error.message }
  return { ok: true }
}
