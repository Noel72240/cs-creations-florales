import ConfigurablePageHeader from './ConfigurablePageHeader'
import ContactCTA from './ContactCTA'
import PageArticleGrid from './PageArticleGrid'
import PageIntroSection from './PageIntroSection'
import PageContactBlock from './PageContactBlock'
import PageMidCta from './PageMidCta'
import PageOrderCta from './PageOrderCta'
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

      {hasArticles && pagePath ? (
        <PageArticleGrid
          sectionTitle={pa.sectionTitle}
          intro={pa.intro}
          items={pa.items}
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
