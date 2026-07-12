import { MAX_PAGE_ARTICLES } from '../data/siteContent.defaults'

/** Pages « hub » → clés `pageArticles` des sous-rubriques à regrouper. */
export const PARENT_ARTICLE_CHILDREN = {
  evenementsFloraux: ['mariage', 'anniversaire', 'baptemeCommunion'],
  creationsSaisonnieres: ['paques', 'noel', 'feteDesMeres', 'feteDesGrandesMeres', 'saintValentin'],
}

function bucketItems(content, pageKey) {
  const items = content?.pageArticles?.[pageKey]?.items
  return Array.isArray(items) ? items : []
}

/** Empreinte légère pour éviter les doublons visuels (aperçus hub vs catalogue complet). */
function articleDisplayFingerprint(item) {
  const src = String(item?.src || '').trim().toLowerCase()
  if (src) return `src:${src}`
  return `id:${String(item?.id || '')}`
}

/** Article visible dans les grilles (photo ou description renseignée). */
export function isPublishableCatalogArticle(item) {
  const title = String(item?.title || '').trim()
  if (!title) return false
  const src = String(item?.src || '').trim()
  const desc = String(item?.description || '').trim()
  return Boolean(src || desc)
}

/**
 * Regroupe les articles d’une page hub + ses sous-rubriques.
 * Les articles des sous-catégories sont la source de vérité ; les aperçus hub restent si uniques.
 */
export function aggregateHubArticles(parentKey, content, { maxItems = MAX_PAGE_ARTICLES } = {}) {
  const children = PARENT_ARTICLE_CHILDREN[parentKey]
  if (!children) return bucketItems(content, parentKey)

  const seenIds = new Set()
  const seenFingerprints = new Set()
  const result = []

  const pushItem = (item, sourcePageKey) => {
    if (!item?.id) return
    if (!isPublishableCatalogArticle(item)) return
    const idKey = `${sourcePageKey}:${item.id}`
    if (seenIds.has(idKey)) return

    const fingerprint = articleDisplayFingerprint(item)
    if (seenFingerprints.has(fingerprint)) return

    seenIds.add(idKey)
    seenFingerprints.add(fingerprint)
    result.push({ ...item, sourcePageKey })
  }

  for (const childKey of children) {
    for (const item of bucketItems(content, childKey)) {
      pushItem(item, childKey)
    }
  }

  for (const item of bucketItems(content, parentKey)) {
    pushItem(item, parentKey)
  }

  const cap = Number.isFinite(maxItems) && maxItems > 0 ? maxItems : result.length
  return result.slice(0, cap)
}

export function isHubPageKey(pageKey) {
  return Object.prototype.hasOwnProperty.call(PARENT_ARTICLE_CHILDREN, pageKey)
}

export function getHubParentKey(pageKey) {
  for (const [parentKey, children] of Object.entries(PARENT_ARTICLE_CHILDREN)) {
    if (children.includes(pageKey)) return parentKey
  }
  return null
}

function findInBucket(content, pageKey, articleId) {
  const raw = decodeURIComponent(articleId || '')
  const items = bucketItems(content, pageKey)
  const matches = items.filter((it) => String(it.id) === raw)
  if (matches.length === 0) return null
  return matches[0]
}

function findInAnyBucket(content, articleId) {
  const pages = content?.pageArticles
  if (!pages || typeof pages !== 'object') return null
  for (const pageKey of Object.keys(pages)) {
    const found = findInBucket(content, pageKey, articleId)
    if (found) return { item: found, pageKey }
  }
  return null
}

/** Clé catalogue où l’article est réellement enregistré (sous-rubrique ou page courante). */
export function resolveCatalogPageKey(content, pageKey, articleId) {
  if (findInBucket(content, pageKey, articleId)) return pageKey

  const children = PARENT_ARTICLE_CHILDREN[pageKey]
  if (children) {
    for (const childKey of children) {
      if (findInBucket(content, childKey, articleId)) return childKey
    }
  }

  return pageKey
}

export function findCatalogArticle(content, pageKey, articleId) {
  const direct = findInBucket(content, pageKey, articleId)
  if (direct) return direct

  const children = PARENT_ARTICLE_CHILDREN[pageKey]
  if (children) {
    for (const childKey of children) {
      const found = findInBucket(content, childKey, articleId)
      if (found) return found
    }
  }

  const global = findInAnyBucket(content, articleId)
  if (global && global.pageKey !== pageKey) return global.item

  return null
}
