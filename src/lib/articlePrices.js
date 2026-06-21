/** Livraison : 0 € par défaut. Mettre VITE_FORCE_ZERO_PRICES=false sur Vercel quand les vrais prix sont prêts. */
const FORCE_ZERO = (import.meta.env.VITE_FORCE_ZERO_PRICES ?? 'true').trim().toLowerCase() !== 'false'

/** @param {unknown} raw Prix brut (nombre ou chaîne) */
export function resolveArticlePrice(raw) {
  if (FORCE_ZERO) return 0
  if (typeof raw === 'number' && Number.isFinite(raw)) return Math.max(0, raw)
  const n = Number(raw)
  return Number.isFinite(n) ? Math.max(0, n) : 0
}
