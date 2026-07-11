/**
 * Pages SEO discrètes (/guides/:slug) — non listées dans le menu principal.
 * Contenu optimisé pour la recherche locale et les intentions d’achat.
 */

export const SEO_HUB = {
  path: '/guides',
  title: 'Guides floraux & conseils',
  description:
    'Conseils et guides C&S Créations Florales : mariage, anniversaire, baptême, deuil, fête des mères et personnalisation à Écommoy et en Sarthe (72).',
}

/** @typedef {{ slug: string, title: string, metaDescription: string, h1: string, subtitle: string, sections: Array<{ heading: string, paragraphs: string[] }>, relatedLinks: Array<{ label: string, path: string }>, shopPath: string, faq: Array<{ question: string, answer: string }>, keywords: string[] }} SeoPage */

/** @type {SeoPage[]} */
export const SEO_PAGES = [
  {
    slug: 'fleuriste-ecommoy-sarthe',
    title: 'Fleuriste à Écommoy (72220) — Créations sur mesure',
    metaDescription:
      'C&S Créations Florales, artisan fleuriste à Écommoy en Sarthe : bouquets, compositions stabilisées, mariages et cadeaux personnalisés. Devis gratuit sous 24 h.',
    h1: 'Fleuriste artisanale à Écommoy, en Sarthe',
    subtitle: 'Compositions florales durables, personnalisées et livrées avec soin',
    keywords: ['fleuriste Écommoy', 'fleuriste Sarthe 72', 'composition florale Écommoy'],
    shopPath: '/creations-florales',
    relatedLinks: [
      { label: 'Mariage', path: '/evenements-floraux/mariage' },
      { label: 'Contact & devis', path: '/contact' },
    ],
    sections: [
      {
        heading: 'Une créatrice florale locale à votre écoute',
        paragraphs: [
          'Basée à Écommoy (72220), C&S Créations Florales réalise des compositions en fleurs stabilisées et artificielles de haute qualité : elles conservent leur beauté longtemps et s’adaptent à tous vos événements.',
          'Chaque projet est pensé avec vous — couleurs, formes, messages gravés — pour un résultat unique, élégant et fidèle à votre histoire.',
        ],
      },
      {
        heading: 'Prestations pour particuliers et professionnels',
        paragraphs: [
          'Mariages, anniversaires, baptêmes et communions, hommages funéraires, fêtes des mères, Pâques ou Noël : nous concevons des pièces sur mesure ainsi que des cadeaux personnalisés (verres gravés, plaques, oursons fleuris…).',
          'Retrait sur place ou livraison selon votre zone : Écommoy, Le Mans, Sablé-sur-Sarthe et communes alentour en Sarthe.',
        ],
      },
    ],
    faq: [
      {
        question: 'Proposez-vous des fleurs fraîches coupées ?',
        answer:
          'Nous sommes spécialisés dans les fleurs en mousse stabilisée et artificielles haut de gamme, idéales pour des créations durables et personnalisables.',
      },
      {
        question: 'Comment obtenir un devis ?',
        answer: 'Remplissez le formulaire de contact ou commandez en ligne : réponse habituellement sous 24 h.',
      },
    ],
  },
  {
    slug: 'composition-florale-mariage-sarthe',
    title: 'Composition florale mariage en Sarthe',
    metaDescription:
      'Décoration florale de mariage en Sarthe : bouquet de mariée, centres de table, plateau d’alliances. Créations durables et personnalisées à Écommoy.',
    h1: 'Composition florale pour votre mariage en Sarthe',
    subtitle: 'Bouquets, tables d’honneur et décors romantiques sur mesure',
    keywords: ['fleuriste mariage Sarthe', 'bouquet mariée Le Mans', 'décoration florale mariage'],
    shopPath: '/evenements-floraux/mariage',
    relatedLinks: [
      { label: 'Galerie mariage', path: '/evenements-floraux/mariage' },
      { label: 'Personnalisations', path: '/personnalisation' },
    ],
    sections: [
      {
        heading: 'Un univers floral cohérent le jour J',
        paragraphs: [
          'De la palette de couleurs au style (champêtre, romantique, moderne), chaque élément est harmonisé : bouquet de mariée, boutonnières, centres de table et accessoires de cérémonie.',
          'Les fleurs stabilisées permettent de préparer à l’avance et de conserver un souvenir précieux après la fête.',
        ],
      },
      {
        heading: 'Accompagnement personnalisé',
        paragraphs: [
          'Échange en amont pour comprendre votre lieu, votre thème et votre budget. Possibilité d’intégrer des détails gravés ou des initiales pour une touche unique.',
        ],
      },
    ],
    faq: [
      {
        question: 'À quelle date faut-il commander ?',
        answer: 'Plus tôt est préférable pour les mariages : contactez-nous dès que la date est fixée pour garantir la disponibilité.',
      },
    ],
  },
  {
    slug: 'bouquet-anniversaire-personnalise',
    title: 'Bouquet & cadeau floral anniversaire personnalisé',
    metaDescription:
      'Bouquet d’anniversaire personnalisé en Sarthe : chiffres fleuris, oursons en roses, verres gravés. Cadeau original et durable à offrir.',
    h1: 'Bouquet et cadeau floral d’anniversaire personnalisé',
    subtitle: 'Chiffres, cœurs, oursons et gravures pour toutes les âges',
    keywords: ['bouquet anniversaire Sarthe', 'cadeau floral personnalisé', 'chiffre fleuri anniversaire'],
    shopPath: '/evenements-floraux/anniversaire',
    relatedLinks: [
      { label: 'Créations anniversaire', path: '/evenements-floraux/anniversaire' },
      { label: 'Créations florales', path: '/creations-florales' },
    ],
    sections: [
      {
        heading: 'Des idées cadeaux qui marquent les esprits',
        paragraphs: [
          'Chiffres en roses, cœurs dédicacés, oursons fleuris ou verres gravés : nos créations en fleurs stabilisées sont pensées pour surprendre et durer.',
          'Indiquez l’âge, les prénoms ou un message : nous adaptons les couleurs et la mise en scène.',
        ],
      },
    ],
    faq: [
      {
        question: 'Puis-je commander en ligne ?',
        answer: 'Oui, ajoutez les articles au panier sur le site ou demandez une création sur mesure via la page contact.',
      },
    ],
  },
  {
    slug: 'fleurs-bapteme-communion',
    title: 'Fleurs baptême & communion — Sarthe',
    metaDescription:
      'Compositions florales pour baptême et communion : plaques personnalisées, gobelets, centres de table. Artisan fleuriste à Écommoy (72).',
    h1: 'Compositions florales baptême & communion',
    subtitle: 'Souvenirs délicats et décors de cérémonie',
    keywords: ['fleurs baptême Sarthe', 'composition communion', 'cadeau baptême floral'],
    shopPath: '/evenements-floraux/bapteme-communion',
    relatedLinks: [{ label: 'Rubrique baptême', path: '/evenements-floraux/bapteme-communion' }],
    sections: [
      {
        heading: 'Des créations symboliques et raffinées',
        paragraphs: [
          'Plaques avec prénom et date, colombes, anges ou nuages de roses : chaque pièce respecte l’esprit de la cérémonie tout en restant élégante.',
          'Idéal en cadeau pour les parrains, marraines ou invités.',
        ],
      },
    ],
    faq: [],
  },
  {
    slug: 'composition-funeraire-sarthe',
    title: 'Composition florale funéraire en Sarthe',
    metaDescription:
      'Hommage floral et compositions funéraires en Sarthe : couronnes, plaques, coussins de fleurs stabilisées. Discrétion et respect à Écommoy.',
    h1: 'Compositions florales funéraires en Sarthe',
    subtitle: 'Hommages durables avec pudeur et attention',
    keywords: ['fleurs deuil Sarthe', 'composition funéraire', 'couronne fleurs artificielles'],
    shopPath: '/creations-funeraires',
    relatedLinks: [{ label: 'Créations funéraires', path: '/creations-funeraires' }],
    sections: [
      {
        heading: 'Un accompagnement respectueux',
        paragraphs: [
          'Couronnes, coussins, plaques et compositions deuil sont réalisés avec des fleurs stabilisées de qualité, dans des tons adaptés à vos souhaits.',
          'Personnalisation possible : prénom, dates, messages discrets.',
        ],
      },
    ],
    faq: [],
  },
  {
    slug: 'cadeau-fete-des-meres-floral',
    title: 'Cadeau fête des Mères floral personnalisé',
    metaDescription:
      'Idées cadeau fête des Mères en Sarthe : cœurs gravés, oursons en roses, compositions murales. Livraison et retrait à Écommoy.',
    h1: 'Cadeau floral pour la fête des Mères',
    subtitle: 'Cœurs, oursons et messages gravés pour maman',
    keywords: ['cadeau fête des mères fleurs', 'composition fête des mères Sarthe'],
    shopPath: '/creations-saisonnieres/fete-des-meres',
    relatedLinks: [{ label: 'Fête des Mères', path: '/creations-saisonnieres/fete-des-meres' }],
    sections: [
      {
        heading: 'Des attentions qui durent',
        paragraphs: [
          'Offrez une création qui ne fane pas : roses stabilisées, bois gravé et détails nacrés pour un présent tendre et raffiné.',
        ],
      },
    ],
    faq: [],
  },
  {
    slug: 'fleurs-artificielles-stabilisees',
    title: 'Fleurs artificielles & stabilisées haut de gamme',
    metaDescription:
      'Compositions en fleurs de mousse et artificielles premium : rendu naturel, longue durée, personnalisation à Écommoy. Idéal cadeau et décoration.',
    h1: 'Fleurs artificielles et stabilisées : l’artisanat durable',
    subtitle: 'Beauté longue durée, sans entretien d’eau',
    keywords: ['fleurs stabilisées Sarthe', 'fleurs artificielles haut de gamme', 'fleurs en mousse'],
    shopPath: '/creations-florales',
    relatedLinks: [{ label: 'Voir la boutique', path: '/creations-florales' }],
    sections: [
      {
        heading: 'Pourquoi choisir des fleurs stabilisées ?',
        paragraphs: [
          'Elles conservent couleurs et forme pendant des mois voire des années, résistent aux environnements intérieurs et permettent des détails impossibles avec des fleurs coupées fragiles.',
          'Parfaites pour cadeaux, décors de table, hommages et événements planifiés longtemps à l’avance.',
        ],
      },
    ],
    faq: [],
  },
  {
    slug: 'personnalisation-florale-gravure',
    title: 'Personnalisation florale & gravure sur mesure',
    metaDescription:
      'Gravure, prénoms et messages sur créations florales et objets : verres, plaques, cœurs bois. Atelier à Écommoy, Sarthe.',
    h1: 'Personnalisation florale et gravure',
    subtitle: 'Votre message, votre style, notre savoir-faire',
    keywords: ['gravure florale Sarthe', 'cadeau personnalisé fleurs', 'objet gravé mariage'],
    shopPath: '/personnalisation',
    relatedLinks: [{ label: 'Exemples personnalisation', path: '/personnalisation' }],
    sections: [
      {
        heading: 'Du sur-mesure pour chaque occasion',
        paragraphs: [
          'Prénoms, dates, citations ou symboles : nous intégrons votre texte sur bois, verre ou médaillons intégrés aux compositions.',
          'Idéal mariage, naissance, anniversaire ou hommage.',
        ],
      },
    ],
    faq: [],
  },
  {
    slug: 'fleuriste-le-mans-proximite',
    title: 'Fleuriste près du Mans — Livraison Sarthe',
    metaDescription:
      'Créations florales artisanales livrées vers Le Mans et agglomération depuis Écommoy. Mariages, cadeaux et deuil en Sarthe (72).',
    h1: 'Créatrice florale près du Mans (72)',
    subtitle: 'À Écommoy, à quelques minutes de l’agglomération mancelle',
    keywords: ['fleuriste Le Mans', 'livraison fleurs Sarthe', 'composition florale 72'],
    shopPath: '/contact',
    relatedLinks: [
      { label: 'Nous contacter', path: '/contact' },
      { label: 'Accueil', path: '/' },
    ],
    sections: [
      {
        heading: 'Proximité et flexibilité',
        paragraphs: [
          'Clients du Mans, Allonnes, Changé et environs : retrait à l’atelier ou livraison selon disponibilité. Devis rapide pour vos événements et cadeaux.',
        ],
      },
    ],
    faq: [],
  },
  {
    slug: 'fleuriste-sable-sur-sarthe',
    title: 'Compositions florales vers Sablé-sur-Sarthe',
    metaDescription:
      'Artisan fleuriste desservant Sablé-sur-Sarthe et Sud Sarthe : bouquets durables, mariages et personnalisation depuis Écommoy.',
    h1: 'Fleurs artisanales vers Sablé-sur-Sarthe',
    subtitle: 'Créations livrées dans le Sud Sarthe',
    keywords: ['fleuriste Sablé-sur-Sarthe', 'composition florale 72300'],
    shopPath: '/contact',
    relatedLinks: [{ label: 'Contact', path: '/contact' }],
    sections: [
      {
        heading: 'Un atelier au cœur de la Sarthe',
        paragraphs: [
          'Depuis Écommoy, nous accompagnons les familles et organisateurs d’événements du secteur Sablé avec des pièces uniques et soignées.',
        ],
      },
    ],
    faq: [],
  },
  {
    slug: 'decoration-paques-florale',
    title: 'Décoration florale de Pâques artisanale',
    metaDescription:
      'Lapins floraux, œufs décorés et centres de table de Pâques en fleurs stabilisées. Commande en ligne et sur mesure en Sarthe.',
    h1: 'Décoration florale de Pâques',
    subtitle: 'Lapins en roses, œufs dorés et compositions printanières',
    keywords: ['décoration Pâques fleurs', 'lapin floral Sarthe'],
    shopPath: '/creations-saisonnieres/paques',
    relatedLinks: [{ label: 'Créations Pâques', path: '/creations-saisonnieres/paques' }],
    sections: [
      {
        heading: 'L’esprit du printemps sur votre table',
        paragraphs: [
          'Compositions joyeuses et durables pour familles et professionnels : idées cadeaux et décors de vitrine.',
        ],
      },
    ],
    faq: [],
  },
  {
    slug: 'centre-table-mariage-fleurs',
    title: 'Centre de table mariage fleurs stabilisées',
    metaDescription:
      'Centres de table et décors de réception mariage en fleurs stabilisées : élégance, cohérence et souvenirs durables. Devis Écommoy / Sarthe.',
    h1: 'Centres de table et décors de réception mariage',
    subtitle: 'Harmonie florale sur toutes vos tables',
    keywords: ['centre de table mariage', 'décoration table mariage Sarthe'],
    shopPath: '/evenements-floraux/mariage',
    relatedLinks: [{ label: 'Mariage', path: '/evenements-floraux/mariage' }],
    sections: [
      {
        heading: 'Cohérence visuelle pour votre salle',
        paragraphs: [
          'Nous déclinons votre thème sur les tables d’invités, la table d’honneur et les accessoires (plateau d’alliances, arche, etc.).',
        ],
      },
    ],
    faq: [],
  },
]

export function getSeoPageBySlug(slug) {
  return SEO_PAGES.find((p) => p.slug === slug) || null
}

export const SEO_PAGE_SLUGS = SEO_PAGES.map((p) => p.slug)
