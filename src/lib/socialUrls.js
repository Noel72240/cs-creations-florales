/** Normalise une URL réseau social (accepte @handle ou URL complète). */
export function normalizeSocialUrl(raw, platform) {
  const s = String(raw || '').trim()
  if (!s) return ''
  if (/^https?:\/\//i.test(s)) return s
  const handle = s.replace(/^@/, '').replace(/\s+/g, '')
  if (!handle) return ''
  if (platform === 'facebook') {
    if (handle.includes('facebook.com')) return `https://${handle.replace(/^https?:\/\//, '')}`
    return `https://www.facebook.com/${handle}`
  }
  if (platform === 'instagram') {
    return `https://www.instagram.com/${handle.replace(/^@/, '')}/`
  }
  if (platform === 'tiktok') {
    const user = handle.replace(/^@/, '')
    return `https://www.tiktok.com/@${user}`
  }
  return s
}

/** URLs par défaut — profils C&S Créations Florales (Facebook à renseigner dans l’admin). */
export const DEFAULT_SOCIAL_URLS = {
  facebook: '',
  instagram: 'https://www.instagram.com/cs_creations_florales/',
  tiktok: 'https://www.tiktok.com/@cs_creations_florales',
}

export function resolveSocialUrls(footer = {}) {
  const fb = normalizeSocialUrl(footer.facebookUrl || DEFAULT_SOCIAL_URLS.facebook, 'facebook')
  const ig = normalizeSocialUrl(footer.instagramUrl || DEFAULT_SOCIAL_URLS.instagram, 'instagram')
  const tt = normalizeSocialUrl(footer.tiktokUrl || DEFAULT_SOCIAL_URLS.tiktok, 'tiktok')
  return { facebookUrl: fb, instagramUrl: ig, tiktokUrl: tt }
}
