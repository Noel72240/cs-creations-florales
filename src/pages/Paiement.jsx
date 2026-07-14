import { useState, useMemo } from 'react'
import ConfigurablePageHeader from '../components/ConfigurablePageHeader'
import CartTotals from '../components/CartTotals'
import MaintenancePaymentNotice from '../components/MaintenancePaymentNotice'
import PromoCodeForm from '../components/PromoCodeForm'
import CheckoutDeliverySection from '../components/CheckoutDeliverySection'
import SecurePaymentNotice, { AcceptedPaymentMethodsList, SumupPaymentMethodsStrip } from '../components/SecurePaymentNotice'
import { useSiteConfig } from '../context/SiteContentContext'
import { getMaintenanceState } from '../lib/maintenance'
import { useCart } from '../context/CartContext'
import { useSumupCartCheckout } from '../hooks/useSumupCartCheckout'
import {
  loadCheckoutPhone,
  loadCheckoutRelayPoint,
  loadCheckoutShippingMethod,
  saveCheckoutPhone,
  saveCheckoutRelayPoint,
  saveCheckoutShippingMethod,
} from '../lib/checkoutShipping'
import {
  loadCheckoutCustomerName,
  loadCheckoutEmail,
  saveCheckoutCustomerName,
  saveCheckoutEmail,
} from '../lib/promoCheckoutApi'
import { Link } from 'react-router-dom'
import { validateShippingCheckout, computeShippingFee, resolveCartParcelTier, parcelTierLabel, getRelayShippingFee } from '../../shared/shipping.js'
import { P, w1200 } from '../data/flowerPhotos'

export default function Paiement() {
  const { content, sumupUrl } = useSiteConfig()
  const { items, appliedPromo, promoError } = useCart()
  const { pay, busy, error, paymentsBlocked } = useSumupCartCheckout()
  const [checkoutEmail, setCheckoutEmail] = useState(() => loadCheckoutEmail())
  const [checkoutName, setCheckoutName] = useState(() => loadCheckoutCustomerName())
  const [checkoutPhone, setCheckoutPhone] = useState(() => loadCheckoutPhone())
  const [shippingMethod, setShippingMethod] = useState(() => loadCheckoutShippingMethod())
  const [relayPoint, setRelayPoint] = useState(() => loadCheckoutRelayPoint())
  const [checkoutError, setCheckoutError] = useState('')
  const maintenance = getMaintenanceState(content)

  const cartParcelTier = useMemo(() => resolveCartParcelTier(items), [items])
  const relayShippingFee = useMemo(() => getRelayShippingFee(cartParcelTier), [cartParcelTier])
  const shippingFee = useMemo(
    () => computeShippingFee(shippingMethod, items),
    [shippingMethod, items],
  )
  const shippingNote =
    shippingFee > 0 ? `Format colis : ${parcelTierLabel(cartParcelTier)} (selon vos articles)` : ''

  const startCheckout = () => {
    setCheckoutError('')
    const email = checkoutEmail.trim()
    const name = checkoutName.trim()
    if (!name) {
      setCheckoutError('Indiquez votre nom et prénom.')
      return
    }
    if (!email) {
      setCheckoutError('Indiquez votre e-mail.')
      return
    }
    const shipping = validateShippingCheckout({
      shippingMethod,
      customerPhone: checkoutPhone,
      relayPoint,
    })
    if (!shipping.valid) {
      setCheckoutError(
        shipping.errors.relayPoint ||
          shipping.errors.customerPhone ||
          shipping.errors.shippingMethod ||
          'Informations de livraison incomplètes.',
      )
      return
    }
    saveCheckoutEmail(email)
    saveCheckoutCustomerName(name)
    saveCheckoutPhone(checkoutPhone)
    saveCheckoutShippingMethod(shipping.shippingMethod)
    saveCheckoutRelayPoint(shipping.relayPoint)
    pay(items, {
      promoCode: appliedPromo?.code,
      customerEmail: email,
      customerName: name,
      customerPhone: checkoutPhone,
      shippingMethod: shipping.shippingMethod,
      relayPoint: shipping.relayPoint,
    })
  }
  const SITE = content.site
  const hasSumUpLink = Boolean(sumupUrl)
  const hasCart = items.length > 0

  return (
    <>
      <ConfigurablePageHeader
        pagePath="/paiement"
        fallback={{
          title: 'Paiement en ligne',
          subtitle: 'Paiement sécurisé en ligne — SumUp (CB, Visa, Mastercard)',
          photoKey: 'bouquetSoft',
          image: w1200(P.bouquetSoft),
        }}
      />

      <section className="py-16 px-4" style={{ background: 'var(--blanc)' }}>
        <div className="max-w-3xl mx-auto space-y-10 font-body text-sm" style={{ color: 'var(--text-mid)', lineHeight: '1.85' }}>
          <MaintenancePaymentNotice />

          <div className="rounded-2xl border border-mauve-light/40 p-6 sm:p-8" style={{ background: 'rgba(240,210,221,0.12)' }}>
            <h2 className="font-heading text-2xl mb-4" style={{ color: 'var(--violet)' }}>
              Paiement sécurisé par carte bancaire
            </h2>
            <p>
              Après validation de votre devis avec <strong style={{ color: 'var(--text-dark)' }}>{SITE.ownerFullName}</strong>, vous
              pouvez régler en ligne sur une page de paiement hébergée par <strong>SumUp</strong>, conforme aux standards de
              sécurité (dont 3-D Secure lorsque votre banque l’exige).
            </p>
            <SecurePaymentNotice className="mt-4" />
            <p className="mt-4">
              Le montant affiché correspond au total de votre panier sur le site ou au lien de paiement manuel. En cas de doute,
              contactez-nous avant de valider.
            </p>
          </div>

          {hasCart ? (
            <div
              className="rounded-2xl border border-mauve-light/40 p-6 sm:p-8"
              style={{ background: 'rgba(255,255,255,0.95)' }}
            >
              <h3 className="font-heading text-xl mb-2" style={{ color: 'var(--violet)' }}>
                Payer votre panier actuel
              </h3>
              <div className="mb-4">
                <CartTotals shippingFee={shippingFee} shippingNote={shippingNote} />
              </div>
              {!paymentsBlocked ? (
                <div className="mb-6">
                  <PromoCodeForm />
                </div>
              ) : null}
              {!paymentsBlocked ? (
                <div className="mb-6">
                  <CheckoutDeliverySection
                    name={checkoutName}
                    email={checkoutEmail}
                    phone={checkoutPhone}
                    shippingMethod={shippingMethod}
                    relayPoint={relayPoint}
                    parcelTier={cartParcelTier}
                    relayShippingFee={relayShippingFee}
                    onNameChange={setCheckoutName}
                    onEmailChange={setCheckoutEmail}
                    onPhoneChange={setCheckoutPhone}
                    onShippingMethodChange={setShippingMethod}
                    onRelayPointChange={(point) => {
                      setRelayPoint(point)
                      saveCheckoutRelayPoint(point)
                    }}
                    idPrefix="paiement"
                  />
                </div>
              ) : null}
              {checkoutError ? (
                <p className="text-xs mb-4 rounded-lg border border-red-200 bg-red-50/90 px-3 py-2" style={{ color: '#7f1d1d' }}>
                  {checkoutError}
                </p>
              ) : null}
              <p className="mb-4 text-xs" style={{ color: 'var(--text-mid)' }}>
                Le montant envoyé à SumUp inclut la réduction si un code valide est appliqué. Aucune donnée de carte ne transite par ce site.
              </p>
              {error ? (
                <p className="text-sm rounded-xl border border-red-200 bg-red-50/90 px-4 py-3 mb-4" style={{ color: '#7f1d1d' }}>
                  {error}
                </p>
              ) : null}
              <button
                type="button"
                disabled={busy || Boolean(promoError) || paymentsBlocked}
                className="btn-primary w-full sm:w-auto text-center text-sm py-3 px-8 disabled:opacity-60"
                onClick={startCheckout}
              >
                {paymentsBlocked
                  ? 'Paiement en ligne indisponible'
                  : busy
                    ? 'Redirection vers SumUp…'
                    : 'Continuer vers SumUp avec le panier'}
              </button>
              <p className="mt-3 text-xs">
                <Link to="/panier" className="underline" style={{ color: 'var(--violet)' }}>
                  Modifier le panier
                </Link>
              </p>
            </div>
          ) : null}

          {hasSumUpLink && !maintenance.active ? (
            <div className="text-center py-4">
              <p className="font-body text-sm mb-4" style={{ color: 'var(--text-mid)' }}>
                Paiement d’un montant convenu par devis (sans panier sur le site) :
              </p>
              <a
                href={sumupUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline inline-flex items-center justify-center gap-2 px-8 py-4 text-base"
              >
                Ouvrir le lien de paiement SumUp
                <span aria-hidden="true">↗</span>
              </a>
              <p className="mt-4 text-xs" style={{ color: 'var(--text-mid)' }}>
                Lien configuré dans l’admin ou les variables d’environnement.
              </p>
            </div>
          ) : hasSumUpLink && maintenance.active ? (
            <p className="text-center text-sm rounded-xl border border-amber-500/40 px-4 py-3" style={{ color: '#92400e', background: 'rgba(251, 191, 36, 0.1)' }}>
              Le lien de paiement SumUp manuel est masqué pendant la maintenance.
            </p>
          ) : !hasCart ? (
            <div
              className="rounded-xl border border-dashed p-6 text-center"
              style={{ borderColor: 'var(--lavande)', color: 'var(--text-mid)' }}
            >
              <p className="font-heading text-lg mb-2" style={{ color: 'var(--violet)' }}>
                Aucun panier ni lien manuel configuré
              </p>
              <p className="text-sm mb-4">
                Ajoutez des articles au panier pour un paiement automatique, ou configurez un lien SumUp (admin /{' '}
                <code className="font-mono text-xs">VITE_SUMUP_PAYMENT_URL</code>).
              </p>
              <Link to="/contact" className="btn-outline inline-block text-sm py-2.5 px-6">
                Nous contacter
              </Link>
            </div>
          ) : null}

          <div>
            <h3 className="font-heading text-xl mb-3" style={{ color: 'var(--violet)' }}>
              Moyens de paiement acceptés
            </h3>
            <div className="flex justify-center mb-6">
              <SumupPaymentMethodsStrip />
            </div>
            {hasCart && !paymentsBlocked ? (
              <div
                className="rounded-xl border border-mauve-light/35 p-5 mb-6"
                style={{ background: 'rgba(255, 255, 255, 0.85)' }}
              >
                <p className="font-body text-xs mb-3" style={{ color: 'var(--text-mid)', lineHeight: 1.65 }}>
                  Pour le <strong>paiement en ligne par carte</strong>, saisissez votre code promo ci-dessous : la réduction
                  est calculée automatiquement sur le total du panier.
                </p>
                <PromoCodeForm compact />
              </div>
            ) : null}
            <AcceptedPaymentMethodsList />
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
