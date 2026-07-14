/** Livraison : afficher les prix par défaut. Mettre VITE_FORCE_ZERO_PRICES=true pour masquer temporairement. */
const FORCE_ZERO = (import.meta.env.VITE_FORCE_ZERO_PRICES ?? 'false').trim().toLowerCase() === 'true'

/** @param {unknown} raw Prix brut (nombre ou chaîne, virgule ou point) */
export function normalizeArticlePrice(raw) {
  const n = Number(String(raw ?? '').trim().replace(',', '.'))
  if (!Number.isFinite(n)) return 0
  return Math.max(0, Math.round(n * 100) / 100)
}

/** @param {unknown} raw Prix brut (nombre ou chaîne) */
export function resolveArticlePrice(raw) {
  if (FORCE_ZERO) return 0
  return normalizeArticlePrice(raw)
}
