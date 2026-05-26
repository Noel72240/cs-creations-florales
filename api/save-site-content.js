/**
 * Enregistre le JSON site_content via service_role (mot de passe admin requis).
 */
import { readAdminPassword } from './lib/adminAuth.js'
import { saveSiteContentCore } from './lib/saveSiteContentCore.js'
import { corsHeaders, readJsonBody, sendJson } from './lib/http.js'

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
    const result = await saveSiteContentCore(readAdminPassword(body, req.headers), body.payload)
    if (!result.ok) {
      const status = result.error?.includes('incorrect') ? 401 : result.error?.includes('configuré') ? 503 : 500
      sendJson(res, status, result, origin)
      return
    }

    sendJson(res, 200, result, origin)
  } catch (e) {
    sendJson(res, 500, { ok: false, error: e?.message || 'Erreur serveur' }, origin)
  }
}
