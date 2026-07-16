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

const DEFAULT_SECTION_TITLES = {
  'verres-personnalises': 'Personnalisez votre verre',
  'verre-communion': 'Personnalisez votre verre',
  'chiffres-floraux': 'Personnalisez votre chiffre',
  'fleur-sous-verre': 'Personnalisez votre création',
  'moto-florale': 'Personnalisez votre création',
}

export function getDefaultProductOptionsSectionTitle(templateId) {
  const id = String(templateId || '').trim()
  if (DEFAULT_SECTION_TITLES[id]) return DEFAULT_SECTION_TITLES[id]
  const template = getProductOptionTemplate(id)
  if (template?.label) return `Personnalisez votre ${template.label.toLowerCase()}`
  return 'Personnalisez votre création'
}

export function resolveProductOptionsSectionTitle(config, title = '') {
  const custom = String(config?.sectionTitle || '').trim()
  if (custom) return custom
  const templateId = String(config?.templateId || suggestTemplateIdFromTitle(title) || '').trim()
  if (!templateId) return 'Personnalisez votre création'
  return getDefaultProductOptionsSectionTitle(templateId)
}

/** Modèles dont le formulaire client doit toujours exposer tous les champs du modèle. */
export const FORCE_FULL_OPTION_TEMPLATES = new Set([
  'box-florale',
  'boite-mouchoirs',
  'ecrin-floral',
  'croix-florale',
  'coeur-sur-plaque',
  'ourson-sur-plaque',
  'tracteur-floral',
  'jardin-souvenir',
  'lapin-paques',
  'couronne-deuil',
])

/** Champs non décochables dans l’admin pour ces modèles. */
export function getLockedOptionFieldIds(templateId) {
  if (templateId === 'box-florale') {
    return ['bagColorExtended', 'personalizationYesNo', 'personalizationTextIfYes', 'textColor', 'specialRequests']
  }
  if (
    templateId === 'croix-florale' ||
    templateId === 'coeur-sur-plaque' ||
    templateId === 'ourson-sur-plaque' ||
    templateId === 'tracteur-floral'
  ) {
    return ['roseColorMax3', 'plaqueAcryliqueYesNo', 'plaqueAcryliqueTextIfYes', 'textColor', 'specialRequests']
  }
  if (templateId === 'boite-mouchoirs' || templateId === 'ecrin-floral') {
    return ['textColor', 'specialRequests']
  }
  return templateId && FORCE_FULL_OPTION_TEMPLATES.has(templateId) ? ['textColor'] : []
}

/** Assure les champs clés présents (ex. couleur du texte) même si l’admin avait une liste partielle. */
function ensureTemplateFields(templateId, enabledFields, templateFields) {
  // Remapper avant filtre : sinon personalizationColor disparaît (plus dans le modèle).
  let ids = enabledFields.map((id) =>
    id === 'personalizationColor' && templateFields.includes('textColor') ? 'textColor' : id,
  )

  const ensure = (fieldId) => {
    if (templateFields.includes(fieldId) && !ids.includes(fieldId)) ids.push(fieldId)
  }

  if (FORCE_FULL_OPTION_TEMPLATES.has(templateId)) {
    return [...templateFields].filter((id) => id !== 'eyeColor')
  }

  if (templateId === 'box-florale' || templateId === 'boite-mouchoirs' || templateId === 'ecrin-floral') {
    ensure('textColor')
    ensure('personalizationYesNo')
    ensure('personalizationTextIfYes')
  }
  if (
    templateId === 'croix-florale' ||
    templateId === 'coeur-sur-plaque' ||
    templateId === 'coeur-plaque-acrylique' ||
    templateId === 'coeur-plaque-bois' ||
    templateId === 'verre-communion' ||
    templateId === 'gobelet-bapteme' ||
    templateId === 'verres-personnalises'
  ) {
    ensure('textColor')
  }

  return ids.filter((id) => templateFields.includes(id) && id !== 'eyeColor')
}

/** Normalise la config admin `productOptions` sur une fiche article. */
export function normalizeArticleProductOptions(raw, title = '') {
  if (!raw || typeof raw !== 'object') {
    return {
      active: false,
      templateId: suggestTemplateIdFromTitle(title),
      enabledFields: [],
      fieldSettings: {},
      sectionTitle: '',
    }
  }
  const templateId = String(raw.templateId || suggestTemplateIdFromTitle(title) || '').trim()
  const template = getProductOptionTemplate(templateId)
  const templateFields = template?.fields || []

  let rawEnabled = Array.isArray(raw.enabledFields) ? raw.enabledFields : []
  // Remapper l’ancien id avant de filtrer sur les champs du modèle.
  rawEnabled = rawEnabled.map((id) =>
    id === 'personalizationColor' && templateFields.includes('textColor') ? 'textColor' : id,
  )

  let enabledFields =
    rawEnabled.length > 0
      ? rawEnabled.filter((id) => templateFields.includes(id) && id !== 'eyeColor')
      : [...templateFields]

  if (rawEnabled.length > 0 || FORCE_FULL_OPTION_TEMPLATES.has(templateId)) {
    enabledFields = ensureTemplateFields(templateId, enabledFields, templateFields)
  }

  return {
    active: Boolean(raw.active),
    templateId,
    enabledFields,
    fieldSettings: normalizeFieldSettings(raw.fieldSettings, templateId),
    // Ne pas trimmer ici : sinon la saisie admin mange les espaces à chaque frappe.
    sectionTitle: String(raw.sectionTitle || ''),
  }
}

export function isProductOptionsActive(article) {
  return Boolean(normalizeArticleProductOptions(article?.productOptions, article?.title).active)
}

export function getArticleProductOptionsConfig(article) {
  const normalized = normalizeArticleProductOptions(article?.productOptions, article?.title)
  if (!normalized.active) return normalized

  // Si le titre indique box/croix/… mais qu’un mauvais modèle sans couleur texte est enregistré, corriger.
  const suggested = suggestTemplateIdFromTitle(article?.title)
  if (suggested && FORCE_FULL_OPTION_TEMPLATES.has(suggested) && normalized.templateId !== suggested) {
    const current = getProductOptionTemplate(normalized.templateId)
    if (!current?.fields?.includes('textColor')) {
      return normalizeArticleProductOptions(
        {
          ...normalized,
          templateId: suggested,
          enabledFields: [],
        },
        article?.title,
      )
    }
  }
  return normalized
}
