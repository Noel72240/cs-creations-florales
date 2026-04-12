/**
 * Contenu éditable du site — valeurs par défaut.
 * Fusionné avec localStorage + optionnellement /public/site-content.json
 */
import { SITE as SITE_BASE, WEB_DEV as WEB_DEV_BASE } from '../config/site'

export const SITE_CONTENT_VERSION = 3

/** Nombre max d’articles boutique par page rubrique (admin + grille vitrine). */
export const MAX_PAGE_ARTICLES = 12

export const SITE_CONTENT_DEFAULTS = {
  version: SITE_CONTENT_VERSION,
  /** Remplace VITE_SUMUP_PAYMENT_URL si renseigné */
  sumupPaymentUrl: '',

  site: { ...SITE_BASE },
  webDev: { ...WEB_DEV_BASE },

  navbar: {
    /** Bannière toute en haut (style annonce, police script) */
    promoBanner: {
      enabled: true,
      /** Multiplicateur de la taille du texte (1 = 100 %, modifiable dans l’admin) */
      fontScale: 1.08,
      /** Surligné en style « code » si présent dans le texte */
      code: 'Bienvenuecscreationflorale10',
      text:
        'Pour votre 1ère commande : 10% sur le site avec un minimum d’achat de 35€ avec le code Bienvenuecscreationflorale10',
    },
    topBarMessage: '✿ Créations florales artisanales sur mesure — Écommoy (72) ✿',
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
      titleLine2: 'et Personnalisation',
      searchPlaceholder: 'Rechercher : mariage, bouquet, fête des mères…',
      searchHint: '(Aperçu visuel — la recherche peut être activée plus tard)',
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
      paragraphs: [
        'Une pièce unique, pensée pour marquer les esprits : une création florale sur moto, idéale pour des vitrines, événements, surprises et séances photos.',
        'Dites-moi vos couleurs, l’ambiance et la date — je vous propose une création entièrement adaptée à votre projet.',
      ],
      tip: 'Astuce : pour afficher votre photo, ajoutez le fichier dans public/ : moto-florale.png (ou .jpg / .webp).',
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
          desc: 'Pâques, Noël, Fête des Mères — des créations adaptées à chaque saison et tradition.',
          icon: '🌿',
          path: '/creations-saisonnieres',
          photoKey: 'tulips',
          src: '',
        },
        {
          title: 'Personnalisation',
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
      subtitle: 'Devis gratuit · Réponse sous 24h · Écommoy et environs (72)',
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
      intro: 'Exemples de compositions avec tarifs indicatifs — ajustables sur devis selon vos fleurs et la saison.',
      items: [
        {
          id: 'evt-bouquet-mariee',
          title: 'Bouquet de mariée',
          description: 'Bouquet rond ou retombant, rubans et finitions au choix. Fleurs artificielles ou stabilisées.',
          price: 85,
          photoKey: 'weddingBouquet',
          src: '',
        },
        {
          id: 'evt-centre-table',
          title: 'Centre de table',
          description: 'Composition basse pour tables d’honneur ou invités, harmonisée avec votre thème.',
          price: 45,
          photoKey: 'weddingTableFlorals',
          src: '',
        },
        {
          id: 'evt-arche-fleurie',
          title: 'Décoration d’entrée',
          description: 'Arrangement floral pour encadrer l’entrée ou la salle (format à définir ensemble).',
          price: 120,
          photoKey: 'peonies',
          src: '',
        },
        {
          id: 'evt-couronne',
          title: 'Couronne ou couronne de tête',
          description: 'Couronne fleurie légère pour cérémonie ou séance photo.',
          price: 55,
          photoKey: 'wildflowers',
          src: '',
        },
        {
          id: 'evt-bouquet-cadeau',
          title: 'Bouquet cadeau invités',
          description: 'Petits bouquets ou boutonnières coordonnés pour vos proches (lot sur devis).',
          price: 38,
          photoKey: 'bouquetSoft',
          src: '',
        },
      ],
    },
    creationsFlorales: {
      sectionTitle: 'Nos créations florales',
      intro: 'Idées de pièces décoratives — dimensions et fleurs personnalisables.',
      items: [
        {
          id: 'cf-vase-signature',
          title: 'Composition en vase',
          description: 'Arrangement pour salon ou salle à manger, vase inclus.',
          price: 52,
          photoKey: 'vaseInterior',
          src: '',
        },
        {
          id: 'cf-bouquet-frais',
          title: 'Bouquet long',
          description: 'Bouquet élancé, tons doux ou contrastés selon saison.',
          price: 42,
          photoKey: 'bouquetSoft',
          src: '',
        },
        {
          id: 'cf-tableau-floral',
          title: 'Cadre floral',
          description: 'Décoration murale ou à poser, fleurs stabilisées.',
          price: 68,
          photoKey: 'flatlayBlooms',
          src: '',
        },
        {
          id: 'cf-suspension',
          title: 'Couronne de porte',
          description: 'Couronne ou demi-couronne pour intérieur ou porche abrité.',
          price: 48,
          photoKey: 'flowerWall',
          src: '',
        },
        {
          id: 'cf-coffret',
          title: 'Coffret fleuri',
          description: 'Fleurs présentées dans un coffret, idéal cadeau.',
          price: 58,
          photoKey: 'bouquetGift',
          src: '',
        },
      ],
    },
    creationsFuneraires: {
      sectionTitle: 'Compositions & tarifs indicatifs',
      intro: 'Créations réalisées avec respect — ajustements possibles selon cérémonie et fleurs souhaitées.',
      items: [
        {
          id: 'fun-gerbe',
          title: 'Gerbe classique',
          description: 'Gerbe allongée, tons au choix (blanc, pastels, couleurs douces).',
          price: 75,
          photoKey: 'wildflowers',
          src: '',
        },
        {
          id: 'fun-couronne',
          title: 'Couronne funéraire',
          description: 'Couronne ronde ou cœur, message ruban en option.',
          price: 95,
          photoKey: 'rosesPink',
          src: '',
        },
        {
          id: 'fun-bouquet',
          title: 'Bouquet de deuil',
          description: 'Bouquet porté ou pour déposer, format moyen.',
          price: 48,
          photoKey: 'bouquetSoft',
          src: '',
        },
        {
          id: 'fun-cercueil',
          title: 'Raquette ou coussin',
          description: 'Composition plate pour cercueil, dimensions standards.',
          price: 110,
          photoKey: 'weddingBouquet',
          src: '',
        },
        {
          id: 'fun-tombe',
          title: 'Plante ou coupe de tombe',
          description: 'Composition résistante pour sépulture, entretien facilité.',
          price: 35,
          photoKey: 'peonies',
          src: '',
        },
      ],
    },
    creationsSaisonnieres: {
      sectionTitle: 'Créations de saison',
      intro: 'Sélection d’exemples tout au long de l’année — Pâques, fêtes, fête des mères…',
      items: [
        {
          id: 'sai-printemps',
          title: 'Composition printanière',
          description: 'Tulipes, jonquilles, tons frais et lumineux.',
          price: 44,
          photoKey: 'tulips',
          src: '',
        },
        {
          id: 'sai-ete',
          title: 'Bouquet estival',
          description: 'Mélange champêtre, pivoines ou dahlias selon arrivage.',
          price: 46,
          photoKey: 'dahlias',
          src: '',
        },
        {
          id: 'sai-automne',
          title: 'Ambiance automnale',
          description: 'Tons orangés, baies et feuillages décoratifs.',
          price: 49,
          photoKey: 'wildflowers',
          src: '',
        },
        {
          id: 'sai-hiver',
          title: 'Couronne ou centre hivernal',
          description: 'Pour tables de fêtes ou porte d’entrée.',
          price: 55,
          photoKey: 'rosesPink',
          src: '',
        },
        {
          id: 'sai-fete-meres',
          title: 'Coffret fête des mères',
          description: 'Fleurs + petite attention dans un coffret.',
          price: 52,
          photoKey: 'bouquetSoft',
          src: '',
        },
      ],
    },
    personnalisation: {
      sectionTitle: 'Exemples de personnalisations',
      intro: 'Objets et créations uniques — texte, couleurs et motifs adaptés à votre projet.',
      items: [
        {
          id: 'pers-coffret',
          title: 'Coffret prénom & date',
          description: 'Coffret décoré, calligraphie ou lettrage au choix.',
          price: 42,
          photoKey: 'bouquetGift',
          src: '',
        },
        {
          id: 'pers-cadre',
          title: 'Cadre fleuri',
          description: 'Cadre orné de fleurs stabilisées, format au choix.',
          price: 55,
          photoKey: 'vaseInterior',
          src: '',
        },
        {
          id: 'pers-accessoire',
          title: 'Accessoire fleuri',
          description: 'Barrette, broche ou peigne pour événement.',
          price: 28,
          photoKey: 'peonies',
          src: '',
        },
        {
          id: 'pers-carte',
          title: 'Cartes & faire-part',
          description: 'Décoration florale artisanale sur papier de qualité.',
          price: 32,
          photoKey: 'flatlayBlooms',
          src: '',
        },
        {
          id: 'pers-boite',
          title: 'Boîte à chapeau fleurie',
          description: 'Grande boîte décorée, idéale pour cadeau ou rangement.',
          price: 65,
          photoKey: 'tulips',
          src: '',
        },
      ],
    },
    /** Sous-pages Événements floraux & saisonniers (5 articles chacune) */
    mariage: {
      sectionTitle: 'Créations mariage',
      intro: 'Exemples de prestations avec tarifs indicatifs — personnalisation et devis selon votre lieu et la saison.',
      items: [
        { id: 'mar-bouquet-mariee', title: 'Bouquet de mariée', description: 'Bouquet signature, forme et palette au choix.', price: 95, photoKey: 'weddingBouquet', src: '' },
        { id: 'mar-lancer', title: 'Bouquet à lancer', description: 'Version compacte pour la tradition du lancer.', price: 48, photoKey: 'bouquetSoft', src: '' },
        { id: 'mar-centre-table', title: 'Centre de table invités', description: 'Composition basse par table (format standard).', price: 42, photoKey: 'weddingTableFlorals', src: '' },
        { id: 'mar-boutonnieres', title: 'Lot boutonnières', description: 'Pour le cortège (prix pour 5 unités, ajustable).', price: 55, photoKey: 'peonies', src: '' },
        { id: 'mar-arche', title: 'Décoration arche / entrée', description: 'Mise en scène florale pour cérémonie (devis détaillé).', price: 180, photoKey: 'flowerWall', src: '' },
      ],
    },
    anniversaire: {
      sectionTitle: 'Créations anniversaire',
      intro: 'Idées festives avec prix de départ — couleurs et thème adaptés à l’âge fêté.',
      items: [
        { id: 'ann-bouquet', title: 'Bouquet surprise', description: 'Bouquet généreux, tons vifs ou pastels.', price: 44, photoKey: 'dahlias', src: '' },
        { id: 'ann-centre', title: 'Centre de table festif', description: 'Pour table ronde ou rectangulaire.', price: 38, photoKey: 'bouquetGift', src: '' },
        { id: 'ann-ballons-fleurs', title: 'Composition « joyeux anniversaire »', description: 'Arrangement avec message floral intégré.', price: 52, photoKey: 'peonies', src: '' },
        { id: 'ann-cadeau', title: 'Coffret fleuri', description: 'Fleurs + présentation cadeau.', price: 48, photoKey: 'wildflowers', src: '' },
        { id: 'ann-salle', title: 'Pack décoration salle', description: 'Plusieurs points floraux (sur devis précis).', price: 120, photoKey: 'vaseInterior', src: '' },
      ],
    },
    baptemeCommunion: {
      sectionTitle: 'Créations baptême & communion',
      intro: 'Compositions douces et lumineuses — tons blanc, ivoire ou pastel.',
      items: [
        { id: 'bap-bouquet-enfant', title: 'Petit bouquet enfant', description: 'Format léger pour la cérémonie.', price: 32, photoKey: 'peonies', src: '' },
        { id: 'bap-autel', title: 'Composition autel / table', description: 'Arrangement discret et élégant.', price: 58, photoKey: 'bouquetSoft', src: '' },
        { id: 'bap-corsage', title: 'Bracelet ou barrette fleurie', description: 'Accessoire assorti (unité).', price: 22, photoKey: 'wildflowers', src: '' },
        { id: 'bap-salle', title: 'Décoration salle de fête', description: 'Ensemble coordonné (devis).', price: 85, photoKey: 'vaseInterior', src: '' },
        { id: 'bap-cadeaux', title: 'Petits bouquets invités', description: 'Lot de 8 mini-bouquets (prix de base).', price: 96, photoKey: 'weddingBouquet', src: '' },
      ],
    },
    paques: {
      sectionTitle: 'Créations Pâques',
      intro: 'Printemps et renouveau — compositions fraîches et colorées.',
      items: [
        { id: 'paq-table', title: 'Centre de table printanier', description: 'Tulipes, jonquilles ou fleurs de saison.', price: 46, photoKey: 'tulips', src: '' },
        { id: 'paq-corbeille', title: 'Corbeille fleurie', description: 'Corbeille décorée, taille moyenne.', price: 52, photoKey: 'peonies', src: '' },
        { id: 'paq-couronne', title: 'Couronne de porte', description: 'Couronne légère tons pastels.', price: 48, photoKey: 'bouquetSoft', src: '' },
        { id: 'paq-bouquet', title: 'Bouquet à offrir', description: 'Prêt à offrir pour Pâques.', price: 40, photoKey: 'wildflowers', src: '' },
        { id: 'paq-oeuf', title: 'Composition « œuf » fleuri', description: 'Création originale sur socle.', price: 55, photoKey: 'flatlayBlooms', src: '' },
      ],
    },
    noel: {
      sectionTitle: 'Créations Noël',
      intro: 'Ambiance hivernale et chaleureuse — rouge, or, vert ou blanc.',
      items: [
        { id: 'noe-couronne-porte', title: 'Couronne de porte', description: 'Couronne fraîche ou stabilisée, diamètre standard.', price: 58, photoKey: 'rosesPink', src: '' },
        { id: 'noe-table', title: 'Centre de table de fête', description: 'Bougies et végétaux de saison.', price: 62, photoKey: 'weddingBouquet', src: '' },
        { id: 'noe-sapin', title: 'Décoration pied de sapin', description: 'Composition pour base d’arbre.', price: 45, photoKey: 'wildflowers', src: '' },
        { id: 'noe-cadeau', title: 'Bouquet cadeau hivernal', description: 'Roses, baies et conifères.', price: 48, photoKey: 'rosesPink', src: '' },
        { id: 'noe-cheminee', title: 'Composition manteau cheminée', description: 'Longueur au choix (devis).', price: 75, photoKey: 'vaseInterior', src: '' },
      ],
    },
    feteDesMeres: {
      sectionTitle: 'Créations Fête des Mères',
      intro: 'Pour dire merci avec des fleurs — tons doux et romantiques.',
      items: [
        { id: 'fdm-bouquet-rose', title: 'Bouquet roses & saison', description: 'Classique élégant, taille moyenne.', price: 52, photoKey: 'rosesBouquet', src: '' },
        { id: 'fdm-pivoines', title: 'Bouquet pivoines', description: 'Selon disponibilité saisonnière.', price: 58, photoKey: 'peonies', src: '' },
        { id: 'fdm-boite', title: 'Boîte à fleurs', description: 'Présentation chic, fleurs assorties.', price: 55, photoKey: 'bouquetSoft', src: '' },
        { id: 'fdm-plant', title: 'Plante fleurie en pot', description: 'Rose ou orchidée selon stock.', price: 38, photoKey: 'tulips', src: '' },
        { id: 'fdm-coffret', title: 'Coffret gourmand fleuri', description: 'Fleurs + petite attention (sur devis).', price: 65, photoKey: 'bouquetGift', src: '' },
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
