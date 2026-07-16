import { useMemo } from 'react'
import { useSiteConfig } from '../context/SiteContentContext'
import { PAGE_BANNER_FALLBACKS, pageKeyFromPath } from '../data/pageCatalog'
import { resolvePhotoSrc } from '../data/photoResolver'
import PageHeader from './PageHeader'

/**
 * Bandeau de page : valeurs admin (pageArticles.banner / pageBanners) + repli code.
 * Cochez « Masquer titre et sous-titre » pour une affiche déjà écrite (ex. Contact).
 */
export default function ConfigurablePageHeader({ pagePath, fallback = {}, className = '' }) {
  const { content } = useSiteConfig()

  const { title, subtitle, image } = useMemo(() => {
    const pageKey = pageKeyFromPath(pagePath)
    const fromArticles = pageKey ? content.pageArticles?.[pageKey]?.banner : null
    const fromUtility = content.pageBanners?.[pagePath] || null
    const fromAdmin = fromArticles || fromUtility
    const fromDefaults = PAGE_BANNER_FALLBACKS[pagePath] || {}

    const hideText =
      Boolean(fromAdmin?.hideText) ||
      // Contact : pas d’écritures par défaut (affiche admin déjà écrite)
      (pagePath === '/contact' && fromAdmin?.hideText !== false)

    const title = hideText
      ? ''
      : pagePath === '/contact'
        ? (fromAdmin?.title || '').trim()
        : (fromAdmin?.title || '').trim() || fallback.title || fromDefaults.title || ''
    const subtitle = hideText
      ? ''
      : pagePath === '/contact'
        ? (fromAdmin?.subtitle || '').trim()
        : (fromAdmin?.subtitle || '').trim() || fallback.subtitle || fromDefaults.subtitle || ''

    const src = String(fromAdmin?.src || '').trim()
    const photoKey =
      String(fromAdmin?.photoKey || '').trim() || fallback.photoKey || fromDefaults.photoKey || ''
    let image = fallback.image
    if (src) image = resolvePhotoSrc(src)
    else if (photoKey) image = resolvePhotoSrc(photoKey)

    return { title, subtitle, image }
  }, [
    content.pageArticles,
    content.pageBanners,
    fallback.image,
    fallback.photoKey,
    fallback.subtitle,
    fallback.title,
    pagePath,
  ])

  return <PageHeader title={title} subtitle={subtitle} image={image} className={className} />
}
