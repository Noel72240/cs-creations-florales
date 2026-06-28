import { normalizePromoCode } from '../../shared/promoCodes.js'

const RELEASED_STATUSES = new Set(['failed', 'cancelled', 'expired'])

export function normalizeCustomerEmail(email) {
  const s = String(email ?? '').trim().toLowerCase()
  if (!s || s.length > 254) return ''
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)) return ''
  return s
}

/**
 * Vérifie si un code promo « 1ère commande » a déjà été utilisé avec cet e-mail.
 * @returns {Promise<{ blocked: boolean, message?: string }>}
 */
export async function isPromoBlockedForEmail(supabase, promoCode, customerEmail) {
  const email = normalizeCustomerEmail(customerEmail)
  const key = normalizePromoCode(promoCode)
  if (!email || !key) {
    return {
      blocked: true,
      message: 'Indiquez une adresse e-mail valide pour utiliser ce code promo (une utilisation par client).',
    }
  }

  const { data, error } = await supabase
    .from('orders')
    .select('id, status, promo_code')
    .ilike('customer_email', email)
    .not('promo_code', 'is', null)
    .limit(30)

  if (error) {
    console.error('[promoRedemption] query', error)
    throw new Error('Vérification du code promo impossible')
  }

  const used = (data || []).some(
    (row) => normalizePromoCode(row.promo_code) === key && !RELEASED_STATUSES.has(row.status),
  )

  if (used) {
    return {
      blocked: true,
      message: 'Ce code promo a déjà été utilisé avec cette adresse e-mail.',
    }
  }

  return { blocked: false }
}
