/** Textes de page modifiables dans Admin → Articles (sans écraser le reste). */

const BASE = {
  contactCta: {
    title: 'Parlons de votre projet',
    message: 'Une question ? Un projet ? Je suis là pour vous accompagner.',
    primaryLabel: 'Demander un devis gratuit',
    phoneLabelPrefix: 'Appeler ',
  },
  midCta: {
    enabled: false,
    label: '',
    path: '/contact',
  },
  orderCta: {
    enabled: false,
    label: 'Commander cette création',
    path: '/contact',
  },
  contactBlock: {
    enabled: false,
    title: 'Nous contacter',
    text: '',
    phoneLabel: 'Appeler',
    messageLabel: 'Envoyer un message',
  },
}

/** Surcharges par défaut (repli si rien en base). */
export const PAGE_TEXTS_PAGE_DEFAULTS = {
  evenementsFloraux: {
    contactCta: {
      message:
        'Vous avez un événement à préparer ? Contactez-moi pour un devis personnalisé et gratuit.',
    },
  },
  mariage: { contactCta: { message: 'Un mariage à préparer ? Parlons de vos envies florales.' } },
  anniversaire: { contactCta: { message: 'Une fête à organiser ? Je crée une composition sur mesure.' } },
  baptemeCommunion: {
    contactCta: { message: 'Baptême ou communion ? Des créations douces et personnalisées.' },
  },
  creationsFlorales: {
    midCta: { enabled: true, label: 'Commander une création', path: '/contact' },
    contactCta: {
      message: 'Vous souhaitez une création florale personnalisée ? Contactez-moi pour en discuter !',
    },
  },
  creationsFuneraires: {
    contactBlock: {
      enabled: true,
      title: 'Nous contacter',
      text: 'Je suis à votre écoute dans ces moments difficiles. N’hésitez pas à me contacter par téléphone pour une réponse rapide.',
      phoneLabel: '📞 Appeler',
      messageLabel: 'Envoyer un message',
    },
    contactCta: {
      message: 'Besoin d’un hommage floral ? Je vous écoute avec attention et discrétion.',
    },
  },
  creationsSaisonnieres: {
    contactCta: {
      message:
        'Vous préparez une fête ou une célébration saisonnière ? Je crée pour vous des compositions florales adaptées.',
    },
  },
  paques: { orderCta: { enabled: true } },
  noel: { orderCta: { enabled: true } },
  feteDesMeres: { orderCta: { enabled: true } },
  feteDesGrandesMeres: { orderCta: { enabled: true } },
  saintValentin: { orderCta: { enabled: true } },
  personnalisation: {
    contactCta: {
      message:
        'Une idée de cadeau personnalisé ? Parlons-en ensemble, je suis là pour concrétiser votre vision !',
    },
  },
}

function buildDefaults(pageKey) {
  const pageDefaults = PAGE_TEXTS_PAGE_DEFAULTS[pageKey] || {}
  return {
    contactCta: { ...BASE.contactCta, ...pageDefaults.contactCta },
    midCta: {
      ...BASE.midCta,
      ...pageDefaults.midCta,
      enabled: Boolean(pageDefaults.midCta?.enabled ?? BASE.midCta.enabled),
    },
    orderCta: {
      ...BASE.orderCta,
      ...pageDefaults.orderCta,
      enabled: Boolean(pageDefaults.orderCta?.enabled ?? BASE.orderCta.enabled),
    },
    contactBlock: {
      ...BASE.contactBlock,
      ...pageDefaults.contactBlock,
      enabled: Boolean(pageDefaults.contactBlock?.enabled ?? BASE.contactBlock.enabled),
    },
  }
}

function pickText(value, fallback) {
  const s = String(value ?? '').trim()
  return s || fallback
}

/**
 * @param {object|null|undefined} raw
 * @param {string} [pageKey]
 * @param {{ trimText?: boolean }} [options] — trimText=false pendant la saisie (espaces entre les mots)
 */
export function normalizePageTexts(raw, pageKey = '', options = {}) {
  const trimText = options.trimText !== false
  const soft = (v) => {
    const s = String(v ?? '')
    return trimText ? s.trim() : s
  }
  const pageDefaults = PAGE_TEXTS_PAGE_DEFAULTS[pageKey] || {}
  const fromRaw = raw && typeof raw === 'object' ? raw : {}

  return {
    contactCta: {
      title: soft(fromRaw.contactCta?.title),
      message: soft(fromRaw.contactCta?.message),
      primaryLabel: soft(fromRaw.contactCta?.primaryLabel),
      phoneLabelPrefix: soft(fromRaw.contactCta?.phoneLabelPrefix),
    },
    midCta: {
      enabled: Boolean(fromRaw.midCta?.enabled ?? pageDefaults.midCta?.enabled ?? BASE.midCta.enabled),
      label: soft(fromRaw.midCta?.label),
      path: String(fromRaw.midCta?.path ?? '/contact').trim() || '/contact',
    },
    orderCta: {
      enabled: Boolean(fromRaw.orderCta?.enabled ?? pageDefaults.orderCta?.enabled ?? BASE.orderCta.enabled),
      label: soft(fromRaw.orderCta?.label),
      path: String(fromRaw.orderCta?.path ?? '/contact').trim() || '/contact',
    },
    contactBlock: {
      enabled: Boolean(
        fromRaw.contactBlock?.enabled ?? pageDefaults.contactBlock?.enabled ?? BASE.contactBlock.enabled,
      ),
      title: soft(fromRaw.contactBlock?.title),
      text: soft(fromRaw.contactBlock?.text),
      phoneLabel: soft(fromRaw.contactBlock?.phoneLabel),
      messageLabel: soft(fromRaw.contactBlock?.messageLabel),
    },
  }
}

/** Textes affichés sur le site (defaults + données admin, sans écraser les customisations). */
export function resolvePageTexts(pageKey, pageArticlesEntry) {
  const base = buildDefaults(pageKey)
  const saved = pageArticlesEntry?.pageTexts || {}

  let contactBlockText = pickText(saved.contactBlock?.text, base.contactBlock.text)
  // Remplace l’ancien texte funéraire figé s’il est encore en base.
  if (
    pageKey === 'creationsFuneraires' &&
    contactBlockText ===
      'Je suis disponible rapidement pour vous accompagner. Appelez-moi ou envoyez un message.'
  ) {
    contactBlockText = base.contactBlock.text
  }

  return {
    contactCta: {
      title: pickText(saved.contactCta?.title, base.contactCta.title),
      message: pickText(saved.contactCta?.message, base.contactCta.message),
      primaryLabel: pickText(saved.contactCta?.primaryLabel, base.contactCta.primaryLabel),
      phoneLabelPrefix: pickText(saved.contactCta?.phoneLabelPrefix, base.contactCta.phoneLabelPrefix),
    },
    midCta: {
      enabled: saved.midCta?.enabled !== undefined ? Boolean(saved.midCta.enabled) : base.midCta.enabled,
      label: pickText(saved.midCta?.label, base.midCta.label),
      path: pickText(saved.midCta?.path, base.midCta.path),
    },
    orderCta: {
      enabled: saved.orderCta?.enabled !== undefined ? Boolean(saved.orderCta.enabled) : base.orderCta.enabled,
      label: pickText(saved.orderCta?.label, base.orderCta.label),
      path: pickText(saved.orderCta?.path, base.orderCta.path),
    },
    contactBlock: {
      enabled:
        saved.contactBlock?.enabled !== undefined
          ? Boolean(saved.contactBlock.enabled)
          : base.contactBlock.enabled,
      title: pickText(saved.contactBlock?.title, base.contactBlock.title),
      text: contactBlockText,
      phoneLabel: pickText(saved.contactBlock?.phoneLabel, base.contactBlock.phoneLabel),
      messageLabel: pickText(saved.contactBlock?.messageLabel, base.contactBlock.messageLabel),
    },
  }
}

/** Préremplit l’admin avec les textes réellement affichés (sinon champs vides = pas éditables). */
export function pageTextsForEditor(raw, pageKey = '') {
  const resolved = resolvePageTexts(pageKey, { pageTexts: raw })
  const normalized = normalizePageTexts(raw, pageKey, { trimText: false })
  return {
    contactCta: {
      title: normalized.contactCta.title || resolved.contactCta.title,
      message: normalized.contactCta.message || resolved.contactCta.message,
      primaryLabel: normalized.contactCta.primaryLabel || resolved.contactCta.primaryLabel,
      phoneLabelPrefix: normalized.contactCta.phoneLabelPrefix || resolved.contactCta.phoneLabelPrefix,
    },
    midCta: {
      enabled: normalized.midCta.enabled,
      label: normalized.midCta.label || resolved.midCta.label,
      path: normalized.midCta.path || resolved.midCta.path,
    },
    orderCta: {
      enabled: normalized.orderCta.enabled,
      label: normalized.orderCta.label || resolved.orderCta.label,
      path: normalized.orderCta.path || resolved.orderCta.path,
    },
    contactBlock: {
      enabled: normalized.contactBlock.enabled,
      title: normalized.contactBlock.title || resolved.contactBlock.title,
      text: normalized.contactBlock.text || resolved.contactBlock.text,
      phoneLabel: normalized.contactBlock.phoneLabel || resolved.contactBlock.phoneLabel,
      messageLabel: normalized.contactBlock.messageLabel || resolved.contactBlock.messageLabel,
    },
  }
}
