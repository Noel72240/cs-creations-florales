import PageHeader from '../components/PageHeader'
import { useSiteConfig } from '../context/SiteContentContext'

export default function PolitiqueConfidentialite() {
  const { content } = useSiteConfig()
  const SITE = content.site

  return (
    <>
      <div>
        <PageHeader title="Politique de Confidentialité" subtitle="RGPD & données personnelles" legal />
      </div>
      <section className="py-16 px-4" style={{ background: 'var(--blanc)' }}>
        <div className="max-w-3xl mx-auto page-legal-doc space-y-8">

          <div>
            <h2>1. Responsable du traitement</h2>
            <p>
              Le responsable du traitement des données personnelles collectées sur ce site est : <br />
              <strong style={{ color: 'var(--text-dark)' }}>{SITE.ownerFullName} — {SITE.businessName}</strong><br />
              {SITE.postalCode} {SITE.city}, {SITE.region} — {SITE.email}
            </p>
          </div>

          <div>
            <h2>2. Données collectées</h2>
            <p>Dans le cadre de l'utilisation de ce site, les données suivantes peuvent être collectées :</p>
            <ul className="mt-3 space-y-1 pl-4 list-disc" style={{ color: 'var(--text-dark)' }}>
              <li>Nom et prénom</li>
              <li>Adresse email</li>
              <li>Numéro de téléphone</li>
              <li>Contenu du message (demande de devis, question)</li>
              <li>Données de navigation (cookies, adresse IP) — avec votre consentement</li>
            </ul>
          </div>

          <div>
            <h2>3. Finalités du traitement</h2>
            <ul className="mt-3 space-y-1 pl-4 list-disc" style={{ color: 'var(--text-dark)' }}>
              <li>Traitement de vos demandes de contact et de devis</li>
              <li>Réponse à vos questions et demandes d'informations</li>
              <li>Amélioration de l'expérience utilisateur du site (avec consentement)</li>
            </ul>
          </div>

          <div>
            <h2>4. Base légale</h2>
            <p>
              Le traitement de vos données repose sur votre consentement explicite (formulaire de contact, bandeau cookies) et sur l'intérêt légitime de l'entreprise pour répondre à vos demandes commerciales.
            </p>
          </div>

          <div>
            <h2>5. Durée de conservation</h2>
            <p>
              Vos données personnelles sont conservées pendant une durée maximale de <strong>3 ans</strong> à compter de votre dernier contact, puis supprimées ou anonymisées.
            </p>
          </div>

          <div>
            <h2>6. Destinataires des données</h2>
            <p>
              Vos données ne sont pas transmises à des tiers à des fins commerciales. Elles peuvent être communiquées uniquement aux prestataires techniques (hébergement, messagerie) dans le cadre strict de l'exécution de leurs services.
            </p>
          </div>

          <div>
            <h2>7. Vos droits</h2>
            <p>Conformément au RGPD (Règlement Général sur la Protection des Données), vous disposez des droits suivants :</p>
            <ul className="mt-3 space-y-1 pl-4 list-disc" style={{ color: 'var(--text-dark)' }}>
              <li><strong>Droit d'accès</strong> : obtenir une copie de vos données</li>
              <li><strong>Droit de rectification</strong> : corriger des données inexactes</li>
              <li><strong>Droit à l'effacement</strong> : demander la suppression de vos données</li>
              <li><strong>Droit d'opposition</strong> : vous opposer au traitement de vos données</li>
              <li><strong>Droit à la portabilité</strong> : recevoir vos données dans un format structuré</li>
            </ul>
            <p className="mt-4">
              Pour exercer ces droits, contactez-nous à : <a href={`mailto:${SITE.email}`} style={{ color: 'var(--mauve)' }}>{SITE.email}</a>
            </p>
            <p className="mt-2">
              En cas de réclamation, vous pouvez également contacter la CNIL : <a href="https://www.cnil.fr" target="_blank" rel="noreferrer" style={{ color: 'var(--mauve)' }}>www.cnil.fr</a>
            </p>
          </div>

          <div>
            <h2>8. Cookies</h2>
            <p>
              Ce site utilise des cookies. À votre première visite, un bandeau vous permet d’accepter, de refuser ou de personnaliser les cookies optionnels. Vous pouvez <strong>modifier votre choix à tout moment</strong> via le lien « Gérer les cookies » en bas de chaque page (pied de page).
            </p>
          </div>

        </div>
      </section>
    </>
  )
}
