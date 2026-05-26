import { useSiteConfig } from '../context/SiteContentContext'
import { getMaintenanceState } from '../lib/maintenance'

/** Bandeau visible dans le contenu (sous le menu) quand la maintenance est active. */
export default function MaintenanceBodyNotice() {
  const { content, remoteLoaded } = useSiteConfig()
  const { active, title, message } = getMaintenanceState(content)

  if (!remoteLoaded || !active) return null

  return (
    <div
      className="site-maintenance-notice px-4 py-4 sm:py-5 text-center border-b-2 border-amber-700/50"
      role="alert"
      aria-live="polite"
    >
      <p className="font-heading text-lg sm:text-xl font-semibold text-amber-950">{title}</p>
      <p className="font-body text-sm sm:text-base mt-2 max-w-2xl mx-auto text-amber-950/90 leading-relaxed">
        {message}
      </p>
      <p className="font-body text-xs mt-2 text-amber-900/80">Les paiements en ligne sont suspendus.</p>
    </div>
  )
}
