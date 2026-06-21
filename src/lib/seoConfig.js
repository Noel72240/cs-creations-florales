import { SITE } from '../config/site'

import { SITE_ORIGIN } from '../config/siteUrl'

const DEFAULT_ORIGIN = SITE_ORIGIN

export function getSiteOrigin() {
  const fromEnv = (import.meta.env.VITE_SITE_URL || '').trim().replace(/\/$/, '')
  if (fromEnv) return fromEnv
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin.replace(/\/$/, '')
  }
  return DEFAULT_ORIGIN
}

export function absoluteUrl(path = '/') {
  const p = path.startsWith('/') ? path : `/${path}`
  return `${getSiteOrigin()}${p}`
}

export const DEFAULT_OG_IMAGE = '/logo-cs-rond-complet.png'

export const BUSINESS_SEO = {
  name: SITE.businessName,
  city: SITE.city,
  postalCode: SITE.postalCode,
  region: SITE.region,
  email: SITE.email,
  phone: SITE.phoneDisplay,
}
