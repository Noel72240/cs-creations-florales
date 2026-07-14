import { resolveItemPhoto } from '../data/photoResolver'

/** Cartes Pâques / Noël / Fêtes… sur la page Créations saisonnières. */
export const CREATIONS_SAISONNIERES_HUB_DEFAULTS = {
  seasonCards: [
    {
      title: 'Pâques',
      desc: 'Des compositions florales printanières et colorées pour célébrer le renouveau du printemps.',
      icon: '🐣',
      path: '/creations-saisonnieres/paques',
      photoKey: 'tulips',
      src: '',
    },
    {
      title: 'Noël',
      desc: 'Couronnes, compositions de table et décors enchanteurs pour illuminer les fêtes de fin d’année.',
      icon: '🎄',
      path: '/creations-saisonnieres/noel',
      photoKey: 'rosesPink',
      src: '',
    },
    {
      title: 'Fêtes des Mères/Pères',
      desc: 'Des bouquets et créations florales tendres et délicats pour honorer mamans et papas avec amour.',
      icon: '💝',
      path: '/creations-saisonnieres/fete-des-meres',
      photoKey: 'bouquetSoft',
      src: '',
    },
    {
      title: 'Fête des Grandes-Mères',
      desc: 'Compositions florales et cadeaux personnalisés pour célébrer mamie avec tendresse.',
      icon: '💐',
      path: '/creations-saisonnieres/fete-des-grandes-meres',
      photoKey: 'peonies',
      src: '',
    },
    {
      title: 'Saint-Valentin',
      desc: 'Cœurs, roses et créations romantiques pour célébrer la Saint-Valentin.',
      icon: '💕',
      path: '/creations-saisonnieres/saint-valentin',
      photoKey: 'rosesBouquet',
      src: '',
    },
  ],
}

export function mergeSeasonHubCards(savedCards) {
  const defaults = CREATIONS_SAISONNIERES_HUB_DEFAULTS.seasonCards
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

export function resolveCreationsSaisonnieresHub(pageSection) {
  const cards = mergeSeasonHubCards(pageSection?.seasonCards).map((card) => ({
    ...card,
    img: resolveItemPhoto(card),
  }))
  return { cards }
}
