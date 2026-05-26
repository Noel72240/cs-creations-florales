/** Retire les images base64 du JSON avant envoi Supabase (limite ~4 Mo sur Vercel). */
export function preparePayloadForCloudSave(payload) {
  const MAX_DATA_URL = 2048
  let strippedCount = 0

  function walk(value) {
    if (value == null) return value
    if (typeof value === 'string') {
      if (value.startsWith('data:') && value.length > MAX_DATA_URL) {
        strippedCount += 1
        return ''
      }
      return value
    }
    if (Array.isArray(value)) return value.map(walk)
    if (typeof value === 'object') {
      const out = {}
      for (const [k, v] of Object.entries(value)) {
        out[k] = walk(v)
      }
      return out
    }
    return value
  }

  const prepared = walk(payload)
  let size = 0
  try {
    size = JSON.stringify(prepared).length
  } catch {
    size = 0
  }

  return { payload: prepared, strippedCount, byteSize: size }
}
