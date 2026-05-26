/** Règles codes promo — partagées front + API checkout. */

export const PROMO_USED_STORAGE_KEY = 'cs_promo_used_v1'

export const DEFAULT_WELCOME_PROMO = {
  code: 'Bienvenuecscreationflorale10',
  percentOff: 10,
  minSubtotal: 35,
  firstOrderOnly: true,
  label: '10 % sur votre 1ère commande',
}

function round2(n) {
  return Math.round(n * 100) / 100
}

export function normalizePromoCode(input) {
  return String(input ?? '')
    .trim()
    .toLowerCase()
}

/** @param {Array<{ code: string, percentOff?: number, minSubtotal?: number, firstOrderOnly?: boolean, label?: string }>} catalog */
export function buildPromoCatalog(catalog = []) {
  const map = new Map()
  const add = (def) => {
    const key = normalizePromoCode(def.code)
    if (!key) return
    map.set(key, {
      code: String(def.code).trim(),
      percentOff: Number(def.percentOff) > 0 ? Number(def.percentOff) : 10,
      minSubtotal: Number(def.minSubtotal) >= 0 ? Number(def.minSubtotal) : 35,
      firstOrderOnly: def.firstOrderOnly !== false,
      label: def.label || `${def.percentOff || 10} % de réduction`,
    })
  }
  add(DEFAULT_WELCOME_PROMO)
  for (const def of catalog) add(def)
  return map
}

/** @param {{ enabled?: boolean, code?: string, percentOff?: number, minSubtotal?: number, firstOrderOnly?: boolean, label?: string }} banner */
export function promosFromSiteBanner(banner) {
  if (!banner?.enabled) return []
  const code = (banner.code || '').trim()
  if (!code) return []
  return [
    {
      code,
      percentOff: banner.percentOff ?? DEFAULT_WELCOME_PROMO.percentOff,
      minSubtotal: banner.minSubtotal ?? DEFAULT_WELCOME_PROMO.minSubtotal,
      firstOrderOnly: banner.firstOrderOnly ?? true,
      label: banner.label ?? DEFAULT_WELCOME_PROMO.label,
    },
  ]
}

export function readUsedPromoCodes() {
  if (typeof localStorage === 'undefined') return new Set()
  try {
    const raw = localStorage.getItem(PROMO_USED_STORAGE_KEY)
    if (!raw) return new Set()
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return new Set()
    return new Set(parsed.map(normalizePromoCode).filter(Boolean))
  } catch {
    return new Set()
  }
}

export function markPromoCodeUsed(code) {
  const key = normalizePromoCode(code)
  if (!key || typeof localStorage === 'undefined') return
  const used = readUsedPromoCodes()
  used.add(key)
  try {
    localStorage.setItem(PROMO_USED_STORAGE_KEY, JSON.stringify([...used]))
  } catch {
    /* ignore */
  }
}

/**
 * @param {string} rawCode
 * @param {number} subtotal
 * @param {{ catalog?: Map, checkFirstOrder?: boolean }} [opts]
 */
export function validatePromoCode(rawCode, subtotal, opts = {}) {
  const catalog = opts.catalog || buildPromoCatalog()
  const key = normalizePromoCode(rawCode)
  if (!key) {
    return { valid: false, message: 'Saisissez un code promo.' }
  }

  const def = catalog.get(key)
  if (!def) {
    return { valid: false, message: 'Code promo invalide ou expiré.' }
  }

  const sub = round2(Number(subtotal) || 0)
  if (sub < def.minSubtotal) {
    return {
      valid: false,
      message: `Minimum d’achat de ${def.minSubtotal.toFixed(0).replace('.', ',')} € pour ce code.`,
    }
  }

  if (opts.checkFirstOrder !== false && def.firstOrderOnly && readUsedPromoCodes().has(key)) {
    return {
      valid: false,
      message: 'Ce code a déjà été utilisé pour une commande sur ce navigateur.',
    }
  }

  const discount = round2((sub * def.percentOff) / 100)
  let total = round2(sub - discount)
  if (total < 0.5) total = 0.5

  return {
    valid: true,
    code: def.code,
    percentOff: def.percentOff,
    minSubtotal: def.minSubtotal,
    label: def.label,
    subtotal: sub,
    discount,
    total,
  }
}
