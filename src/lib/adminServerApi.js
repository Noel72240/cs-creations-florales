const ADMIN_PWD_KEY = 'cs_admin_pwd'

export function storeAdminPasswordForApi(password) {
  try {
    sessionStorage.setItem(ADMIN_PWD_KEY, String(password || ''))
  } catch {
    /* ignore */
  }
}

export function clearAdminPasswordForApi() {
  try {
    sessionStorage.removeItem(ADMIN_PWD_KEY)
  } catch {
    /* ignore */
  }
}

function getStoredAdminPassword() {
  try {
    return sessionStorage.getItem(ADMIN_PWD_KEY) || ''
  } catch {
    return ''
  }
}

async function parseApiResponse(r) {
  let data = {}
  try {
    data = await r.json()
  } catch {
    /* ignore */
  }
  if (!r.ok) {
    const err = data?.error || `Erreur serveur (${r.status})`
    if (r.status === 404) {
      throw new Error(
        'API admin indisponible en local. Lancez `npx vercel dev` ou testez sur le site déployé Vercel.',
      )
    }
    throw new Error(err)
  }
  return data
}

/** @returns {Promise<{ ok: boolean, serverHealth?: object }>} */
export async function fetchAdminServerHealth() {
  try {
    const r = await fetch('/api/admin-health', { method: 'GET' })
    return await parseApiResponse(r)
  } catch {
    return { ok: false, supabaseServiceConfigured: false, adminPasswordConfigured: false }
  }
}

/** @returns {Promise<{ ok: boolean, error?: string, strippedImages?: number, payloadTooLarge?: boolean }>} */
export async function saveSiteContentViaApi(payload) {
  const adminPassword = getStoredAdminPassword()
  if (!adminPassword) {
    return { ok: false, error: 'Reconnectez-vous à l’admin (mot de passe du site).' }
  }

  const { preparePayloadForCloudSave } = await import('./siteContentCloudPayload.js')
  const { payload: cloudPayload, strippedCount, byteSize } = preparePayloadForCloudSave(payload)

  if (byteSize > 4_200_000) {
    return {
      ok: false,
      error: `Contenu trop lourd (${Math.round(byteSize / 1024)} Ko). Réduisez les photos intégrées.`,
      payloadTooLarge: true,
      strippedImages: strippedCount,
    }
  }

  try {
    const r = await fetch('/api/save-site-content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adminPassword, payload: cloudPayload }),
    })
    await parseApiResponse(r)
    return { ok: true, strippedImages: strippedCount }
  } catch (e) {
    const msg = e?.message || 'Échec enregistrement serveur'
    if (msg.includes('413') || msg.toLowerCase().includes('too large')) {
      return { ok: false, error: msg, payloadTooLarge: true, strippedImages: strippedCount }
    }
    return { ok: false, error: msg, strippedImages: strippedCount }
  }
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const raw = String(reader.result || '')
      resolve(raw.includes(',') ? raw.split(',')[1] : raw)
    }
    reader.onerror = () => reject(new Error('Lecture fichier impossible'))
    reader.readAsDataURL(file)
  })
}

/** @param {File} file @param {string} folder @returns {Promise<string>} */
export async function uploadSiteImageViaApi(file, folder) {
  const adminPassword = getStoredAdminPassword()
  if (!adminPassword) {
    throw new Error('Reconnectez-vous à l’admin pour envoyer des photos sur le cloud.')
  }
  const dataBase64 = await fileToBase64(file)
  const r = await fetch('/api/upload-site-image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      adminPassword,
      folder,
      fileName: file.name,
      contentType: file.type,
      dataBase64,
    }),
  })
  const data = await parseApiResponse(r)
  if (!data.url) throw new Error('URL publique manquante')
  return data.url
}
