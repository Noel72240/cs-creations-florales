import { Link } from 'react-router-dom'
import ConfigurablePageHeader from '../components/ConfigurablePageHeader'
import ContactCTA from '../components/ContactCTA'
import PageArticleGrid from '../components/PageArticleGrid'
import { useSiteConfig } from '../context/SiteContentContext'
import { P, w1200 } from '../data/flowerPhotos'
import { resolveEvenementsFlorauxHub } from '../lib/eventHubCards'
import { aggregateHubArticles } from '../lib/articleHubAggregation'

export default function EvenementsFloraux() {
  const { content } = useSiteConfig()
  const pa = content.pageArticles?.evenementsFloraux
  const hubItems = aggregateHubArticles('evenementsFloraux', content, { maxItems: 500 })
  const { cards, hubIntro } = resolveEvenementsFlorauxHub(pa)

  return (
    <>
      <div>
        <ConfigurablePageHeader
          pagePath="/evenements-floraux"
          fallback={{
            title: 'Événements Floraux',
            subtitle: 'Créations sur mesure',
            image: w1200(P.weddingTableFlorals),
          }}
        />
      </div>
      <section className="py-8 px-4" style={{ background: 'var(--blanc)' }}>
        <div className="max-w-5xl mx-auto text-center">
          {hubIntro ? (
            <p className="text-refined max-w-3xl mx-auto mb-5 leading-relaxed">{hubIntro}</p>
          ) : null}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cards.map((ev) => (
              <Link key={ev.path} to={ev.path} className="card group block touch-manipulation">
                <div className="img-overlay h-56">
                  <img src={ev.img} alt={ev.title} className="w-full h-full object-cover" />
                  <div className="overlay" aria-hidden="true">
                    <span>Découvrir →</span>
                  </div>
                </div>
                <div className="p-6 text-left">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">{ev.icon}</span>
                    <h2 className="font-heading text-xl font-medium" style={{ color: 'var(--violet)' }}>
                      {ev.title}
                    </h2>
                  </div>
                  <div className="text-xs font-body flex items-center gap-1" style={{ color: 'var(--mauve)' }}>
                    <span>En savoir plus</span>
                    <svg
                      className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <PageArticleGrid
        sectionTitle={pa?.sectionTitle}
        intro={pa?.intro}
        items={hubItems}
        pagePath="/evenements-floraux"
        pageKey="evenementsFloraux"
        maxItems={500}
        showIntro
      />

      <ContactCTA pageKey="evenementsFloraux" />
    </>
  )
}
