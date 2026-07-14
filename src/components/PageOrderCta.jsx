import { Link } from 'react-router-dom'
import { useSiteConfig } from '../context/SiteContentContext'
import { resolvePageTexts } from '../lib/pageTexts'

export default function PageOrderCta({ pageKey }) {
  const { content } = useSiteConfig()
  if (!pageKey) return null
  const texts = resolvePageTexts(pageKey, content.pageArticles?.[pageKey])
  if (!texts.orderCta.enabled || !texts.orderCta.label) return null

  return (
    <div className="py-8 text-center">
      <Link to={texts.orderCta.path || '/contact'} className="btn-primary">
        {texts.orderCta.label}
      </Link>
    </div>
  )
}
