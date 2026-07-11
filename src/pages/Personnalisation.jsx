import ConfigurablePageHeader from '../components/ConfigurablePageHeader'
import ContactCTA from '../components/ContactCTA'
import PageArticleGrid from '../components/PageArticleGrid'
import PageIntroSection from '../components/PageIntroSection'
import { useSiteConfig } from '../context/SiteContentContext'
import { P, w1200 } from '../data/flowerPhotos'

export default function Personnalisation() {
  const { content } = useSiteConfig()
  const pa = content.pageArticles?.personnalisation

  return (
    <>
      <div>
        <ConfigurablePageHeader
          pagePath="/personnalisation"
          fallback={{
            title: 'Personnalisations',
            subtitle: 'Créations sur mesure',
            image: w1200(P.bouquetGift),
          }}
        />
      </div>

      <PageIntroSection pageKey="personnalisation" />

      <PageArticleGrid
        sectionTitle={pa?.sectionTitle}
        intro={pa?.intro}
        items={pa?.items}
        pagePath="/personnalisation"
        pageKey="personnalisation"
      />

      <ContactCTA message="Une idée de cadeau personnalisé ? Parlons-en ensemble, je suis là pour concrétiser votre vision !" />
    </>
  )
}
