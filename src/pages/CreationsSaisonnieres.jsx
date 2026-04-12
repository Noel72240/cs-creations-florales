import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import ContactCTA from '../components/ContactCTA'
import PageArticleGrid from '../components/PageArticleGrid'
import { useSiteConfig } from '../context/SiteContentContext'
import { P, w600, w1200 } from '../data/flowerPhotos'

const SEASONS = [
  {
    title: 'Pâques',
    path: '/creations-saisonnieres/paques',
    desc: 'Des compositions florales printanières et colorées pour célébrer le renouveau du printemps.',
    img: w600(P.tulips),
    icon: '🐣',
    color: '#a8d08d',
  },
  {
    title: 'Noël',
    path: '/creations-saisonnieres/noel',
    desc: 'Couronnes, compositions de table et décors enchanteurs pour illuminer les fêtes de fin d\'année.',
    img: w600(P.rosesPink),
    icon: '🎄',
    color: '#c94f4f',
  },
  {
    title: 'Fête des Mères',
    path: '/creations-saisonnieres/fete-des-meres',
    desc: 'Des bouquets et créations florales tendres et délicats pour honorer les mamans avec amour.',
    img: w600(P.bouquetSoft),
    icon: '💝',
    color: '#d4759b',
  },
]

export default function CreationsSaisonnieres() {
  const { content } = useSiteConfig()
  const pa = content.pageArticles?.creationsSaisonnieres

  return (
    <>
      <div>
        <PageHeader
          title="Créations Saisonnières"
          subtitle="Tout au long de l'année"
          image={w1200(P.tulips)}
        />
      </div>

      <section className="py-16 px-4" style={{ background: 'var(--blanc)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-refined max-w-xl mx-auto">
              Au fil des saisons, la nature offre ses plus belles parures. Je crée des compositions florales en accord avec chaque époque de l'année, pour que vous puissiez célébrer chaque moment avec des fleurs qui lui correspondent.
            </p>
          </div>
        </div>
      </section>

      <PageArticleGrid
        sectionTitle={pa?.sectionTitle}
        intro={pa?.intro}
        items={pa?.items}
        pagePath="/creations-saisonnieres"
      />

      <section className="py-16 px-4" style={{ background: 'var(--blanc)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SEASONS.map((season) => (
              <Link key={season.path} to={season.path} className="card group block overflow-hidden">
                <div className="img-overlay h-60">
                  <img src={season.img} alt={season.title} className="w-full h-full object-cover" />
                  <div className="overlay"><span>Découvrir →</span></div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">{season.icon}</span>
                    <h2 className="font-heading text-xl font-medium" style={{ color: 'var(--violet)' }}>
                      {season.title}
                    </h2>
                  </div>
                  <p className="text-body-soft">{season.desc}</p>
                  <div className="mt-4 text-xs font-body flex items-center gap-1" style={{ color: 'var(--mauve)' }}>
                    <span>Voir la collection</span>
                    <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <ContactCTA message="Vous préparez une fête ou une célébration saisonnière ? Je crée pour vous des compositions florales adaptées." />
    </>
  )
}
