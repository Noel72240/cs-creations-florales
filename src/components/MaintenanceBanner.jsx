import { useSiteConfig } from '../context/SiteContentContext'
import { getMaintenanceState } from '../lib/maintenance'

export default function MaintenanceBanner() {
  const { content } = useSiteConfig()
  const { active, title, message } = getMaintenanceState(content)

  if (!active) return null

  return (
    <div
      className="site-maintenance-banner"
      role="alert"
      aria-live="polite"
    >
      <div className="site-maintenance-banner__inner max-w-6xl mx-auto px-3 sm:px-4 py-2 sm:py-2.5 text-center">
        <p className="site-maintenance-banner__title font-heading text-sm sm:text-base font-medium">
          {title}
        </p>
        <p className="site-maintenance-banner__message text-xs sm:text-sm mt-0.5 leading-snug opacity-95">
          {message}
        </p>
      </div>
    </div>
  )
}
