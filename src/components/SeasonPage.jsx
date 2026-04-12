import { Link } from 'react-router-dom'
import PageHeader from './PageHeader'
import ContactCTA from './ContactCTA'
import PageArticleGrid from './PageArticleGrid'
import { useSiteConfig } from '../context/SiteContentContext'

export default function SeasonPage({ title, subtitle, coverImg, intro, icon, items, articlePageKey, pagePath }) {
  const { content } = useSiteConfig()
  const pa = articlePageKey ? content.pageArticles?.[articlePageKey] : null
  const hasArticles = Array.isArray(pa?.items) && pa.items.length > 0

  return (
    <>
      <div>
        <PageHeader title={title} subtitle={subtitle} image={coverImg} />
      </div>

      {/* Intro */}
      <section className="py-16 px-4" style={{ background: 'var(--blanc)' }}>
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-5xl mb-6">{icon}</p>
          <p className="text-refined max-w-[36rem] mx-auto">{intro}</p>
        </div>
      </section>

      {hasArticles && pagePath && (
        <PageArticleGrid
          sectionTitle={pa.sectionTitle}
          intro={pa.intro}
          items={pa.items}
          pagePath={pagePath}
        />
      )}

      {/* Items (si pas d’articles catalogue) */}
      {items && !hasArticles && (
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
      )}

      <div className="py-8 text-center">
        <Link to="/contact" className="btn-primary">Commander cette création</Link>
      </div>
      <ContactCTA />
    </>
  )
}
