/** Stockage du choix cookies + événement pour rouvrir le bandeau (ex. depuis le pied de page). */
export const COOKIE_CONSENT_KEY = 'cs_cookie_consent'
export const OPEN_COOKIE_PREFERENCES_EVENT = 'cs-open-cookie-preferences'

export function readCookieConsent() {
  try {
    const raw = localStorage.getItem(COOKIE_CONSENT_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function openCookiePreferences() {
  window.dispatchEvent(new CustomEvent(OPEN_COOKIE_PREFERENCES_EVENT))
}
