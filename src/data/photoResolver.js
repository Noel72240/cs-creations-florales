import { photoW600 } from './homePhotos'

/** Fond image optionnel : ex. `/site-bg.png` dans `public/` si vous en ajoutez un depuis l’admin */
export const DEFAULT_SITE_BACKGROUND = ''

/**
 * Résout une source image depuis l'admin.
 * - si `srcOrKey` commence par data: → image intégrée (ex. choisie depuis l’ordinateur)
 * - si `srcOrKey` commence par http(s):// → URL externe
 * - si `srcOrKey` commence par / → fichier dans public/
 * - sinon → clé Unsplash (P[key]) via `photoW600`
 */
export function resolvePhotoSrc(srcOrKey) {
  const v = (srcOrKey || '').trim()
  if (!v) return photoW600('weddingBouquet')
  if (v.startsWith('data:')) return v
  if (v.startsWith('http://') || v.startsWith('https://')) return v
  if (v.startsWith('/')) return v
  return photoW600(v)
}

/**
 * Fond d’accueil (admin). Vide = dégradé CSS sans image.
 */
export function resolveBackgroundSrc(src, photoKey) {
  const v = (src || '').trim()
  if (v) {
    if (v.startsWith('data:')) return v
    if (v.startsWith('http://') || v.startsWith('https://')) return v
    if (v.startsWith('/')) return v
    return photoW600(v)
  }
  const k = (photoKey || '').trim()
  if (k) return photoW600(k)
  return DEFAULT_SITE_BACKGROUND
}

