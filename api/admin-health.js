/**
 * Diagnostic (sans secrets) : variables serveur pour l’admin Supabase.
 */
import { getAdminPasswordFromEnv } from './lib/adminAuth.js'
import { getSupabaseServiceClient } from './lib/supabaseService.js'
import { corsHeaders, sendJson } from './lib/http.js'

export default async function handler(req, res) {
  const origin = req.headers.origin

  if (req.method === 'OPTIONS') {
    res.writeHead(204, corsHeaders(origin))
    res.end()
    return
  }

  if (req.method !== 'GET') {
    sendJson(res, 405, { ok: false, error: 'GET uniquement' }, origin)
    return
  }

  const sb = getSupabaseServiceClient()
  const url = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').trim()

  sendJson(
    res,
    200,
    {
      ok: true,
      supabaseUrlConfigured: Boolean(url),
      supabaseServiceConfigured: Boolean(sb),
      adminPasswordConfigured: Boolean(getAdminPasswordFromEnv()),
      storageBucketConfigured: Boolean(
        (process.env.SUPABASE_STORAGE_BUCKET || process.env.VITE_SUPABASE_STORAGE_BUCKET || '').trim(),
      ),
    },
    origin,
  )
}
