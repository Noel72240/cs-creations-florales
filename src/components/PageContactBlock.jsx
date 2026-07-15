import { Link } from 'react-router-dom'
import { useSiteConfig } from '../context/SiteContentContext'
import { resolvePageTexts } from '../lib/pageTexts'

export default function PageContactBlock({ pageKey }) {
  const { content } = useSiteConfig()
  const SITE = content.site
  if (!pageKey) return null
  const texts = resolvePageTexts(pageKey, content.pageArticles?.[pageKey])
  const block = texts.contactBlock
  if (!block.enabled) return null

  return (
    <section className="py-10 px-4 text-center" style={{ background: 'var(--beige)' }}>
      <h2 className="font-heading text-2xl mb-4" style={{ color: 'var(--violet)' }}>
        {block.title}
      </h2>
      {block.text ? (
        <p className="text-refined--sm max-w-xl mx-auto mb-6">{block.text}</p>
      ) : null}
      <div className="flex flex-wrap gap-4 justify-center">
        <a href={SITE.phoneHref} className="btn-primary">
          {block.phoneLabel} {SITE.ownerFirstName}
        </a>
        <Link to="/contact" className="btn-outline">
          {block.messageLabel}
        </Link>
      </div>
    </section>
  )
}
