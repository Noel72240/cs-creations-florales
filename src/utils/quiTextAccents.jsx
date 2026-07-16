export function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export const DEFAULT_BRAND_PHRASES = [
  'C&S Créations Florales et Personnalisation',
  'C&S Créations Florales',
  'Créations Florales et Personnalisation',
  'Création florale et personnalisation',
  'Créations florales et personnalisation',
]

export const DEFAULT_PLACE_PHRASES = ['Écommoy', 'Ecommoy', 'Sarthe']

/**
 * Accents violet + police Cookie (comme « C&S Créations Florales »)
 * pour prénom, marque, lieux (Écommoy, Sarthe).
 */
export function renderQuiParagraphAccents(text, firstName, extraBrandPhrases = []) {
  const str = String(text ?? '')
  const fn = (firstName || '').trim()
  const brands = [...new Set([...extraBrandPhrases, ...DEFAULT_BRAND_PHRASES])]
    .filter(Boolean)
    .sort((a, b) => b.length - a.length)
  const places = [...DEFAULT_PLACE_PHRASES].sort((a, b) => b.length - a.length)

  const wrapBrand = (content, k) => (
    <span key={k} className="qui-inline-brand font-brand">
      {content}
    </span>
  )
  const wrapPlace = (content, k) => (
    <span key={k} className="qui-inline-place">
      {content}
    </span>
  )

  const highlightTerms = [fn, ...brands, ...places].filter(Boolean).sort((a, b) => b.length - a.length)
  if (!highlightTerms.length) return str

  const placeSet = new Set(places.map((p) => p.toLowerCase()))
  const re = new RegExp(`(${highlightTerms.map(escapeRegExp).join('|')})`, 'gi')
  const nodes = []
  let key = 0
  let last = 0
  let match

  while ((match = re.exec(str)) !== null) {
    if (match.index > last) {
      nodes.push(str.slice(last, match.index))
    }
    const hit = match[0]
    if (placeSet.has(hit.toLowerCase())) {
      nodes.push(wrapPlace(hit, key++))
    } else {
      nodes.push(wrapBrand(hit, key++))
    }
    last = match.index + match[0].length
  }
  if (last < str.length) nodes.push(str.slice(last))

  return nodes.length ? nodes : str
}
