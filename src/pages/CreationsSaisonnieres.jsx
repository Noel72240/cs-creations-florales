import ConfigurablePageHeader from '../components/ConfigurablePageHeader'
import ContactCTA from '../components/ContactCTA'
import PageArticleGrid from '../components/PageArticleGrid'
import PageIntroSection from '../components/PageIntroSection'
import { Link } from 'react-router-dom'
import { useSiteConfig } from '../context/SiteContentContext'
import { aggregateHubArticles } from '../lib/articleHubAggregation'
import { P, w600, w1200 } from '../data/flowerPhotos'

const SEASONS = [
  {
    title: 'Pâques',
    path: '/creations-saisonnieres/paques',
    desc: 'Des compositions florales printanières et colorées pour célébrer le renouveau du printemps.',
    img: w600(P.tulips),
    icon: '🐣',
  },
  {
    title: 'Noël',
    path: '/creations-saisonnieres/noel',
    desc: 'Couronnes, compositions de table et décors enchanteurs pour illuminer les fêtes de fin d\'année.',
    img: w600(P.rosesPink),
    icon: '🎄',
  },
  {
    title: 'Fêtes des Mères/Pères',
    path: '/creations-saisonnieres/fete-des-meres',
    desc: 'Des bouquets et créations florales tendres et délicats pour honorer mamans et papas avec amour.',
    img: w600(P.bouquetSoft),
    icon: '💝',
  },
  {
    title: 'Fête des Grandes-Mères',
    path: '/creations-saisonnieres/fete-des-grandes-meres',
    desc: 'Compositions florales et cadeaux personnalisés pour célébrer mamie avec tendresse.',
    img: w600(P.peonies),
    icon: '💐',
  },
]

export default function CreationsSaisonnieres() {
  const { content } = useSiteConfig()
  const pa = content.pageArticles?.creationsSaisonnieres
  const hubItems = aggregateHubArticles('creationsSaisonnieres', content, { maxItems: 500 })
  const showSeasonCards = pa?.seasonCardsSectionEnabled === true

  return (
    <>
      <div>
        <ConfigurablePageHeader
          pagePath="/creations-saisonnieres"
          fallback={{
            title: 'Créations Saisonnières',
            subtitle: "Tout au long de l'année",
            image: w1200(P.tulips),
          }}
        />
      </div>

      <PageIntroSection pageKey="creationsSaisonnieres" />

      <PageArticleGrid
        sectionTitle={pa?.sectionTitle}
        intro={pa?.intro}
        items={hubItems}
        pagePath="/creations-saisonnieres"
        pageKey="creationsSaisonnieres"
        maxItems={500}
      />

      {showSeasonCards ? (
        <section className="py-16 px-4" style={{ background: 'var(--blanc)' }}>
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {SEASONS.map((season) => (
                <Link key={season.path} to={season.path} className="card group block overflow-hidden touch-manipulation">
                  <div className="img-overlay h-60">
                    <img src={season.img} alt={season.title} className="w-full h-full object-cover" />
                    <div className="overlay"><span>Voir la collection →</span></div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-3xl">{season.icon}</span>
                      <h2 className="font-heading text-xl font-medium" style={{ color: 'var(--violet)' }}>
                        {season.title}
                      </h2>
                    </div>
                    <p className="text-body-soft">{season.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <ContactCTA message="Vous préparez une fête ou une célébration saisonnière ? Je crée pour vous des compositions florales adaptées." />
    </>
  )
}
