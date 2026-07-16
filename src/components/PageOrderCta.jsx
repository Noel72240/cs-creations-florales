import { Link } from 'react-router-dom'
import { useSiteConfig } from '../context/SiteContentContext'
import { isPublishableCatalogArticle } from '../lib/articleHubAggregation'
import { resolvePageTexts } from '../lib/pageTexts'

export default function PageOrderCta({ pageKey }) {
  const { content } = useSiteConfig()
  if (!pageKey) return null
  const pa = content.pageArticles?.[pageKey]
  const texts = resolvePageTexts(pageKey, pa)
  if (!texts.orderCta.enabled || !texts.orderCta.label) return null

  const hasArticle = Array.isArray(pa?.items) && pa.items.some(isPublishableCatalogArticle)
  if (!hasArticle) return null

  return (
    <div className="py-5 text-center">
      <Link to={texts.orderCta.path || '/contact'} className="btn-primary">
        {texts.orderCta.label}
      </Link>
    </div>
  )
}
