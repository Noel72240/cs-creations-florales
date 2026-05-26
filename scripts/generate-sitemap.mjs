/**
 * Génère public/sitemap.xml et public/robots.txt avant le build.
 * Définir VITE_SITE_URL sur Vercel (ex. https://www.cs-creations-florales.fr).
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { SEO_PAGES, SEO_HUB } from '../src/data/seoPages.js'
import { ROUTE_SEO } from '../src/data/routeSeo.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const publicDir = path.join(__dirname, '..', 'public')

const origin = (process.env.VITE_SITE_URL || 'https://www.cs-creations-florales.fr').replace(/\/$/, '')
const today = new Date().toISOString().slice(0, 10)

const paths = new Set(['/'])

for (const route of Object.keys(ROUTE_SEO)) {
  if (ROUTE_SEO[route]?.noindex) continue
  paths.add(route)
}

paths.add(SEO_HUB.path)
for (const page of SEO_PAGES) {
  paths.add(`/guides/${page.slug}`)
}

const priorityFor = (p) => {
  if (p === '/') return '1.0'
  if (p.startsWith('/guides/')) return '0.7'
  if (p === '/guides') return '0.75'
  if (p.includes('contact') || p.includes('creations-florales')) return '0.9'
  return '0.8'
}

const urls = [...paths]
  .sort()
  .map(
    (p) => `  <url>
    <loc>${origin}${p}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.startsWith('/guides') ? 'monthly' : 'weekly'}</changefreq>
    <priority>${priorityFor(p)}</priority>
  </url>`,
  )
  .join('\n')

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`

const robots = `User-agent: *
Allow: /

Disallow: /admin
Disallow: /panier
Disallow: /paiement

Sitemap: ${origin}/sitemap.xml
`

fs.mkdirSync(publicDir, { recursive: true })
fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap, 'utf8')
fs.writeFileSync(path.join(publicDir, 'robots.txt'), robots, 'utf8')

console.log(`[sitemap] ${paths.size} URLs → ${origin}/sitemap.xml`)
