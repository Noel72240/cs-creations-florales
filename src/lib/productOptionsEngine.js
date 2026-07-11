import { colorLabelFromKey, colorLabelsFromKeys } from '../data/floralColorPalette'
import { getOptionFieldDef } from '../data/productOptionFields'
import { getProductOptionTemplate } from '../data/productOptionTemplates'

/** Tarifs dégressifs verres personnalisés / communion (€ / verre). */
export const GLASS_TIER_PRICES = [
  { min: 100, price: 3.9 },
  { min: 50, price: 6.5 },
  { min: 30, price: 7.5 },
  { min: 10, price: 8.9 },
  { min: 1, price: 9.9 },
]

/** Prix unitaire par taille de chiffre floral (€ / chiffre). */
export const CHIFFRE_SIZE_PRICES = {
  20: 24.9,
  30: 34.9,
  40: 44.9,
  50: 54.9,
  60: 64.9,
}

export function glassUnitPrice(quantity) {
  const q = Math.max(1, parseInt(quantity, 10) || 1)
  for (const tier of GLASS_TIER_PRICES) {
    if (q >= tier.min) return tier.price
  }
  return GLASS_TIER_PRICES[GLASS_TIER_PRICES.length - 1].price
}

export function countChiffreDigits(raw) {
  const digits = String(raw || '').replace(/\D/g, '')
  return digits.length || 0
}

export function isFieldVisible(fieldDef, values) {
  if (!fieldDef?.showWhen) return true
  const { field, equals } = fieldDef.showWhen
  const current = values?.[field]
  return String(current ?? '') === String(equals ?? '')
}

export function resolveProductOptionFields(templateId, enabledFieldIds) {
  const template = getProductOptionTemplate(templateId)
  if (!template) return []
  const ids = Array.isArray(enabledFieldIds) && enabledFieldIds.length
    ? enabledFieldIds
    : template.fields
  return ids.map((id) => getOptionFieldDef(id)).filter(Boolean)
}

export function computeOptionsUnitPrice({ templateId, values = {}, basePrice = 0 }) {
  const template = getProductOptionTemplate(templateId)
  if (!template) return resolveArticlePriceFallback(basePrice)

  if (template.pricingMode === 'glassTier') {
    const qty = parseInt(values.glassQuantity, 10) || 1
    return glassUnitPrice(qty)
  }

  if (template.pricingMode === 'chiffreFloral') {
    const size = String(values.chiffreSize || '20')
    const perDigit = CHIFFRE_SIZE_PRICES[size] ?? CHIFFRE_SIZE_PRICES['20']
    const digits = countChiffreDigits(values.chiffreNumber)
    if (digits < 1) return 0
    return perDigit * digits
  }

  return resolveArticlePriceFallback(basePrice)
}

function resolveArticlePriceFallback(basePrice) {
  const n = Number(basePrice)
  return Number.isFinite(n) && n >= 0 ? n : 0
}

export function computeOptionsCartQuantity({ templateId, values = {}, fallbackQty = 1 }) {
  const template = getProductOptionTemplate(templateId)
  if (template?.pricingMode === 'glassTier') {
    const q = parseInt(values.glassQuantity, 10)
    return Number.isFinite(q) && q >= 1 ? Math.min(999, q) : 1
  }
  return fallbackQty
}

export function usesGlassQuantityAsCartQty(templateId) {
  return getProductOptionTemplate(templateId)?.pricingMode === 'glassTier'
}

export function shouldHideCartQuantityStepper(templateId) {
  const mode = getProductOptionTemplate(templateId)?.pricingMode
  return mode === 'glassTier' || mode === 'chiffreFloral'
}

export function validateProductOptions(fields, values) {
  const errors = {}
  for (const field of fields) {
    if (!isFieldVisible(field, values)) continue
    const raw = values[field.id]
    if (field.type === 'color') {
      if (field.required && !raw) errors[field.id] = 'Choisissez une couleur.'
    } else if (field.type === 'colorMulti') {
      const arr = Array.isArray(raw) ? raw : []
      if (field.required && arr.length < 1) errors[field.id] = 'Choisissez au moins une couleur.'
      if (field.max && arr.length > field.max) errors[field.id] = `Maximum ${field.max} couleur(s).`
    } else if (field.type === 'yesNo') {
      if (field.required && raw !== 'oui' && raw !== 'non') errors[field.id] = 'Choisissez Oui ou Non.'
    } else if (field.type === 'select') {
      if (field.required && !String(raw ?? '').trim()) errors[field.id] = 'Sélectionnez une option.'
    } else if (field.type === 'number') {
      const n = parseInt(raw, 10)
      if (field.required && (!Number.isFinite(n) || n < (field.min ?? 1))) {
        errors[field.id] = `Indiquez un nombre (min. ${field.min ?? 1}).`
      }
    } else if (field.type === 'text' || field.type === 'textarea') {
      const s = String(raw ?? '').trim()
      if (field.required && !s) errors[field.id] = 'Ce champ est obligatoire.'
      if (field.id === 'chiffreNumber' && field.required) {
        if (countChiffreDigits(s) < 1) errors[field.id] = 'Saisissez au moins un chiffre.'
      }
    }
  }
  return { valid: Object.keys(errors).length === 0, errors }
}

function formatFieldValue(field, raw) {
  if (field.type === 'color') return colorLabelFromKey(raw)
  if (field.type === 'colorMulti') return colorLabelsFromKeys(Array.isArray(raw) ? raw : [])
  if (field.type === 'yesNo') return raw === 'oui' ? 'Oui' : raw === 'non' ? 'Non' : ''
  if (field.type === 'select') {
    const opt = field.options?.find((o) => o.value === raw)
    return opt?.label || String(raw || '')
  }
  return String(raw ?? '').trim()
}

/** Résumé lisible pour panier / contact / checkout. */
export function formatProductOptionsSummary(fields, values) {
  const lines = []
  for (const field of fields) {
    if (!isFieldVisible(field, values)) continue
    const formatted = formatFieldValue(field, values[field.id])
    if (!formatted) continue
    lines.push({ label: field.label, value: formatted })
  }
  return lines
}

export function serializeProductOptionsForCart(fields, values) {
  const summary = formatProductOptionsSummary(fields, values)
  const compact = {}
  for (const field of fields) {
    if (!isFieldVisible(field, values)) continue
    const v = values[field.id]
    if (v == null || v === '' || (Array.isArray(v) && v.length === 0)) continue
    compact[field.id] = v
  }
  return { values: compact, summary, templateId: fields._templateId }
}

export function buildProductOptionsCartLineSuffix(values, templateId) {
  try {
    const payload = JSON.stringify({ t: templateId, v: values })
    return `::opt:${encodeURIComponent(payload.slice(0, 800))}`
  } catch {
    return ''
  }
}
