import { PAGE_ARTICLE_CATALOG } from '../data/articleCatalog'
import { isPublishableCatalogArticle, articleDisplayFingerprint } from './articleHubAggregation'
import { normalizeArticlePrice } from './articlePrices'
import { normalizeArticleProductOptions, isGobeletPlastiqueArticle } from './articleProductOptions'

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

function repairProductOptions(item) {
  if (!isGobeletPlastiqueArticle(item)) return item.productOptions
  return normalizeArticleProductOptions(
    {
      ...(item.productOptions || {}),
      active: true,
      templateId: 'gobelet-bapteme',
    },
    item.title,
  )
}

function repairKnownArticle(item, defaults) {
  const def = defaults.get(String(item?.id || ''))
  let next = { ...item }

  if (def) {
    const storedPrice = normalizeArticlePrice(item.price)
    const defaultPrice = normalizeArticlePrice(def.price)
    if (storedPrice === 0 && defaultPrice > 0) {
      next.price = defaultPrice
    }
  }

  // Gobelet plastique : toujours 2,90 € (jamais le barème verres 9,90 ni un mauvais prix admin).
  if (isGobeletPlastiqueArticle(next)) {
    next.price = 2.9
  }

  next.productOptions = repairProductOptions(next)
  return next
}

function dedupeItemsByFingerprint(items) {
  const byFingerprint = new Map()

  for (const item of items) {
    const fingerprint = articleDisplayFingerprint(item)
    const existing = byFingerprint.get(fingerprint)
    if (!existing) {
      byFingerprint.set(fingerprint, item)
      continue
    }
    const existingPrice = normalizeArticlePrice(existing.price)
    const nextPrice = normalizeArticlePrice(item.price)
    if (nextPrice > existingPrice) {
      byFingerprint.set(fingerprint, item)
    } else if (nextPrice === existingPrice && existingPrice === 0) {
      const existingHasDefault = Boolean(existing.id && existing.id === item.id)
      if (!existingHasDefault && String(item.id || '').length > String(existing.id || '').length) {
        byFingerprint.set(fingerprint, item)
      }
    }
  }

  return [...byFingerprint.values()]
}

/**
 * Nettoie les articles éditables / affichés.
 * @param {object} pageArticles
 * @param {{ forDisplay?: boolean }} [options] — forDisplay=false conserve les brouillons admin à l’enregistrement.
 */
export function sanitizePageArticles(pageArticles, options = {}) {
  const forDisplay = options.forDisplay !== false
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

    const items = dedupeItemsByFingerprint(
      (Array.isArray(page.items) ? page.items : [])
        .filter((item) => {
          if (!item?.id || isHubOnlyArticleId(item.id)) return false
          if (pageKey === 'feteDesGrandesMeres' && shouldDropFromGrandesMeres(item)) return false

          if (forDisplay) {
            if (!isPublishableCatalogArticle(item)) return false

            const storedPrice = normalizeArticlePrice(item.price)
            const hasDefault = defaults.has(String(item.id))
            const hasPhoto =
              Boolean(String(item.src || '').trim()) || Boolean(String(item.photoKey || '').trim())
            if (storedPrice === 0 && !hasDefault && !hasPhoto) return false
          } else if (!String(item?.title || '').trim()) {
            return false
          }

          return true
        })
        .map((item) => repairKnownArticle(item, defaults)),
    )

    out[pageKey] = { ...page, items }
  }

  return out
}
