import { useState, useEffect, useCallback } from 'react'
import {
  COOKIE_CONSENT_KEY,
  OPEN_COOKIE_PREFERENCES_EVENT,
  readCookieConsent,
} from '../lib/cookieConsent'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [preferences, setPreferences] = useState({
    analytics: false,
    marketing: false,
  })

  const applySavedPreferences = useCallback(() => {
    const saved = readCookieConsent()
    if (saved) {
      setPreferences({
        analytics: !!saved.analytics,
        marketing: !!saved.marketing,
      })
    }
  }, [])

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY)
    if (!consent) {
      const t = setTimeout(() => setVisible(true), 1500)
      return () => clearTimeout(t)
    }
  }, [])

  useEffect(() => {
    const onOpenPreferences = () => {
      applySavedPreferences()
      setShowDetails(true)
      setVisible(true)
    }
    window.addEventListener(OPEN_COOKIE_PREFERENCES_EVENT, onOpenPreferences)
    return () => window.removeEventListener(OPEN_COOKIE_PREFERENCES_EVENT, onOpenPreferences)
  }, [applySavedPreferences])

  const acceptAll = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify({ necessary: true, analytics: true, marketing: true }))
    setVisible(false)
  }

  const rejectAll = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify({ necessary: true, analytics: false, marketing: false }))
    setVisible(false)
  }

  const savePreferences = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify({ necessary: true, ...preferences }))
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      className="cookie-banner animate-fade-up"
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-banner-title"
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="flex-1">
            <p
              id="cookie-banner-title"
              className="cookie-banner__title"
              style={{ color: 'var(--violet)' }}
            >
              🍪 Nous respectons votre vie privée
            </p>
            <p className="cookie-banner__text" style={{ color: 'var(--text-mid)' }}>
              Ce site utilise des cookies pour améliorer votre expérience. Les cookies nécessaires sont toujours actifs.
              Les cookies analytiques et marketing sont optionnels.
            </p>
            {showDetails && (
              <div className="mt-3 space-y-2">
                <label className="cookie-banner__label flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked disabled className="accent-mauve shrink-0" />
                  <span><strong>Cookies nécessaires</strong> — Toujours actifs (fonctionnement du site)</span>
                </label>
                <label className="cookie-banner__label flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.analytics}
                    onChange={(e) => setPreferences(p => ({ ...p, analytics: e.target.checked }))}
                    className="accent-mauve shrink-0"
                  />
                  <span><strong>Cookies analytiques</strong> — Statistiques de visite anonymes</span>
                </label>
                <label className="cookie-banner__label flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.marketing}
                    onChange={(e) => setPreferences(p => ({ ...p, marketing: e.target.checked }))}
                    className="accent-mauve shrink-0"
                  />
                  <span><strong>Cookies marketing</strong> — Publicités personnalisées</span>
                </label>
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-2 shrink-0">
            <button onClick={() => setShowDetails(!showDetails)} className="btn-outline text-xs py-2 px-4">
              {showDetails ? 'Masquer' : 'Personnaliser'}
            </button>
            {showDetails && (
              <button onClick={savePreferences} className="btn-outline text-xs py-2 px-4">
                Enregistrer
              </button>
            )}
            <button onClick={rejectAll} className="btn-outline text-xs py-2 px-4">
              Refuser
            </button>
            <button onClick={acceptAll} className="btn-primary text-xs py-2 px-4">
              Tout accepter
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
