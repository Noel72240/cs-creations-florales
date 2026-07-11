/**
 * Catalogue articles vitrine (photo + titre + description + prix).
 * Une entrée par image dans public/images/articles/{slug}/
 */
import { enrichCatalogWithProductOptions } from '../lib/articleProductOptionsDefaults'

function item(slug, num, { title, description, price: _price, photoKey = 'vaseInterior' }) {
  const n = String(num).padStart(3, '0')
  return {
    id: `${slug}-${n}`,
    title,
    description,
    price: 0,
    photoKey,
    src: `/images/articles/${slug}/${n}.png`,
  }
}

const CF = 'creations-florales'
const FUN = 'creations-funeraires'

export const PAGE_ARTICLE_CATALOG = enrichCatalogWithProductOptions({
  creationsFlorales: {
    sectionTitle: 'Nos créations florales',
    intro:
      'Découvrez nos compositions artisanales en fleurs stabilisées et artificielles — chaque pièce est réalisée sur mesure avec soin.',
    items: [
      item(CF, 1, {
        title: 'Cœur roses rouges personnalisé',
        description:
          'Grand cœur de roses rouges orné de perles, avec médaillon central personnalisable (prénoms et date). Idéal pour un anniversaire de couple.',
        price: 68,
        photoKey: 'rosesPink',
      }),
      item(CF, 2, {
        title: 'Cœur « Je t’aime pour la vie »',
        description:
          'Cœur de roses rouges sur socle blanc et rouge, colombe blanche et médaillon gravé. Un hommage romantique et durable.',
        price: 65,
        photoKey: 'weddingBouquet',
      }),
      item(CF, 3, {
        title: 'Cœur amour colombe perles',
        description:
          'Composition en cœur de roses rouges, perles nacrées et colombe symbolique. Message d’amour éternel pour offrir ou décorer.',
        price: 65,
        photoKey: 'peonies',
      }),
      item(CF, 4, {
        title: 'Cœur romantique roses rouges',
        description:
          'Cœur fleuri rouge et blanc avec colombe et médaillon « Je t’aime pour la vie ». Finitions soignées, création artisanale unique.',
        price: 65,
        photoKey: 'bouquetSoft',
      }),
      item(CF, 5, {
        title: 'Ourson roses rouges',
        description:
          'Petit ours entièrement recouvert de roses rouges, couronne argentée et marguerite blanche. Cadeau tendre et original.',
        price: 48,
        photoKey: 'bouquetGift',
      }),
      item(CF, 6, {
        title: 'Ourson roses blanches',
        description:
          'Ourson en roses blanches, couronne perlée et rose bordeaux au centre. Élégant et intemporel pour toutes les occasions.',
        price: 48,
        photoKey: 'vaseInterior',
      }),
      item(CF, 7, {
        title: 'Couronne cœur rouge et blanc',
        description:
          'Couronne en forme de cœur, roses rouges et blanches, étoile argentée. Décor mural ou sur table pour un effet romantique.',
        price: 52,
        photoKey: 'flowerWall',
      }),
      item(CF, 8, {
        title: 'Plaque naissance personnalisée',
        description:
          'Nuage de roses roses et blanches avec cœur gravé et étiquettes poids, heure et taille. Souvenir de naissance sur mesure.',
        price: 75,
        photoKey: 'flatlayBlooms',
      }),
      item(CF, 9, {
        title: 'Cœur LOVE roses bicolores',
        description:
          'Cœur de roses rouges et blanches avec lettrage LOVE et roses accent. Parfait pour la Saint-Valentin ou un anniversaire.',
        price: 55,
        photoKey: 'wildflowers',
      }),
      item(CF, 10, {
        title: 'Minnie roses perles',
        description:
          'Silhouette Minnie en roses noires, rouges et blanches, socle fleuri et perles. Création ludique pour une chambre ou un événement.',
        price: 85,
        photoKey: 'dahlias',
      }),
      item(CF, 11, {
        title: 'Cœur doré roses pêche',
        description:
          'Double cœur doré habillé de roses pêche et d’un géranium rose, rehaussé d’un papillon et de perles. Romantique et durable.',
        price: 58,
      }),
      item(CF, 12, {
        title: 'Coffret cœur fête maman',
        description:
          'Roses blanches et pêche dans un écrin rouge en forme de cœur, avec message « Bonne fête maman ». Cadeau plein de tendresse.',
        price: 52,
      }),
      item(CF, 13, {
        title: 'Cœur blanc lys rose',
        description:
          'Cadre cœur blanc orné d’un lys rose, de roses pêche et blanches, cœurs argentés et herbes séchées. Charme intemporel.',
        price: 55,
      }),
      item(CF, 14, {
        title: 'Cœur noir roses rouges',
        description:
          'Écrin noir en forme de cœur garni de roses rouges et crème, poinsettia doré et papillon. Élégant pour déclarer votre amour.',
        price: 56,
      }),
      item(CF, 15, {
        title: 'Double cœur roses bordeaux',
        description:
          'Deux cœurs entrelacés de roses bordeaux et blanches, lys blanc et touches argentées. Pièce raffinée pour votre intérieur.',
        price: 57,
      }),
      item(CF, 16, {
        title: 'Sac matelassé roses pastel',
        description:
          'Roses pêche et crème, lys et coloquintes dans un sac matelassé rose avec chaîne dorée. Création poétique ornée du mot LOVE.',
        price: 54,
      }),
      item(CF, 17, {
        title: 'Sac blanc géranium vert',
        description:
          'Sac matelassé blanc garni de géranium, roses blanches et vertes, papillon vert et perles. Fraîcheur et élégance.',
        price: 54,
      }),
      item(CF, 18, {
        title: 'Écrin blanc roses vertes',
        description:
          'Géranium blanc, roses vert tendre et blanches dans un écrin matelassé blanc à chaîne dorée. Cadeau raffiné et original.',
        price: 53,
      }),
      item(CF, 19, {
        title: 'Sac bleu colombe blanche',
        description:
          'Roses bleues et blanches, lys et colombe dans un sac matelassé blanc. Composition céleste pour un moment précieux.',
        price: 55,
      }),
      item(CF, 20, {
        title: 'Sac noir roses couronne',
        description:
          'Sac noir matelassé de roses rouges et crème, lys, perles et petite couronne. Luxueux pour une occasion exceptionnelle.',
        price: 62,
      }),
      item(CF, 21, {
        title: 'Plaque « Bienvenue chez nous »',
        description:
          'Plaque ronde sur chevalet avec roses bordeaux et crème, papillon argenté et message d’accueil. Idéale pour votre entrée.',
        price: 42,
      }),
      item(CF, 22, {
        title: 'Plaque « Bienvenue chez moi »',
        description:
          'Plaque circulaire fleurie de roses rouges et blanches, papillon et coccinelles. Touche artisanale chaleureuse.',
        price: 40,
      }),
      item(CF, 23, {
        title: 'Plaque bienvenue papillon argent',
        description:
          'Roses bordeaux et crème, perles et grand papillon argenté sur plaque de bienvenue. Accueil élégant pour votre maison.',
        price: 43,
      }),
      item(CF, 24, {
        title: 'Plaque bienvenue coccinelles',
        description:
          'Plaque « Bienvenue chez moi » ornée de roses, feuilles dorées, papillon rouge et coccinelles. Charme artisanal.',
        price: 40,
      }),
      item(CF, 25, {
        title: 'Plaque bienvenue roses bleues',
        description:
          'Arc de roses bleues et blanches avec colombe sur plaque de bienvenue. Apporte sérénité à votre décoration.',
        price: 44,
      }),
      item(CF, 26, {
        title: 'Plaque bienvenue gerbera pêche',
        description:
          'Géranium rose, roses pêche et crème, papillon doré sur plaque de bienvenue. Accueil fleuri et chaleureux.',
        price: 43,
      }),
      item(CF, 27, {
        title: 'Plaque bienvenue tons poudrés',
        description:
          'Géranium et roses aux tons poudrés, papillon doré et message de bienvenue. Pour une entrée accueillante et romantique.',
        price: 43,
      }),
      item(CF, 28, {
        title: 'Miroir personnalisé',
        description:
          'Miroir circulaire orné de roses crème et pêche, daté et gravé aux prénoms de votre choix. Souvenir unique et élégant.',
        price: 48,
      }),
      item(CF, 29, {
        title: 'Papillon roses bordeaux',
        description:
          'Grand papillon en roses bordeaux bordé de gris, avec papillon métallique. Pièce spectaculaire réalisée main.',
        price: 85,
      }),
      item(CF, 30, {
        title: 'Lanterne bois roses poudrées',
        description:
          'Lanterne en bois naturel garnie de roses poudrées et crème, perles et bougie LED. Ambiance chaleureuse et romantique.',
        price: 52,
      }),
      item(CF, 31, {
        title: 'Lanterne pêche papillon rose',
        description:
          'Lanterne fleurie de roses pêche et crème, papillon rose et guirlande lumineuse. Douceur et lumière pour votre intérieur.',
        price: 51,
      }),
      item(CF, 32, {
        title: 'Lanterne étoile papillon doré',
        description:
          'Lanterne en bois ornée de roses, étoile dorée, papillon rose et herbes séchées. Pièce féerique et artisanale.',
        price: 53,
      }),
      item(CF, 33, {
        title: 'Cœur roses message amour',
        description:
          'Cœur en roses rose et gris sur socle, avec étiquette au message sentimental. Hommage romantique et durable.',
        price: 68,
      }),
      item(CF, 34, {
        title: 'Boîte à mouchoirs fleurie',
        description:
          'Boîte en bois fleurie de roses rouges et blanches, perles et messages humoristiques. Cadeau original pour la maison.',
        price: 38,
      }),
      item(CF, 35, {
        title: 'Boîte mouchoirs roses perles',
        description:
          'Écrin en bois décoré de roses rouges et crème avec perles. Pratique et tendre pour le quotidien.',
        price: 40,
      }),
      item(CF, 36, {
        title: 'Cœur « Mamie je t’aime »',
        description:
          'Grand cœur rose et noir portant un message d’amour pour mamie sur socle fleuri. Hommage touchant et artisanal.',
        price: 72,
      }),
      item(CF, 37, {
        title: 'Rose sous cloche liège',
        description:
          'Rose rose sous cloche de verre sur socle liège, entourée de boutons et perles. Élégante pour bureau ou étagère.',
        price: 42,
      }),
      item(CF, 38, {
        title: 'Rose sous verre bois',
        description:
          'Grande rose rose protégée dans un cylindre de verre sur base bois, perles et fleurs séchées. Cadeau durable et raffiné.',
        price: 45,
      }),
    ],
  },

  creationsFuneraires: {
    sectionTitle: 'Compositions & tarifs indicatifs',
    intro:
      'Créations réalisées avec respect et délicatesse — chaque hommage peut être adapté selon vos souhaits et la cérémonie.',
    items: [
      item(FUN, 1, {
        title: 'Cœur photo hommage',
        description:
          'Cœur de roses rouges et blanches avec cadre photo et message d’amour. Hommage personnalisé pour honorer un être cher.',
        price: 78,
        photoKey: 'wildflowers',
      }),
      item(FUN, 2, {
        title: 'Cœur hommage roses rouges',
        description:
          'Composition en cœur de roses rouges et blanches, perles dorées et emplacement photo. Souvenir précieux et respectueux.',
        price: 78,
        photoKey: 'rosesPink',
      }),
      item(FUN, 3, {
        title: 'Croix roses bleu et rose',
        description:
          'Croix de roses bleues et roses sur socle, avec bougie et ange. Hommage délicat pour un recueillement empreint de douceur.',
        price: 82,
        photoKey: 'bouquetSoft',
      }),
      item(FUN, 4, {
        title: 'Couronne bougie papillon bleu',
        description:
          'Couronne de roses bleues et blanches entourant une bougie funéraire et un papillon. Symbole d’espoir et de sérénité.',
        price: 68,
        photoKey: 'weddingBouquet',
      }),
      item(FUN, 5, {
        title: 'Couronne céleste bougie blanche',
        description:
          'Roses bleues et blanches autour d’une bougie de recueillement, papillon et feuillages. Hommage paisible et lumineux.',
        price: 68,
        photoKey: 'peonies',
      }),
      item(FUN, 6, {
        title: 'Arche colombe et ange',
        description:
          'Arche de roses roses et crème avec colombe, ange, barrières et chemin fleuri. Hommage symbolique réalisé avec respect.',
        price: 88,
        photoKey: 'flowerWall',
      }),
      item(FUN, 7, {
        title: 'Arche souvenir rose crème',
        description:
          'Arc en roses roses et crème, colombe et ange sur socle fleuri. Création commémorative douce et personnalisée.',
        price: 88,
      }),
      item(FUN, 8, {
        title: 'Arche hommage papillon rose',
        description:
          'Arche artisanale roses roses et blanches, papillon, colombe et ange. Pour accompagner un adieu avec tendresse.',
        price: 88,
      }),
      item(FUN, 9, {
        title: 'Cœur bougie et ange bleu',
        description:
          'Cœur de roses bleues et blanches sur socle, bougie et ange. Hommage élégant pour la mémoire d’un proche.',
        price: 75,
      }),
      item(FUN, 10, {
        title: 'Cœur funéraire perles bleues',
        description:
          'Cœur bleu et blanc, perles, bougie et ange sur socle. Composition empreinte de calme et de respect.',
        price: 75,
      }),
      item(FUN, 11, {
        title: 'Croix bleue arum blanc',
        description:
          'Croix de roses bleues bordée de blanc, arum royal et roses crème au centre. Hommage raffiné pour la cérémonie.',
        price: 72,
      }),
      item(FUN, 12, {
        title: 'Croix roses roses et crème',
        description:
          'Croix entièrement couverte de roses roses et crème, herbes séchées au centre. Tons doux pour le recueillement.',
        price: 70,
      }),
      item(FUN, 13, {
        title: 'Papillon hommage violet rose',
        description:
          'Grand papillon en roses violettes et roses, fleurs blanches en accent. Symbole d’espoir et de liberté.',
        price: 90,
      }),
      item(FUN, 14, {
        title: 'Moto florale hommage',
        description:
          'Moto de course entièrement réalisée en roses vert lime et noires. Hommage unique pour un passionné de moto.',
        price: 110,
      }),
      item(FUN, 15, {
        title: 'Camion floral hommage',
        description:
          'Semi-remorque en roses rouges, gris et blanc. Création sur mesure pour honorer un professionnel de la route.',
        price: 115,
      }),
    ],
  },

  anniversaire: {
    sectionTitle: 'Créations anniversaire',
    intro:
      'Compositions festives et personnalisées pour célébrer chaque âge avec couleurs et messages sur mesure.',
    items: [
      item('anniversaire', 1, {
        title: 'Verre à vin 18 ans',
        description:
          'Verre à vin gravé « 18 ans » en doré, présentation soignée. Idéal pour fêter une majorité avec élégance.',
        price: 30,
        photoKey: 'bouquetGift',
      }),
      item('anniversaire', 2, {
        title: 'Verre à vin prénom',
        description:
          'Verre personnalisé avec initiale dorée et prénom en calligraphie. Cadeau raffiné pour un anniversaire mémorable.',
        price: 30,
        photoKey: 'dahlias',
      }),
      item('anniversaire', 3, {
        title: 'Chiffre floral anniversaire',
        description:
          'Chiffre en roses roses et blanches sur socle fleuri. Parfait pour un 30 ans, 40 ans ou toute étape importante.',
        price: 75,
        photoKey: 'peonies',
      }),
    ],
  },

  baptemeCommunion: {
    sectionTitle: 'Créations baptême & communion',
    intro:
      'Compositions douces et lumineuses — tons blanc, ivoire, bleu ou pastel, personnalisables au prénom et à la date.',
    items: [
      item('bapteme-communion', 1, {
        title: 'Croix florale bleue',
        description:
          'Croix de roses bleues et blanches, arum et roses crème au centre. Pièce délicate pour baptême ou communion.',
        price: 72,
        photoKey: 'peonies',
      }),
      item('bapteme-communion', 2, {
        title: 'Gobelet baptême personnalisé',
        description:
          'Gobelet givré avec cadre doré, dentelle et prénom gravé. Souvenir élégant et réutilisable pour vos invités.',
        price: 32,
        photoKey: 'bouquetSoft',
      }),
      item('bapteme-communion', 3, {
        title: 'Verre communion colombes',
        description:
          'Verre à vin gravé prénom, date et colombes. Souvenir artisanal pour un jour de fête inoubliable.',
        price: 32,
        photoKey: 'wildflowers',
      }),
      item('bapteme-communion', 4, {
        title: 'Plaque baptême fleurie',
        description:
          'Plaque commémorative bordée de roses bleues et blanches, ange, papillon et colombe. Cadeau de baptême sur mesure.',
        price: 68,
        photoKey: 'vaseInterior',
      }),
    ],
  },

  mariage: {
    sectionTitle: 'Créations mariage',
    intro:
      'Accessoires et compositions florales pour le jour J — personnalisation des prénoms, dates et couleurs de votre thème.',
    items: [
      item('mariage', 1, {
        title: 'Inspiration alliances fleuries',
        description:
          'Mise en scène romantique roses blanches et séchées, ambiance douce pour votre décoration de mariage.',
        price: 45,
        photoKey: 'weddingBouquet',
      }),
      item('mariage', 2, {
        title: 'Rose sous cloche mariage',
        description:
          'Grande rose rose sous cloche de verre, socle liège et perles. Souvenir élégant pour les mariés ou les témoins.',
        price: 48,
        photoKey: 'weddingTableFlorals',
      }),
      item('mariage', 3, {
        title: 'Alliances entrelacées LOVE',
        description:
          'Deux anneaux de roses blanches entrelacés, socle rose et blanc, message LOVE et cœurs dorés. Centre de table symbolique.',
        price: 95,
        photoKey: 'peonies',
      }),
      item('mariage', 4, {
        title: 'Plateau alliances miroir',
        description:
          'Plateau miroir personnalisé prénoms et date, roses blanches et coffret cœur pour les alliances. Accessoire de cérémonie raffiné.',
        price: 85,
        photoKey: 'flowerWall',
      }),
    ],
  },

  feteDesMeres: {
    sectionTitle: 'Créations Fêtes des Mères/Pères',
    intro:
      'Pour dire merci à maman — créations artisanales en fleurs, bois gravé et messages tendres.',
    items: [
      item('fete-des-meres', 1, {
        title: 'Plaque cœur bois maman',
        description:
          'Cœur en bois gravé « La vie est plus belle avec une Maman comme toi », roses et herbes séchées à suspendre.',
        price: 32,
        photoKey: 'rosesBouquet',
      }),
      item('fete-des-meres', 2, {
        title: 'Cœur « Bonne fête Maman »',
        description:
          'Grand cœur de roses rouges et blanches avec médaillon en bois et message d’amour. Cadeau touchant et durable.',
        price: 68,
        photoKey: 'peonies',
      }),
      item('fete-des-meres', 3, {
        title: 'Cœur rouge fête des mères',
        description:
          'Cœur de roses rouges, papillon doré et plaque « Bonne fête Maman, je t’aime fort » sur socle blanc.',
        price: 68,
        photoKey: 'bouquetSoft',
      }),
      item('fete-des-meres', 4, {
        title: 'Cœur maman colombe',
        description:
          'Cœur de roses rouges avec colombe et message pour maman sur socle fleuri. Plein de tendresse pour sa fête.',
        price: 68,
        photoKey: 'wildflowers',
      }),
      item('fete-des-meres', 5, {
        title: 'Ourson « Je t’aime Maman »',
        description:
          'Ourson en roses roses et noires, couronne de perles et cœur gravé. Doux et original pour la fête des mères.',
        price: 55,
        photoKey: 'bouquetGift',
      }),
      item('fete-des-meres', 6, {
        title: 'Suspension bois fête maman',
        description:
          'Cœur en bois naturel perlé, gravé « Bonne fête Maman » et « Je t’aime ». Création simple et pleine de cœur.',
        price: 32,
        photoKey: 'tulips',
      }),
    ],
  },

  feteDesGrandesMeres: {
    sectionTitle: 'Créations Fête des Grandes-Mères',
    intro:
      'Pour mamie avec tendresse — bouquets, cœurs gravés et compositions durables pour la fête des grandes-mères.',
    items: [
      item('fete-des-grandes-meres', 1, {
        title: 'Plaque cœur « Bonne fête Mamie »',
        description:
          'Cœur en bois gravé et roses séchées à suspendre. Message personnalisable pour la fête des grandes-mères.',
        price: 32,
        photoKey: 'rosesBouquet',
      }),
      item('fete-des-grandes-meres', 2, {
        title: 'Cœur roses pour mamie',
        description:
          'Grand cœur de roses rouges et blanches avec médaillon gravé. Cadeau touchant pour votre grand-mère.',
        price: 68,
        photoKey: 'peonies',
      }),
      item('fete-des-grandes-meres', 3, {
        title: 'Composition « Je t’aime Mamie »',
        description:
          'Cœur fleuri avec colombe et message d’amour sur socle. Création artisanale pour honorer mamie.',
        price: 68,
        photoKey: 'bouquetSoft',
      }),
      item('fete-des-grandes-meres', 4, {
        title: 'Suspension bois grand-mère',
        description:
          'Cœur en bois naturel perlé, gravé « Bonne fête Mamie » et « Je t’aime ». Simple et plein de cœur.',
        price: 32,
        photoKey: 'wildflowers',
      }),
    ],
  },

  paques: {
    sectionTitle: 'Créations Pâques',
    intro:
      'Printemps et renouveau — lapins, œufs et compositions fraîches pour votre table de fête.',
    items: [
      item('paques', 1, {
        title: 'Lapin de Pâques en roses',
        description:
          'Lapin en roses crème sur socle rayé rose et crème, œufs dorés et herbe verte. Centre de table printanier.',
        price: 65,
        photoKey: 'tulips',
      }),
      item('paques', 2, {
        title: 'Lapin roses gris et rouge',
        description:
          'Lapin en roses grises et rouges sur socle fleuri, œufs décorés. Élégant pour célébrer Pâques avec poésie.',
        price: 65,
        photoKey: 'peonies',
      }),
      item('paques', 3, {
        title: 'Composition Pâques naturelle',
        description:
          'Œufs décorés, fleurs séchées et vase dans une mise en scène aux tons naturels. Ambiance printanière raffinée.',
        price: 38,
        photoKey: 'wildflowers',
      }),
    ],
  },

  personnalisation: {
    sectionTitle: 'Exemples de personnalisations',
    intro:
      'Objets gravés, verres, plaques et créations uniques — prénom, date et motifs adaptés à votre projet.',
    items: [
      item('personnalisation', 1, {
        title: 'Plaque « Bonne fête Maman »',
        description:
          'Cœur en bois perlé avec message fête des mères et petit cœur fleuri gravé. À suspendre ou poser.',
        price: 32,
        photoKey: 'bouquetGift',
      }),
      item('personnalisation', 2, {
        title: 'Cœur bois message maman',
        description:
          'Cœur en bois gravé hommage à maman, roses et herbes séchées. Cadeau tendre et artisanal.',
        price: 35,
        photoKey: 'vaseInterior',
      }),
      item('personnalisation', 3, {
        title: 'Cœur « Merveilleuse Maman »',
        description:
          'Plaque cœur en bois avec mains formant un cœur. Suspension rustique pour la fête des mères.',
        price: 30,
        photoKey: 'peonies',
      }),
      item('personnalisation', 4, {
        title: 'Cœur citation famille',
        description:
          'Cœur en bois gravé sur la famille, à suspendre. Message chaleureux pour décorer votre intérieur.',
        price: 32,
        photoKey: 'flatlayBlooms',
      }),
      item('personnalisation', 5, {
        title: 'Plaque « Papa roi du barbecue »',
        description:
          'Plaque ovale en bois humoristique avec ustensiles et étoiles. Cadeau artisanal pour la fête des pères.',
        price: 34,
        photoKey: 'tulips',
      }),
      item('personnalisation', 6, {
        title: 'Plaque « Meilleur cadeau : moi »',
        description:
          'Plaque humoristique pour papa sur bois naturel. Touche complice et originale à offrir avec le sourire.',
        price: 34,
      }),
      item('personnalisation', 7, {
        title: 'Plaque papa motard',
        description:
          'Plaque « Le meilleur motard, c’est toi papa » avec silhouette de moto. Idéal pour un papa passionné.',
        price: 36,
      }),
      item('personnalisation', 8, {
        title: 'Fiole baptême personnalisée',
        description:
          'Fiole en verre avec prénom, date et colombe dorée sur socle pierre. Souvenir de baptême ou communion.',
        price: 28,
      }),
      item('personnalisation', 9, {
        title: 'Gobelet baptême doré',
        description:
          'Gobelet givré avec cadre doré, dentelle et prénom gravé. Souvenir raffiné pour vos invités.',
        price: 32,
      }),
      item('personnalisation', 10, {
        title: 'Verre à vin prénom doré',
        description:
          'Verre gravé initiale et prénom en doré. Cadeau personnalisé pour anniversaire ou occasion festive.',
        price: 30,
      }),
      item('personnalisation', 11, {
        title: 'Verre à vin 18 ans',
        description:
          'Verre « 18 ans » en doré, présentation soignée. Pour célébrer une majorité avec style.',
        price: 30,
      }),
      item('personnalisation', 12, {
        title: 'Verre communion colombes',
        description:
          'Verre gravé prénom, date et colombes. Souvenir délicat pour un jour de communion inoubliable.',
        price: 32,
      }),
      item('personnalisation', 13, {
        title: 'Horloge message famille',
        description:
          'Horloge ronde bordée de perles avec message sur la famille. Déco chaleureuse et personnalisée.',
        price: 48,
      }),
      item('personnalisation', 14, {
        title: 'Présentoir fleurs séchées',
        description:
          'Socle pierre et composition de fleurs séchées pour mettre en valeur vos créations. Présentation élégante.',
        price: 35,
      }),
    ],
  },
})
