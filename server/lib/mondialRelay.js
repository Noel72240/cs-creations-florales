import { createHash } from 'node:crypto'
import {
  mondialRelayColLivMod,
  normalizeParcelTier,
  normalizeRelayPoint,
  padMondialRelayBrand,
  parcelWeightGrams,
} from '../../shared/shipping.js'

const WS_URL = 'https://api.mondialrelay.com/Web_Services.asmx'
const SOAP_ACTION = 'http://www.mondialrelay.fr/webservice/WSI2_CreationEtiquette'

/** Ordre exact pour le hash MD5 (doc Mondial Relay WSI2). */
const WSI2_SECURITY_FIELDS = [
  'Enseigne',
  'ModeCol',
  'ModeLiv',
  'NDossier',
  'NClient',
  'Expe_Langage',
  'Expe_Ad1',
  'Expe_Ad2',
  'Expe_Ad3',
  'Expe_Ad4',
  'Expe_Ville',
  'Expe_CP',
  'Expe_Pays',
  'Expe_Tel1',
  'Expe_Tel2',
  'Expe_Mail',
  'Dest_Langage',
  'Dest_Ad1',
  'Dest_Ad2',
  'Dest_Ad3',
  'Dest_Ad4',
  'Dest_Ville',
  'Dest_CP',
  'Dest_Pays',
  'Dest_Tel1',
  'Dest_Tel2',
  'Dest_Mail',
  'Poids',
  'Longueur',
  'Taille',
  'NbColis',
  'CRT_Valeur',
  'CRT_Devise',
  'Exp_Valeur',
  'Exp_Devise',
  'COL_Rel_Pays',
  'COL_Rel',
  'LIV_Rel_Pays',
  'LIV_Rel',
  'TAvisage',
  'TReprise',
  'Montage',
  'TRDV',
  'Assurance',
  'Instructions',
]

const DEFAULT_SENDER = {
  name: 'MME CHARLENE',
  address2: 'C&S CREATIONS FLORALES',
  address3: '54 RUE DU MANEGE',
  address4: '',
  city: 'ECOMMOY',
  postcode: '72220',
  country: 'FR',
  phone: '0762615423',
  email: 'contact@cscreationsflorales.com',
}

export function getMondialRelayConfig() {
  const brandCode = padMondialRelayBrand(
    process.env.MONDIAL_RELAY_BRAND_CODE || process.env.VITE_MONDIAL_RELAY_BRAND_CODE || '',
  )
  const privateKey = (
    process.env.MONDIAL_RELAY_PRIVATE_KEY ||
    process.env.MONDIAL_RELAY_API_SECRET ||
    ''
  ).trim()
  const codeMarque = String(process.env.MONDIAL_RELAY_CODE_MARQUE || '41').trim()
  const modeCol = String(process.env.MONDIAL_RELAY_MODE_COL || 'CCC').trim().toUpperCase()

  return {
    privateKey,
    codeMarque,
    brandCode,
    modeCol,
    labelFormat: String(process.env.MONDIAL_RELAY_LABEL_FORMAT || '10x15').trim(),
    sandbox: process.env.MONDIAL_RELAY_SANDBOX === 'true',
    defaultWeightGrams: Math.min(
      30000,
      Math.max(100, parseInt(process.env.MONDIAL_RELAY_DEFAULT_WEIGHT_GRAMS, 10) || 1000),
    ),
    wsUrl: WS_URL,
    sender: {
      name: normalizeMrText(process.env.MONDIAL_RELAY_SENDER_NAME || DEFAULT_SENDER.name, 32),
      address2: normalizeMrText(process.env.MONDIAL_RELAY_SENDER_ADDRESS2 || DEFAULT_SENDER.address2, 32),
      address3: normalizeMrText(process.env.MONDIAL_RELAY_SENDER_ADDRESS3 || DEFAULT_SENDER.address3, 32),
      address4: normalizeMrText(process.env.MONDIAL_RELAY_SENDER_ADDRESS4 || DEFAULT_SENDER.address4, 32),
      city: normalizeMrText(process.env.MONDIAL_RELAY_SENDER_CITY || DEFAULT_SENDER.city, 26),
      postcode: String(process.env.MONDIAL_RELAY_SENDER_POSTCODE || DEFAULT_SENDER.postcode)
        .replace(/\D/g, '')
        .slice(0, 5),
      country: String(process.env.MONDIAL_RELAY_SENDER_COUNTRY || DEFAULT_SENDER.country)
        .trim()
        .slice(0, 2)
        .toUpperCase(),
      phone: normalizeMrPhone(process.env.MONDIAL_RELAY_SENDER_PHONE || DEFAULT_SENDER.phone),
      email: String(process.env.MONDIAL_RELAY_SENDER_EMAIL || DEFAULT_SENDER.email)
        .trim()
        .slice(0, 70),
    },
  }
}

export function isMondialRelayWidgetConfigured() {
  return Boolean(getMondialRelayConfig().brandCode.trim())
}

export function isMondialRelayApiConfigured() {
  const { privateKey, brandCode } = getMondialRelayConfig()
  return Boolean(privateKey && brandCode.trim())
}

export function normalizeMrText(value, maxLen = 32) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/[^0-9A-Z_\-'., /]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLen)
}

export function normalizeMrPhone(value) {
  let digits = String(value ?? '').replace(/\D/g, '')
  if (digits.startsWith('33') && digits.length >= 11) digits = `0${digits.slice(2)}`
  if (digits.length === 9 && /^[67]/.test(digits)) digits = `0${digits}`
  return digits.slice(-10)
}

function normalizeRelayId(value) {
  const digits = String(value ?? '').replace(/\D/g, '')
  if (!digits) return ''
  return digits.padStart(6, '0').slice(-6)
}

function parseRelayPoint(order) {
  const raw = order?.relay_point
  if (!raw) return null
  if (typeof raw === 'string') {
    try {
      return normalizeRelayPoint(JSON.parse(raw))
    } catch {
      return null
    }
  }
  return normalizeRelayPoint(raw)
}

function md5Security(params, privateKey) {
  const concat = WSI2_SECURITY_FIELDS.map((key) => String(params[key] ?? '')).join('') + privateKey
  return createHash('md5').update(concat, 'utf8').digest('hex').toUpperCase()
}

function escapeXml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function parseXmlTag(xml, tag) {
  const m = String(xml || '').match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'i'))
  return m ? m[1].trim() : ''
}

export function resolveMondialRelayLabelUrl(rawPath, labelFormat = '10x15') {
  const path = String(rawPath || '').trim()
  if (!path) return ''
  if (/^https?:\/\//i.test(path)) {
    return path.replace(/format=A4/i, `format=${labelFormat}`)
  }
  const withSlash = path.startsWith('/') ? path : `/${path}`
  let url = `https://www.mondialrelay.com${withSlash}`
  if (!/format=/i.test(url)) {
    url += url.includes('?') ? '&' : '?'
    url += `format=${encodeURIComponent(labelFormat)}`
  } else {
    url = url.replace(/format=[^&]+/i, `format=${labelFormat}`)
  }
  return url
}

function buildShipmentParams(order, cfg) {
  const relay = parseRelayPoint(order)
  const relayId = normalizeRelayId(relay?.id)
  if (!relayId) return null

  const tier = normalizeParcelTier(order.parcel_tier)
  const weight = String(parcelWeightGrams(tier) || cfg.defaultWeightGrams)
  const modeLiv = mondialRelayColLivMod(tier)
  const customerName = normalizeMrText(order.customer_name || 'CLIENT', 32)
  const customerPhone = normalizeMrPhone(order.customer_phone)
  const customerEmail = String(order.customer_email || cfg.sender.email).trim().slice(0, 70)
  const ref = String(order.checkout_reference || '').trim()

  const sender = cfg.sender
  const relayStreet = normalizeMrText(relay.addressLine1 || relay.name || 'POINT RELAIS', 32)
  const relayCity = normalizeMrText(relay.city || '', 26)
  const relayPostcode = String(relay.postcode || '')
    .replace(/\D/g, '')
    .slice(0, 5)

  return {
    Enseigne: cfg.brandCode,
    ModeCol: cfg.modeCol,
    ModeLiv: modeLiv,
    NDossier: normalizeMrText(ref.replace(/[^0-9A-Z_ -]/gi, ''), 15),
    NClient: normalizeMrText(ref.replace(/[^0-9A-Z]/gi, ''), 9),
    Expe_Langage: 'FR',
    Expe_Ad1: sender.name,
    Expe_Ad2: sender.address2,
    Expe_Ad3: sender.address3,
    Expe_Ad4: sender.address4,
    Expe_Ville: sender.city,
    Expe_CP: sender.postcode,
    Expe_Pays: sender.country,
    Expe_Tel1: '',
    Expe_Tel2: sender.phone,
    Expe_Mail: sender.email,
    Dest_Langage: 'FR',
    Dest_Ad1: customerName,
    Dest_Ad2: '',
    Dest_Ad3: relayStreet,
    Dest_Ad4: normalizeMrText(relay.name || '', 32),
    Dest_Ville: relayCity,
    Dest_CP: relayPostcode,
    Dest_Pays: String(relay.country || 'FR')
      .trim()
      .slice(0, 2)
      .toUpperCase(),
    Dest_Tel1: '',
    Dest_Tel2: customerPhone,
    Dest_Mail: customerEmail,
    Poids: weight,
    Longueur: '',
    Taille: '',
    NbColis: '1',
    CRT_Valeur: '0',
    CRT_Devise: '',
    Exp_Valeur: '0',
    Exp_Devise: '',
    COL_Rel_Pays: '',
    COL_Rel: '',
    LIV_Rel_Pays: 'FR',
    LIV_Rel: relayId,
    TAvisage: '',
    TReprise: '',
    Montage: '0',
    TRDV: '',
    Assurance: '0',
    Instructions: normalizeMrText(`CMD ${ref}`.slice(0, 31), 31),
  }
}

function buildSoapBody(params) {
  const fields = Object.entries(params)
    .map(([key, value]) => `      <${key}>${escapeXml(value)}</${key}>`)
    .join('\n')
  return `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <WSI2_CreationEtiquette xmlns="http://www.mondialrelay.fr/webservice/">
${fields}
    </WSI2_CreationEtiquette>
  </soap:Body>
</soap:Envelope>`
}

/**
 * Crée une expédition Mondial Relay + URL PDF étiquette (WSI2).
 * @param {Record<string, unknown>} order Ligne `orders` Supabase
 */
export async function createMondialRelayShipment(order) {
  if (order?.shipping_method !== 'mondial_relay') {
    return { ok: false, reason: 'not_mondial_relay' }
  }

  const relay = parseRelayPoint(order)
  if (!relay?.id) {
    return { ok: false, reason: 'missing_relay_point' }
  }

  if (!isMondialRelayApiConfigured()) {
    console.warn('[mondial-relay] Identifiants non configurés — étiquette non générée')
    return { ok: false, reason: 'not_configured' }
  }

  const cfg = getMondialRelayConfig()
  const params = buildShipmentParams(order, cfg)
  if (!params) {
    return { ok: false, reason: 'invalid_params' }
  }

  params.Security = md5Security(params, cfg.privateKey)
  const body = buildSoapBody(params)

  try {
    const res = await fetch(cfg.wsUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/xml; charset=utf-8',
        SOAPAction: SOAP_ACTION,
      },
      body,
    })
    const xml = await res.text()
    const stat = parseXmlTag(xml, 'STAT')
    if (stat !== '0') {
      const errMsg =
        parseXmlTag(xml, 'Libelle01') ||
        parseXmlTag(xml, 'Libelle02') ||
        parseXmlTag(xml, 'STAT') ||
        'Erreur Mondial Relay'
      console.warn('[mondial-relay] WSI2_CreationEtiquette', stat, errMsg)
      return { ok: false, reason: 'api_error', stat, message: errMsg }
    }

    const expeditionId = parseXmlTag(xml, 'ExpeditionNum')
    const labelPath = parseXmlTag(xml, 'URL_Etiquette')
    const labelUrl = resolveMondialRelayLabelUrl(labelPath, cfg.labelFormat)

    return {
      ok: true,
      expeditionId: expeditionId || null,
      labelUrl: labelUrl || null,
      labelPath: labelPath || null,
    }
  } catch (err) {
    console.error('[mondial-relay] fetch', err)
    return { ok: false, reason: 'network_error', message: err?.message || String(err) }
  }
}

/**
 * Génère l’étiquette si besoin et met à jour la commande Supabase.
 * @returns {Promise<{ order: object, labelResult: object|null }>}
 */
export async function ensureMondialRelayLabelForOrder(supabase, order) {
  if (!order || order.shipping_method !== 'mondial_relay') {
    return { order, labelResult: null }
  }
  if (order.mondial_relay_label_url) {
    return { order, labelResult: { ok: true, skipped: true, labelUrl: order.mondial_relay_label_url } }
  }

  const labelResult = await createMondialRelayShipment(order)
  if (!labelResult.ok || !labelResult.labelUrl) {
    return { order, labelResult }
  }

  const patch = {
    mondial_relay_expedition_id: labelResult.expeditionId || null,
    mondial_relay_label_url: labelResult.labelUrl,
    updated_at: new Date().toISOString(),
  }
  const { data: updated, error } = await supabase
    .from('orders')
    .update(patch)
    .eq('id', order.id)
    .select('*')
    .maybeSingle()

  if (error) {
    console.error('[mondial-relay] supabase update', error)
    return { order: { ...order, ...patch }, labelResult }
  }

  return { order: updated || { ...order, ...patch }, labelResult }
}
