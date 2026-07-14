import ConfigurablePageHeader from '../components/ConfigurablePageHeader'
import ContactCTA from '../components/ContactCTA'
import PageArticleGrid from '../components/PageArticleGrid'
import PageIntroSection from '../components/PageIntroSection'
import PageOrderCta from '../components/PageOrderCta'
import { useSiteConfig } from '../context/SiteContentContext'

export default function SeasonPage({ title, subtitle, coverImg, items, articlePageKey, pagePath }) {
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

      {items && !hasArticles ? (
        <section className="py-12 px-4" style={{ background: 'var(--beige)' }}>
          <div className="max-w-4xl mx-auto">
            <h2 className="section-title mb-2">Mes créations</h2>
            <div className="floral-divider mb-10"><span className="floral-icon">✿</span></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {items.map((item, i) => (
                <div key={i} className="flex items-start gap-4 p-5 rounded-xl bg-white" style={{ boxShadow: '0 2px 16px rgba(139,75,106,0.07)' }}>
                  <span className="text-2xl shrink-0">{item.icon}</span>
                  <div>
                    <h3 className="font-heading text-base font-medium mb-1" style={{ color: 'var(--violet)', fontSize: '1rem' }}>{item.title}</h3>
                    <p className="text-body-soft text-[0.8125rem] leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <PageOrderCta pageKey={articlePageKey} />
      <ContactCTA pageKey={articlePageKey} />
    </>
  )
}
