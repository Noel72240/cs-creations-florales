/** Métadonnées des rubriques articles (clé pageArticles → URL). */
export const ARTICLE_PAGE_META = {
  evenementsFloraux: { path: '/evenements-floraux', label: 'Événements floraux' },
  anniversaire: { path: '/evenements-floraux/anniversaire', label: 'Anniversaire' },
  mariage: { path: '/evenements-floraux/mariage', label: 'Mariage' },
  baptemeCommunion: { path: '/evenements-floraux/bapteme-communion', label: 'Baptême / Communion' },
  creationsFlorales: { path: '/creations-florales', label: 'Créations florales' },
  creationsFuneraires: { path: '/creations-funeraires', label: 'Créations funéraires' },
  creationsSaisonnieres: { path: '/creations-saisonnieres', label: 'Créations saisonnières' },
  paques: { path: '/creations-saisonnieres/paques', label: 'Pâques' },
  noel: { path: '/creations-saisonnieres/noel', label: 'Noël' },
  feteDesMeres: { path: '/creations-saisonnieres/fete-des-meres', label: 'Fête des Mères' },
  personnalisation: { path: '/personnalisation', label: 'Personnalisation' },
}

const STATIC_PAGES = [
  { path: '/', label: 'Accueil', keywords: 'accueil créations florales charlène' },
  { path: '/contact', label: 'Contact', keywords: 'contact devis rendez-vous téléphone email' },
  { path: '/avis-google', label: 'Avis Google', keywords: 'avis témoignages clients google' },
  { path: '/panier', label: 'Panier', keywords: 'panier commande achat' },
  { path: '/paiement', label: 'Paiement', keywords: 'paiement sumup carte' },
  { path: '/personnalisation', label: 'Personnalisation', keywords: 'sur mesure gravure prénom' },
]

export function normalizeSearchText(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * @param {object} pageArticles — content.pageArticles (fusionné avec les défauts)
 * @returns {Array<{ id: string, kind: 'page'|'product', title: string, subtitle?: string, path: string, searchText: string }>}
 */
export function buildSiteSearchIndex(pageArticles) {
  const index = []

  for (const page of STATIC_PAGES) {
    index.push({
      id: `static:${page.path}`,
      kind: 'page',
      title: page.label,
      subtitle: 'Page du site',
      path: page.path,
      searchText: normalizeSearchText(`${page.label} ${page.keywords || ''}`),
    })
  }

  const articles = pageArticles && typeof pageArticles === 'object' ? pageArticles : {}

  for (const [key, section] of Object.entries(articles)) {
    if (!section || typeof section !== 'object') continue
    const meta = ARTICLE_PAGE_META[key] || { path: '/', label: key }
    const sectionBits = [meta.label, section.sectionTitle, section.intro].filter(Boolean).join(' ')

    index.push({
      id: `section:${key}`,
      kind: 'page',
      title: section.sectionTitle || meta.label,
      subtitle: meta.label,
      path: meta.path,
      searchText: normalizeSearchText(sectionBits),
    })

    const items = Array.isArray(section.items) ? section.items : []
    for (const item of items) {
      if (!item?.title) continue
      const bits = [meta.label, section.sectionTitle, item.title, item.description].filter(Boolean).join(' ')
      index.push({
        id: `item:${key}:${item.id || item.title}`,
        kind: 'product',
        title: item.title,
        subtitle: meta.label,
        path: meta.path,
        searchText: normalizeSearchText(bits),
      })
    }
  }

  return index
}

/**
 * @param {ReturnType<typeof buildSiteSearchIndex>} index
 * @param {string} rawQuery
 * @param {{ limit?: number }} [opts]
 */
export function searchSiteIndex(index, rawQuery, { limit = 8 } = {}) {
  const q = normalizeSearchText(rawQuery)
  if (q.length < 2) return []

  const tokens = q.split(' ').filter(Boolean)
  const scored = []

  for (const entry of index) {
    const hay = entry.searchText
    let score = 0
    for (const token of tokens) {
      if (!hay.includes(token)) {
        score = 0
        break
      }
      score += token.length
      if (entry.kind === 'product' && normalizeSearchText(entry.title).includes(token)) {
        score += 4
      }
      if (entry.kind === 'page' && normalizeSearchText(entry.title).includes(token)) {
        score += 2
      }
    }
    if (score > 0) scored.push({ entry, score })
  }

  scored.sort((a, b) => b.score - a.score || a.entry.title.localeCompare(b.entry.title, 'fr'))
  return scored.slice(0, limit).map((s) => s.entry)
}
