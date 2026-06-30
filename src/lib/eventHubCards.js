import { resolveItemPhoto } from '../data/photoResolver'

/** Cartes Anniversaire / Mariage / Baptême sur la page Événements floraux. */
export const EVENEMENTS_FLORAUX_HUB_DEFAULTS = {
  hubIntro:
    "Chaque événement mérite d'être sublimé par des fleurs. Je crée pour vous des compositions florales sur mesure qui s'accordent parfaitement à l'ambiance de votre célébration.",
  eventCards: [
    {
      title: 'Anniversaire',
      desc: 'Des compositions florales festives et personnalisées pour célébrer chaque année avec éclat.',
      icon: '🎂',
      path: '/evenements-floraux/anniversaire',
      photoKey: 'dahlias',
      src: '',
    },
    {
      title: 'Mariage',
      desc: 'Des créations florales romantiques et élégantes pour sublimer le plus beau jour de votre vie.',
      icon: '💍',
      path: '/evenements-floraux/mariage',
      photoKey: 'weddingBouquet',
      src: '',
    },
    {
      title: 'Baptême & Communion',
      desc: "Des arrangements doux et délicats pour accompagner ces moments d'une tendresse infinie.",
      icon: '🕊️',
      path: '/evenements-floraux/bapteme-communion',
      photoKey: 'peonies',
      src: '',
    },
  ],
}

export function mergeEventHubCards(savedCards) {
  const defaults = EVENEMENTS_FLORAUX_HUB_DEFAULTS.eventCards
  return defaults.map((def, i) => {
    const c = savedCards?.[i] || {}
    return {
      title: String(c.title ?? def.title).trim() || def.title,
      desc: String(c.desc ?? def.desc).trim() || def.desc,
      icon: String(c.icon ?? def.icon).trim() || def.icon,
      path: String(c.path ?? def.path).trim() || def.path,
      photoKey: String(c.photoKey ?? def.photoKey).trim() || def.photoKey,
      src: String(c.src ?? '').trim(),
    }
  })
}

/** @param {object | undefined} pageSection — content.pageArticles.evenementsFloraux */
export function resolveEvenementsFlorauxHub(pageSection) {
  const defaults = EVENEMENTS_FLORAUX_HUB_DEFAULTS
  const hubIntro = String(pageSection?.hubIntro ?? defaults.hubIntro).trim() || defaults.hubIntro
  const cards = mergeEventHubCards(pageSection?.eventCards).map((card) => ({
    ...card,
    img: resolveItemPhoto(card),
  }))
  return { hubIntro, cards }
}
