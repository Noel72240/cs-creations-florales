import {
  getProductOptionTemplate,
  suggestTemplateIdFromTitle,
} from '../data/productOptionTemplates'

/** Normalise la config admin `productOptions` sur une fiche article. */
export function normalizeArticleProductOptions(raw, title = '') {
  if (!raw || typeof raw !== 'object') {
    return { active: false, templateId: suggestTemplateIdFromTitle(title), enabledFields: [] }
  }
  const templateId = String(raw.templateId || suggestTemplateIdFromTitle(title) || '').trim()
  const template = getProductOptionTemplate(templateId)
  const enabledFields = Array.isArray(raw.enabledFields)
    ? raw.enabledFields.filter((id) => template?.fields?.includes(id))
    : template?.fields ? [...template.fields] : []
  return {
    active: Boolean(raw.active),
    templateId,
    enabledFields,
  }
}

export function isProductOptionsActive(article) {
  return Boolean(normalizeArticleProductOptions(article?.productOptions, article?.title).active)
}

export function getArticleProductOptionsConfig(article) {
  return normalizeArticleProductOptions(article?.productOptions, article?.title)
}
