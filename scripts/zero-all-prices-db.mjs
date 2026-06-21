/**
 * Met tous les prix des articles (pageArticles) à 0 dans Supabase.
 * npx vite-node scripts/zero-all-prices-db.mjs
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

function zeroPrices(pageArticles) {
  if (!pageArticles || typeof pageArticles !== 'object') return PAGE_ARTICLE_CATALOG
  const out = {}
  for (const [key, section] of Object.entries(pageArticles)) {
    out[key] = {
      ...section,
      items: (section.items || []).map((it) => ({ ...it, price: 0 })),
    }
  }
  return out
}

/** @param {object} pageArticles */
export function zeroAllArticlePrices(pageArticles) {
  return zeroPrices(pageArticles)
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
/** Catalogue code = source de vérité (prix forcés à 0 dans item()). */
const pageArticles = structuredClone(PAGE_ARTICLE_CATALOG)
let count = 0
for (const section of Object.values(pageArticles)) {
  count += (section.items || []).length
}

const payload = { ...prev, pageArticles }
const { error } = await sb.from('site_content').upsert({
  id: 'main',
  payload,
  updated_at: new Date().toISOString(),
})

if (error) {
  console.error(error.message)
  process.exit(1)
}

console.log(`${count} article(s) mis à 0,00 € dans Supabase.`)
