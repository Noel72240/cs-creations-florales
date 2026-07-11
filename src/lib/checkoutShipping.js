import {
  SHIPPING_METHOD_MONDIAL_RELAY,
  SHIPPING_METHOD_PICKUP,
  normalizeRelayPoint,
} from '../../shared/shipping.js'

const PHONE_KEY = 'cs_checkout_phone_v1'
const SHIPPING_METHOD_KEY = 'cs_checkout_shipping_method_v1'
const RELAY_POINT_KEY = 'cs_checkout_relay_point_v1'

export function loadCheckoutPhone() {
  try {
    return sessionStorage.getItem(PHONE_KEY) || ''
  } catch {
    return ''
  }
}

export function saveCheckoutPhone(phone) {
  try {
    const v = String(phone || '').trim()
    if (v) sessionStorage.setItem(PHONE_KEY, v)
    else sessionStorage.removeItem(PHONE_KEY)
  } catch {
    /* ignore */
  }
}

export function loadCheckoutShippingMethod() {
  try {
    const v = sessionStorage.getItem(SHIPPING_METHOD_KEY)
    if (v === SHIPPING_METHOD_MONDIAL_RELAY || v === SHIPPING_METHOD_PICKUP) return v
    return ''
  } catch {
    return ''
  }
}

export function saveCheckoutShippingMethod(method) {
  try {
    if (method === SHIPPING_METHOD_MONDIAL_RELAY || method === SHIPPING_METHOD_PICKUP) {
      sessionStorage.setItem(SHIPPING_METHOD_KEY, method)
    } else {
      sessionStorage.removeItem(SHIPPING_METHOD_KEY)
    }
  } catch {
    /* ignore */
  }
}

export function loadCheckoutRelayPoint() {
  try {
    const raw = sessionStorage.getItem(RELAY_POINT_KEY)
    if (!raw) return null
    return normalizeRelayPoint(JSON.parse(raw))
  } catch {
    return null
  }
}

export function saveCheckoutRelayPoint(relay) {
  try {
    const normalized = normalizeRelayPoint(relay)
    if (normalized) sessionStorage.setItem(RELAY_POINT_KEY, JSON.stringify(normalized))
    else sessionStorage.removeItem(RELAY_POINT_KEY)
  } catch {
    /* ignore */
  }
}

export function getMondialRelayBrandCode() {
  return String(import.meta.env.VITE_MONDIAL_RELAY_BRAND_CODE || '').trim()
}

export function isMondialRelayWidgetEnabled() {
  return Boolean(getMondialRelayBrandCode())
}
