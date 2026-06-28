/**
 * Retour SumUp : marque la commande comme payée (honor system) après redirection succès.
 */
import { createClient } from '@supabase/supabase-js'

function getAllowedOrigins() {
  const fromApp = (process.env.APP_URL || '')
    .split(',')
    .map((s) => s.trim().replace(/\/$/, ''))
    .filter(Boolean)
  const vercel = process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []
  return [...new Set([...fromApp, ...vercel])]
}

function corsHeaders(requestOrigin) {
  const allowed = getAllowedOrigins()
  const origin = (requestOrigin || '').trim().replace(/\/$/, '')
  const match = allowed.find((a) => origin === a)
  const allow = match || allowed[0] || '*'
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    Vary: 'Origin',
  }
}

function sendJson(res, status, body, origin) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', ...corsHeaders(origin) })
  res.end(JSON.stringify(body))
}

async function readJsonBody(req) {
  if (req.body && typeof req.body === 'object' && !Buffer.isBuffer(req.body)) {
    return req.body
  }
  const chunks = []
  for await (const chunk of req) {
    chunks.push(chunk)
  }
  const raw = Buffer.concat(chunks).toString('utf8')
  if (!raw.trim()) return {}
  try {
    return JSON.parse(raw)
  } catch {
    throw new Error('Corps JSON invalide')
  }
}

export default async function handler(req, res) {
  const origin = req.headers.origin || req.headers.referer?.split('/').slice(0, 3).join('/') || ''

  if (req.method === 'OPTIONS') {
    res.writeHead(204, corsHeaders(origin))
    res.end()
    return
  }

  if (req.method !== 'POST') {
    sendJson(res, 405, { error: 'Méthode non autorisée' }, origin)
    return
  }

  const supabaseUrl = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').trim()
  const serviceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim()
  if (!supabaseUrl || !serviceKey) {
    sendJson(res, 503, { error: 'Supabase non configuré' }, origin)
    return
  }

  let body
  try {
    body = await readJsonBody(req)
  } catch (e) {
    sendJson(res, 400, { error: e.message || 'Requête invalide' }, origin)
    return
  }

  const ref = String(body.checkoutReference || '').trim()
  if (!ref) {
    sendJson(res, 400, { error: 'Référence manquante' }, origin)
    return
  }

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  const { data, error } = await supabase
    .from('orders')
    .update({ status: 'paid', updated_at: new Date().toISOString() })
    .eq('checkout_reference', ref)
    .eq('status', 'pending')
    .select('id, promo_code')
    .maybeSingle()

  if (error) {
    console.error('[confirm-checkout-return]', error)
    sendJson(res, 500, { error: 'Mise à jour impossible' }, origin)
    return
  }

  sendJson(res, 200, { ok: true, updated: Boolean(data), promoCode: data?.promo_code || null }, origin)
}
