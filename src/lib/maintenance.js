const DEFAULT_TITLE = 'Site en maintenance'
const DEFAULT_MESSAGE =
  'Notre site est momentanément en maintenance. Les paiements en ligne sont suspendus — vous pouvez nous contacter pour toute demande.'

/** @param {object} [content] Contenu fusionné du site */
export function getMaintenanceState(content) {
  const m = content?.maintenance
  const enabled = Boolean(m?.enabled)
  return {
    active: enabled,
    title: (m?.title || DEFAULT_TITLE).trim() || DEFAULT_TITLE,
    message: (m?.message || DEFAULT_MESSAGE).trim() || DEFAULT_MESSAGE,
  }
}

export const MAINTENANCE_PAYMENT_BLOCKED_MSG =
  'Les paiements en ligne sont suspendus pendant la maintenance du site. Merci de nous contacter ou de réessayer plus tard.'
