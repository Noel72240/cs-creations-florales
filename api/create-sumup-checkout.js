/**
 * Vercel Serverless — checkout SumUp, validation promo et confirmation retour paiement.
 * Routes via rewrites : /api/validate-promo-code, /api/confirm-checkout-return.
 */
import { createClient } from '@supabase/supabase-js'
import { randomUUID } from 'node:crypto'
import { fetchMaintenanceMode } from '../server/lib/maintenanceMode.js'
import { corsHeaders, readJsonBody, sendJson } from '../server/lib/http.js'
import { isPromoBlockedForEmail, normalizeCustomerEmail } from '../server/lib/promoRedemption.js'
import { buildPromoCatalog, normalizePromoCode, validatePromoCode } from '../shared/promoCodes.js'

const SUMUP_API = 'https://api.sumup.com/v0.1'

function getRequestPath(req) {
  const url = req.url || ''
  if (url.startsWith('/')) return url.split('?')[0]
  try {
    return new URL(url, 'http://localhost').pathname
  } catch {
    return url
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

function clampAmount(n) {
  const x = Math.round(n * 100) / 100
  if (!Number.isFinite(x) || x < 0.5) return null
  if (x > 50_000) return null
  return x
}

function normalizeLineItems(rawItems) {
  if (!Array.isArray(rawItems) || rawItems.length === 0) return null
  const out = []
  let sum = 0
  for (const raw of rawItems.slice(0, 30)) {
    const id = String(raw?.id ?? '').trim().slice(0, 120)
    if (!id) continue
    const title = String(raw?.title ?? 'Article').trim().slice(0, 220)
    const price = Number(raw?.price)
    let qty = parseInt(raw?.quantity, 10)
    if (!Number.isFinite(qty) || qty < 1) qty = 1
    if (qty > 99) qty = 99
    if (!Number.isFinite(price) || price < 0) continue
    const line = price * qty
    sum += line
    out.push({
      id,
      title,
      price: Math.round(price * 100) / 100,
      quantity: qty,
      lineTotal: Math.round(line * 100) / 100,
      selectedColor: raw?.selectedColor ? String(raw.selectedColor).slice(0, 32) : undefined,
      path: raw?.path ? String(raw.path).slice(0, 300) : undefined,
    })
  }
  if (!out.length) return null
  const total = clampAmount(sum)
  if (total === null) return null
  return { items: out, total }
}

async function fetchMerchantCode(apiKey) {
  const preset = (process.env.SUMUP_MERCHANT_CODE || '').trim()
  if (preset) return preset
  const r = await fetch(`${SUMUP_API}/me`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  })
  if (!r.ok) {
    const t = await r.text()
    throw new Error(`SumUp profil (${r.status}): ${t.slice(0, 240)}`)
  }
  const data = await r.json()
  const code = data?.merchant_profile?.merchant_code
  if (!code) throw new Error('merchant_code absent du profil SumUp — renseignez SUMUP_MERCHANT_CODE')
  return String(code)
}

function getSupabaseConfig() {
  const supabaseUrl = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').trim()
  const serviceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim()
  return { supabaseUrl, serviceKey }
}

function createServiceClient(supabaseUrl, serviceKey) {
  return createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

async function handleValidatePromo(req, res, origin) {
  const { supabaseUrl, serviceKey } = getSupabaseConfig()

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
      const supabase = createServiceClient(supabaseUrl, serviceKey)
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

async function handleConfirmReturn(req, res, origin) {
  const { supabaseUrl, serviceKey } = getSupabaseConfig()
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

  const supabase = createServiceClient(supabaseUrl, serviceKey)

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

async function handleCreateCheckout(req, res, origin) {
  const apiKey = (process.env.SUMUP_API_KEY || '').trim()
  const appUrl = (process.env.APP_URL || '').split(',')[0].trim().replace(/\/$/, '')
  const { supabaseUrl, serviceKey } = getSupabaseConfig()
  const payeeEmail = (process.env.SUMUP_PAY_TO_EMAIL || '').trim().slice(0, 254)

  if (!apiKey) {
    sendJson(res, 503, { error: 'SUMUP_API_KEY non configurée sur le serveur' }, origin)
    return
  }
  if (!appUrl) {
    sendJson(res, 503, { error: 'APP_URL non configurée sur le serveur' }, origin)
    return
  }
  if (!supabaseUrl || !serviceKey) {
    sendJson(res, 503, { error: 'Supabase serveur incomplet (SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY)' }, origin)
    return
  }

  const maintenance = await fetchMaintenanceMode()
  if (maintenance.active) {
    sendJson(
      res,
      503,
      {
        error: maintenance.message || 'Paiements suspendus — site en maintenance.',
        maintenance: true,
      },
      origin,
    )
    return
  }

  let body
  try {
    body = await readJsonBody(req)
  } catch (e) {
    sendJson(res, 400, { error: e.message || 'Requête invalide' }, origin)
    return
  }

  const parsed = normalizeLineItems(body.items)
  if (!parsed) {
    sendJson(res, 400, { error: 'Panier vide ou montant invalide (0,50 € – 50 000 €)' }, origin)
    return
  }

  const { items, total: subtotal } = parsed
  const checkoutReference = randomUUID()
  const customerEmailRaw = typeof body.customerEmail === 'string' ? body.customerEmail.trim() : ''
  const customerEmail = normalizeCustomerEmail(customerEmailRaw) || null
  const promoCodeRaw = typeof body.promoCode === 'string' ? body.promoCode.trim() : ''

  let total = subtotal
  let promoCode = null
  let discountEur = 0

  const supabase = createServiceClient(supabaseUrl, serviceKey)

  if (promoCodeRaw) {
    const catalog = buildPromoCatalog(getServerPromoCatalog())
    const promo = validatePromoCode(promoCodeRaw, subtotal, { catalog, checkFirstOrder: false })
    if (!promo.valid) {
      sendJson(res, 400, { error: promo.message }, origin)
      return
    }
    const def = catalog.get(normalizePromoCode(promoCodeRaw))
    if (def?.firstOrderOnly !== false) {
      if (!customerEmail) {
        sendJson(
          res,
          400,
          {
            error:
              'Indiquez votre adresse e-mail pour utiliser ce code promo. Chaque code est limité à une utilisation par client.',
          },
          origin,
        )
        return
      }
      try {
        const usage = await isPromoBlockedForEmail(supabase, promo.code, customerEmail)
        if (usage.blocked) {
          sendJson(res, 400, { error: usage.message }, origin)
          return
        }
      } catch (e) {
        sendJson(res, 503, { error: e.message || 'Vérification du code promo impossible' }, origin)
        return
      }
    }
    total = promo.total
    promoCode = promo.code
    discountEur = promo.discount
  }

  const descriptionBase = items.map((i) => `${i.title}×${i.quantity}`).join(', ')
  let description = descriptionBase.slice(0, 120) || 'Commande site'
  if (promoCode) {
    description = `${description} (-${promoCode})`.slice(0, 120)
  }

  const orderBase = {
    checkout_reference: checkoutReference,
    status: 'pending',
    amount_eur: total,
    currency: 'EUR',
    line_items: items,
    customer_email: customerEmail,
    payee_email: payeeEmail || null,
  }
  const orderWithPromo = {
    ...orderBase,
    promo_code: promoCode,
    discount_eur: discountEur > 0 ? discountEur : null,
    subtotal_eur: promoCode ? subtotal : null,
  }

  let insertErr = (await supabase.from('orders').insert(orderWithPromo)).error
  if (insertErr && /promo_code|discount_eur|subtotal_eur/i.test(insertErr.message || '')) {
    insertErr = (await supabase.from('orders').insert(orderBase)).error
  }

  if (insertErr) {
    console.error('[create-sumup-checkout] Supabase insert', insertErr)
    sendJson(res, 500, { error: 'Enregistrement commande impossible', details: insertErr.message }, origin)
    return
  }

  let merchantCode
  try {
    merchantCode = await fetchMerchantCode(apiKey)
  } catch (e) {
    await supabase.from('orders').update({ status: 'failed' }).eq('checkout_reference', checkoutReference)
    sendJson(res, 502, { error: e.message || 'SumUp indisponible' }, origin)
    return
  }

  const redirectUrl = `${appUrl}/paiement/succes?ref=${encodeURIComponent(checkoutReference)}`

  let sumupJson
  try {
    const sumupRes = await fetch(`${SUMUP_API}/checkouts`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: total,
        currency: 'EUR',
        checkout_reference: checkoutReference,
        merchant_code: merchantCode,
        description,
        redirect_url: redirectUrl,
        hosted_checkout: { enabled: true },
      }),
    })
    sumupJson = await sumupRes.json().catch(() => ({}))
    if (!sumupRes.ok) {
      const msg = sumupJson?.message || sumupJson?.error_code || JSON.stringify(sumupJson).slice(0, 300)
      throw new Error(`SumUp checkout (${sumupRes.status}): ${msg}`)
    }
  } catch (e) {
    await supabase.from('orders').update({ status: 'failed' }).eq('checkout_reference', checkoutReference)
    sendJson(res, 502, { error: e.message || 'Échec création checkout SumUp' }, origin)
    return
  }

  const hostedUrl = sumupJson?.hosted_checkout_url
  const checkoutId = sumupJson?.id
  if (!hostedUrl || typeof hostedUrl !== 'string') {
    await supabase.from('orders').update({ status: 'failed' }).eq('checkout_reference', checkoutReference)
    sendJson(res, 502, { error: 'Réponse SumUp inattendue (hosted_checkout_url manquant)' }, origin)
    return
  }

  const { error: updateErr } = await supabase
    .from('orders')
    .update({
      sumup_checkout_id: checkoutId || null,
      updated_at: new Date().toISOString(),
    })
    .eq('checkout_reference', checkoutReference)

  if (updateErr) {
    console.error('[create-sumup-checkout] Supabase update', updateErr)
  }

  sendJson(
    res,
    200,
    {
      url: hostedUrl,
      checkoutId: checkoutId || null,
      checkoutReference,
    },
    origin,
  )
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

  const path = getRequestPath(req)
  if (path.endsWith('/validate-promo-code')) {
    return handleValidatePromo(req, res, origin)
  }
  if (path.endsWith('/confirm-checkout-return')) {
    return handleConfirmReturn(req, res, origin)
  }
  return handleCreateCheckout(req, res, origin)
}
