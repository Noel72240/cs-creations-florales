/** Vérifie le mot de passe admin (serveur uniquement — jamais exposé au bundle client). */
export function getAdminPasswordFromEnv() {
  return (process.env.ADMIN_PASSWORD || process.env.VITE_ADMIN_PASSWORD || '').trim()
}

export function verifyAdminPassword(provided) {
  const expected = getAdminPasswordFromEnv()
  if (!expected) {
    return { ok: false, error: 'Mot de passe admin serveur non configuré (ADMIN_PASSWORD sur Vercel).' }
  }
  if ((provided || '').trim() !== expected) {
    return { ok: false, error: 'Mot de passe admin incorrect.' }
  }
  return { ok: true }
}

export function readAdminPassword(body, headers = {}) {
  const fromHeader = headers['x-admin-password'] || headers['X-Admin-Password']
  return String(body?.adminPassword ?? fromHeader ?? '').trim()
}
