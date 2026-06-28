import { resolvePhotoSrc } from '../data/photoResolver'

const PHOTO_SLOTS = [
  { src: 'src', key: 'photoKey' },
  { src: 'src2', key: 'photoKey2' },
  { src: 'src3', key: 'photoKey3' },
]

/** Jusqu’à 3 URLs pour une fiche article. */
export function getArticlePhotoUrls(item) {
  if (!item || typeof item !== 'object') return []
  const urls = []
  for (const slot of PHOTO_SLOTS) {
    const custom = String(item[slot.src] || '').trim()
    const key = String(item[slot.key] || '').trim()
    const url = resolvePhotoSrc(custom || key)
    if (url && !urls.includes(url)) urls.push(url)
    if (urls.length >= 3) break
  }
  return urls
}
