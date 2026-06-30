import { resolveItemPhoto, resolvePhotoSrc } from '../data/photoResolver'

const OPTIONAL_SLOTS = [
  { src: 'src2', key: 'photoKey2' },
  { src: 'src3', key: 'photoKey3' },
]

/** Jusqu’à 3 URLs pour une fiche article (photos 2 et 3 seulement si renseignées). */
export function getArticlePhotoUrls(item) {
  if (!item || typeof item !== 'object') return []

  const urls = []
  const main = resolveItemPhoto(item)
  if (main) urls.push(main)

  for (const slot of OPTIONAL_SLOTS) {
    const custom = String(item[slot.src] || '').trim()
    const key = String(item[slot.key] || '').trim()
    if (!custom && !key) continue
    const url = resolvePhotoSrc(custom || key)
    if (url && !urls.includes(url)) urls.push(url)
  }

  return urls
}
