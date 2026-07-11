import { loadCheckoutCustomerName, saveCheckoutCustomerName } from '../lib/promoCheckoutApi'
import CheckoutEmailField from './CheckoutEmailField'

/**
 * Coordonnées client avant paiement SumUp (facturation / notification).
 */
export default function CheckoutCustomerFields({
  name,
  email,
  onNameChange,
  onEmailChange,
  idPrefix = 'checkout',
}) {
  const handleNameChange = (e) => {
    const next = e.target.value
    onNameChange?.(next)
    saveCheckoutCustomerName(next)
  }

  return (
    <div className="space-y-4 rounded-xl border border-mauve-light/35 p-4" style={{ background: 'rgba(255,248,251,0.7)' }}>
      <p className="text-xs font-medium" style={{ color: 'var(--violet)' }}>
        Vos coordonnées pour la commande
      </p>
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
          onChange={handleNameChange}
          required
          maxLength={120}
        />
      </label>
      <CheckoutEmailField
        id={`${idPrefix}-customer-email`}
        value={email}
        onChange={onEmailChange}
        required
        hint="Obligatoire pour la facturation et le suivi de votre commande."
      />
    </div>
  )
}
