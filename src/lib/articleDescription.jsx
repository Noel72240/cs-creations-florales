/**
 * Mise en forme légère des descriptions article : **mot** → gras.
 * Le texte sans ** reste affiché tel quel.
 */

export function stripArticleDescriptionMarkup(text) {
  return String(text || '').replace(/\*\*([^*]+)\*\*/g, '$1')
}

export function ArticleDescriptionBlock({ text }) {
  const raw = String(text || '')
  if (!raw) return null

  const nodes = []
  const re = /\*\*([^*]+)\*\*/g
  let last = 0
  let match

  while ((match = re.exec(raw)) !== null) {
    if (match.index > last) {
      nodes.push(<span key={`t-${last}`}>{raw.slice(last, match.index)}</span>)
    }
    nodes.push(<strong key={`b-${match.index}`}>{match[1]}</strong>)
    last = match.index + match[0].length
  }

  if (last < raw.length) {
    nodes.push(<span key={`t-${last}`}>{raw.slice(last)}</span>)
  }

  if (!nodes.length) return <span>{raw}</span>

  return <>{nodes}</>
}
