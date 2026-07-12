import {
  getProductOptionTemplate,
  suggestTemplateIdFromTitle,
} from '../data/productOptionTemplates'
import { getOptionFieldDef } from '../data/productOptionFields'

function normalizeFieldSettings(raw, templateId) {
  const template = getProductOptionTemplate(templateId)
  const allowed = new Set(template?.fields || [])
  const out = {}
  if (!raw || typeof raw !== 'object') return out
  for (const [fieldId, settings] of Object.entries(raw)) {
    if (!allowed.has(fieldId)) continue
    const def = getOptionFieldDef(fieldId)
    if (!def || (def.type !== 'color' && def.type !== 'colorMulti')) continue
    const multi = Boolean(settings?.multi) || def.type === 'colorMulti'
    let max = parseInt(settings?.max, 10)
    if (!Number.isFinite(max) || max < 1) max = def.max ?? 99
    if (multi) out[fieldId] = { multi: true, max: Math.min(99, max) }
  }
  return out
}

/** Normalise la config admin `productOptions` sur une fiche article. */
export function normalizeArticleProductOptions(raw, title = '') {
  if (!raw || typeof raw !== 'object') {
    return { active: false, templateId: suggestTemplateIdFromTitle(title), enabledFields: [], fieldSettings: {} }
  }
  const templateId = String(raw.templateId || suggestTemplateIdFromTitle(title) || '').trim()
  const template = getProductOptionTemplate(templateId)
  const templateFields = template?.fields || []
  let enabledFields = Array.isArray(raw.enabledFields) && raw.enabledFields.length
    ? raw.enabledFields.filter((id) => templateFields.includes(id))
    : [...templateFields]
  if (Boolean(raw.active) && templateFields.length) {
    enabledFields = [...new Set([...enabledFields, ...templateFields])].filter((id) => templateFields.includes(id))
  }
  return {
    active: Boolean(raw.active),
    templateId,
    enabledFields,
    fieldSettings: normalizeFieldSettings(raw.fieldSettings, templateId),
  }
}

export function isProductOptionsActive(article) {
  return Boolean(normalizeArticleProductOptions(article?.productOptions, article?.title).active)
}

export function getArticleProductOptionsConfig(article) {
  return normalizeArticleProductOptions(article?.productOptions, article?.title)
}
