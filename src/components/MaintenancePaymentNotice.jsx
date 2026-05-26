import { Link } from 'react-router-dom'
import { useSiteConfig } from '../context/SiteContentContext'
import { getMaintenanceState } from '../lib/maintenance'

/** Alerte sur panier / paiement lorsque les paiements en ligne sont bloqués. */
export default function MaintenancePaymentNotice() {
  const { content } = useSiteConfig()
  const { active, title, message } = getMaintenanceState(content)

  if (!active) return null

  return (
    <div
      className="rounded-xl border-2 border-amber-500/60 px-4 py-4 mb-6"
      style={{ background: 'rgba(251, 191, 36, 0.12)' }}
      role="alert"
    >
      <p className="font-heading text-base font-medium mb-1" style={{ color: '#92400e' }}>
        {title}
      </p>
      <p className="font-body text-sm leading-relaxed mb-3" style={{ color: 'var(--text-dark)' }}>
        {message}
      </p>
      <p className="font-body text-xs" style={{ color: 'var(--text-mid)' }}>
        Les paiements par carte (SumUp) sont désactivés.{' '}
        <Link to="/contact" className="underline hover:text-mauve transition-colors" style={{ color: 'var(--violet)' }}>
          Contactez-nous
        </Link>{' '}
        pour une commande ou un devis.
      </p>
    </div>
  )
}
