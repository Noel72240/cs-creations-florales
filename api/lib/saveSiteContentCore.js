import { verifyAdminPassword } from './adminAuth.js'
import { getSupabaseServiceClient } from './supabaseService.js'

const ROW_ID = 'main'

function deepMerge(base, patch) {
  if (!patch || typeof patch !== 'object') return base
  if (Array.isArray(patch)) return patch
  const out = Array.isArray(base) ? [...base] : { ...(base && typeof base === 'object' ? base : {}) }
  for (const key of Object.keys(patch)) {
    const pv = patch[key]
    const bv = base?.[key]
    if (pv && typeof pv === 'object' && !Array.isArray(pv) && bv && typeof bv === 'object' && !Array.isArray(bv)) {
      out[key] = deepMerge(bv, pv)
    } else if (pv !== undefined && pv !== null) {
      out[key] = pv
    }
  }
  return out
}

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

  const { data: existing, error: fetchError } = await sb
    .from('site_content')
    .select('payload')
    .eq('id', ROW_ID)
    .maybeSingle()

  if (fetchError) return { ok: false, error: fetchError.message }

  const mergedPayload = deepMerge(existing?.payload || {}, payload)

  const { error } = await sb.from('site_content').upsert(
    {
      id: ROW_ID,
      payload: mergedPayload,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'id' },
  )

  if (error) return { ok: false, error: error.message }
  return { ok: true }
}
