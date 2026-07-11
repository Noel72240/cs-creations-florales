/**
 * Contenu éditable du site — valeurs par défaut.
 * Fusionné avec localStorage + optionnellement /public/site-content.json
 */
import { SITE as SITE_BASE, WEB_DEV as WEB_DEV_BASE } from '../config/site'
import { PAGE_ARTICLE_CATALOG } from './articleCatalog'
import { EVENEMENTS_FLORAUX_HUB_DEFAULTS } from '../lib/eventHubCards'

export const SITE_CONTENT_VERSION = 7

/** Nombre max d’articles boutique par page rubrique (admin + grille vitrine). */
export const MAX_PAGE_ARTICLES = 50

export const SITE_CONTENT_DEFAULTS = {
  version: SITE_CONTENT_VERSION,
  /** Remplace VITE_SUMUP_PAYMENT_URL si renseigné */
  sumupPaymentUrl: '',

  site: { ...SITE_BASE },
  webDev: { ...WEB_DEV_BASE },

  /** Bandeau maintenance + blocage des paiements en ligne */
  maintenance: {
    enabled: false,
    title: 'Site en cours de maintenance',
    message:
      'Notre site est momentanément en maintenance. Les paiements en ligne sont suspendus — vous pouvez nous contacter pour toute commande ou devis.',
  },

  navbar: {
    /** Bannière toute en haut (style annonce, police script) */
    promoBanner: {
      enabled: true,
      /** Multiplicateur de la taille du texte (1 = 100 %, modifiable dans l’admin) */
      fontScale: 1.08,
      /** Surligné en style « code » si présent dans le texte */
      code: 'Bienvenuecscreationflorale10',
      percentOff: 10,
      minSubtotal: 35,
      firstOrderOnly: true,
      label: '10 % sur votre 1ère commande',
      text:
        'Pour votre 1ère commande : 10% sur le site avec un minimum d’achat de 35€ avec le code Bienvenuecscreationflorale10',
    },
    topBarMessage: '✿ Créations florales artisanales sur mesure — Écommoy Sarthe (72) ✿',
  },

  footer: {
    brandTitle: 'C&S Créations Florales',
    brandLead:
      'Créatrice florale passionnée, je réalise des compositions artisanales uniques pour tous vos moments de vie, avec soin et élégance.',
    paymentWithSumup:
      'carte bancaire en ligne (SumUp), sur place (terminal SumUp), virement, chèque et espèces selon modalités convenues.',
    paymentWithoutSumup:
      'carte bancaire (terminal SumUp sur rendez-vous), virement, chèque et espèces selon modalités convenues.',
    facebookUrl: 'https://www.facebook.com',
    instagramUrl: 'https://www.instagram.com',
    tiktokUrl: 'https://www.tiktok.com',
  },

  contact: {
    addressLine: '72220 Écommoy, Sarthe',
    availability: 'Lun–Sam · 9h–18h',
  },

  googleReviews: {
    pageTitle: 'Avis Google',
    pageSubtitle: 'Ce que nos clients disent',
    intro:
      'Merci pour votre confiance. Voici quelques témoignages partagés sur Google — n’hésitez pas à laisser le vôtre après votre commande.',
    googleUrl: '',
    ctaLabel: 'Voir nos avis sur Google',
    items: [
      {
        id: 'demo-1',
        authorName: 'Sophie L.',
        rating: 5,
        text: 'Un bouquet magnifique pour notre mariage, délicat et exactement comme je l’avais imaginé. Merci Charlène pour votre écoute et votre talent.',
        publishedAt: 'janvier 2025',
      },
      {
        id: 'demo-2',
        authorName: 'Marc & Julie',
        rating: 5,
        text: 'Composition funéraire très touchante, réalisée avec beaucoup de soin. Nous recommandons sans hésiter.',
        publishedAt: 'décembre 2024',
      },
    ],
  },

  home: {
    /** Texte sous le hero, avant « Mes réalisations / Coups de cœur » */
    intro: {
      headline: 'Créatrice florale en Sarthe',
      tagline: 'Des fleurs qui racontent votre histoire.',
      paragraph:
        'Je réalise des créations florales personnalisées, uniques, pour sublimer chaque moment et accompagner vos occasions importantes.',
    },
    hero: {
      /** Fond (hero + body) : comme les galeries — src prioritaire, sinon clé Unsplash ; vide = site-bg.png */
      backgroundSrc: '',
      backgroundPhotoKey: '',
      pretitle: 'Créations artisanales',
      titleLine1: 'C&S Créations Florales',
      titleLine2: 'et Personnalisations',
      searchPlaceholder: 'Rechercher : mariage, bouquet, fête des mères…',
      searchHint: 'Mariage, anniversaire, deuil, fête des mères… — 2 lettres minimum.',
      ctaPrimaryLabel: 'Découvrir mes créations',
      ctaPrimaryPath: '/evenements-floraux',
      ctaSecondaryLabel: 'Demander un devis',
      ctaSecondaryPath: '/contact',
      scrollLabel: 'Découvrir',
    },
    quiSuisJe: {
      sectionPretitle: 'À propos',
      sectionTitle: 'Qui suis-je ?',
      badgeTitle: '✿ Artisan floral',
      badgeLine: 'Écommoy, Sarthe',
      values: [
        { icon: '🌸', label: 'Artisanat' },
        { icon: '💜', label: 'Passion' },
        { icon: '✨', label: 'Sur mesure' },
      ],
      ctaLabel: 'Me contacter',
      ctaPath: '/contact',
      /** {firstName} sera remplacé par le prénom du site */
      paragraphs: [
        'Bonjour, je suis {firstName}, j’ai 33 ans.',
        'Passionnée par l’art et les fleurs, j’ai fait de cette passion mon métier. C&S Créations Florales a été créée en mémoire d’un être cher parti trop tôt, à qui je rends hommage à travers chacune de mes réalisations.',
        'Chaque composition est élaborée avec des fleurs en mousse et artificielles, disposées avec soin, délicatesse et attention pour mettre en valeur chaque détail. Mes créations artisanales, uniques et personnalisables, racontent vos souvenirs et s’adaptent à toutes vos occasions : anniversaire, mariage, baptême ou moment de recueillement.',
        'Chez C&S Créations Florales, chaque réalisation est pensée sur mesure et réalisée avec passion, soin et attention, pour vous offrir une composition véritablement unique.',
        'Je serai ravie de concevoir pour vous une pièce florale qui reflète vos émotions et illumine vos instants précieux.',
        'Possibilité de remise en main propre ou de livraison selon votre convenance.',
      ],
    },
    moto: {
      overlayTitle: 'Création sur mesure',
      pretitle: 'Création sur mesure',
      title: 'La moto florale',
      photoKey: '',
      src: '/moto-florale.png',
      paragraphs: [
        'Une pièce unique, pensée pour marquer les esprits : une création florale sur moto, idéale pour des vitrines, événements, surprises et séances photos.',
        'Dites-moi vos couleurs, l’ambiance et la date — je vous propose une création entièrement adaptée à votre projet.',
      ],
      tip: '',
      ctaPrimary: 'Demander un devis',
      ctaSecondary: 'Voir des inspirations',
    },
    coupsDeCoeur: {
      pretitle: 'Mes réalisations',
      title: 'Coup de cœur',
      intro:
        'Découvrez mes compositions les plus appréciées, créées avec des fleurs en mousse, parfaites pour tous vos événements et personnalisables selon vos envies.',
      ctaLabel: 'Voir toutes mes créations',
      ctaPath: '/creations-florales',
      items: [
        { photoKey: 'weddingBouquet', label: 'Bouquet de mariée', src: '' },
        { photoKey: 'peonies', label: 'Couronne florale', src: '' },
        { photoKey: 'bouquetSoft', label: 'Composition de table', src: '' },
        { photoKey: 'wildflowers', label: 'Pivoines & roses', src: '' },
        { photoKey: 'dahlias', label: 'Arrangement romantique', src: '' },
      ],
    },
    prestations: {
      pretitle: 'Mes univers',
      title: 'Mes prestations',
      categories: [
        {
          title: 'Événements floraux',
          desc: 'Mariages, anniversaires, baptêmes... Des créations uniques pour chaque moment précieux.',
          icon: '💐',
          path: '/evenements-floraux',
          photoKey: 'weddingTableFlorals',
          src: '',
        },
        {
          title: 'Créations florales',
          desc: 'Compositions décoratives artisanales pour embellir votre intérieur au fil des saisons.',
          icon: '🌸',
          path: '/creations-florales',
          photoKey: 'vaseInterior',
          src: '',
        },
        {
          title: 'Créations saisonnières',
          desc: 'Pâques, Noël, Fêtes des Mères/Pères, Fête des Grandes-Mères — des créations adaptées à chaque saison et tradition.',
          icon: '🌿',
          path: '/creations-saisonnieres',
          photoKey: 'tulips',
          src: '',
        },
        {
          title: 'Personnalisations',
          desc: 'Objets, accessoires, cadeaux personnalisés pour offrir quelque chose de vraiment unique.',
          icon: '✨',
          path: '/personnalisation',
          photoKey: 'bouquetGift',
          src: '',
        },
      ],
    },
    contactStrip: {
      pretitle: 'Votre projet, ma passion',
      title: 'Créons quelque chose de beau ensemble',
      subtitle: 'Devis gratuit · Réponse sous 24h · Écommoy Sarthe et environs (72)',
      ctaLabel: 'Demander un devis gratuit',
      phoneCtaPrefix: '📞 Appeler ',
    },
  },

  /**
   * Articles vitrine (5 par page rubrique) : photo, description, prix — éditables via JSON / futur admin.
   */
  pageArticles: {
    evenementsFloraux: {
      sectionTitle: 'Nos créations événementielles',
      intro:
        'Aperçu de nos réalisations — consultez chaque rubrique (mariage, anniversaire, baptême) pour voir toutes les créations.',
      hubIntro: EVENEMENTS_FLORAUX_HUB_DEFAULTS.hubIntro,
      eventCards: EVENEMENTS_FLORAUX_HUB_DEFAULTS.eventCards.map((c) => ({ ...c })),
      items: [
        {
          id: 'evt-mariage-plateau',
          title: 'Plateau alliances miroir',
          description: 'Plateau personnalisé pour l’échange des alliances, roses blanches et coffret cœur.',
          price: 0,
          photoKey: 'weddingBouquet',
          src: '/images/articles/mariage/004.png',
        },
        {
          id: 'evt-anniversaire-verre',
          title: 'Verre anniversaire 18 ans',
          description: 'Verre gravé doré pour fêter une majorité ou un anniversaire mémorable.',
          price: 0,
          photoKey: 'dahlias',
          src: '/images/articles/anniversaire/001.png',
        },
        {
          id: 'evt-anniversaire-chiffre',
          title: 'Chiffre floral anniversaire',
          description: 'Chiffre en roses roses et blanches sur socle — idéal pour 30, 40 ou 50 ans.',
          price: 0,
          photoKey: 'peonies',
          src: '/images/articles/anniversaire/003.png',
        },
        {
          id: 'evt-bapteme-plaque',
          title: 'Plaque baptême fleurie',
          description: 'Plaque commémorative roses bleues et blanches, ange et colombe.',
          price: 0,
          photoKey: 'bouquetSoft',
          src: '/images/articles/bapteme-communion/004.png',
        },
        {
          id: 'evt-bapteme-gobelet',
          title: 'Gobelet baptême personnalisé',
          description: 'Gobelet givré avec prénom, âge et date — souvenir pour vos invités.',
          price: 0,
          photoKey: 'wildflowers',
          src: '/images/articles/bapteme-communion/002.png',
        },
      ],
    },
    ...PAGE_ARTICLE_CATALOG,
    creationsSaisonnieres: {
      sectionTitle: 'Créations de saison',
      intro:
        'Pâques, fêtes des mères, fête des grandes-mères et fêtes de fin d’année — découvrez nos créations dans chaque rubrique dédiée.',
      items: [
        {
          id: 'sai-paques-lapin',
          title: 'Lapin de Pâques en roses',
          description: 'Lapin en roses crème sur socle rayé, œufs dorés et herbe verte.',
          price: 0,
          photoKey: 'tulips',
          src: '/images/articles/paques/001.png',
        },
        {
          id: 'sai-paques-lapin-gris',
          title: 'Lapin Pâques roses gris',
          description: 'Lapin en roses grises et rouges, œufs décorés sur socle fleuri.',
          price: 0,
          photoKey: 'peonies',
          src: '/images/articles/paques/002.png',
        },
        {
          id: 'sai-fete-meres-plaque',
          title: 'Plaque cœur fête des mères',
          description: 'Cœur en bois gravé et roses séchées — cadeau tendre pour maman.',
          price: 0,
          photoKey: 'rosesBouquet',
          src: '/images/articles/fete-des-meres/001.png',
        },
        {
          id: 'sai-fete-meres-coeur',
          title: 'Cœur « Bonne fête Maman »',
          description: 'Grand cœur de roses rouges et blanches avec message d’amour.',
          price: 0,
          photoKey: 'bouquetSoft',
          src: '/images/articles/fete-des-meres/002.png',
        },
        {
          id: 'sai-fete-meres-ours',
          title: 'Ourson « Je t’aime Maman »',
          description: 'Ourson en roses avec couronne de perles et cœur gravé.',
          price: 0,
          photoKey: 'bouquetGift',
          src: '/images/articles/fete-des-meres/005.png',
        },
      ],
    },
    noel: {
      sectionTitle: 'Créations Noël',
      intro: 'Ambiance hivernale et chaleureuse — rouge, or, vert ou blanc.',
      items: [
        { id: 'noe-couronne-porte', title: 'Couronne de porte', description: 'Couronne fraîche ou stabilisée, diamètre standard.', price: 0, photoKey: 'rosesPink', src: '' },
        { id: 'noe-table', title: 'Centre de table de fête', description: 'Bougies et végétaux de saison.', price: 0, photoKey: 'weddingBouquet', src: '' },
        { id: 'noe-sapin', title: 'Décoration pied de sapin', description: 'Composition pour base d’arbre.', price: 0, photoKey: 'wildflowers', src: '' },
        { id: 'noe-cadeau', title: 'Bouquet cadeau hivernal', description: 'Roses, baies et conifères.', price: 0, photoKey: 'rosesPink', src: '' },
        { id: 'noe-cheminee', title: 'Composition manteau cheminée', description: 'Longueur au choix (devis).', price: 0, photoKey: 'vaseInterior', src: '' },
      ],
    },
  },

  /** Galeries par catégorie (pages) */
  galleries: {
    mariage: {
      title: 'Galerie',
      items: [
        { photoKey: 'weddingBouquet', label: 'Bouquet de mariée', featured: true },
        { photoKey: 'weddingTableFlorals', label: 'Décoration cérémonie' },
        { photoKey: 'peonies', label: 'Centre de table' },
        { photoKey: 'bouquetSoft', label: 'Accessoires floraux' },
        { photoKey: 'vaseInterior', label: 'Arche florale' },
      ],
    },
    anniversaire: {
      title: 'Galerie',
      items: [
        { photoKey: 'bouquetGift', label: 'Bouquet festif', featured: true },
        { photoKey: 'peonies', label: 'Centre de table' },
        { photoKey: 'vaseInterior', label: 'Décoration florale' },
        { photoKey: 'weddingBouquet', label: 'Composition colorée' },
        { photoKey: 'wildflowers', label: 'Arrangement cadeau' },
      ],
    },
    baptemeCommunion: {
      title: 'Galerie',
      items: [
        { photoKey: 'peonies', label: 'Composition baptême', featured: true },
        { photoKey: 'vaseInterior', label: 'Fleurs délicates' },
        { photoKey: 'wildflowers', label: 'Centre de table' },
        { photoKey: 'bouquetSoft', label: 'Décoration communion' },
      ],
    },
    decoratives: {
      title: 'Galerie',
      items: [
        { photoKey: 'vaseInterior', label: 'Composition murale', featured: true },
        { photoKey: 'bouquetSoft', label: 'Bouquet séché' },
        { photoKey: 'flatlayBlooms', label: 'Arrangement naturel' },
        { photoKey: 'wildflowers', label: 'Composition champêtre' },
        { photoKey: 'peonies', label: 'Fleurs fraîches' },
        { photoKey: 'flowerWall', label: 'Décoration intérieure' },
      ],
    },
    personnalisation: {
      title: 'Quelques réalisations',
      items: [
        { photoKey: 'bouquetGift', label: 'Cadeau personnalisé', featured: true },
        { photoKey: 'tulips', label: 'Accessoire fleuri' },
        { photoKey: 'wildflowers', label: 'Coffret sur mesure' },
        { photoKey: 'bouquetSoft', label: 'Création unique' },
        { photoKey: 'vaseInterior', label: 'Décoration florale' },
      ],
    },
    funeraires: {
      title: 'Galerie',
      items: [
        { photoKey: 'wildflowers', label: 'Composition florale' },
        { photoKey: 'rosesPink', label: 'Gerbe blanche' },
        { photoKey: 'weddingBouquet', label: 'Couronne florale' },
        { photoKey: 'bouquetSoft', label: 'Bouquet de deuil' },
      ],
    },
    paques: {
      title: 'Galerie',
      items: [
        { photoKey: 'tulips', label: 'Composition printanière', featured: true },
        { photoKey: 'peonies', label: 'Corbeille de Pâques' },
        { photoKey: 'bouquetSoft', label: 'Fleurs de printemps' },
        { photoKey: 'vaseInterior', label: 'Couronne florale' },
      ],
    },
    noel: {
      title: 'Galerie',
      items: [
        { photoKey: 'rosesPink', label: 'Décoration de Noël', featured: true },
        { photoKey: 'weddingBouquet', label: 'Couronne de porte' },
        { photoKey: 'wildflowers', label: 'Centre de table hivernal' },
        { photoKey: 'vaseInterior', label: 'Composition enchantée' },
      ],
    },
    feteDesMeres: {
      title: 'Galerie',
      items: [
        { photoKey: 'bouquetSoft', label: 'Bouquet pour maman', featured: true },
        { photoKey: 'weddingBouquet', label: 'Roses romantiques' },
        { photoKey: 'peonies', label: 'Composition délicate' },
        { photoKey: 'rosesBouquet', label: 'Coffret fleuri' },
      ],
    },
  },
}
