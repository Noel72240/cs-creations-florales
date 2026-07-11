/** Slug court pour préfixer les identifiants articles (ex. personnalisation → personnalisation). */
const PAGE_KEY_SLUG = {
  evenementsFloraux: 'evenements',
  creationsFlorales: 'creations-florales',
  creationsFuneraires: 'creations-funeraires',
  creationsSaisonnieres: 'saison',
  personnalisation: 'personnalisation',
  mariage: 'mariage',
  anniversaire: 'anniversaire',
  baptemeCommunion: 'bapteme',
  paques: 'paques',
  noel: 'noel',
  feteDesMeres: 'fete-meres',
  feteDesGrandesMeres: 'fete-grandes-meres',
}

function pageKeySlug(pageKey) {
  return PAGE_KEY_SLUG[pageKey] || String(pageKey || 'article').replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
}

/**
 * Garantit des identifiants uniques par page (évite qu’un clic ouvre le mauvais article).
 */
export function normalizePageArticleIds(pageKey, items) {
  if (!Array.isArray(items)) return items
  const slug = pageKeySlug(pageKey)
  const seen = new Set()

  return items.map((item, index) => {
    let id = String(item?.id || '').trim()
    if (!id) {
      id = `${slug}-${String(index + 1).padStart(3, '0')}`
    }

    if (seen.has(id)) {
      let candidate = `${slug}-${String(index + 1).padStart(3, '0')}`
      let n = 2
      while (seen.has(candidate)) {
        candidate = `${slug}-${String(index + 1).padStart(3, '0')}-${n}`
        n += 1
      }
      id = candidate
    }

    seen.add(id)
    return id === item?.id ? item : { ...item, id }
  })
}

export function normalizeAllPageArticleIds(pageArticles) {
  if (!pageArticles || typeof pageArticles !== 'object') return pageArticles
  const out = {}
  for (const [pageKey, page] of Object.entries(pageArticles)) {
    out[pageKey] = {
      ...page,
      items: normalizePageArticleIds(pageKey, page?.items),
    }
  }
  return out
}
