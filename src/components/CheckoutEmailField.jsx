import { loadCheckoutEmail, saveCheckoutEmail } from '../lib/promoCheckoutApi'

/**
 * E-mail client pour le paiement / code promo (session navigateur).
 */
export default function CheckoutEmailField({
  value,
  onChange,
  required = false,
  id = 'checkout-email',
  hint,
}) {
  const handleChange = (e) => {
    const next = e.target.value
    onChange?.(next)
    saveCheckoutEmail(next)
  }

  const defaultHint = required
    ? 'Obligatoire pour le code promo : une seule utilisation par adresse e-mail.'
    : 'Pour le suivi de commande et la confirmation SumUp.'

  return (
    <label className="block">
      <span className="text-sm font-medium mb-1 block" style={{ color: 'var(--violet)' }}>
        Votre e-mail {required ? '*' : ''}
      </span>
      <input
        id={id}
        type="email"
        inputMode="email"
        autoComplete="email"
        className="form-field w-full text-sm"
        placeholder="ex. prenom@email.fr"
        value={value ?? ''}
        onChange={handleChange}
        required={required}
      />
      <p className="font-body text-[11px] mt-1.5 leading-snug" style={{ color: 'var(--text-mid)' }}>
        {hint || defaultHint}
      </p>
    </label>
  )
}
