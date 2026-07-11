import { padMondialRelayBrand } from '../../shared/shipping.js'

const CONNECT_API_PROD = 'https://connect-api.mondialrelay.com/api/shipment'
const CONNECT_API_SANDBOX = 'https://connect-api-sandbox.mondialrelay.com/api/shipment'

export function getMondialRelayConfig() {
  const brandCode = padMondialRelayBrand(process.env.MONDIAL_RELAY_BRAND_CODE || '')
  return {
    apiKey: (process.env.MONDIAL_RELAY_API_KEY || '').trim(),
    apiSecret: (process.env.MONDIAL_RELAY_API_SECRET || '').trim(),
    brandCode,
    sandbox: process.env.MONDIAL_RELAY_SANDBOX === 'true',
    defaultWeightGrams: Math.min(
      30000,
      Math.max(100, parseInt(process.env.MONDIAL_RELAY_DEFAULT_WEIGHT_GRAMS, 10) || 1000),
    ),
    connectUrl: process.env.MONDIAL_RELAY_SANDBOX === 'true' ? CONNECT_API_SANDBOX : CONNECT_API_PROD,
  }
}

export function isMondialRelayApiConfigured() {
  const { apiKey, apiSecret, brandCode } = getMondialRelayConfig()
  return Boolean(apiKey && apiSecret && brandCode.trim())
}

/**
 * Création d’expédition + étiquette PDF — à activer quand Charlène aura les identifiants Connect.
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
    console.warn('[mondial-relay] API non configurée — étiquette non générée')
    return { ok: false, reason: 'not_configured' }
  }

  // Étape suivante : appeler CONNECT_API avec expéditeur atelier + point relais client.
  return { ok: false, reason: 'not_implemented' }
}
