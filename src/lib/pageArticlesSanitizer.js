import { PAGE_ARTICLE_CATALOG } from '../data/articleCatalog'
import { isPublishableCatalogArticle } from './articleHubAggregation'
import { normalizeArticlePrice } from './articlePrices'

const HUB_PAGE_KEYS = new Set(['evenementsFloraux', 'creationsSaisonnieres'])
const HUB_ONLY_ID_PREFIXES = ['evt-', 'sai-']

function buildDefaultArticleIndex() {
  const byId = new Map()
  for (const page of Object.values(PAGE_ARTICLE_CATALOG)) {
    for (const item of page.items || []) {
      if (item?.id) byId.set(String(item.id), item)
    }
  }
  return byId
}

function isHubOnlyArticleId(id) {
  const raw = String(id || '')
  return HUB_ONLY_ID_PREFIXES.some((prefix) => raw.startsWith(prefix))
}

function shouldDropFromGrandesMeres(item) {
  const id = String(item?.id || '')
  return id.startsWith('fete-des-meres-')
}

function repairKnownArticle(item, defaults) {
  const def = defaults.get(String(item?.id || ''))
  if (!def) return item

  const next = { ...item }
  const storedPrice = normalizeArticlePrice(item.price)
  const defaultPrice = normalizeArticlePrice(def.price)
  if (storedPrice === 0 && defaultPrice > 0) {
    next.price = defaultPrice
  }
  return next
}

/**
 * Nettoie les articles éditables / affichés :
 * - vide les aperçus hub (doublons evt-* / sai-*),
 * - retire les articles hub-only et les fantômes à 0 €,
 * - corrige les prix connus depuis le catalogue par défaut.
 */
export function sanitizePageArticles(pageArticles) {
  if (!pageArticles || typeof pageArticles !== 'object') return pageArticles

  const defaults = buildDefaultArticleIndex()
  const out = {}

  for (const [pageKey, page] of Object.entries(pageArticles)) {
    if (!page || typeof page !== 'object') {
      out[pageKey] = page
      continue
    }

    if (HUB_PAGE_KEYS.has(pageKey)) {
      out[pageKey] = { ...page, items: [] }
      continue
    }

    const items = (Array.isArray(page.items) ? page.items : [])
      .filter((item) => {
        if (!item?.id || isHubOnlyArticleId(item.id)) return false
        if (pageKey === 'feteDesGrandesMeres' && shouldDropFromGrandesMeres(item)) return false
        if (!isPublishableCatalogArticle(item)) return false

        const storedPrice = normalizeArticlePrice(item.price)
        const hasDefault = defaults.has(String(item.id))
        if (storedPrice === 0 && !hasDefault && !String(item.src || '').trim()) return false

        return true
      })
      .map((item) => repairKnownArticle(item, defaults))

    out[pageKey] = { ...page, items }
  }

  return out
}
