/** Seuil aligné sur preparePayloadForCloudSave : au-delà, l’image doit être hébergée (Storage / public/). */
const MIN_DATA_URL_LEN = 2048

export function countLargeDataUrls(value) {
  let n = 0
  function walk(v) {
    if (v == null) return
    if (typeof v === 'string') {
      if (v.startsWith('data:') && v.length > MIN_DATA_URL_LEN) n += 1
      return
    }
    if (Array.isArray(v)) v.forEach(walk)
    else if (typeof v === 'object') Object.values(v).forEach(walk)
  }
  walk(value)
  return n
}

export function dataUrlToFile(dataUrl) {
  const m = String(dataUrl).match(/^data:([^;,]+)(?:;[^,]*)?;base64,(.+)$/s)
  if (!m) return null
  const contentType = m[1]
  const b64 = m[2]
  let binary
  try {
    binary = atob(b64)
  } catch {
    return null
  }
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  const ext = contentType.includes('png') ? 'png' : contentType.includes('webp') ? 'webp' : 'jpg'
  return new File([bytes], `inline-${Date.now()}.${ext}`, { type: contentType })
}

function storageFolderForPath(jsonPath) {
  const p = jsonPath.toLowerCase()
  if (p.includes('coupsdecoeur') || p.includes('coups')) return 'site/coups'
  if (p.includes('prestations')) return 'site/prestations'
  if (p.includes('hero')) return 'site/hero'
  if (p.includes('quisuisje')) return 'site/about'
  if (p.includes('articles') || p.includes('pages')) return 'articles'
  return 'site/uploads'
}

/**
 * Remplace les data:URL volumineuses par des URL Storage via uploadFile(file, folder).
 * @returns {{ payload: object, uploaded: number, failed: number }}
 */
export async function uploadLargeDataUrlsInPayload(payload, uploadFile) {
  let uploaded = 0
  let failed = 0

  async function walk(value, path = '') {
    if (value == null) return value
    if (typeof value === 'string') {
      if (value.startsWith('data:') && value.length > MIN_DATA_URL_LEN) {
        const file = dataUrlToFile(value)
        if (!file) {
          failed += 1
          return ''
        }
        try {
          const folder = storageFolderForPath(path)
          const url = await uploadFile(file, folder)
          uploaded += 1
          return url
        } catch {
          failed += 1
          return value
        }
      }
      return value
    }
    if (Array.isArray(value)) {
      const out = []
      for (let i = 0; i < value.length; i++) {
        out.push(await walk(value[i], `${path}[${i}]`))
      }
      return out
    }
    if (typeof value === 'object') {
      const out = {}
      for (const [k, v] of Object.entries(value)) {
        const childPath = path ? `${path}.${k}` : k
        out[k] = await walk(v, childPath)
      }
      return out
    }
    return value
  }

  const next = await walk(payload)
  return { payload: next, uploaded, failed }
}
