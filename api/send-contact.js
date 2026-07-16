/**
 * Envoie une demande de contact / devis à Charlène (Resend).
 */
import { normalizeContactPayload, sendContactNotificationEmail } from '../server/lib/contactEmail.js'
import { corsHeaders, readJsonBody, sendJson } from '../server/lib/http.js'

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

  let body
  try {
    body = await readJsonBody(req)
  } catch (e) {
    sendJson(res, 400, { ok: false, error: e?.message || 'Requête invalide' }, origin)
    return
  }

  // Honeypot anti-spam (champ caché côté client)
  if (String(body?.website || '').trim()) {
    sendJson(res, 200, { ok: true, sent: true }, origin)
    return
  }

  const normalized = normalizeContactPayload(body)
  if (!normalized.ok) {
    sendJson(res, 400, { ok: false, error: normalized.errors[0] || 'Données invalides' }, origin)
    return
  }

  const result = await sendContactNotificationEmail(normalized.data)
  if (!result.sent) {
    const status = result.reason === 'no_api_key' || result.reason === 'no_recipient' ? 503 : 502
    sendJson(
      res,
      status,
      {
        ok: false,
        error:
          status === 503
            ? 'Envoi e-mail non configuré. Réessayez plus tard ou contactez-nous par téléphone.'
            : 'Impossible d’envoyer le message pour le moment. Réessayez ou appelez Charlène.',
        reason: result.reason,
      },
      origin,
    )
    return
  }

  sendJson(res, 200, { ok: true, sent: true }, origin)
}
