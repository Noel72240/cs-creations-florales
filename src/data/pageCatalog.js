/** Rubriques articles : clé admin → URL publique. */
export const ARTICLE_PAGE_META = {
  evenementsFloraux: { path: '/evenements-floraux', label: 'Événements floraux' },
  creationsFlorales: { path: '/creations-florales', label: 'Créations florales' },
  creationsFuneraires: { path: '/creations-funeraires', label: 'Créations funéraires' },
  creationsSaisonnieres: { path: '/creations-saisonnieres', label: 'Créations saisonnières' },
  personnalisation: { path: '/personnalisation', label: 'Personnalisations' },
  mariage: { path: '/evenements-floraux/mariage', label: 'Mariage' },
  anniversaire: { path: '/evenements-floraux/anniversaire', label: 'Anniversaire' },
  baptemeCommunion: { path: '/evenements-floraux/bapteme-communion', label: 'Baptême & Communion' },
  paques: { path: '/creations-saisonnieres/paques', label: 'Pâques' },
  noel: { path: '/creations-saisonnieres/noel', label: 'Noël' },
  feteDesMeres: { path: '/creations-saisonnieres/fete-des-meres', label: 'Fêtes des Mères/Pères' },
  feteDesGrandesMeres: { path: '/creations-saisonnieres/fete-des-grandes-meres', label: 'Fête des Grandes-Mères' },
}

/** Bandeaux par défaut (si non modifiés dans l’admin). */
export const PAGE_BANNER_FALLBACKS = {
  '/evenements-floraux': {
    title: 'Événements Floraux',
    subtitle: 'Créations sur mesure',
    photoKey: 'weddingTableFlorals',
  },
  '/evenements-floraux/anniversaire': {
    title: 'Anniversaire',
    subtitle: 'Événements floraux',
    photoKey: 'dahlias',
  },
  '/evenements-floraux/mariage': {
    title: 'Mariage',
    subtitle: 'Événements floraux',
    photoKey: 'weddingBouquet',
  },
  '/evenements-floraux/bapteme-communion': {
    title: 'Baptême & Communion',
    subtitle: 'Événements floraux',
    photoKey: 'peonies',
  },
  '/creations-florales': {
    title: 'Créations Florales & Décoratives',
    subtitle: 'Mon univers artisanal',
    photoKey: 'vaseInterior',
  },
  '/creations-funeraires': {
    title: 'Créations Funéraires',
    subtitle: 'Hommage floral',
    photoKey: 'wildflowers',
  },
  '/creations-saisonnieres': {
    title: 'Créations Saisonnières',
    subtitle: "Tout au long de l'année",
    photoKey: 'tulips',
  },
  '/creations-saisonnieres/paques': {
    title: 'Pâques',
    subtitle: 'Créations saisonnières',
    photoKey: 'wildflowers',
  },
  '/creations-saisonnieres/noel': {
    title: 'Noël',
    subtitle: 'Créations saisonnières',
    photoKey: 'rosesPink',
  },
  '/creations-saisonnieres/fete-des-meres': {
    title: 'Fêtes des Mères/Pères',
    subtitle: 'Créations saisonnières',
    photoKey: 'peonies',
  },
  '/creations-saisonnieres/fete-des-grandes-meres': {
    title: 'Fête des Grandes-Mères',
    subtitle: 'Créations saisonnières',
    photoKey: 'peonies',
  },
  '/personnalisation': {
    title: 'Personnalisations',
    subtitle: 'Créations sur mesure',
    photoKey: 'bouquetGift',
  },
}

export function pageKeyFromPath(pagePath) {
  const entry = Object.entries(ARTICLE_PAGE_META).find(([, m]) => m.path === pagePath)
  return entry ? entry[0] : null
}

export function rubriquePath(pageKey) {
  return ARTICLE_PAGE_META[pageKey]?.path || '/'
}

export function articleProductPath(pageKey, articleId) {
  return `/produit/${encodeURIComponent(pageKey)}/${encodeURIComponent(articleId)}`
}

export function findCatalogArticle(content, pageKey, articleId) {
  const raw = decodeURIComponent(articleId || '')
  const items = content?.pageArticles?.[pageKey]?.items
  if (!Array.isArray(items)) return null
  return items.find((it) => String(it.id) === raw) || null
}
