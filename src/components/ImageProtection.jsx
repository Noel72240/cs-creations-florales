import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

function isPublicSite() {
  return !window.location.pathname.startsWith('/admin')
}

function isProtectedMediaTarget(target) {
  if (!(target instanceof Element)) return false
  if (target.closest('.admin-page')) return false

  if (target instanceof HTMLImageElement) {
    return Boolean(target.closest('.site-main, .article-catalog-lightbox'))
  }

  return Boolean(
    target.closest(
      '.page-header--image, .hero-section--image-bg, .img-overlay, .article-catalog-card__media, .article-product-gallery, .article-catalog-lightbox',
    ),
  )
}

/**
 * Décourage l’enregistrement direct des photos (clic droit, glisser-déposer).
 * Ne bloque pas les captures d’écran ni les outils développeur.
 */
export default function ImageProtection() {
  const { pathname } = useLocation()

  useEffect(() => {
    if (!isPublicSite()) return undefined

    const blockContextMenu = (event) => {
      if (isProtectedMediaTarget(event.target)) event.preventDefault()
    }

    const blockDrag = (event) => {
      if (event.target instanceof HTMLImageElement && isProtectedMediaTarget(event.target)) {
        event.preventDefault()
      }
    }

    document.addEventListener('contextmenu', blockContextMenu, true)
    document.addEventListener('dragstart', blockDrag, true)

    return () => {
      document.removeEventListener('contextmenu', blockContextMenu, true)
      document.removeEventListener('dragstart', blockDrag, true)
    }
  }, [pathname])

  return null
}
