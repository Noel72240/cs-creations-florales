import ConfigurablePageHeader from '../components/ConfigurablePageHeader'
import ContactCTA from '../components/ContactCTA'
import PageArticleGrid from '../components/PageArticleGrid'
import PageIntroSection from '../components/PageIntroSection'
import PageContactBlock from '../components/PageContactBlock'
import { useSiteConfig } from '../context/SiteContentContext'
import { P, w1200 } from '../data/flowerPhotos'

export default function CreationsFuneraires() {
  const { content } = useSiteConfig()
  const pa = content.pageArticles?.creationsFuneraires

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

      <PageContactBlock pageKey="creationsFuneraires" />
      <ContactCTA pageKey="creationsFuneraires" />
    </>
  )
}
