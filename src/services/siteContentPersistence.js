/**
 * Persistance du contenu éditable (admin) — navigateur + fichier statique déployé.
 * Pour Supabase : voir `siteContentSupabase.js` et brancher `VITE_CONTENT_DRIVER=supabase` dans le contexte.
 */
import { SITE_CONTENT_DEFAULTS, SITE_CONTENT_VERSION } from '../data/siteContent.defaults'

export const STORAGE_KEY = 'cs_site_content_v1'

/** Met à jour les données stockées (migrations légères entre versions). */
export function migrateStoredOverrides(stored) {
  if (!stored || typeof stored !== 'object') return { stored, changed: false }
  const v = stored.version ?? 1
  if (v >= SITE_CONTENT_VERSION) return { stored, changed: false }

  const hero = stored.home?.hero
  if (!hero) {
    return { stored: { ...stored, version: SITE_CONTENT_VERSION }, changed: true }
  }

  let titleLine1 = hero.titleLine1
  let titleLine2 = hero.titleLine2
  let touched = false

  if (titleLine1 === 'C.S Créations Florales') {
    titleLine1 = 'C&S Créations Florales'
    touched = true
  }
  if (titleLine2 === '& Personnalisation') {
    titleLine2 = SITE_CONTENT_DEFAULTS.home.hero.titleLine2
    touched = true
  }

  const next = {
    ...stored,
    version: SITE_CONTENT_VERSION,
    home: {
      ...stored.home,
      hero: {
        ...hero,
        ...(touched ? { titleLine1, titleLine2 } : {}),
      },
    },
  }
  return { stored: next, changed: true }
}

/** Lit et migre les surcharges enregistrées dans localStorage. */
export function readLocalSiteOverrides() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    const { stored, changed } = migrateStoredOverrides(parsed)
    if (changed) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stored))
      } catch {
        /* ignore */
      }
    }
    return stored
  } catch {
    return null
  }
}

export function writeLocalSiteOverrides(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    return true
  } catch {
    return false
  }
}

export function clearLocalSiteOverrides() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    /* ignore */
  }
}

/** Contenu fusionné déployé avec le site (`public/site-content.json`). */
export async function fetchStaticSiteContentSeed() {
  try {
    const r = await fetch('/site-content.json', { cache: 'no-store' })
    if (!r.ok) return null
    const data = await r.json()
    return data && typeof data === 'object' ? data : null
  } catch {
    return null
  }
}
