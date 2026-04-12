import { P, w500, w600 } from './flowerPhotos'

export function photoW600(key) {
  const id = P[key]
  return w600(id || P.weddingBouquet)
}

export function photoW500(key) {
  const id = P[key]
  return w500(id || P.weddingTableFlorals)
}

export const PHOTO_KEY_OPTIONS = Object.keys(P)
