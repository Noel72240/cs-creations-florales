import { useMemo } from 'react'
import { useSiteConfig } from '../context/SiteContentContext'
import { PAGE_BANNER_FALLBACKS, pageKeyFromPath } from '../data/pageCatalog'
import { resolvePhotoSrc } from '../data/photoResolver'
import PageHeader from './PageHeader'

/**
 * Bandeau de page : valeurs admin (pageArticles.banner) + repli code.
 * @param {{ pagePath: string, fallback?: { title?: string, subtitle?: string, image?: string, photoKey?: string } }} props
 */
export default function ConfigurablePageHeader({ pagePath, fallback = {}, className = '' }) {
  const { content } = useSiteConfig()

  const { title, subtitle, image } = useMemo(() => {
    const pageKey = pageKeyFromPath(pagePath)
    const fromArticles = pageKey ? content.pageArticles?.[pageKey]?.banner : null
    const fromUtility = content.pageBanners?.[pagePath] || null
    const fromAdmin = fromArticles || fromUtility
    const fromDefaults = PAGE_BANNER_FALLBACKS[pagePath] || {}

    const title = (fromAdmin?.title || '').trim() || fallback.title || fromDefaults.title || ''
    const subtitle = (fromAdmin?.subtitle || '').trim() || fallback.subtitle || fromDefaults.subtitle || ''

    const src = (fromAdmin?.src || '').trim()
    const photoKey = (fromAdmin?.photoKey || '').trim() || fallback.photoKey || fromDefaults.photoKey || ''
    let image = fallback.image
    if (src) image = resolvePhotoSrc(src)
    else if (photoKey) image = resolvePhotoSrc(photoKey)

    return { title, subtitle, image }
  }, [content.pageArticles, content.pageBanners, fallback.image, fallback.photoKey, fallback.subtitle, fallback.title, pagePath])

  return <PageHeader title={title} subtitle={subtitle} image={image} className={className} />
}
