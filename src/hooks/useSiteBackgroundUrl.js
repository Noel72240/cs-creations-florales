import { useEffect, useMemo, useState } from 'react'
import { useSiteConfig } from '../context/SiteContentContext'
import { resolveBackgroundSrc } from '../data/photoResolver'

/**
 * URL image du bandeau d’accueil (vide = dégradé CSS `.hero-bg-soft`).
 * Priorité : VITE_HERO_BG → public/hero.png ou hero.jpg → admin (src / clé) → chaîne vide.
 */
export function useSiteBackgroundUrl() {
  const { content } = useSiteConfig()
  const envBg = import.meta.env.VITE_HERO_BG?.trim()
  const adminSrc = content.home?.hero?.backgroundSrc ?? ''
  const adminKey = content.home?.hero?.backgroundPhotoKey ?? ''
  const adminResolved = useMemo(() => resolveBackgroundSrc(adminSrc, adminKey), [adminSrc, adminKey])

  const [url, setUrl] = useState(() => envBg || adminResolved)

  useEffect(() => {
    if (envBg) {
      setUrl(envBg)
      return
    }
    const paths = ['/hero.png', '/hero.jpg']
    let i = 0
    const probe = () => {
      if (i >= paths.length) {
        setUrl(adminResolved)
        return
      }
      const path = paths[i]
      const img = new Image()
      img.onload = () => setUrl(path)
      img.onerror = () => {
        i += 1
        probe()
      }
      img.src = path
    }
    probe()
  }, [envBg, adminResolved])

  return typeof url === 'string' ? url : ''
}
