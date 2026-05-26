/**
 * Enregistre le JSON site_content via service_role (mot de passe admin requis).
 */
import { readAdminPassword, verifyAdminPassword } from './lib/adminAuth.js'
import { getSupabaseServiceClient } from './lib/supabaseService.js'
import { corsHeaders, readJsonBody, sendJson } from './lib/http.js'

const ROW_ID = 'main'

export default async function handler(req, res) {
  const origin = req.headers.origin

  if (req.method === 'OPTIONS') {
    res.writeHead(204, corsHeaders(origin))
    res.end()
    return
  }

  if (req.method !== 'POST') {
    sendJson(res, 405, { ok: false, error: 'Méthode non autorisée' }, origin)
    return
  }

  try {
    const body = await readJsonBody(req)
    const auth = verifyAdminPassword(readAdminPassword(body, req.headers))
    if (!auth.ok) {
      sendJson(res, 401, { ok: false, error: auth.error }, origin)
      return
    }

    const payload = body.payload
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
      sendJson(res, 400, { ok: false, error: 'payload JSON invalide' }, origin)
      return
    }

    const sb = getSupabaseServiceClient()
    if (!sb) {
      sendJson(
        res,
        503,
        {
          ok: false,
          error: 'Supabase serveur non configuré (SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY sur Vercel).',
        },
        origin,
      )
      return
    }

    const { error } = await sb.from('site_content').upsert(
      {
        id: ROW_ID,
        payload,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' },
    )

    if (error) {
      sendJson(res, 500, { ok: false, error: error.message }, origin)
      return
    }

    sendJson(res, 200, { ok: true }, origin)
  } catch (e) {
    sendJson(res, 500, { ok: false, error: e?.message || 'Erreur serveur' }, origin)
  }
}
