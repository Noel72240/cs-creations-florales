/** Bandeau « paiement sécurisé SumUp » + cartes acceptées sur la page hébergée. */
export default function SecurePaymentNotice({ compact = false, className = '' }) {
  return (
    <div
      className={`secure-payment-notice${compact ? ' secure-payment-notice--compact' : ''}${className ? ` ${className}` : ''}`}
      role="note"
      aria-label="Paiement sécurisé"
    >
      <div className="secure-payment-notice__head">
        <span className="secure-payment-notice__lock" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="currentColor" className="secure-payment-notice__lock-icon">
            <path d="M12 1a5 5 0 00-5 5v3H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V11a2 2 0 00-2-2h-1V6a5 5 0 00-5-5zm-3 8V6a3 3 0 116 0v3H9z" />
          </svg>
        </span>
        <p className="secure-payment-notice__title">
          {compact ? 'Paiement sécurisé SumUp' : 'Paiement sécurisé sur le site'}
        </p>
      </div>
      <p className="secure-payment-notice__text">
        {compact
          ? 'Redirection vers la page sécurisée SumUp (3-D Secure si votre banque l’exige).'
          : 'Le règlement en ligne s’effectue sur une page hébergée par SumUp — vos données de carte ne transitent pas par ce site.'}
      </p>
      <p className="secure-payment-notice__cards" aria-label="Cartes acceptées sur SumUp">
        <span className="secure-payment-notice__badge secure-payment-notice__badge--brand">CB</span>
        <span className="secure-payment-notice__badge secure-payment-notice__badge--brand">Visa</span>
        <span className="secure-payment-notice__badge secure-payment-notice__badge--brand">Mastercard</span>
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
