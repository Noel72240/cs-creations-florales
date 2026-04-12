export function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export const DEFAULT_BRAND_PHRASES = [
  'C&S Créations Florales et Personnalisation',
  'C&S Créations Florales',
]

/**
 * Prénom + nom de marque en manuscrite (.qui-inline-script), le reste suit le corps de texte.
 */
export function renderQuiParagraphAccents(text, firstName, extraBrandPhrases = []) {
  const str = String(text ?? '')
  const fn = (firstName || '').trim()
  const brands = [...new Set([...extraBrandPhrases, ...DEFAULT_BRAND_PHRASES])]
    .filter(Boolean)
    .sort((a, b) => b.length - a.length)

  const wrapScript = (content, k) => (
    <span key={k} className="qui-inline-script">
      {content}
    </span>
  )

  if (!brands.length && !fn) {
    return str
  }

  const brandRe =
    brands.length > 0 ? new RegExp(`(${brands.map(escapeRegExp).join('|')})`, 'g') : null

  if (!brandRe) {
    const fnRe = new RegExp(`(${escapeRegExp(fn)})`, 'gi')
    let k = 0
    return str.split(fnRe).map((chunk) =>
      chunk.toLowerCase() === fn.toLowerCase() ? wrapScript(chunk, k++) : chunk,
    )
  }

  const nodes = []
  let key = 0

  str.split(brandRe).forEach((chunk) => {
    if (brands.includes(chunk)) {
      nodes.push(wrapScript(chunk, key++))
      return
    }
    if (fn) {
      const fnRe = new RegExp(`(${escapeRegExp(fn)})`, 'gi')
      chunk.split(fnRe).forEach((c) => {
        if (c.toLowerCase() === fn.toLowerCase()) {
          nodes.push(wrapScript(c, key++))
        } else if (c) {
          nodes.push(c)
        }
      })
    } else if (chunk) {
      nodes.push(chunk)
    }
  })

  return nodes
}
