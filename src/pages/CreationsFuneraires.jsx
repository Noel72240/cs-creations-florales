import ConfigurablePageHeader from '../components/ConfigurablePageHeader'
import PageArticleGrid from '../components/PageArticleGrid'
import PageIntroSection from '../components/PageIntroSection'
import { Link } from 'react-router-dom'
import { useSiteConfig } from '../context/SiteContentContext'
import { P, w1200 } from '../data/flowerPhotos'

export default function CreationsFuneraires() {
  const { content } = useSiteConfig()
  const pa = content.pageArticles?.creationsFuneraires
  const SITE = content.site

  return (
    <>
      <div>
        <ConfigurablePageHeader
          pagePath="/creations-funeraires"
          fallback={{
            title: 'Créations Funéraires',
            subtitle: 'Hommage floral',
            image: w1200(P.wildflowers),
          }}
        />
      </div>

      <PageIntroSection pageKey="creationsFuneraires" />

      <PageArticleGrid
        sectionTitle={pa?.sectionTitle}
        intro={pa?.intro}
        showIntro
        items={pa?.items}
        pagePath="/creations-funeraires"
        pageKey="creationsFuneraires"
      />

      <section className="py-16 px-4 text-center" style={{ background: 'var(--beige)' }}>
        <h2 className="font-heading text-2xl mb-4" style={{ color: 'var(--violet)' }}>Nous contacter</h2>
        <p className="text-refined--sm max-w-xl mx-auto mb-6">
          Je suis disponible rapidement pour vous accompagner. Appelez-moi ou envoyez un message.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <a href={SITE.phoneHref} className="btn-primary">📞 Appeler {SITE.ownerFirstName}</a>
          <Link to="/contact" className="btn-outline">Envoyer un message</Link>
        </div>
      </section>
    </>
  )
}
