/**
 * Appel de la route serveur `/api/create-sumup-checkout` (clé SumUp jamais ici).
 * En local : `vercel dev` (recommandé) ou URL complète via VITE_SUMUP_CHECKOUT_API_URL.
 */
export function getSumupCheckoutApiUrl() {
  const raw = (import.meta.env.VITE_SUMUP_CHECKOUT_API_URL || '').trim().replace(/\/$/, '')
  if (!raw) return '/api/create-sumup-checkout'
  if (raw.endsWith('/api/create-sumup-checkout')) return raw
  return `${raw}/api/create-sumup-checkout`
}

/**
 * @param {{ items: Array<{ id: string, title: string, price: number, quantity: number, selectedColor?: string, path?: string, imageUrl?: string }>, customerEmail?: string, promoCode?: string }} payload
 * @returns {Promise<{ url: string, checkoutId?: string, checkoutReference: string }>}
 */
export async function createSumupCheckout(payload) {
  const url = getSumupCheckoutApiUrl()
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const msg = typeof data.error === 'string' ? data.error : `Erreur ${res.status}`
    throw new Error(msg)
  }
  if (!data.url || typeof data.url !== 'string') {
    throw new Error('Réponse serveur invalide')
  }
  return {
    url: data.url,
    checkoutId: data.checkoutId,
    checkoutReference: data.checkoutReference,
  }
}
