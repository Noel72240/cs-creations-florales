import { useEffect, useState } from 'react'
import { useSiteConfig } from '../context/SiteContentContext'
import { useCart } from '../context/CartContext'
import { formatEuro } from '../utils/formatEuro'
import { buildPromoCatalog, promosFromSiteBanner, validatePromoCode } from '../lib/promoCodes'
import { loadCheckoutEmail, saveCheckoutEmail, validatePromoOnServer } from '../lib/promoCheckoutApi'
import CheckoutEmailField from './CheckoutEmailField'

export default function PromoCodeForm({ compact = false }) {
  const { content } = useSiteConfig()
  const { subtotal, appliedPromo, applyPromoCode, removePromo, promoError, clearPromoError } = useCart()
  const [input, setInput] = useState(appliedPromo?.code || '')
  const [email, setEmail] = useState(() => loadCheckoutEmail())
  const [validating, setValidating] = useState(false)
  const [localError, setLocalError] = useState('')

  const banner = content?.navbar?.promoBanner
  const hintCode = (banner?.enabled && banner?.code?.trim()) || 'Bienvenuecscreationflorale10'
  const firstOrderOnly = banner?.firstOrderOnly !== false

  useEffect(() => {
    const catalog = buildPromoCatalog(promosFromSiteBanner(banner))
    try {
      const stored = sessionStorage.getItem('cs_cart_promo_v1')
      if (stored && !appliedPromo) applyPromoCode(stored, { catalog })
    } catch {
      /* ignore */
    }
  }, [banner?.code, banner?.enabled, banner?.percentOff, banner?.minSubtotal, appliedPromo, applyPromoCode])

  const displayError = localError || promoError

  const handleApply = async (e) => {
    e.preventDefault()
    clearPromoError()
    setLocalError('')
    saveCheckoutEmail(email)

    const catalog = buildPromoCatalog(promosFromSiteBanner(banner))
    const local = validatePromoCode(input, subtotal, { catalog })
    if (!local.valid) {
      applyPromoCode(input, { catalog })
      return
    }

    if (firstOrderOnly && !email.trim()) {
      setLocalError('Indiquez votre adresse e-mail : le code est limité à une utilisation par client.')
      return
    }

    setValidating(true)
    try {
      const server = await validatePromoOnServer({
        promoCode: input,
        subtotal,
        customerEmail: email.trim(),
      })
      if (!server.valid) {
        setLocalError(server.message || 'Code promo refusé.')
        removePromo()
        return
      }
      applyPromoCode(input, { catalog })
    } catch (err) {
      setLocalError(err?.message || 'Impossible de vérifier le code promo.')
      removePromo()
    } finally {
      setValidating(false)
    }
  }

  const handleRemove = () => {
    setInput('')
    setLocalError('')
    removePromo()
    clearPromoError()
  }

  if (appliedPromo) {
    return (
      <div className={`promo-code-form ${compact ? 'promo-code-form--compact' : ''}`}>
        <div
          className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-mauve-light/40 px-4 py-3"
          style={{ background: 'rgba(240, 210, 221, 0.2)' }}
        >
          <div>
            <p className="font-body text-xs uppercase tracking-wide" style={{ color: 'var(--mauve)' }}>
              Code appliqué
            </p>
            <p className="font-heading text-base" style={{ color: 'var(--violet)' }}>
              {appliedPromo.code}
            </p>
            <p className="font-body text-xs mt-0.5" style={{ color: 'var(--text-mid)' }}>
              −{formatEuro(appliedPromo.discount)} ({appliedPromo.percentOff} %)
            </p>
            {email.trim() ? (
              <p className="font-body text-[11px] mt-1" style={{ color: 'var(--text-mid)' }}>
                E-mail : {email.trim()}
              </p>
            ) : null}
          </div>
          <button type="button" className="btn-outline text-xs py-2 px-4" onClick={handleRemove}>
            Retirer
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`promo-code-form ${compact ? 'promo-code-form--compact' : ''}`}>
      <p className="font-heading text-base mb-2" style={{ color: 'var(--violet)' }}>
        Code promo
      </p>
      {firstOrderOnly ? (
        <div className="mb-3">
          <CheckoutEmailField
            id="promo-checkout-email"
            value={email}
            onChange={setEmail}
            required
          />
        </div>
      ) : null}
      <form onSubmit={handleApply} className="flex flex-col sm:flex-row gap-2">
        <label className="sr-only" htmlFor="promo-code-input">
          Code promo
        </label>
        <input
          id="promo-code-input"
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value)
            if (displayError) {
              clearPromoError()
              setLocalError('')
            }
          }}
          className="form-field flex-1 text-sm"
          placeholder={hintCode}
          autoComplete="off"
          spellCheck={false}
        />
        <button type="submit" className="btn-primary text-sm py-2.5 px-5 shrink-0" disabled={validating}>
          {validating ? 'Vérification…' : 'Appliquer'}
        </button>
      </form>
      {displayError ? (
        <p className="text-xs mt-2 rounded-lg border border-red-200 bg-red-50/90 px-3 py-2" style={{ color: '#7f1d1d' }}>
          {displayError}
        </p>
      ) : (
        <p className="font-body text-xs mt-2" style={{ color: 'var(--text-mid)', lineHeight: 1.55 }}>
          Ex. <span className="font-mono">{hintCode}</span> : {banner?.percentOff ?? 10} % dès {banner?.minSubtotal ?? 35} €.
          {firstOrderOnly ? ' Une seule utilisation par adresse e-mail.' : null}
        </p>
      )}
      {subtotal > 0 && subtotal < (banner?.minSubtotal ?? 35) ? (
        <p className="font-body text-xs mt-1" style={{ color: 'var(--mauve)' }}>
          Il vous manque {formatEuro((banner?.minSubtotal ?? 35) - subtotal)} pour utiliser ce code.
        </p>
      ) : null}
    </div>
  )
}
