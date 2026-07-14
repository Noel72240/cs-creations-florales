/** Texte central sous le bandeau — modifiable dans Admin → Articles. */
export const PAGE_INTRO_DEFAULTS = {
  personnalisation: {
    enabled: true,
    layout: 'split',
    pretitle: 'Ce qui vous ressemble',
    title: "L'art de la personnalisation",
    paragraphs: [
      'Au-delà des fleurs, je propose un service de personnalisation artisanale pour créer des objets, des cadeaux et des accessoires uniques qui vous ressemblent ou qui toucheront le cœur de ceux à qui vous les offrez.',
      "Chaque création est pensée avec vous, selon vos goûts, vos couleurs, votre histoire. Rien n'est standardisé : tout est créé à la main, avec amour et attention.",
    ],
    image: {
      src: '/images/personnalisation/trousse-personnalisee.png',
      photoKey: '',
      overlayTitle: 'Création sur mesure',
      overlayPosition: 'bottom-left',
      alt: 'Trousse personnalisée — exemple de création sur mesure',
    },
    cta: { enabled: true, label: 'Demander une personnalisation', path: '/contact' },
    supportBox: { enabled: false, quote: '', showAuthor: true },
  },
  creationsFuneraires: {
    enabled: false,
    layout: 'center',
    pretitle: '',
    title: '',
    paragraphs: [],
    image: null,
    cta: { enabled: false, label: '', path: '/contact' },
    supportBox: {
      enabled: true,
      quote:
        "Je suis à votre écoute dans ces moments difficiles. N'hésitez pas à me contacter par téléphone pour une réponse rapide.",
      showAuthor: true,
    },
  },
  creationsFlorales: {
    enabled: false,
    layout: 'center',
    pretitle: '',
    title: '',
    paragraphs: [],
    image: null,
    cta: { enabled: false, label: '', path: '/contact' },
    supportBox: { enabled: false, quote: '', showAuthor: true },
  },
  creationsSaisonnieres: {
    enabled: false,
    layout: 'center',
    pretitle: '',
    title: '',
    paragraphs: [],
    image: null,
    cta: { enabled: false, label: '', path: '/contact' },
    supportBox: { enabled: false, quote: '', showAuthor: true },
  },
  evenementsFloraux: {
    enabled: false,
    layout: 'center',
    pretitle: '',
    title: '',
    paragraphs: [],
    image: null,
    cta: { enabled: false, label: '', path: '/contact' },
    supportBox: { enabled: false, quote: '', showAuthor: true },
  },
  mariage: {
    enabled: false,
    layout: 'center',
    pretitle: '',
    title: '',
    paragraphs: [],
    image: null,
    cta: { enabled: false, label: '', path: '/contact' },
    supportBox: { enabled: false, quote: '', showAuthor: true },
  },
  anniversaire: {
    enabled: false,
    layout: 'center',
    pretitle: '',
    title: '',
    paragraphs: [],
    image: null,
    cta: { enabled: false, label: '', path: '/contact' },
    supportBox: { enabled: false, quote: '', showAuthor: true },
  },
  baptemeCommunion: {
    enabled: false,
    layout: 'center',
    pretitle: '',
    title: '',
    paragraphs: [],
    image: null,
    cta: { enabled: false, label: '', path: '/contact' },
    supportBox: { enabled: false, quote: '', showAuthor: true },
  },
  paques: {
    enabled: false,
    layout: 'center',
    pretitle: '',
    title: '',
    paragraphs: [],
    image: null,
    cta: { enabled: false, label: '', path: '/contact' },
    supportBox: { enabled: false, quote: '', showAuthor: true },
  },
  noel: {
    enabled: false,
    layout: 'center',
    pretitle: '',
    title: '',
    paragraphs: [],
    image: null,
    cta: { enabled: false, label: '', path: '/contact' },
    supportBox: { enabled: false, quote: '', showAuthor: true },
  },
  feteDesMeres: {
    enabled: false,
    layout: 'center',
    pretitle: '',
    title: '',
    paragraphs: [],
    image: null,
    cta: { enabled: false, label: '', path: '/contact' },
    supportBox: { enabled: false, quote: '', showAuthor: true },
  },
  feteDesGrandesMeres: {
    enabled: false,
    layout: 'center',
    pretitle: '',
    title: '',
    paragraphs: [],
    image: null,
    cta: { enabled: false, label: '', path: '/contact' },
    supportBox: { enabled: false, quote: '', showAuthor: true },
  },
  saintValentin: {
    enabled: false,
    layout: 'center',
    pretitle: '',
    title: '',
    paragraphs: [],
    image: null,
    cta: { enabled: false, label: '', path: '/contact' },
    supportBox: { enabled: false, quote: '', showAuthor: true },
  },
}

export function normalizePageIntro(raw, pageKey) {
  const base = PAGE_INTRO_DEFAULTS[pageKey] || {
    enabled: false,
    layout: 'center',
    pretitle: '',
    title: '',
    paragraphs: [],
    image: null,
    cta: { enabled: false, label: '', path: '/contact' },
    supportBox: { enabled: false, quote: '', showAuthor: true },
  }
  if (!raw || typeof raw !== 'object') return { ...base, paragraphs: [...(base.paragraphs || [])] }

  const paragraphs = Array.isArray(raw.paragraphs)
    ? raw.paragraphs.map((p) => String(p || '').trim()).filter(Boolean)
    : base.paragraphs

  const imageRaw = raw.image
  let image = base.image
  if (imageRaw === null) image = null
  else if (imageRaw && typeof imageRaw === 'object') {
    image = {
      src: String(imageRaw.src ?? base.image?.src ?? '').trim(),
      photoKey: String(imageRaw.photoKey ?? base.image?.photoKey ?? '').trim(),
      overlayTitle: String(imageRaw.overlayTitle ?? base.image?.overlayTitle ?? '').trim(),
      overlayPosition: imageRaw.overlayPosition === 'bottom-left' ? 'bottom-left' : 'centered',
      alt: String(imageRaw.alt ?? base.image?.alt ?? '').trim(),
    }
  }

  return {
    enabled: raw.enabled !== undefined ? Boolean(raw.enabled) : base.enabled,
    layout: raw.layout === 'split' ? 'split' : 'center',
    pretitle: String(raw.pretitle ?? base.pretitle ?? '').trim(),
    title: String(raw.title ?? base.title ?? '').trim(),
    paragraphs,
    image,
    cta: {
      enabled: Boolean(raw.cta?.enabled ?? base.cta?.enabled),
      label: String(raw.cta?.label ?? base.cta?.label ?? '').trim(),
      path: String(raw.cta?.path ?? base.cta?.path ?? '/contact').trim() || '/contact',
    },
    supportBox: {
      enabled: Boolean(raw.supportBox?.enabled ?? base.supportBox?.enabled),
      quote: String(raw.supportBox?.quote ?? base.supportBox?.quote ?? '').trim(),
      showAuthor: raw.supportBox?.showAuthor !== false,
    },
  }
}

export function resolvePageIntro(pageArticlesEntry, pageKey) {
  return normalizePageIntro(pageArticlesEntry?.pageIntro, pageKey)
}
