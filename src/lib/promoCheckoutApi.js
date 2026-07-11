const CHECKOUT_EMAIL_KEY = 'cs_checkout_email_v1'
const CHECKOUT_NAME_KEY = 'cs_checkout_name_v1'

export function getCheckoutEmailStorageKey() {
  return CHECKOUT_EMAIL_KEY
}

export function loadCheckoutEmail() {
  try {
    return sessionStorage.getItem(CHECKOUT_EMAIL_KEY) || ''
  } catch {
    return ''
  }
}

export function saveCheckoutEmail(email) {
  try {
    const v = String(email || '').trim()
    if (v) sessionStorage.setItem(CHECKOUT_EMAIL_KEY, v)
    else sessionStorage.removeItem(CHECKOUT_EMAIL_KEY)
  } catch {
    /* ignore */
  }
}

export function loadCheckoutCustomerName() {
  try {
    return sessionStorage.getItem(CHECKOUT_NAME_KEY) || ''
  } catch {
    return ''
  }
}

export function saveCheckoutCustomerName(name) {
  try {
    const v = String(name || '').trim()
    if (v) sessionStorage.setItem(CHECKOUT_NAME_KEY, v)
    else sessionStorage.removeItem(CHECKOUT_NAME_KEY)
  } catch {
    /* ignore */
  }
}

function getValidatePromoApiUrl() {
  const raw = (import.meta.env.VITE_SUMUP_CHECKOUT_API_URL || '').trim().replace(/\/$/, '')
  if (!raw) return '/api/validate-promo-code'
  if (raw.endsWith('/api/validate-promo-code')) return raw
  return `${raw}/api/validate-promo-code`
}

function getConfirmCheckoutApiUrl() {
  const raw = (import.meta.env.VITE_SUMUP_CHECKOUT_API_URL || '').trim().replace(/\/$/, '')
  if (!raw) return '/api/confirm-checkout-return'
  if (raw.endsWith('/api/confirm-checkout-return')) return raw
  return `${raw}/api/confirm-checkout-return`
}

/**
 * Vérifie le code promo côté serveur (usage unique par e-mail).
 */
export async function validatePromoOnServer({ promoCode, subtotal, customerEmail }) {
  const res = await fetch(getValidatePromoApiUrl(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ promoCode, subtotal, customerEmail }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(typeof data.error === 'string' ? data.error : `Erreur ${res.status}`)
  }
  return data
}

/** Confirme le retour SumUp (commande → payée, code promo consommé). */
export async function confirmCheckoutReturn(checkoutReference) {
  if (!checkoutReference) return null
  const res = await fetch(getConfirmCheckoutApiUrl(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ checkoutReference }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) return null
  return data
}
