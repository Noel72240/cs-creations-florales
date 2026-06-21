/**
 * Restaure pageArticles (catalogue) + maintenance dans site_content.
 * npx vite-node scripts/restore-site-content-db.mjs
 */
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { createClient } from '@supabase/supabase-js'
import { PAGE_ARTICLE_CATALOG } from '../src/data/articleCatalog.js'

function loadEnv() {
  const envPath = resolve(process.cwd(), '.env')
  const text = readFileSync(envPath, 'utf8')
  const env = {}
  for (const line of text.split('\n')) {
    const t = line.trim()
    if (!t || t.startsWith('#')) continue
    const i = t.indexOf('=')
    if (i < 1) continue
    env[t.slice(0, i).trim()] = t.slice(i + 1).trim()
  }
  return env
}

const env = loadEnv()
const url = env.SUPABASE_URL || env.VITE_SUPABASE_URL
const key = env.SUPABASE_SERVICE_ROLE_KEY
if (!url || !key) {
  console.error('SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY requis dans .env')
  process.exit(1)
}

const sb = createClient(url, key)
const { data, error: fetchError } = await sb.from('site_content').select('payload').eq('id', 'main').maybeSingle()
if (fetchError) {
  console.error(fetchError.message)
  process.exit(1)
}

const prev = data?.payload && typeof data.payload === 'object' ? data.payload : {}
const payload = {
  ...prev,
  pageArticles: PAGE_ARTICLE_CATALOG,
  maintenance: {
    ...(prev.maintenance || {}),
    enabled: true,
    title: prev.maintenance?.title || 'Site en cours de maintenance',
    message:
      prev.maintenance?.message ||
      'Notre site est momentanément en maintenance. Les paiements en ligne sont suspendus — vous pouvez nous contacter pour toute commande ou devis.',
  },
}

const { error } = await sb.from('site_content').upsert({
  id: 'main',
  payload,
  updated_at: new Date().toISOString(),
})

if (error) {
  console.error(error.message)
  process.exit(1)
}

console.log('Restauré : pageArticles + maintenance.enabled=true')
console.log('Rubriques:', Object.keys(payload.pageArticles).join(', '))
