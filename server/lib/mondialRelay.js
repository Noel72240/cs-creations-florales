import { padMondialRelayBrand } from '../../shared/shipping.js'

const CONNECT_API_PROD = 'https://connect-api.mondialrelay.com/api/shipment'
const CONNECT_API_SANDBOX = 'https://connect-api-sandbox.mondialrelay.com/api/shipment'

export function getMondialRelayConfig() {
  const brandCode = padMondialRelayBrand(
    process.env.MONDIAL_RELAY_BRAND_CODE || process.env.VITE_MONDIAL_RELAY_BRAND_CODE || '',
  )
  const privateKey = (
    process.env.MONDIAL_RELAY_PRIVATE_KEY ||
    process.env.MONDIAL_RELAY_API_SECRET ||
    ''
  ).trim()
  const codeMarque = String(process.env.MONDIAL_RELAY_CODE_MARQUE || '').trim()
  const apiKey = (process.env.MONDIAL_RELAY_API_KEY || '').trim()

  return {
    apiKey,
    apiSecret: privateKey,
    privateKey,
    codeMarque,
    brandCode,
    sandbox: process.env.MONDIAL_RELAY_SANDBOX === 'true',
    defaultWeightGrams: Math.min(
      30000,
      Math.max(100, parseInt(process.env.MONDIAL_RELAY_DEFAULT_WEIGHT_GRAMS, 10) || 1000),
    ),
    connectUrl: process.env.MONDIAL_RELAY_SANDBOX === 'true' ? CONNECT_API_SANDBOX : CONNECT_API_PROD,
  }
}

/** Widget carte Point Relais (code enseigne — peut être exposé côté client via VITE_). */
export function isMondialRelayWidgetConfigured() {
  return Boolean(getMondialRelayConfig().brandCode.trim())
}

/** Identifiants serveur pour génération d’étiquettes (clé privée ou API Connect v2). */
export function isMondialRelayApiConfigured() {
  const { apiKey, privateKey, brandCode } = getMondialRelayConfig()
  if (apiKey && privateKey && brandCode.trim()) return true
  return Boolean(privateKey && brandCode.trim())
}

/**
 * Création d’expédition + étiquette PDF — prochaine étape (API Connect v2 Mondial Relay).
 * Le widget Point Relais fonctionne dès que VITE_MONDIAL_RELAY_BRAND_CODE est configuré.
 * @param {Record<string, unknown>} order Ligne `orders` Supabase
 */
export async function createMondialRelayShipment(order) {
  if (order?.shipping_method !== 'mondial_relay') {
    return { ok: false, reason: 'not_mondial_relay' }
  }
  if (!order?.relay_point?.id && !order?.relay_point?.ID) {
    return { ok: false, reason: 'missing_relay_point' }
  }
  if (!isMondialRelayApiConfigured()) {
    console.warn('[mondial-relay] Identifiants non configurés — étiquette non générée')
    return { ok: false, reason: 'not_configured' }
  }

  // Mondial Relay oriente les nouvelles intégrations vers l’API Connect v2 pour les étiquettes.
  return { ok: false, reason: 'not_implemented' }
}
