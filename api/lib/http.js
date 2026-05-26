function getAllowedOrigins() {
  const fromApp = (process.env.APP_URL || '')
    .split(',')
    .map((s) => s.trim().replace(/\/$/, ''))
    .filter(Boolean)
  const vercel = process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []
  return [...new Set([...fromApp, ...vercel, 'http://localhost:5173', 'http://127.0.0.1:5173'])]
}

export function corsHeaders(requestOrigin) {
  const allowed = getAllowedOrigins()
  const origin = (requestOrigin || '').trim().replace(/\/$/, '')
  const match = allowed.find((a) => origin === a)
  const allow = match || allowed[0] || '*'
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Password',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  }
}

export function sendJson(res, status, body, origin) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', ...corsHeaders(origin) })
  res.end(JSON.stringify(body))
}

export async function readJsonBody(req) {
  if (req.body && typeof req.body === 'object' && !Buffer.isBuffer(req.body)) {
    return req.body
  }
  const chunks = []
  for await (const chunk of req) {
    chunks.push(chunk)
  }
  const raw = Buffer.concat(chunks).toString('utf8')
  if (!raw.trim()) return {}
  try {
    return JSON.parse(raw)
  } catch {
    throw new Error('Corps JSON invalide')
  }
}
