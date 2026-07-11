/** Modèles d’options par type de création (activables dans l’admin). */
export const PRODUCT_OPTION_TEMPLATES = {
  'verres-personnalises': {
    id: 'verres-personnalises',
    label: 'Verres personnalisés',
    pricingMode: 'glassTier',
    fields: ['textColor', 'personalizationText', 'roseColor', 'glassQuantity'],
  },
  'chiffres-floraux': {
    id: 'chiffres-floraux',
    label: 'Chiffres floraux',
    pricingMode: 'chiffreFloral',
    fields: ['chiffreNumber', 'chiffreSize', 'roseColorExtended', 'chiffreWishes'],
  },
  'centre-de-table': {
    id: 'centre-de-table',
    label: 'Centre de table',
    fields: ['roseColor', 'ledYesNo', 'largeFlowerColor', 'flowersDecorationsText'],
  },
  'fleur-sous-verre': {
    id: 'fleur-sous-verre',
    label: 'Fleur sous verre',
    fields: ['roseColor', 'textColor', 'personalizationText'],
  },
  'porte-alliance-floral': {
    id: 'porte-alliance-floral',
    label: 'Porte-alliance floral',
    fields: ['roseColor', 'specialRequests', 'inscriptionSupportYesNo'],
  },
  'plateau-miroir-porte-alliance': {
    id: 'plateau-miroir-porte-alliance',
    label: 'Plateau miroir porte-alliance',
    fields: ['roseColor', 'personalizationText', 'textColor', 'specialRequests'],
  },
  'bapteme-theme': {
    id: 'bapteme-theme',
    label: 'Création baptême (thème)',
    fields: ['roseColor', 'personalizationText', 'personalizationColor', 'themeText', 'specialRequests'],
  },
  'panneau-bapteme': {
    id: 'panneau-bapteme',
    label: 'Panneau de baptême',
    fields: ['roseColor', 'textColor', 'personalizationText', 'decorationSelect', 'decorationOtherText', 'specialRequests'],
  },
  'verre-communion': {
    id: 'verre-communion',
    label: 'Verre de communion',
    pricingMode: 'glassTier',
    fields: ['textColor', 'personalizationText', 'roseColor', 'glassQuantity'],
  },
  'coeur-plaque-acrylique': {
    id: 'coeur-plaque-acrylique',
    label: 'Cœur floral plaque acrylique',
    fields: ['roseColor', 'plaqueAcryliqueText', 'textColor', 'pearlYesNo', 'specialRequests'],
  },
  'cone-floral': {
    id: 'cone-floral',
    label: 'Cône floral',
    fields: ['coneColor', 'roseColorMulti', 'largeFlowerColorDual', 'flowerTypeText', 'pearlYesNo', 'pearlColorMulti', 'specialRequests'],
  },
  'coeur-plaque-bois': {
    id: 'coeur-plaque-bois',
    label: 'Cœur floral plaque bois',
    fields: ['roseColorMulti', 'plaqueWoodText', 'textColor', 'pearlColor', 'colombeYesNo', 'specialRequests'],
  },
  'grande-composition-florale': {
    id: 'grande-composition-florale',
    label: 'Grande composition florale',
    fields: ['messageSupportYesNo', 'messageSupportText', 'supportColorRoseBlanc', 'roseColorMulti', 'guirlandePearlColor', 'specialRequests'],
  },
  'ourson-floral': {
    id: 'ourson-floral',
    label: 'Ourson floral',
    fields: ['roseColorMulti', 'blueEyesYesNo', 'decorationTypeSelect', 'flowerColorIfFleur', 'coeurTextIfCoeur', 'textColor', 'specialRequests'],
  },
  'cadre-naissance': {
    id: 'cadre-naissance',
    label: 'Cadre de naissance',
    fields: ['roseColor', 'cloudColor', 'plaqueHeartText', 'textColor', 'birthSizeText', 'birthWeightText', 'birthTimeText', 'specialRequests'],
  },
  'coeur-love': {
    id: 'coeur-love',
    label: 'Cœur floral Love',
    fields: ['smallRoseColor', 'largeRoseColorMax3', 'loveInscriptionYesNo', 'decorationText', 'specialRequests'],
  },
  'petit-sac-floral': {
    id: 'petit-sac-floral',
    label: 'Petit sac floral',
    fields: ['bagColorPale', 'roseColorMax3', 'flowerSelect2', 'flowerDetailsLarge', 'specialRequests'],
  },
  'panneau-bienvenue': {
    id: 'panneau-bienvenue',
    label: 'Panneau de bienvenue',
    fields: ['roseColorMax3', 'personalizationText', 'textColor', 'welcomeDecorationLarge', 'specialRequests'],
  },
  'grand-sac-floral': {
    id: 'grand-sac-floral',
    label: 'Grand sac floral',
    fields: ['bagColorExtended', 'roseColorMax3', 'sacTopPersonalizationYesNo', 'sacTopPersonalizationText', 'textColor', 'flowerDetailsMax2', 'specialRequests'],
  },
  'papillon-floral': {
    id: 'papillon-floral',
    label: 'Papillon floral',
    fields: ['roseColor', 'papillonMetalSelect', 'flowerMin2Text', 'flowerColorsText', 'plaqueAcryliqueYesNo', 'plaqueAcryliqueTextIfYes', 'textColor'],
  },
  'boite-mouchoirs': {
    id: 'boite-mouchoirs',
    label: 'Boîte à mouchoirs florale',
    fields: ['largeFlowerColor', 'smallRoseColor', 'personalizationText', 'pearlYesNo', 'pearlColor', 'textColor', 'specialRequests'],
  },
  'camion-floral': {
    id: 'camion-floral',
    label: 'Camion floral',
    fields: ['roseColorMulti', 'plaqueAcryliqueYesNo', 'plaqueAcryliqueTextIfYes', 'textColor', 'specialRequests'],
  },
  'moto-florale': {
    id: 'moto-florale',
    label: 'Moto florale',
    fields: ['roseColorMulti', 'plaqueAcryliqueYesNo', 'plaqueAcryliqueTextIfYes', 'textColor', 'specialRequests'],
  },
  'ecrin-floral': {
    id: 'ecrin-floral',
    label: 'Écrin floral',
    fields: ['supportColorEcrin', 'pearlYesNo', 'pearlColor', 'messagePersonalizationYesNo', 'messagePersonalizationText', 'flowerColor', 'ribbonColor', 'specialRequests'],
  },
  'coeur-plexiglass': {
    id: 'coeur-plexiglass',
    label: 'Cœur plexiglass',
    fields: ['roseColorMax3', 'plaqueHeartYesNo', 'plaqueHeartTextIfYes', 'textColor', 'specialRequests'],
  },
  'miroir-floral': {
    id: 'miroir-floral',
    label: 'Miroir floral',
    fields: ['roseColorMax3', 'personalizationYesNo', 'personalizationTextIfYes', 'textColor', 'specialRequests'],
  },
  'communes-personnalisable': {
    id: 'communes-personnalisable',
    label: 'Options communes personnalisables',
    fields: ['personalizationYesNo', 'personalizationTextIfYes', 'textColor', 'roseColor', 'specialRequests'],
  },
  'plaque-funeraire': {
    id: 'plaque-funeraire',
    label: 'Plaque funéraire',
    fields: ['roseColorMax3', 'messagePersonalizationYesNo', 'messagePersonalizationText', 'personalizationColor', 'candleMessageYesNo', 'candleMessageText', 'candleTextColor', 'specialRequests'],
  },
  'croix-florale': {
    id: 'croix-florale',
    label: 'Croix florale',
    fields: ['roseColorMax3', 'plaqueAcryliqueYesNo', 'plaqueAcryliqueTextIfYes', 'personalizationColor', 'specialRequests'],
  },
  'tracteur-floral': {
    id: 'tracteur-floral',
    label: 'Tracteur floral',
    fields: ['roseColorMax3', 'plaqueAcryliqueYesNo', 'plaqueAcryliqueTextIfYes', 'personalizationColor', 'specialRequests'],
  },
  'ourson-sur-plaque': {
    id: 'ourson-sur-plaque',
    label: 'Ourson sur plaque florale',
    fields: ['roseColorMax3', 'plaqueAcryliqueYesNo', 'plaqueAcryliqueTextIfYes', 'personalizationColor', 'specialRequests'],
  },
  'coeur-sur-plaque': {
    id: 'coeur-sur-plaque',
    label: 'Cœur sur plaque florale',
    fields: ['roseColorMax3', 'plaqueAcryliqueYesNo', 'plaqueAcryliqueTextIfYes', 'personalizationColor', 'specialRequests'],
  },
  'couronne-deuil': {
    id: 'couronne-deuil',
    label: 'Couronne florale de deuil',
    fields: ['roseColorMax3', 'candleMessageYesNo', 'candleMessageText', 'personalizationColor', 'specialRequests'],
  },
  'jardin-souvenir': {
    id: 'jardin-souvenir',
    label: 'Jardin du Souvenir',
    fields: ['roseColorMax3', 'gateMaterial', 'plaqueAcryliqueYesNo', 'plaqueAcryliqueTextIfYes', 'personalizationColor', 'specialRequests'],
  },
  'lapin-paques': {
    id: 'lapin-paques',
    label: 'Lapin de Pâques floral',
    fields: ['roseColorMax3', 'plaqueAcryliqueYesNo', 'plaqueAcryliqueTextIfYes', 'personalizationColor', 'paquesDecorationsText'],
  },
}

export const PRODUCT_OPTION_TEMPLATE_LIST = Object.values(PRODUCT_OPTION_TEMPLATES)

/** Suggestion auto du modèle selon le titre de l’article (modifiable dans l’admin). */
export const TITLE_TO_OPTION_TEMPLATE = [
  { match: /verre.*personnal|verre à vin|verre anniversaire/i, templateId: 'verres-personnalises' },
  { match: /chiffre floral/i, templateId: 'chiffres-floraux' },
  { match: /centre de table|alliances entrelac/i, templateId: 'centre-de-table' },
  { match: /sous verre|sous cloche|rose sous/i, templateId: 'fleur-sous-verre' },
  { match: /alliances entrelac|porte.?alliance/i, templateId: 'porte-alliance-floral' },
  { match: /plateau alliances miroir|plateau miroir/i, templateId: 'plateau-miroir-porte-alliance' },
  { match: /plaque baptême|panneau bapt/i, templateId: 'panneau-bapteme' },
  { match: /verre communion|gobelet.*communion|gobelet bapt/i, templateId: 'verre-communion' },
  { match: /cône|cone floral/i, templateId: 'cone-floral' },
  { match: /plaque.*bois|suspension bois|cœur bois message/i, templateId: 'coeur-plaque-bois' },
  { match: /arche|grande composition/i, templateId: 'grande-composition-florale' },
  { match: /ourson/i, templateId: 'ourson-floral' },
  { match: /naissance|plaque naissance/i, templateId: 'cadre-naissance' },
  { match: /love/i, templateId: 'coeur-love' },
  { match: /sac matelassé|sac blanc|sac bleu|petit sac/i, templateId: 'petit-sac-floral' },
  { match: /bienvenue/i, templateId: 'panneau-bienvenue' },
  { match: /sac noir|grand sac|écrin blanc roses vertes/i, templateId: 'grand-sac-floral' },
  { match: /papillon/i, templateId: 'papillon-floral' },
  { match: /mouchoir/i, templateId: 'boite-mouchoirs' },
  { match: /camion/i, templateId: 'camion-floral' },
  { match: /moto/i, templateId: 'moto-florale' },
  { match: /écrin|coffret cœur/i, templateId: 'ecrin-floral' },
  { match: /plexiglass|acrylique/i, templateId: 'coeur-plexiglass' },
  { match: /miroir/i, templateId: 'miroir-floral' },
  { match: /plaque funéraire|hommage.*plaque/i, templateId: 'plaque-funeraire' },
  { match: /croix/i, templateId: 'croix-florale' },
  { match: /tracteur/i, templateId: 'tracteur-floral' },
  { match: /couronne.*bougie|couronne.*deuil/i, templateId: 'couronne-deuil' },
  { match: /jardin.*souvenir|arche souvenir/i, templateId: 'jardin-souvenir' },
  { match: /lapin.*pâques|lapin pâques/i, templateId: 'lapin-paques' },
  { match: /cœur.*personnalis|médaillon/i, templateId: 'coeur-plaque-acrylique' },
]

export function suggestTemplateIdFromTitle(title) {
  const t = String(title || '')
  for (const row of TITLE_TO_OPTION_TEMPLATE) {
    if (row.match.test(t)) return row.templateId
  }
  return ''
}

export function getProductOptionTemplate(templateId) {
  return PRODUCT_OPTION_TEMPLATES[templateId] || null
}
