/**
 * Vérifie un code promo (montant + usage unique par e-mail en base).
 */
import { createClient } from '@supabase/supabase-js'
import { buildPromoCatalog, normalizePromoCode, validatePromoCode } from '../shared/promoCodes.js'
import { isPromoBlockedForEmail, normalizeCustomerEmail } from './lib/promoRedemption.js'

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
    'Access-Control-Max-Age': '86400',
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

function getServerPromoCatalog() {
  const code = (process.env.PROMO_WELCOME_CODE || 'Bienvenuecscreationflorale10').trim()
  const percentOff = Number(process.env.PROMO_WELCOME_PERCENT) || 10
  const minSubtotal = Number(process.env.PROMO_WELCOME_MIN_EUR) || 35
  if (!code) return []
  return [
    {
      code,
      percentOff,
      minSubtotal,
      firstOrderOnly: process.env.PROMO_WELCOME_FIRST_ORDER_ONLY !== 'false',
    },
  ]
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

  let body
  try {
    body = await readJsonBody(req)
  } catch (e) {
    sendJson(res, 400, { error: e.message || 'Requête invalide' }, origin)
    return
  }

  const promoCodeRaw = typeof body.promoCode === 'string' ? body.promoCode.trim() : ''
  const subtotal = Math.round((Number(body.subtotal) || 0) * 100) / 100
  const customerEmail = typeof body.customerEmail === 'string' ? body.customerEmail.trim() : ''

  const catalog = buildPromoCatalog(getServerPromoCatalog())
  const promo = validatePromoCode(promoCodeRaw, subtotal, { catalog, checkFirstOrder: false })

  if (!promo.valid) {
    sendJson(res, 200, { valid: false, message: promo.message }, origin)
    return
  }

  const def = catalog.get(normalizePromoCode(promoCodeRaw))
  const needsEmail = def?.firstOrderOnly !== false

  if (needsEmail && !normalizeCustomerEmail(customerEmail)) {
    sendJson(
      res,
      200,
      {
        valid: false,
        message: 'Indiquez votre adresse e-mail : ce code est limité à une utilisation par client.',
        requiresEmail: true,
      },
      origin,
    )
    return
  }

  if (needsEmail && supabaseUrl && serviceKey) {
    try {
      const supabase = createClient(supabaseUrl, serviceKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      })
      const usage = await isPromoBlockedForEmail(supabase, promo.code, customerEmail)
      if (usage.blocked) {
        sendJson(res, 200, { valid: false, message: usage.message }, origin)
        return
      }
    } catch (e) {
      sendJson(res, 503, { error: e.message || 'Vérification indisponible' }, origin)
      return
    }
  }

  sendJson(res, 200, { valid: true, promo }, origin)
}
