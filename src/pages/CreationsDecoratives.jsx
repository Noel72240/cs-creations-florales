import ConfigurablePageHeader from '../components/ConfigurablePageHeader'
import ContactCTA from '../components/ContactCTA'
import PageArticleGrid from '../components/PageArticleGrid'
import PageIntroSection from '../components/PageIntroSection'
import { Link } from 'react-router-dom'
import { useSiteConfig } from '../context/SiteContentContext'
import { P, w1200 } from '../data/flowerPhotos'

export default function CreationsDecoratives() {
  const { content } = useSiteConfig()
  const pa = content.pageArticles?.creationsFlorales

  return (
    <>
      <div>
        <ConfigurablePageHeader
          pagePath="/creations-florales"
          fallback={{
            title: 'Créations Florales & Décoratives',
            subtitle: 'Mon univers artisanal',
            image: w1200(P.vaseInterior),
          }}
        />
      </div>

      <PageIntroSection pageKey="creationsFlorales" />

      <PageArticleGrid
        sectionTitle={pa?.sectionTitle}
        intro={pa?.intro}
        items={pa?.items}
        pagePath="/creations-florales"
        pageKey="creationsFlorales"
      />

      <div className="py-8 text-center">
        <Link to="/contact" className="btn-primary">Commander une création</Link>
      </div>
      <ContactCTA message="Vous souhaitez une création florale personnalisée ? Contactez-moi pour en discuter !" />
    </>
  )
}
