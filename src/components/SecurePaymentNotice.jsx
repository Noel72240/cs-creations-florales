/** Bandeau « paiement sécurisé » + cartes acceptées (SumUp). */
const SECURE_PAYMENT_LOGO = '/images/paiement-securise.png'

export default function SecurePaymentNotice({ compact = false, className = '' }) {
  return (
    <div
      className={`secure-payment-notice${compact ? ' secure-payment-notice--compact' : ''}${className ? ` ${className}` : ''}`}
      role="note"
      aria-label="Paiement sécurisé"
    >
      <div className="secure-payment-notice__layout">
        <img
          src={SECURE_PAYMENT_LOGO}
          alt=""
          className="secure-payment-notice__logo"
          width={72}
          height={72}
          loading="lazy"
          decoding="async"
          aria-hidden="true"
        />
        <div className="secure-payment-notice__body">
          <p className="secure-payment-notice__title">
            {compact ? 'Paiement sécurisé SumUp' : 'Paiement sécurisé sur le site'}
          </p>
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
      </div>
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

/** Logo seul — pied de page, page paiement. */
export function SecurePaymentLogo({ className = '', size = 'md' }) {
  const dim = size === 'sm' ? 56 : size === 'lg' ? 88 : 72
  return (
    <img
      src={SECURE_PAYMENT_LOGO}
      alt="Paiement sécurisé — carte bancaire protégée"
      className={`secure-payment-logo${className ? ` ${className}` : ''}`}
      width={dim}
      height={dim}
      loading="lazy"
      decoding="async"
    />
  )
}
