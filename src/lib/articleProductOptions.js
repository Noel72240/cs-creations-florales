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

/** Assure les champs clés présents (ex. couleur du texte) même si l’admin avait une liste partielle. */
function ensureTemplateFields(templateId, enabledFields, templateFields) {
  let ids = enabledFields.map((id) =>
    (templateId === 'croix-florale' ||
      templateId === 'coeur-sur-plaque' ||
      templateId === 'tracteur-floral' ||
      templateId === 'ourson-sur-plaque' ||
      templateId === 'couronne-deuil' ||
      templateId === 'jardin-souvenir' ||
      templateId === 'lapin-paques') &&
    id === 'personalizationColor'
      ? 'textColor'
      : id,
  )

  const ensure = (fieldId) => {
    if (templateFields.includes(fieldId) && !ids.includes(fieldId)) ids.push(fieldId)
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
  let enabledFields =
    Array.isArray(raw.enabledFields) && raw.enabledFields.length
      ? raw.enabledFields.filter((id) => templateFields.includes(id) && id !== 'eyeColor')
      : [...templateFields]

  if (Array.isArray(raw.enabledFields) && raw.enabledFields.length) {
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
  return normalizeArticleProductOptions(article?.productOptions, article?.title)
}
