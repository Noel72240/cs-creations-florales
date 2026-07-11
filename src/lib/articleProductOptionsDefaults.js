import { normalizeArticleProductOptions } from '../lib/articleProductOptions'
import { getProductOptionTemplate, suggestTemplateIdFromTitle } from '../data/productOptionTemplates'

/**
 * Modèle d’options par identifiant article (prioritaire sur le titre).
 * Clé = id article (`creations-florales-001`, etc.).
 */
export const ARTICLE_OPTION_TEMPLATE_BY_ID = {
  // — Créations florales —
  'creations-florales-001': 'coeur-plaque-acrylique',
  'creations-florales-002': 'coeur-plaque-acrylique',
  'creations-florales-003': 'coeur-plaque-acrylique',
  'creations-florales-004': 'coeur-plaque-acrylique',
  'creations-florales-005': 'ourson-floral',
  'creations-florales-006': 'ourson-floral',
  'creations-florales-007': 'communes-personnalisable',
  'creations-florales-008': 'cadre-naissance',
  'creations-florales-009': 'coeur-love',
  'creations-florales-010': 'communes-personnalisable',
  'creations-florales-011': 'coeur-plaque-acrylique',
  'creations-florales-012': 'ecrin-floral',
  'creations-florales-013': 'coeur-plaque-acrylique',
  'creations-florales-014': 'ecrin-floral',
  'creations-florales-015': 'coeur-plaque-acrylique',
  'creations-florales-016': 'petit-sac-floral',
  'creations-florales-017': 'petit-sac-floral',
  'creations-florales-018': 'petit-sac-floral',
  'creations-florales-019': 'petit-sac-floral',
  'creations-florales-020': 'grand-sac-floral',
  'creations-florales-021': 'panneau-bienvenue',
  'creations-florales-022': 'panneau-bienvenue',
  'creations-florales-023': 'panneau-bienvenue',
  'creations-florales-024': 'panneau-bienvenue',
  'creations-florales-025': 'panneau-bienvenue',
  'creations-florales-026': 'panneau-bienvenue',
  'creations-florales-027': 'panneau-bienvenue',
  'creations-florales-028': 'miroir-floral',
  'creations-florales-029': 'papillon-floral',
  'creations-florales-030': 'communes-personnalisable',
  'creations-florales-031': 'communes-personnalisable',
  'creations-florales-032': 'communes-personnalisable',
  'creations-florales-033': 'coeur-plaque-acrylique',
  'creations-florales-034': 'boite-mouchoirs',
  'creations-florales-035': 'boite-mouchoirs',
  'creations-florales-036': 'coeur-plaque-acrylique',
  'creations-florales-037': 'fleur-sous-verre',
  'creations-florales-038': 'fleur-sous-verre',

  // — Funéraire —
  'creations-funeraires-001': 'coeur-sur-plaque',
  'creations-funeraires-002': 'coeur-sur-plaque',
  'creations-funeraires-003': 'croix-florale',
  'creations-funeraires-004': 'couronne-deuil',
  'creations-funeraires-005': 'couronne-deuil',
  'creations-funeraires-006': 'jardin-souvenir',
  'creations-funeraires-007': 'jardin-souvenir',
  'creations-funeraires-008': 'jardin-souvenir',
  'creations-funeraires-009': 'plaque-funeraire',
  'creations-funeraires-010': 'plaque-funeraire',
  'creations-funeraires-011': 'croix-florale',
  'creations-funeraires-012': 'croix-florale',
  'creations-funeraires-013': 'papillon-floral',
  'creations-funeraires-014': 'moto-florale',
  'creations-funeraires-015': 'camion-floral',

  // — Anniversaire —
  'anniversaire-001': 'verres-personnalises',
  'anniversaire-002': 'verres-personnalises',
  'anniversaire-003': 'chiffres-floraux',

  // — Baptême & communion —
  'bapteme-communion-001': 'croix-florale',
  'bapteme-communion-002': 'verre-communion',
  'bapteme-communion-003': 'verre-communion',
  'bapteme-communion-004': 'panneau-bapteme',

  // — Mariage —
  'mariage-003': 'centre-de-table',
  'mariage-002': 'fleur-sous-verre',
  'mariage-004': 'plateau-miroir-porte-alliance',

  // — Fête des mères —
  'fete-des-meres-001': 'coeur-plaque-bois',
  'fete-des-meres-002': 'coeur-plaque-acrylique',
  'fete-des-meres-003': 'coeur-plaque-acrylique',
  'fete-des-meres-004': 'coeur-plaque-acrylique',
  'fete-des-meres-005': 'ourson-floral',
  'fete-des-meres-006': 'coeur-plaque-bois',

  // — Fête des grandes-mères —
  'fete-des-grandes-meres-001': 'coeur-plaque-bois',
  'fete-des-grandes-meres-002': 'coeur-plaque-acrylique',
  'fete-des-grandes-meres-003': 'coeur-plaque-acrylique',
  'fete-des-grandes-meres-004': 'coeur-plaque-bois',

  // — Pâques —
  'paques-001': 'lapin-paques',
  'paques-002': 'lapin-paques',
  'paques-003': 'communes-personnalisable',

  // — Personnalisation —
  'personnalisation-001': 'coeur-plaque-bois',
  'personnalisation-002': 'coeur-plaque-bois',
  'personnalisation-003': 'coeur-plaque-bois',
  'personnalisation-004': 'coeur-plaque-bois',
  'personnalisation-005': 'communes-personnalisable',
  'personnalisation-006': 'communes-personnalisable',
  'personnalisation-007': 'communes-personnalisable',
  'personnalisation-008': 'communes-personnalisable',
  'personnalisation-009': 'verre-communion',
  'personnalisation-010': 'verres-personnalises',
  'personnalisation-011': 'verres-personnalises',
  'personnalisation-012': 'verre-communion',
  'personnalisation-013': 'communes-personnalisable',

  // — Hub événements / saison —
  'evt-mariage-plateau': 'plateau-miroir-porte-alliance',
  'evt-anniversaire-verre': 'verres-personnalises',
  'evt-anniversaire-chiffre': 'chiffres-floraux',
  'evt-bapteme-plaque': 'panneau-bapteme',
  'evt-bapteme-gobelet': 'verre-communion',
  'sai-paques-lapin': 'lapin-paques',
  'sai-paques-lapin-gris': 'lapin-paques',
  'sai-fete-meres-plaque': 'coeur-plaque-bois',
  'sai-fete-meres-coeur': 'coeur-plaque-acrylique',
  'sai-fete-meres-ours': 'ourson-floral',
}

/** Articles sans formulaire d’options (vitrine / inspiration uniquement). */
const NO_OPTIONS_ARTICLE_IDS = new Set(['mariage-001', 'personnalisation-014'])

function resolveTemplateId(article) {
  const id = String(article?.id || '').trim()
  if (NO_OPTIONS_ARTICLE_IDS.has(id)) return ''
  if (ARTICLE_OPTION_TEMPLATE_BY_ID[id]) return ARTICLE_OPTION_TEMPLATE_BY_ID[id]
  return suggestTemplateIdFromTitle(article?.title)
}

/** Réglages couleurs multi par défaut selon le modèle. */
function defaultFieldSettings(templateId) {
  if (templateId === 'communes-personnalisable') {
    return { roseColorMulti: { multi: true, max: 99 } }
  }
  return {}
}

export function buildArticleProductOptions(article) {
  const templateId = resolveTemplateId(article)
  if (!templateId || !getProductOptionTemplate(templateId)) return null
  return {
    active: true,
    templateId,
    enabledFields: [],
    fieldSettings: defaultFieldSettings(templateId),
  }
}

/** Active les formulaires d’options sur tout le catalogue par défaut. */
export function enrichCatalogWithProductOptions(catalog) {
  if (!catalog || typeof catalog !== 'object') return catalog
  const out = {}
  for (const [pageKey, page] of Object.entries(catalog)) {
    out[pageKey] = {
      ...page,
      items: (page.items || []).map((article) => {
        if (article.productOptions?.active) return article
        const productOptions = buildArticleProductOptions(article)
        if (!productOptions) return article
        return { ...article, productOptions }
      }),
    }
  }
  return out
}

export function enrichPageArticlesObject(pageArticles) {
  if (!pageArticles || typeof pageArticles !== 'object') return pageArticles
  const out = {}
  for (const [pageKey, page] of Object.entries(pageArticles)) {
    out[pageKey] = {
      ...page,
      items: (page.items || []).map(enrichArticleWithProductOptions),
    }
  }
  return out
}

export function enrichArticleWithProductOptions(article) {
  const existing = article?.productOptions
  if (existing?.active === false) return article
  if (existing?.active === true && existing?.templateId) {
    return {
      ...article,
      productOptions: normalizeArticleProductOptions(existing, article?.title),
    }
  }
  const built = buildArticleProductOptions(article)
  if (!built) return article
  return { ...article, productOptions: built }
}

export function enrichPageArticlesProductOptions(pageArticles) {
  if (!pageArticles || typeof pageArticles !== 'object') return pageArticles
  const out = {}
  for (const [pageKey, page] of Object.entries(pageArticles)) {
    out[pageKey] = {
      ...page,
      items: (page.items || []).map(enrichArticleWithProductOptions),
    }
  }
  return out
}
