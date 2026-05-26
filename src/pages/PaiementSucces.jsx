import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import { useCart } from '../context/CartContext'
import { markPromoCodeUsed } from '../lib/promoCodes'
import { P, w1200 } from '../data/flowerPhotos'

export default function PaiementSucces() {
  const [params] = useSearchParams()
  const ref = params.get('ref')
  const { appliedPromo, removePromo } = useCart()

  useEffect(() => {
    if (appliedPromo?.code) {
      markPromoCodeUsed(appliedPromo.code)
      removePromo()
    }
  }, [appliedPromo?.code, removePromo])

  return (
    <>
      <PageHeader
        title="Paiement SumUp"
        subtitle="Retour depuis la page sécurisée"
        image={w1200(P.bouquetSoft)}
      />
      <section className="py-16 px-4" style={{ background: 'var(--blanc)' }}>
        <div className="max-w-2xl mx-auto text-center space-y-6 font-body text-sm" style={{ color: 'var(--text-mid)', lineHeight: 1.85 }}>
          <p className="font-heading text-2xl" style={{ color: 'var(--violet)' }}>
            Merci pour votre retour
          </p>
          <p>
            Si votre paiement a été <strong>accepté</strong> par SumUp, la transaction est en cours de traitement côté
            banque. Vous recevrez une confirmation de SumUp par e-mail si vous avez saisi une adresse sur leur page.
          </p>
          <p>
            Pour toute question sur votre commande florale (délais, retrait, personnalisation), contactez-nous en
            indiquant votre référence si vous l’avez notée.
          </p>
          {ref ? (
            <p className="font-mono text-xs break-all rounded-xl border border-mauve-light/40 px-4 py-3" style={{ color: 'var(--text-dark)' }}>
              Référence commande : {ref}
            </p>
          ) : null}
          <div className="flex flex-wrap gap-3 justify-center pt-4">
            <Link to="/" className="btn-primary text-sm py-2.5 px-6">
              Accueil
            </Link>
            <Link to="/contact" className="btn-outline text-sm py-2.5 px-6">
              Nous contacter
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
