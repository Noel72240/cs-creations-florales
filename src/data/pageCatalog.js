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
  saintValentin: { path: '/creations-saisonnieres/saint-valentin', label: 'Saint-Valentin' },
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
  '/creations-saisonnieres/saint-valentin': {
    title: 'Saint-Valentin',
    subtitle: 'Créations saisonnières',
    photoKey: 'rosesBouquet',
  },
  '/personnalisation': {
    title: 'Personnalisations',
    subtitle: 'Créations sur mesure',
    photoKey: 'bouquetGift',
  },
  '/panier': {
    title: 'Panier',
    subtitle: 'Votre sélection',
    photoKey: 'bouquetSoft',
  },
  '/contact': {
    title: 'Nous contacter',
    subtitle: 'Parlons de votre projet',
    photoKey: 'peonies',
  },
  '/paiement': {
    title: 'Paiement en ligne',
    subtitle: 'Paiement sécurisé en ligne — SumUp (CB, Visa, Mastercard)',
    photoKey: 'bouquetSoft',
  },
}

/** Pages utilitaires — bandeau modifiable dans l’admin (onglet Contact). */
export const UTILITY_PAGE_BANNERS = [
  { path: '/panier', label: 'Panier' },
  { path: '/contact', label: 'Contact' },
  { path: '/paiement', label: 'Paiement' },
]

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

/** @deprecated Prefer findCatalogArticle from ../lib/articleHubAggregation.js */
export { findCatalogArticle } from '../lib/articleHubAggregation'
