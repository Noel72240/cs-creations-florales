/** Champ admin « Message de la personnalisation » = Oui */
export function isPersonalizationMessageEnabled(article) {
  const v = article?.personalizationMessageEnabled
  if (v === true || v === 1) return true
  if (typeof v === 'string') {
    const s = v.trim().toLowerCase()
    return s === 'yes' || s === 'oui' || s === 'true' || s === '1'
  }
  return false
}

export function buildArticleCartLineId(
  articleId,
  { selectedColor = '', personalizationMessage = '', customOptionsKey = '' } = {},
) {
  let id = String(articleId || '').trim()
  const color = String(selectedColor || '').trim()
  const msg = String(personalizationMessage || '').trim()
  const optKey = String(customOptionsKey || '').trim()
  if (color) id += `::${color}`
  if (msg) id += `::p:${encodeURIComponent(msg.slice(0, 500))}`
  if (optKey) id += `::opt:${encodeURIComponent(optKey.slice(0, 400))}`
  return id
}
