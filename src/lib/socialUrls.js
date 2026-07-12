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

/** Profils officiels C&S Créations Florales. */
export const DEFAULT_SOCIAL_URLS = {
  facebook: 'https://www.facebook.com/profile.php?id=61587027218191',
  instagram: 'https://www.instagram.com/cs_creations_florales/',
  tiktok: 'https://www.tiktok.com/@cs_creations_florales',
}

const PLACEHOLDER_PATTERNS = {
  facebook: /^https?:\/\/(www\.)?facebook\.com\/?$/i,
  instagram: /^https?:\/\/(www\.)?instagram\.com\/?$/i,
  tiktok: /^https?:\/\/(www\.)?tiktok\.com\/?$/i,
}

function pickSocialUrl(stored, platform) {
  const trimmed = String(stored || '').trim()
  if (!trimmed || PLACEHOLDER_PATTERNS[platform]?.test(trimmed)) {
    return DEFAULT_SOCIAL_URLS[platform]
  }
  return normalizeSocialUrl(trimmed, platform) || DEFAULT_SOCIAL_URLS[platform]
}

export function resolveSocialUrls(footer = {}) {
  return {
    facebookUrl: pickSocialUrl(footer.facebookUrl, 'facebook'),
    instagramUrl: pickSocialUrl(footer.instagramUrl, 'instagram'),
    tiktokUrl: pickSocialUrl(footer.tiktokUrl, 'tiktok'),
  }
}
