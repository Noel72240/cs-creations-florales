import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import ContactCTA from '../components/ContactCTA'
import PageArticleGrid from '../components/PageArticleGrid'
import { useSiteConfig } from '../context/SiteContentContext'
import { P, w600, w1200 } from '../data/flowerPhotos'

const EVENTS = [
  {
    title: 'Anniversaire',
    path: '/evenements-floraux/anniversaire',
    desc: 'Des compositions florales festives et personnalisées pour célébrer chaque année avec éclat.',
    img: w600(P.dahlias),
    icon: '🎂',
  },
  {
    title: 'Mariage',
    path: '/evenements-floraux/mariage',
    desc: 'Des créations florales romantiques et élégantes pour sublimer le plus beau jour de votre vie.',
    img: w600(P.weddingBouquet),
    icon: '💍',
  },
  {
    title: 'Baptême & Communion',
    path: '/evenements-floraux/bapteme-communion',
    desc: "Des arrangements doux et délicats pour accompagner ces moments d'une tendresse infinie.",
    img: w600(P.peonies),
    icon: '🕊️',
  },
]

export default function EvenementsFloraux() {
  const { content } = useSiteConfig()
  const pa = content.pageArticles?.evenementsFloraux

  return (
    <>
      <div>
        <PageHeader
          title="Événements Floraux"
          subtitle="Créations sur mesure"
          image={w1200(P.weddingTableFlorals)}
        />
      </div>
      <section className="py-16 px-4" style={{ background: 'var(--blanc)' }}>
        <div className="max-w-5xl mx-auto">
          <p className="text-refined text-center max-w-xl mx-auto mb-8">
            Chaque événement mérite d'être sublimé par des fleurs. Je crée pour vous des compositions florales sur mesure qui s'accordent parfaitement à l'ambiance de votre célébration.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {EVENTS.map((ev) => (
              <Link key={ev.path} to={ev.path} className="card group block">
                <div className="img-overlay h-56">
                  <img src={ev.img} alt={ev.title} className="w-full h-full object-cover" />
                  <div className="overlay"><span>Découvrir →</span></div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">{ev.icon}</span>
                    <h2 className="font-heading text-xl font-medium" style={{ color: 'var(--violet)' }}>{ev.title}</h2>
                  </div>
                  <p className="text-body-soft">{ev.desc}</p>
                  <div className="mt-4 text-xs font-body flex items-center gap-1" style={{ color: 'var(--mauve)' }}>
                    <span>En savoir plus</span>
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

      <PageArticleGrid
        sectionTitle={pa?.sectionTitle}
        intro={pa?.intro}
        items={pa?.items}
        pagePath="/evenements-floraux"
      />

      <ContactCTA message="Vous avez un événement à préparer ? Contactez-moi pour un devis personnalisé et gratuit." />
    </>
  )
}
