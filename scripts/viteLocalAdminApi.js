/**
 * En `npm run dev`, Vite ne sert pas /api — ce middleware réutilise la même logique que Vercel.
 * Prérequis dans .env : SUPABASE_SERVICE_ROLE_KEY (+ SUPABASE_URL ou VITE_SUPABASE_URL).
 */
import { saveSiteContentCore } from '../api/lib/saveSiteContentCore.js'
import { getAdminHealthStatus } from '../api/lib/adminHealthCore.js'

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', (c) => chunks.push(c))
    req.on('end', () => {
      try {
        const raw = Buffer.concat(chunks).toString('utf8')
        resolve(raw ? JSON.parse(raw) : {})
      } catch {
        reject(new Error('JSON invalide'))
      }
    })
    req.on('error', reject)
  })
}

function sendJson(res, status, body) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.end(JSON.stringify(body))
}

export function createLocalAdminApiMiddleware() {
  return async (req, res, next) => {
    const url = req.url?.split('?')[0] || ''

    if (url === '/api/admin-health' && req.method === 'GET') {
      sendJson(res, 200, getAdminHealthStatus())
      return
    }

    if (url === '/api/save-site-content' && req.method === 'POST') {
      try {
        const body = await readBody(req)
        const adminPassword = String(body.adminPassword || '').trim()
        const result = await saveSiteContentCore(adminPassword, body.payload)
        if (!result.ok) {
          const status = result.error?.includes('incorrect') ? 401 : result.error?.includes('configuré') ? 503 : 500
          sendJson(res, status, result)
          return
        }
        sendJson(res, 200, result)
      } catch (e) {
        sendJson(res, 500, { ok: false, error: e?.message || 'Erreur serveur' })
      }
      return
    }

    next()
  }
}
