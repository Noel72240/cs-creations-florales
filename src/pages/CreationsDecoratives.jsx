import PageHeader from '../components/PageHeader'
import ContactCTA from '../components/ContactCTA'
import PageArticleGrid from '../components/PageArticleGrid'
import { Link } from 'react-router-dom'
import { useSiteConfig } from '../context/SiteContentContext'
import { P, w1200 } from '../data/flowerPhotos'

export default function CreationsDecoratives() {
  const { content } = useSiteConfig()
  const pa = content.pageArticles?.creationsFlorales

  return (
    <>
      <div>
        <PageHeader
          title="Créations Florales & Décoratives"
          subtitle="Mon univers artisanal"
          image={w1200(P.vaseInterior)}
        />
      </div>

      {/* Intro */}
      <section className="py-16 px-4" style={{ background: 'var(--blanc)' }}>
        <div className="max-w-3xl mx-auto text-center">
          <p className="section-subtitle mb-2">Artisanat floral</p>
          <h2 className="section-title mb-4">Des créations pensées avec amour</h2>
          <div className="floral-divider mb-8"><span className="floral-icon">✿</span></div>
          <p className="text-refined max-w-[36rem] mx-auto">
            Mes créations florales et décoratives sont imaginées pour embellir votre intérieur, offrir un cadeau original ou simplement s'offrir un peu de beauté au quotidien. Chaque pièce est réalisée à la main, avec soin, en utilisant des fleurs fraîches, séchées ou stabilisées de qualité.
          </p>
        </div>
      </section>

      <PageArticleGrid
        sectionTitle={pa?.sectionTitle}
        intro={pa?.intro}
        items={pa?.items}
        pagePath="/creations-florales"
      />

      {/* CTA */}
      <div className="py-8 text-center">
        <Link to="/contact" className="btn-primary">Commander une création</Link>
      </div>
      <ContactCTA message="Vous souhaitez une création florale personnalisée ? Contactez-moi pour en discuter !" />
    </>
  )
}
