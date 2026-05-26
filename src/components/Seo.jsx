import { useEffect } from 'react'
import { absoluteUrl, BUSINESS_SEO, DEFAULT_OG_IMAGE } from '../lib/seoConfig'

function upsertMeta(attr, key, content, isProperty = false) {
  if (!content) return
  const selector = isProperty ? `meta[property="${key}"]` : `meta[${attr}="${key}"]`
  let el = document.head.querySelector(selector)
  if (!el) {
    el = document.createElement('meta')
    if (isProperty) el.setAttribute('property', key)
    else el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertLink(rel, href) {
  if (!href) return
  let el = document.head.querySelector(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

function upsertJsonLd(id, data) {
  const prev = document.getElementById(id)
  if (prev) prev.remove()
  if (!data) return
  const script = document.createElement('script')
  script.type = 'application/ld+json'
  script.id = id
  script.text = JSON.stringify(data)
  document.head.appendChild(script)
}

/**
 * Balises SEO dynamiques (title, description, Open Graph, canonical, JSON-LD).
 */
export default function Seo({
  title,
  description,
  path = '/',
  image = DEFAULT_OG_IMAGE,
  type = 'website',
  noindex = false,
  jsonLd = null,
  breadcrumb = null,
}) {
  const canonical = absoluteUrl(path)
  const imageUrl = image.startsWith('http') ? image : absoluteUrl(image)
  const fullTitle = title.includes(BUSINESS_SEO.name) ? title : `${title} | ${BUSINESS_SEO.name}`

  useEffect(() => {
    document.title = fullTitle
    document.documentElement.lang = 'fr'

    upsertMeta('name', 'description', description)
    upsertMeta('name', 'robots', noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large')

    upsertMeta('property', 'og:type', type, true)
    upsertMeta('property', 'og:title', fullTitle, true)
    upsertMeta('property', 'og:description', description, true)
    upsertMeta('property', 'og:url', canonical, true)
    upsertMeta('property', 'og:image', imageUrl, true)
    upsertMeta('property', 'og:locale', 'fr_FR', true)
    upsertMeta('property', 'og:site_name', BUSINESS_SEO.name, true)

    upsertMeta('name', 'twitter:card', 'summary_large_image')
    upsertMeta('name', 'twitter:title', fullTitle)
    upsertMeta('name', 'twitter:description', description)
    upsertMeta('name', 'twitter:image', imageUrl)

    upsertLink('canonical', canonical)

    const schemas = []
    if (jsonLd) {
      schemas.push(...(Array.isArray(jsonLd) ? jsonLd : [jsonLd]))
    }
    if (breadcrumb?.length) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumb.map((item, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: item.name,
          item: absoluteUrl(item.path),
        })),
      })
    }
    const ldPayload =
      schemas.length === 0
        ? null
        : schemas.length === 1
          ? schemas[0]
          : { '@context': 'https://schema.org', '@graph': schemas }
    upsertJsonLd('seo-jsonld', ldPayload)
  }, [fullTitle, description, canonical, imageUrl, type, noindex, jsonLd, breadcrumb])

  return null
}

export function buildLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Florist',
    name: BUSINESS_SEO.name,
    description:
      'Créatrice florale artisanale à Écommoy (Sarthe) : compositions en fleurs stabilisées et artificielles, mariages, anniversaires, baptêmes, deuil et personnalisation.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: BUSINESS_SEO.city,
      postalCode: BUSINESS_SEO.postalCode,
      addressRegion: BUSINESS_SEO.region,
      addressCountry: 'FR',
    },
    areaServed: [
      { '@type': 'City', name: 'Écommoy' },
      { '@type': 'City', name: 'Le Mans' },
      { '@type': 'City', name: 'Sablé-sur-Sarthe' },
      { '@type': 'AdministrativeArea', name: 'Sarthe' },
    ],
    email: BUSINESS_SEO.email,
    priceRange: '€€',
    url: absoluteUrl('/'),
    image: absoluteUrl(DEFAULT_OG_IMAGE),
  }
}

export function buildFaqSchema(faq) {
  if (!faq?.length) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  }
}
