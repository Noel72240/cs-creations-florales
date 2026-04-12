import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import { useSiteConfig } from '../context/SiteContentContext'
import { P, w1200 } from '../data/flowerPhotos'

export default function Paiement() {
  const { content, sumupUrl } = useSiteConfig()
  const SITE = content.site
  const hasSumUpLink = Boolean(sumupUrl)

  return (
    <>
      <PageHeader
        title="Paiement en ligne"
        subtitle="Régler votre commande en toute sécurité avec SumUp"
        image={w1200(P.bouquetSoft)}
      />

      <section className="py-16 px-4" style={{ background: 'var(--blanc)' }}>
        <div className="max-w-3xl mx-auto space-y-10 font-body text-sm" style={{ color: 'var(--text-mid)', lineHeight: '1.85' }}>
          <div className="rounded-2xl border border-mauve-light/40 p-6 sm:p-8" style={{ background: 'rgba(240,210,221,0.12)' }}>
            <h2 className="font-heading text-2xl mb-4" style={{ color: 'var(--violet)' }}>
              Paiement sécurisé par carte bancaire
            </h2>
            <p>
              Après validation de votre devis avec <strong style={{ color: 'var(--text-dark)' }}>{SITE.ownerFullName}</strong>, vous pouvez
              régler par carte bancaire (CB, Visa, Mastercard) sur une page de paiement hébergée par{' '}
              <strong>SumUp</strong>, conforme aux standards de sécurité (dont 3-D Secure lorsque votre banque l’exige).
            </p>
            <p className="mt-4">
              Le montant affiché sur le lien correspond au devis ou à l’acompte convenu ensemble. Si vous avez un doute sur
              le montant à payer, contactez-nous avant de valider le paiement.
            </p>
          </div>

          {hasSumUpLink ? (
            <div className="text-center py-4">
              <a
                href={sumupUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center justify-center gap-2 px-8 py-4 text-base"
              >
                Payer avec SumUp
                <span aria-hidden="true">↗</span>
              </a>
              <p className="mt-4 text-xs" style={{ color: 'var(--text-mid)' }}>
                Vous serez redirigé vers la page sécurisée SumUp pour saisir votre carte.
              </p>
            </div>
          ) : (
            <div
              className="rounded-xl border border-dashed p-6 text-center"
              style={{ borderColor: 'var(--lavande)', color: 'var(--text-mid)' }}
            >
              <p className="font-heading text-lg mb-2" style={{ color: 'var(--violet)' }}>
                Lien de paiement en cours de configuration
              </p>
              <p className="text-sm mb-4">
                Le bouton de paiement apparaîtra ici dès qu’un lien SumUp (lien de paiement) sera renseigné sur le site.
                En attendant, vous pouvez régler sur place (terminal SumUp), par virement ou par chèque selon nos échanges.
              </p>
              <Link to="/contact" className="btn-outline inline-block text-sm py-2.5 px-6">
                Nous contacter
              </Link>
            </div>
          )}

          <div>
            <h3 className="font-heading text-xl mb-3" style={{ color: 'var(--violet)' }}>
              Autres moyens de paiement
            </h3>
            <ul className="space-y-2 pl-4 list-disc" style={{ color: 'var(--text-dark)' }}>
              <li>Terminal SumUp (carte bancaire) lors d’un rendez-vous ou au retrait</li>
              <li>Virement bancaire</li>
              <li>Chèque à l’ordre de {SITE.ownerFullName}</li>
              <li>Espèces (remise en main propre, dans la limite des plafonds légaux)</li>
            </ul>
            <p className="mt-4 text-xs">
              Détails contractuels :{' '}
              <Link to="/cgv" className="underline hover:text-mauve transition-colors">
                conditions générales de vente
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
