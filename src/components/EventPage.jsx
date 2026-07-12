import { Link } from 'react-router-dom'
import ConfigurablePageHeader from './ConfigurablePageHeader'
import ContactCTA from './ContactCTA'
import PageArticleGrid from './PageArticleGrid'
import PageIntroSection from './PageIntroSection'
import { useSiteConfig } from '../context/SiteContentContext'

export default function EventPage({ title, subtitle, coverImg, articlePageKey, pagePath }) {
  const { content } = useSiteConfig()
  const pa = articlePageKey ? content.pageArticles?.[articlePageKey] : null
  const hasArticles = Array.isArray(pa?.items) && pa.items.length > 0

  return (
    <>
      <div>
        <ConfigurablePageHeader
          pagePath={pagePath}
          fallback={{ title, subtitle, image: coverImg }}
        />
      </div>

      {articlePageKey ? <PageIntroSection pageKey={articlePageKey} /> : null}

      {hasArticles && pagePath && (
        <PageArticleGrid
          sectionTitle={pa.sectionTitle}
          intro={pa.intro}
          items={pa.items}
          pagePath={pagePath}
          pageKey={articlePageKey}
        />
      )}

      <div className="px-4 pb-4 flex justify-center">
        <Link to="/contact" className="btn-primary">Demander un devis gratuit</Link>
      </div>
      <ContactCTA />
    </>
  )
}
