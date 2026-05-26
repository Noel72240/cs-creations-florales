import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import CartTotals from '../components/CartTotals'
import MaintenancePaymentNotice from '../components/MaintenancePaymentNotice'
import PromoCodeForm from '../components/PromoCodeForm'
import { buildCartPrefillMessage, useCart } from '../context/CartContext'
import { useSumupCartCheckout } from '../hooks/useSumupCartCheckout'
import { formatEuro } from '../utils/formatEuro'
import { P, w1200 } from '../data/flowerPhotos'

export default function Panier() {
  const { items, itemCount, subtotal, total, appliedPromo, promoError, setQuantity, removeItem, clearCart } = useCart()
  const { pay, busy, error, paymentsBlocked } = useSumupCartCheckout()

  const contactState = useMemo(
    () => ({
      prefillSujet: 'Commande (panier)',
      prefillMessage: buildCartPrefillMessage(items, appliedPromo, subtotal, total),
    }),
    [items, appliedPromo, subtotal, total],
  )

  const startCheckout = () => {
    pay(items, { promoCode: appliedPromo?.code })
  }

  return (
    <>
      <PageHeader
        title="Panier"
        subtitle={itemCount > 0 ? `${itemCount} article${itemCount > 1 ? 's' : ''}` : 'Votre sélection'}
        image={w1200(P.bouquetSoft)}
      />

      <section className="py-14 px-4" style={{ background: 'var(--blanc)' }}>
        <div className="max-w-3xl mx-auto">
          {items.length === 0 ? (
            <div className="text-center py-12 px-4 rounded-2xl border border-mauve-light/35" style={{ background: 'rgba(240,210,221,0.1)' }}>
              <p className="font-heading text-2xl mb-3" style={{ color: 'var(--violet)' }}>
                Votre panier est vide
              </p>
              <p className="font-body text-sm mb-8" style={{ color: 'var(--text-mid)', lineHeight: 1.75 }}>
                Parcourez les créations et utilisez le bouton « Ajouter au panier » sur les fiches concernées.
                Les compositions sur mesure pourront être validées par devis après contact.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link to="/evenements-floraux" className="btn-primary text-sm py-2.5 px-6">
                  Événements floraux
                </Link>
                <Link to="/creations-florales" className="btn-outline text-sm py-2.5 px-6">
                  Créations florales
                </Link>
              </div>
            </div>
          ) : (
            <>
              <ul className="space-y-4 mb-10">
                {items.map((line) => (
                  <li
                    key={line.id}
                    className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-2xl border border-mauve-light/30"
                    style={{ background: 'rgba(255,255,255,0.95)' }}
                  >
                    <div className="flex-1 min-w-0">
                      {line.path ? (
                        <Link to={line.path} className="font-heading text-lg hover:text-mauve transition-colors" style={{ color: 'var(--violet)' }}>
                          {line.title}
                        </Link>
                      ) : (
                        <p className="font-heading text-lg" style={{ color: 'var(--violet)' }}>{line.title}</p>
                      )}
                      {line.selectedColor ? (
                        <p className="font-body text-xs mt-1" style={{ color: 'var(--text-mid)' }}>
                          Couleur :{' '}
                          <span
                            className="inline-block align-middle h-3.5 w-3.5 rounded-full border border-mauve-light/40 mr-1"
                            style={{ background: line.selectedColor }}
                            aria-hidden="true"
                          />
                          <span className="font-mono">{line.selectedColor}</span>
                        </p>
                      ) : null}
                      <p className="font-body text-sm mt-1" style={{ color: 'var(--text-mid)' }}>
                        {formatEuro(line.price)} <span className="opacity-75">/ unité</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <label className="flex items-center gap-2 font-body text-sm" style={{ color: 'var(--text-dark)' }}>
                        <span className="sr-only">Quantité</span>
                        <input
                          type="number"
                          min={1}
                          max={99}
                          value={line.quantity}
                          onChange={(e) => setQuantity(line.id, e.target.value)}
                          className="form-field w-16 py-2 px-2 text-center text-sm"
                        />
                      </label>
                      <p className="font-heading w-24 text-right" style={{ color: 'var(--mauve)' }}>
                        {formatEuro(line.price * line.quantity)}
                      </p>
                      <button
                        type="button"
                        className="p-2 rounded-lg text-xs font-body hover:bg-mauve-pale transition-colors"
                        style={{ color: 'var(--text-mid)' }}
                        onClick={() => removeItem(line.id)}
                        aria-label={`Retirer ${line.title}`}
                      >
                        Retirer
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              <div
                className="rounded-2xl border border-mauve-light/40 p-6 sm:p-8 mb-8"
                style={{ background: 'rgba(240,210,221,0.12)' }}
              >
                <MaintenancePaymentNotice />
                <CartTotals size="large" />
                {!paymentsBlocked ? (
                  <div className="mt-6 mb-6">
                    <PromoCodeForm />
                  </div>
                ) : null}
                <p className="font-body text-xs mb-6" style={{ color: 'var(--text-mid)', lineHeight: 1.65 }}>
                  Montant indicatif : la commande florale est souvent personnalisée (couleurs, taille, date). Ce total sera
                  confirmé par devis. Les créations sur mesure ne sont pas définitives tant que nous ne nous sommes pas accordés par écrit.
                </p>
                {error ? (
                  <p className="text-sm rounded-xl border border-red-200 bg-red-50/90 px-4 py-3 mb-4" style={{ color: '#7f1d1d' }}>
                    {error}
                    <span className="block mt-1 text-xs opacity-90">
                      En développement, lancez <code className="font-mono">npm run dev:vercel</code> (ou proxy{' '}
                      <code className="font-mono">VITE_DEV_API_PROXY</code> vers votre API — voir .env.example).
                    </span>
                  </p>
                ) : null}
                <div className="flex flex-col sm:flex-row flex-wrap gap-3">
                  <Link
                    to="/contact"
                    state={contactState}
                    className="btn-primary text-center text-sm py-3 px-6"
                  >
                    Demander un devis avec ce panier
                  </Link>
                  <button
                    type="button"
                    disabled={busy || Boolean(promoError) || paymentsBlocked}
                    className="btn-primary text-center text-sm py-3 px-6 disabled:opacity-60"
                    onClick={startCheckout}
                    title={paymentsBlocked ? 'Paiements suspendus (maintenance)' : undefined}
                  >
                    {paymentsBlocked
                      ? 'Paiement en ligne indisponible'
                      : busy
                        ? 'Redirection vers SumUp…'
                        : 'Payer en ligne (carte bancaire)'}
                  </button>
                  {!paymentsBlocked ? (
                    <Link to="/paiement" className="btn-outline text-center text-sm py-3 px-6">
                      Page paiement (lien manuel)
                    </Link>
                  ) : null}
                  <button type="button" className="text-sm font-body underline py-2 px-2" style={{ color: 'var(--text-mid)' }} onClick={() => clearCart()}>
                    Vider le panier
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  )
}
