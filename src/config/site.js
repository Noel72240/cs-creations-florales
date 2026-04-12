import { DEFAULT_SITE_BACKGROUND } from '../data/photoResolver'

/**
 * Infos site — à adapter si besoin.
 * Bandeau d’accueil : image optionnelle (admin / hero.png) ; sinon dégradé sans image.
 */
export const HERO_BACKGROUND_DEFAULT = DEFAULT_SITE_BACKGROUND
export const SITE = {
  ownerFirstName: 'Charlène',
  ownerLastName: '',
  ownerFullName: 'Charlène',
  businessName: 'C&S Créations Florales et Personnalisation',
  city: 'Écommoy',
  postalCode: '72220',
  region: 'Sarthe',
  email: 'contact@cs-creations-florales.fr',
  phoneDisplay: '06 XX XX XX XX',
  phoneHref: 'tel:+33600000000',
}

/**
 * Paiement en ligne SumUp : créez un « lien de paiement » dans l’application SumUp
 * (ou plusieurs liens selon les montants), puis collez l’URL complète ici.
 * Fichier `.env` : VITE_SUMUP_PAYMENT_URL=https://…
 */
export const SUMUP_PAYMENT_URL = (import.meta.env.VITE_SUMUP_PAYMENT_URL || '').trim()

/** Agence / éditeur technique du site (mentions légales & pied de page) */
export const WEB_DEV = {
  contactName: 'Noël Liebault',
  company: 'Allotech72',
  legalForm: 'Micro-entreprise',
  addressLine: '7 rue de la Rentière',
  city: 'Lombron',
  postalCode: '72450',
  phoneDisplay: '06 13 89 39 67',
  phoneHref: 'tel:+33613893967',
  email: 'contact@allotech72.fr',
  siret: '99006097200017',
}

