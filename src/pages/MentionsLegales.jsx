import PageHeader from '../components/PageHeader'
import { useSiteConfig } from '../context/SiteContentContext'

export default function MentionsLegales() {
  const { content } = useSiteConfig()
  const SITE = content.site
  const WEB_DEV = content.webDev

  return (
    <>
      <div>
        <PageHeader title="Mentions Légales" subtitle="Informations légales" legal />
      </div>
      <section className="py-16 px-4" style={{ background: 'var(--blanc)' }}>
        <div className="max-w-3xl mx-auto prose-custom">
          <div className="space-y-8 page-legal-doc">

            <div>
              <h2>1. Éditeur du site</h2>
              <p>Le présent site est édité par l’entreprise artisanale :</p>
              <ul className="mt-3 space-y-1 pl-4 list-disc" style={{ color: 'var(--text-dark)' }}>
                <li><strong>Raison sociale :</strong> {SITE.businessName}</li>
                <li><strong>Responsable de publication :</strong> {SITE.ownerFullName}</li>
                <li><strong>Adresse :</strong> {SITE.postalCode} {SITE.city}, {SITE.region}, France</li>
                <li><strong>Email :</strong> <a href={`mailto:${SITE.email}`} style={{ color: 'var(--mauve)' }}>{SITE.email}</a></li>
                <li><strong>Téléphone :</strong> {SITE.phoneDisplay}</li>
                <li><strong>SIREN / SIRET :</strong> [À compléter par l’artisan]</li>
              </ul>
            </div>

            <div>
              <h2>2. Conception et réalisation du site</h2>
              <p>Le site a été conçu et réalisé par :</p>
              <ul className="mt-3 space-y-1 pl-4 list-disc" style={{ color: 'var(--text-dark)' }}>
                <li><strong>Contact :</strong> {WEB_DEV.contactName}</li>
                <li><strong>Entreprise :</strong> {WEB_DEV.company} ({WEB_DEV.legalForm})</li>
                <li><strong>Adresse :</strong> {WEB_DEV.addressLine}, {WEB_DEV.postalCode} {WEB_DEV.city}</li>
                <li><strong>SIRET :</strong> {WEB_DEV.siret}</li>
                <li><strong>Téléphone :</strong> <a href={WEB_DEV.phoneHref} style={{ color: 'var(--mauve)' }}>{WEB_DEV.phoneDisplay}</a></li>
                <li><strong>Email :</strong> <a href={`mailto:${WEB_DEV.email}`} style={{ color: 'var(--mauve)' }}>{WEB_DEV.email}</a></li>
              </ul>
            </div>

            <div>
              <h2>3. Hébergeur</h2>
              <ul className="mt-3 space-y-1 pl-4 list-disc" style={{ color: 'var(--text-dark)' }}>
                <li><strong>Hébergeur :</strong> [Nom de l'hébergeur à compléter]</li>
                <li><strong>Adresse :</strong> [Adresse de l'hébergeur]</li>
                <li><strong>Site web :</strong> [URL de l'hébergeur]</li>
              </ul>
            </div>

            <div>
              <h2>4. Propriété intellectuelle</h2>
              <p>
                L'ensemble du contenu de ce site (textes, images, logos, compositions, photographies) est la propriété exclusive de {SITE.ownerFullName} — {SITE.businessName}, sauf mention contraire. Toute reproduction, représentation, modification ou exploitation, totale ou partielle, de ce contenu est interdite sans autorisation préalable écrite.
              </p>
            </div>

            <div>
              <h2>5. Responsabilité</h2>
              <p>
                L'éditeur s'efforce de maintenir les informations du site à jour et exactes, mais ne peut garantir leur exhaustivité ni leur exactitude absolue. En aucun cas, l'éditeur ne saurait être tenu responsable des dommages directs ou indirects résultant de l'utilisation de ce site.
              </p>
            </div>

            <div>
              <h2>6. Liens externes</h2>
              <p>
                Ce site peut contenir des liens vers des sites tiers. L'éditeur n'exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu.
              </p>
            </div>

            <div>
              <h2>7. Droit applicable</h2>
              <p>
                Le présent site est soumis au droit français. Tout litige relatif à son utilisation sera soumis à la compétence des tribunaux français.
              </p>
            </div>

          </div>
        </div>
      </section>
    </>
  )
}
