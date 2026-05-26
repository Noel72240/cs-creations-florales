const DEFAULT_TITLE = 'Site en maintenance'
const DEFAULT_MESSAGE =
  'Notre site est momentanément en maintenance. Les paiements en ligne sont suspendus — vous pouvez nous contacter pour toute demande.'

function isMaintenanceEnabled(m) {
  if (!m || typeof m !== 'object') return false
  const v = m.enabled ?? m.active
  if (v === true || v === 1) return true
  if (typeof v === 'string') {
    const s = v.trim().toLowerCase()
    return s === 'true' || s === '1' || s === 'on' || s === 'yes'
  }
  return false
}

/** @param {object} [content] Contenu fusionné du site */
export function getMaintenanceState(content) {
  const m = content?.maintenance
  const enabled = isMaintenanceEnabled(m)
  return {
    active: enabled,
    title: (m?.title || DEFAULT_TITLE).trim() || DEFAULT_TITLE,
    message: (m?.message || DEFAULT_MESSAGE).trim() || DEFAULT_MESSAGE,
  }
}

export const MAINTENANCE_PAYMENT_BLOCKED_MSG =
  'Les paiements en ligne sont suspendus pendant la maintenance du site. Merci de nous contacter ou de réessayer plus tard.'
