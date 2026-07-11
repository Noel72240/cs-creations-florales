import {
  SHIPPING_METHOD_MONDIAL_RELAY,
  SHIPPING_METHOD_OPTIONS,
  SHIPPING_METHOD_PICKUP,
} from '../../shared/shipping.js'
import {
  saveCheckoutCustomerName,
} from '../lib/promoCheckoutApi'
import {
  isMondialRelayWidgetEnabled,
  saveCheckoutPhone,
  saveCheckoutRelayPoint,
  saveCheckoutShippingMethod,
} from '../lib/checkoutShipping'
import CheckoutEmailField from './CheckoutEmailField'
import MondialRelayPicker from './MondialRelayPicker'
import { formatEuro } from '../utils/formatEuro'

/**
 * Coordonnées client + choix livraison (Point Relais) ou récupération main à main.
 */
export default function CheckoutDeliverySection({
  name,
  email,
  phone,
  shippingMethod,
  relayPoint,
  parcelTier,
  relayShippingFee = 0,
  onNameChange,
  onEmailChange,
  onPhoneChange,
  onShippingMethodChange,
  onRelayPointChange,
  errors = {},
  idPrefix = 'checkout',
}) {
  const widgetReady = isMondialRelayWidgetEnabled()

  const setShippingMethod = (method) => {
    onShippingMethodChange?.(method)
    saveCheckoutShippingMethod(method)
    if (method !== SHIPPING_METHOD_MONDIAL_RELAY) {
      onRelayPointChange?.(null)
      saveCheckoutRelayPoint(null)
    }
  }

  return (
    <div className="space-y-4 rounded-xl border border-mauve-light/35 p-4" style={{ background: 'rgba(255,248,251,0.7)' }}>
      <p className="text-xs font-medium" style={{ color: 'var(--violet)' }}>
        Livraison ou récupération
      </p>

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium mb-1" style={{ color: 'var(--violet)' }}>
          Comment souhaitez-vous recevoir votre commande ? *
        </legend>
        {!shippingMethod ? (
          <p className="text-[11px] mb-1" style={{ color: 'var(--text-mid)' }}>
            Sélectionnez une option ci-dessous avant de payer.
          </p>
        ) : null}
        {SHIPPING_METHOD_OPTIONS.map((opt) => {
          const disabled = opt.id === SHIPPING_METHOD_MONDIAL_RELAY && !widgetReady
          const feeText =
            opt.id === SHIPPING_METHOD_PICKUP
              ? opt.feeLabel
              : relayShippingFee > 0
                ? formatEuro(relayShippingFee)
                : null
          return (
            <label
              key={opt.id}
              className={`flex gap-3 rounded-lg border px-3 py-2.5 cursor-pointer text-xs ${
                disabled ? 'opacity-55 cursor-not-allowed' : ''
              }`}
              style={{
                borderColor:
                  shippingMethod === opt.id ? 'var(--mauve)' : 'rgba(212,180,200,0.35)',
                background: shippingMethod === opt.id ? 'rgba(240,210,221,0.25)' : 'rgba(255,255,255,0.55)',
              }}
            >
              <input
                type="radio"
                name={`${idPrefix}-shipping`}
                value={opt.id}
                checked={shippingMethod === opt.id}
                disabled={disabled}
                onChange={() => setShippingMethod(opt.id)}
                className="mt-0.5 shrink-0"
              />
              <span className="flex-1 min-w-0">
                <span className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
                  <span className="font-medium" style={{ color: 'var(--violet)' }}>
                    {opt.label}
                    {disabled ? ' (bientôt)' : ''}
                  </span>
                  {feeText && !disabled ? (
                    <span className="font-medium shrink-0" style={{ color: 'var(--mauve)' }}>
                      {feeText}
                    </span>
                  ) : null}
                </span>
                <span className="block mt-0.5" style={{ color: 'var(--text-mid)' }}>
                  {opt.description}
                </span>
              </span>
            </label>
          )
        })}
        {errors.shippingMethod ? (
          <p className="text-xs" style={{ color: '#b42318' }}>
            {errors.shippingMethod}
          </p>
        ) : null}
      </fieldset>

      {shippingMethod === SHIPPING_METHOD_MONDIAL_RELAY && widgetReady ? (
        <div>
          <MondialRelayPicker
            value={relayPoint}
            onChange={onRelayPointChange}
            defaultPostcode="72220"
            parcelTier={parcelTier}
          />
          {errors.relayPoint ? (
            <p className="text-xs mt-2" style={{ color: '#b42318' }}>
              {errors.relayPoint}
            </p>
          ) : null}
        </div>
      ) : null}

      <label className="block">
        <span className="text-sm font-medium mb-1 block" style={{ color: 'var(--violet)' }}>
          Nom et prénom *
        </span>
        <input
          id={`${idPrefix}-customer-name`}
          type="text"
          autoComplete="name"
          className="form-field w-full text-sm"
          placeholder="ex. Marie Dupont"
          value={name ?? ''}
          onChange={(e) => {
            onNameChange?.(e.target.value)
            saveCheckoutCustomerName(e.target.value)
          }}
          required
          maxLength={120}
        />
      </label>

      <CheckoutEmailField
        id={`${idPrefix}-customer-email`}
        value={email}
        onChange={onEmailChange}
        required
        hint="Pour la confirmation de commande et le suivi."
      />

      <label className="block">
        <span className="text-sm font-medium mb-1 block" style={{ color: 'var(--violet)' }}>
          Téléphone mobile *
        </span>
        <input
          id={`${idPrefix}-customer-phone`}
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          className="form-field w-full text-sm"
          placeholder="ex. 06 12 34 56 78"
          value={phone ?? ''}
          onChange={(e) => {
            onPhoneChange?.(e.target.value)
            saveCheckoutPhone(e.target.value)
          }}
          required
          maxLength={20}
        />
        <p className="font-body text-[11px] mt-1.5 leading-snug" style={{ color: 'var(--text-mid)' }}>
          {shippingMethod === SHIPPING_METHOD_MONDIAL_RELAY
            ? 'Obligatoire pour la livraison en Point Relais et pour vous joindre si besoin.'
            : 'Pour vous joindre et convenir du rendez-vous de récupération.'}
        </p>
        {errors.customerPhone ? (
          <p className="text-xs mt-1" style={{ color: '#b42318' }}>
            {errors.customerPhone}
          </p>
        ) : null}
      </label>
    </div>
  )
}
