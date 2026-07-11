/** Modes de livraison — partagé client / serveur. */

export const SHIPPING_METHOD_PICKUP = 'pickup'
export const SHIPPING_METHOD_MONDIAL_RELAY = 'mondial_relay'

export const PARCEL_TIER_PETIT = 'petit'
export const PARCEL_TIER_MOYEN = 'moyen'
export const PARCEL_TIER_GRAND = 'grand'

/** Tarifs livraison Point Relais (€) — modifiables via env serveur plus tard. */
export const DEFAULT_RELAY_SHIPPING_FEES = {
  [PARCEL_TIER_PETIT]: 5.9,
  [PARCEL_TIER_MOYEN]: 8.9,
  [PARCEL_TIER_GRAND]: 12.9,
}

const PARCEL_TIER_RANK = {
  [PARCEL_TIER_PETIT]: 1,
  [PARCEL_TIER_MOYEN]: 2,
  [PARCEL_TIER_GRAND]: 3,
}

export const PARCEL_TIER_OPTIONS = [
  { id: PARCEL_TIER_PETIT, label: 'Petit colis', hint: 'Verre, petit cœur, chiffre…' },
  { id: PARCEL_TIER_MOYEN, label: 'Moyen colis', hint: 'Ourson moyen, composition…' },
  { id: PARCEL_TIER_GRAND, label: 'Grand colis', hint: 'Grand sac, grosse création…' },
]

export function parcelTierLabel(tier) {
  return PARCEL_TIER_OPTIONS.find((o) => o.id === normalizeParcelTier(tier))?.label || 'Petit colis'
}

export function normalizeParcelTier(tier) {
  const t = String(tier || '')
    .trim()
    .toLowerCase()
  if (t === PARCEL_TIER_MOYEN || t === PARCEL_TIER_GRAND) return t
  return PARCEL_TIER_PETIT
}

/** Taille colis = la plus grande parmi les articles (définie par Charlène dans l’admin). */
export function resolveCartParcelTier(items) {
  let best = PARCEL_TIER_PETIT
  for (const item of items || []) {
    const tier = normalizeParcelTier(item?.parcelTier)
    if ((PARCEL_TIER_RANK[tier] || 1) > (PARCEL_TIER_RANK[best] || 1)) best = tier
  }
  return best
}

export function getRelayShippingFee(parcelTier, fees = DEFAULT_RELAY_SHIPPING_FEES) {
  const tier = normalizeParcelTier(parcelTier)
  const amount = fees[tier]
  return Number.isFinite(amount) && amount >= 0 ? Math.round(amount * 100) / 100 : 0
}

export function computeShippingFee(shippingMethod, items) {
  if (shippingMethod !== SHIPPING_METHOD_MONDIAL_RELAY) return 0
  return getRelayShippingFee(resolveCartParcelTier(items))
}

export function mondialRelayColLivMod(parcelTier) {
  const tier = normalizeParcelTier(parcelTier)
  if (tier === PARCEL_TIER_GRAND) return '24L'
  if (tier === PARCEL_TIER_MOYEN) return '24L'
  return '24R'
}

export function parcelWeightGrams(parcelTier) {
  const tier = normalizeParcelTier(parcelTier)
  if (tier === PARCEL_TIER_GRAND) return 3000
  if (tier === PARCEL_TIER_MOYEN) return 1500
  return 500
}

export const SHIPPING_METHOD_OPTIONS = [
  {
    id: SHIPPING_METHOD_PICKUP,
    label: 'Récupération main à main',
    description: 'Remise en main propre à l’atelier — Écommoy (72220), sur rendez-vous après confirmation.',
    feeLabel: 'Gratuit',
  },
  {
    id: SHIPPING_METHOD_MONDIAL_RELAY,
    label: 'Livraison en Point Relais',
    description: 'Mondial Relay : choisissez un relais près de chez vous. L’atelier prépare l’envoi.',
    feeLabel: null,
  },
]

export function shippingMethodLabel(method) {
  return SHIPPING_METHOD_OPTIONS.find((o) => o.id === method)?.label || method || '—'
}

/** Code enseigne Mondial Relay sur 8 caractères (espaces à droite). */
export function padMondialRelayBrand(code) {
  const c = String(code || '')
    .trim()
    .toUpperCase()
  if (!c) return ''
  return c.padEnd(8, ' ').slice(0, 8)
}

export function normalizeRelayPoint(raw) {
  if (!raw || typeof raw !== 'object') return null
  const id = String(raw.id ?? raw.ID ?? '').trim()
  if (!id) return null
  return {
    id: id.slice(0, 24),
    name: String(raw.name ?? raw.Nom ?? '').trim().slice(0, 120),
    addressLine1: String(raw.addressLine1 ?? raw.Adresse1 ?? '').trim().slice(0, 120),
    addressLine2: String(raw.addressLine2 ?? raw.Adresse2 ?? '').trim().slice(0, 120),
    postcode: String(raw.postcode ?? raw.CP ?? '').trim().slice(0, 12),
    city: String(raw.city ?? raw.Ville ?? '').trim().slice(0, 80),
    country: String(raw.country ?? raw.Pays ?? 'FR')
      .trim()
      .slice(0, 2)
      .toUpperCase(),
  }
}

export function formatRelayPointSummary(relay) {
  const r = normalizeRelayPoint(relay)
  if (!r) return ''
  const line2 = r.addressLine2 ? ` ${r.addressLine2}` : ''
  return `${r.name} — ${r.addressLine1}${line2}, ${r.postcode} ${r.city}`
}

export function normalizeCustomerPhone(phone) {
  const digits = String(phone ?? '').replace(/\D/g, '')
  if (digits.length < 10 || digits.length > 15) return null
  if (digits.startsWith('33') && digits.length >= 11) {
    return `+${digits}`
  }
  if (digits.startsWith('0')) {
    return `+33${digits.slice(1)}`
  }
  return `+${digits}`
}

export function formatCustomerPhoneDisplay(phone) {
  const n = normalizeCustomerPhone(phone)
  if (!n) return String(phone ?? '').trim()
  if (n.startsWith('+33') && n.length === 12) {
    const d = n.slice(3)
    return `0${d.slice(0, 1)} ${d.slice(1, 3)} ${d.slice(3, 5)} ${d.slice(5, 7)} ${d.slice(7, 9)}`
  }
  return n
}

/**
 * @param {{ shippingMethod?: string, customerPhone?: string, relayPoint?: object|null }} input
 */
export function validateShippingCheckout(input) {
  const errors = {}
  const shippingMethod = String(input?.shippingMethod || '').trim()
  const phone = normalizeCustomerPhone(input?.customerPhone)
  const relayPoint = normalizeRelayPoint(input?.relayPoint)

  if (!SHIPPING_METHOD_OPTIONS.some((o) => o.id === shippingMethod)) {
    errors.shippingMethod = 'Choisissez la livraison en Point Relais ou la récupération main à main.'
  }
  if (!phone) {
    errors.customerPhone = 'Indiquez un numéro de mobile valide (10 chiffres minimum).'
  }
  if (shippingMethod === SHIPPING_METHOD_MONDIAL_RELAY && !relayPoint) {
    errors.relayPoint = 'Sélectionnez un Point Relais Mondial Relay sur la carte.'
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    shippingMethod: shippingMethod || null,
    customerPhone: phone,
    relayPoint: shippingMethod === SHIPPING_METHOD_MONDIAL_RELAY ? relayPoint : null,
  }
}

export function buildShippingOrderFields(validated, items = []) {
  if (!validated?.shippingMethod) return {}
  const parcelTier = resolveCartParcelTier(items)
  const shippingFeeEur =
    validated.shippingMethod === SHIPPING_METHOD_MONDIAL_RELAY
      ? computeShippingFee(validated.shippingMethod, items)
      : 0
  return {
    shipping_method: validated.shippingMethod,
    customer_phone: validated.customerPhone || null,
    relay_point: validated.relayPoint || null,
    parcel_tier: parcelTier,
    parcel_weight_grams: parcelWeightGrams(parcelTier),
    shipping_fee_eur: shippingFeeEur > 0 ? shippingFeeEur : null,
  }
}

export function formatShippingSummary(order) {
  const method = order?.shipping_method
  if (!method) return null
  const lines = [`Mode : ${shippingMethodLabel(method)}`]
  if (order?.customer_phone) {
    lines.push(`Téléphone : ${formatCustomerPhoneDisplay(order.customer_phone)}`)
  }
  if (method === SHIPPING_METHOD_MONDIAL_RELAY && order?.relay_point) {
    const relay =
      typeof order.relay_point === 'string'
        ? normalizeRelayPoint(JSON.parse(order.relay_point))
        : normalizeRelayPoint(order.relay_point)
    if (relay) {
      lines.push(`Point Relais n°${relay.id}`)
      lines.push(formatRelayPointSummary(relay))
    }
  }
  if (order?.parcel_tier) {
    lines.push(`Format colis (atelier) : ${parcelTierLabel(order.parcel_tier)}`)
  }
  if (order?.shipping_fee_eur != null && Number(order.shipping_fee_eur) > 0) {
    lines.push(`Frais de livraison : ${Number(order.shipping_fee_eur).toFixed(2).replace('.', ',')} €`)
  }
  return lines.join('\n')
}
