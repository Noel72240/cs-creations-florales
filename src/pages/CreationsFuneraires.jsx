import PageHeader from '../components/PageHeader'
import PageArticleGrid from '../components/PageArticleGrid'
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
        <PageHeader
          title="Créations Funéraires"
          subtitle="Hommage floral"
          image={w1200(P.wildflowers)}
        />
      </div>

      {/* Message d'accompagnement */}
      <section className="py-16 px-4" style={{ background: 'var(--blanc)' }}>
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-4xl mb-6 opacity-40" style={{ color: 'var(--mauve)' }}>✿</p>
          <h2 className="font-heading text-3xl md:text-4xl mb-6" style={{ color: 'var(--violet)', fontWeight: 400 }}>
            Des fleurs pour honorer la mémoire
          </h2>
          <p className="text-refined mb-5 max-w-[36rem] mx-auto">
            Dans les moments les plus difficiles, les fleurs portent les mots que l'on ne peut pas dire. Je crée avec pudeur, délicatesse et respect des compositions funéraires qui rendent hommage à celles et ceux qui nous ont quittés.
          </p>
          <p className="text-refined max-w-[36rem] mx-auto">
            Chaque composition est réalisée avec soin, dans un esprit de sobriété et d'élégance, pour accompagner les familles endeuillées avec toute la considération qu'elles méritent. Je suis disponible dans les meilleurs délais pour vous aider.
          </p>

          <div className="mt-10 p-6 rounded-2xl text-left" style={{ background: 'linear-gradient(to right, rgba(240,210,221,0.2), rgba(239,230,234,0.3))', border: '1px solid rgba(240,210,221,0.4)' }}>
            <p className="font-heading text-base italic text-center" style={{ color: 'var(--violet)' }}>
              « Je suis à votre écoute dans ces moments difficiles. N'hésitez pas à me contacter par téléphone pour une réponse rapide. »
            </p>
            <p className="text-center font-body text-xs mt-3" style={{ color: 'var(--mauve)' }}>— {SITE.ownerFullName}</p>
          </div>
        </div>
      </section>

      <PageArticleGrid
        sectionTitle={pa?.sectionTitle}
        intro={pa?.intro}
        items={pa?.items}
        pagePath="/creations-funeraires"
      />

      {/* Contact CTA sobre */}
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
