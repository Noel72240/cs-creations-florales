import { Link } from 'react-router-dom'
import { useSiteConfig } from '../context/SiteContentContext'
import { resolvePageTexts } from '../lib/pageTexts'

export default function PageMidCta({ pageKey }) {
  const { content } = useSiteConfig()
  if (!pageKey) return null
  const texts = resolvePageTexts(pageKey, content.pageArticles?.[pageKey])
  if (!texts.midCta.enabled || !texts.midCta.label) return null

  return (
    <div className="py-5 text-center">
      <Link to={texts.midCta.path || '/contact'} className="btn-primary">
        {texts.midCta.label}
      </Link>
    </div>
  )
}
