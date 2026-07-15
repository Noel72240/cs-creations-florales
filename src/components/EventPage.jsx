import ConfigurablePageHeader from './ConfigurablePageHeader'
import ContactCTA from './ContactCTA'
import PageArticleGrid from './PageArticleGrid'
import PageIntroSection from './PageIntroSection'
import PageContactBlock from './PageContactBlock'
import PageMidCta from './PageMidCta'
import PageOrderCta from './PageOrderCta'
import { useSiteConfig } from '../context/SiteContentContext'
import { isPublishableCatalogArticle } from '../lib/articleHubAggregation'

export default function EventPage({ title, subtitle, coverImg, articlePageKey, pagePath }) {
  const { content } = useSiteConfig()
  const pa = articlePageKey ? content.pageArticles?.[articlePageKey] : null
  const catalogItems = Array.isArray(pa?.items) ? pa.items : []
  const publishable = catalogItems.filter(isPublishableCatalogArticle)
  const hasSectionCopy = Boolean(String(pa?.sectionTitle || '').trim() || String(pa?.intro || '').trim())
  const showCatalog = Boolean(pagePath && (publishable.length > 0 || hasSectionCopy))

  return (
    <>
      <div>
        <ConfigurablePageHeader
          pagePath={pagePath}
          fallback={{ title, subtitle, image: coverImg }}
        />
      </div>

      {articlePageKey ? <PageIntroSection pageKey={articlePageKey} /> : null}

      {showCatalog ? (
        <PageArticleGrid
          sectionTitle={pa?.sectionTitle}
          intro={pa?.intro}
          items={catalogItems}
          pagePath={pagePath}
          pageKey={articlePageKey}
          showIntro
        />
      ) : null}

      <PageMidCta pageKey={articlePageKey} />
      <PageContactBlock pageKey={articlePageKey} />
      <PageOrderCta pageKey={articlePageKey} />
      <ContactCTA pageKey={articlePageKey} />
    </>
  )
}
