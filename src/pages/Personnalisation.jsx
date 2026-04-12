import PageHeader from '../components/PageHeader'
import ContactCTA from '../components/ContactCTA'
import PageArticleGrid from '../components/PageArticleGrid'
import { Link } from 'react-router-dom'
import { useSiteConfig } from '../context/SiteContentContext'
import { P, w700, w1200 } from '../data/flowerPhotos'

export default function Personnalisation() {
  const { content } = useSiteConfig()
  const pa = content.pageArticles?.personnalisation

  return (
    <>
      <div>
        <PageHeader
          title="Personnalisation"
          subtitle="Créations sur mesure"
          image={w1200(P.bouquetGift)}
        />
      </div>

      {/* Intro */}
      <section className="py-16 px-4" style={{ background: 'var(--blanc)' }}>
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="section-subtitle text-left mb-2">Ce qui vous ressemble</p>
              <h2 className="font-heading text-3xl md:text-4xl font-medium mb-6" style={{ color: 'var(--violet)' }}>
                L'art de la personnalisation
              </h2>
              <div className="flex items-center gap-3 mb-7">
                <div className="h-px w-16 bg-mauve-light" />
                <span className="text-mauve text-sm">✿</span>
              </div>
              <p className="text-refined text-left mb-5">
                Au-delà des fleurs, je propose un service de personnalisation artisanale pour créer des objets, des cadeaux et des accessoires uniques qui vous ressemblent ou qui toucheront le cœur de ceux à qui vous les offrez.
              </p>
              <p className="text-refined text-left mb-6">
                Chaque création est pensée avec vous, selon vos goûts, vos couleurs, votre histoire. Rien n'est standardisé : tout est créé à la main, avec amour et attention.
              </p>
              <Link to="/contact" className="btn-primary">Demander une personnalisation</Link>
            </div>
            <div className="img-overlay rounded-2xl" style={{ height: '380px' }}>
              <img
                src={w700(P.rosesBouquet)}
                alt="Personnalisation artisanale"
                className="w-full h-full object-cover"
              />
              <div className="overlay overlay--centered">
                <span
                  className="font-refined text-[26px] sm:text-[27px] font-semibold tracking-wide text-white/95 not-italic"
                  style={{ textShadow: '0 1px 4px rgba(0,0,0,0.55)' }}
                >
                  Créations sur mesure
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PageArticleGrid
        sectionTitle={pa?.sectionTitle}
        intro={pa?.intro}
        items={pa?.items}
        pagePath="/personnalisation"
      />

      <ContactCTA message="Une idée de cadeau personnalisé ? Parlons-en ensemble, je suis là pour concrétiser votre vision !" />
    </>
  )
}
