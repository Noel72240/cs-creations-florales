/**
 * Upload Storage Supabase via service_role (mot de passe admin requis).
 * Corps JSON : { adminPassword, folder, fileName, contentType, dataBase64 }
 */
import { readAdminPassword, verifyAdminPassword } from '../server/lib/adminAuth.js'
import { getSupabaseServiceClient } from '../server/lib/supabaseService.js'
import { corsHeaders, readJsonBody, sendJson } from '../server/lib/http.js'

function safeFileExtension(fileName, contentType) {
  const fromName = (fileName || '').split('.').pop()
  if (fromName && /^[a-z0-9]+$/i.test(fromName) && fromName.length <= 8) {
    return fromName.toLowerCase()
  }
  const t = (contentType || '').toLowerCase()
  if (t === 'image/jpeg' || t === 'image/jpg') return 'jpg'
  if (t === 'image/png') return 'png'
  if (t === 'image/webp') return 'webp'
  if (t === 'image/gif') return 'gif'
  if (t === 'image/svg+xml') return 'svg'
  return 'jpg'
}

function randomSegment() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

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

    const bucket = (process.env.SUPABASE_STORAGE_BUCKET || process.env.VITE_SUPABASE_STORAGE_BUCKET || '').trim()
    if (!bucket) {
      sendJson(res, 503, { ok: false, error: 'Bucket Storage non configuré (SUPABASE_STORAGE_BUCKET).' }, origin)
      return
    }

    const dataBase64 = String(body.dataBase64 || '').trim()
    if (!dataBase64) {
      sendJson(res, 400, { ok: false, error: 'dataBase64 manquant' }, origin)
      return
    }

    const buffer = Buffer.from(dataBase64, 'base64')
    if (buffer.length < 1 || buffer.length > 4_500_000) {
      sendJson(res, 400, { ok: false, error: 'Image trop volumineuse (max ~4 Mo).' }, origin)
      return
    }

    const sb = getSupabaseServiceClient()
    if (!sb) {
      sendJson(res, 503, { ok: false, error: 'Supabase serveur non configuré.' }, origin)
      return
    }

    const sub = String(body.folder || 'site').replace(/^\/+|\/+$/g, '')
    const ext = safeFileExtension(body.fileName, body.contentType)
    const path = `${sub}/${randomSegment()}.${ext}`
    const contentType = body.contentType || `image/${ext === 'jpg' ? 'jpeg' : ext}`

    const { error } = await sb.storage.from(bucket).upload(path, buffer, {
      contentType,
      upsert: false,
    })
    if (error) {
      sendJson(res, 500, { ok: false, error: error.message }, origin)
      return
    }

    const { data } = sb.storage.from(bucket).getPublicUrl(path)
    const url = data?.publicUrl
    if (!url) {
      sendJson(res, 500, { ok: false, error: 'URL publique indisponible' }, origin)
      return
    }

    sendJson(res, 200, { ok: true, url }, origin)
  } catch (e) {
    sendJson(res, 500, { ok: false, error: e?.message || 'Erreur serveur' }, origin)
  }
}
