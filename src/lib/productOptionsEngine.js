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

/** Applique les réglages admin (ex. couleur unique → multi-couleurs). */
export function applyFieldSettings(fieldDef, settings) {
  if (!fieldDef) return null
  const multi = Boolean(settings?.multi) || fieldDef.type === 'colorMulti'
  if (fieldDef.type === 'color' && multi) {
    const max = Number.isFinite(parseInt(settings?.max, 10))
      ? Math.min(99, Math.max(1, parseInt(settings.max, 10)))
      : 99
    return { ...fieldDef, type: 'colorMulti', max }
  }
  if (fieldDef.type === 'colorMulti' && settings?.max) {
    const max = Math.min(99, Math.max(1, parseInt(settings.max, 10) || fieldDef.max || 99))
    return { ...fieldDef, max }
  }
  return fieldDef
}

/** Ordre cohérent des champs sur toutes les fiches (demandes particulières en dernier). */
const OPTION_FIELD_SORT_PRIORITY = {
  feteCategorySelect: 5,
  smallRoseColor: 10,
  coneColor: 12,
  bagColorPale: 12,
  bagColorExtended: 12,
  supportColorEcrin: 12,
  gateMaterial: 12,
  personalizationYesNo: 13,
  personalizationTextIfYes: 14,
  textColor: 15,
  roseColor: 20,
  roseColorMulti: 20,
  roseColorMax3: 20,
  roseColorExtended: 20,
  cloudColor: 22,
  largeFlowerColor: 30,
  largeFlowerColorDual: 30,
  largeRoseColorMax3: 30,
  smallRoseColor: 28,
  flowerSelectMax2: 40,
  flowerSelect2: 40,
  flowerColor: 31,
  flowerColorIfFleur: 40,
  supportColorRoseBlanc: 42,
  supportColorRoseBlancNoir: 42,
  loveInscriptionYesNo: 42,
  messageSupportYesNo: 42,
  photoPersonalizationYesNo: 42,
  sacTopPersonalizationYesNo: 42,
  messagePersonalizationYesNo: 45,
  chiffreNumber: 50,
  birthSizeText: 51,
  birthWeightText: 52,
  birthTimeText: 53,
  chiffreSize: 54,
  personalizationText: 55,
  messagePersonalizationText: 56,
  messageSupportText: 56,
  sacTopPersonalizationText: 56,
  plaqueAcryliqueText: 57,
  plaqueAcryliqueTextIfYes: 58,
  plaqueWoodText: 57,
  plaqueHeartText: 57,
  plaqueHeartTextIfYes: 58,
  personalizationColor: 61,
  candleTextColor: 62,
  guirlandePearlColor: 63,
  ribbonColor: 63,
  pearlYesNo: 70,
  pearlColor: 80,
  pearlColorIfYes: 80,
  pearlColorMulti: 80,
  ledYesNo: 85,
  colombeYesNo: 88,
  inscriptionSupportYesNo: 88,
  papillonMetalSelect: 88,
  decorationSelect: 88,
  decorationTypeSelect: 88,
  plaqueAcryliqueYesNo: 88,
  plaqueHeartYesNo: 88,
  candleMessageYesNo: 88,
  decorationOtherText: 91,
  decorationText: 91,
  coeurTextIfCoeur: 91,
  themeText: 91,
  flowersDecorationsText: 92,
  flowerDetailsLarge: 92,
  flowerDetailsMax2: 92,
  welcomeDecorationLarge: 92,
  paquesDecorationsText: 92,
  glassQuantity: 94,
  chiffreQuantity: 94,
  chiffreWishes: 998,
  specialRequests: 1000,
}

function sortOptionFieldIds(ids, templateFields = []) {
  const templateIndex = new Map(templateFields.map((id, index) => [id, index]))
  return [...ids].sort((a, b) => {
    const ia = templateIndex.get(a)
    const ib = templateIndex.get(b)
    if (ia !== undefined && ib !== undefined) return ia - ib
    const pa = OPTION_FIELD_SORT_PRIORITY[a] ?? 500 + (ia ?? 99)
    const pb = OPTION_FIELD_SORT_PRIORITY[b] ?? 500 + (ib ?? 99)
    if (pa !== pb) return pa - pb
    return (ia ?? 999) - (ib ?? 999)
  })
}

export function resolveProductOptionFields(templateId, enabledFieldIds, fieldSettings = {}) {
  const template = getProductOptionTemplate(templateId)
  if (!template) return []
  let ids = Array.isArray(enabledFieldIds) && enabledFieldIds.length
    ? enabledFieldIds.filter((id) => template.fields.includes(id) && id !== 'eyeColor')
    : [...template.fields]
  if (template.fields.includes('specialRequests') && !ids.includes('specialRequests')) {
    ids = [...ids, 'specialRequests']
  }
  ids = sortOptionFieldIds(ids, template.fields)
  return ids
    .map((id) => applyFieldSettings(getOptionFieldDef(id), fieldSettings[id]))
    .filter(Boolean)
}

export function computeOptionsUnitPrice({ templateId, values = {}, basePrice = 0 }) {
  const template = getProductOptionTemplate(templateId)
  if (!template) return resolveArticlePriceFallback(basePrice)

  if (template.pricingMode === 'glassTier') {
    const qty = parseInt(values.glassQuantity, 10) || 1
    return glassUnitPrice(qty)
  }

  if (template.pricingMode === 'unitQuantity') {
    return resolveArticlePriceFallback(basePrice)
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
  if (template?.pricingMode === 'glassTier' || template?.pricingMode === 'unitQuantity') {
    const q = parseInt(values.glassQuantity, 10)
    return Number.isFinite(q) && q >= 1 ? Math.min(999, q) : 1
  }
  if (template?.pricingMode === 'chiffreFloral') {
    const q = parseInt(values.chiffreQuantity, 10)
    const base = Number.isFinite(q) && q >= 1 ? Math.min(999, q) : 1
    return base * fallbackQty
  }
  return fallbackQty
}

export function usesGlassQuantityAsCartQty(templateId) {
  return getProductOptionTemplate(templateId)?.pricingMode === 'glassTier'
}

export function shouldHideCartQuantityStepper(templateId) {
  const mode = getProductOptionTemplate(templateId)?.pricingMode
  return mode === 'glassTier' || mode === 'chiffreFloral' || mode === 'unitQuantity'
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
    } else if (field.type === 'selectMulti') {
      const arr = Array.isArray(raw) ? raw : []
      if (field.required && arr.length < 1) errors[field.id] = 'Sélectionnez au moins une option.'
      if (field.max && arr.length > field.max) errors[field.id] = `Maximum ${field.max} choix.`
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
  if (field.type === 'selectMulti') {
    const arr = Array.isArray(raw) ? raw : []
    return arr
      .map((v) => field.options?.find((o) => o.value === v)?.label || v)
      .filter(Boolean)
      .join(', ')
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
