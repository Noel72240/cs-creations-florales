import BrandName from '../components/BrandName'
import PageHeader from '../components/PageHeader'
import { TVA_MICRO_ENTREPRISE_NOTICE } from '../config/siteUrl'
import { useSiteConfig } from '../context/SiteContentContext'

export default function CGV() {
  const { content } = useSiteConfig()
  const SITE = content.site

  return (
    <>
      <div>
        <PageHeader title="Conditions Générales de Vente" subtitle="Informations contractuelles" legal />
      </div>
      <section className="py-16 px-4" style={{ background: 'var(--blanc)' }}>
        <div className="max-w-3xl mx-auto page-legal-doc space-y-8">

          <div>
            <h2>1. Identification du vendeur</h2>
            <p>
              <strong style={{ color: 'var(--text-dark)' }}>
                {SITE.ownerFullName} — <BrandName>{SITE.businessName}</BrandName>
              </strong>
              <br />
              {SITE.postalCode} {SITE.city}, {SITE.region} — {SITE.email}<br />
              Forme juridique : {SITE.legalForm || 'Micro-entreprise'}<br />
              SIREN / SIRET : {SITE.siret?.trim() || '—'}
            </p>
          </div>

          <div>
            <h2>2. Objet</h2>
            <p>
              Les présentes Conditions Générales de Vente (CGV) régissent les relations entre{' '}
              <BrandName>{SITE.businessName}</BrandName> et ses clients dans le cadre de la vente de
              compositions florales, créations décoratives et prestations de personnalisation.
            </p>
          </div>

          <div>
            <h2>3. Commandes</h2>
            <p>
              Toute commande est formalisée après échange avec la créatrice (via le formulaire de contact, par email ou par téléphone), validation du devis par le client, et versement d'un acompte si applicable. La commande est considérée comme définitive à réception de la confirmation écrite.
            </p>
          </div>

          <div>
            <h2>4. Prix</h2>
            <p>
              Les prix sont indiqués en euros TTC. {TVA_MICRO_ENTREPRISE_NOTICE} Les tarifs peuvent varier selon la
              complexité de la création, les fleurs choisies et la période. Un devis personnalisé est établi gratuitement
              sur demande.
            </p>
          </div>

          <div>
            <h2>5. Paiement</h2>
            <p>Les moyens de paiement acceptés sont les suivants :</p>
            <ul className="mt-3 space-y-1 pl-4 list-disc" style={{ color: 'var(--text-dark)' }}>
              <li>
                <strong>Carte bancaire (Carte Bleue / CB)</strong> — paiement sécurisé via <strong>SumUp</strong> : sur place
                (terminal) lors du retrait ou de la remise de la commande, ou <strong>en ligne</strong> via la page « Paiement »
                du site (page hébergée SumUp, cartes CB, Visa et Mastercard acceptées).
              </li>
              <li>Espèces (remise en main propre, dans la limite des plafonds légaux)</li>
            </ul>
            <p className="mt-3">
              Les données de carte bancaire sont saisies uniquement sur l’interface de paiement SumUp ; elles ne transitent pas par
              le serveur de ce site.
            </p>
            <p className="mt-3">
              Un acompte de 30 à 50 % peut être demandé à la commande pour les créations sur mesure importantes (mariages, événements). Le solde est réglé à la livraison ou au retrait.
            </p>
          </div>

          <div>
            <h2>6. Livraison & retrait</h2>
            <p>
              Les créations peuvent être retirées directement à Écommoy (72220) sur rendez-vous. Une livraison peut être proposée dans un rayon limité — nous contacter pour les modalités et tarifs.
            </p>
          </div>

          <div>
            <h2>7. Annulation & rétractation</h2>
            <p>
              Les commandes de fleurs fraîches étant des produits périssables, elles ne peuvent être ni retournées ni remboursées une fois réalisées. En cas d'annulation avant réalisation, l'acompte versé pourra être retenu selon l'avancement des commandes de fleurs. Pour les créations sèches ou personnalisées, l'annulation doit être communiquée au moins 7 jours ouvrés avant la date de remise.
            </p>
          </div>

          <div>
            <h2>8. Litiges</h2>
            <p>
              En cas de litige, une solution amiable sera recherchée en priorité. À défaut, le litige sera soumis aux tribunaux compétents du ressort du siège de l'entreprise, sauf disposition légale contraire.
            </p>
          </div>

          <div>
            <h2>9. Contact client</h2>
            <p>
              Pour toute question relative à une commande : <a href={`mailto:${SITE.email}`} style={{ color: 'var(--mauve)' }}>{SITE.email}</a> ou au {SITE.phoneDisplay}.
            </p>
          </div>

        </div>
      </section>
    </>
  )
}
