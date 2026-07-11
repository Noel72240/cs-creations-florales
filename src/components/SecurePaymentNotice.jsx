/** Bandeau « paiement sécurisé SumUp » + cartes acceptées sur la page hébergée. */
export default function SecurePaymentNotice({ compact = false, className = '' }) {
  return (
    <div
      className={`secure-payment-notice${compact ? ' secure-payment-notice--compact' : ''}${className ? ` ${className}` : ''}`}
    >
      <p className="secure-payment-notice__title">
        {compact ? 'Paiement sécurisé SumUp' : 'Paiement sécurisé sur le site'}
      </p>
      <p className="secure-payment-notice__text">
        {compact
          ? 'Redirection vers la page sécurisée SumUp (3-D Secure si votre banque l’exige).'
          : 'Le règlement en ligne s’effectue sur une page hébergée par SumUp — vos données de carte ne transitent pas par ce site.'}
      </p>
      <p className="secure-payment-notice__cards" aria-label="Cartes acceptées sur SumUp">
        <span className="secure-payment-notice__badge">CB</span>
        <span className="secure-payment-notice__badge">Visa</span>
        <span className="secure-payment-notice__badge">Mastercard</span>
      </p>
    </div>
  )
}

/** Moyens acceptés par l’artisan (hors liste SumUp). */
export function AcceptedPaymentMethodsList({ className = '' }) {
  return (
    <ul className={`space-y-2 pl-4 list-disc${className ? ` ${className}` : ''}`} style={{ color: 'var(--text-dark)' }}>
      <li>
        <strong>Carte bancaire (Carte Bleue / CB)</strong> — en ligne via SumUp ou sur place (terminal SumUp) lors du
        retrait ou d’un rendez-vous
      </li>
      <li>
        <strong>Espèces</strong> — remise en main propre, dans la limite des plafonds légaux
      </li>
    </ul>
  )
}
