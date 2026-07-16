/**
 * Mise en forme légère des descriptions article : **mot** → gras.
 * Lignes consécutives = bloc serré ; ligne(s) vide(s) = espace entre sections.
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

/**
 * Découpe la description admin en blocs :
 * - lignes non vides consécutives → un paragraphe serré (lignes séparées par <br>)
 * - ligne(s) vide(s) → séparateur entre blocs
 */
export function splitArticleDescriptionSections(raw) {
  const lines = String(raw || '')
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((line) => line.replace(/\s+$/g, ''))

  const sections = []
  let current = []

  const flush = () => {
    if (!current.length) return
    sections.push({ type: 'block', lines: current })
    current = []
  }

  for (const line of lines) {
    if (line.trim() === '') {
      flush()
      if (sections.length && sections[sections.length - 1].type !== 'gap') {
        sections.push({ type: 'gap' })
      }
    } else {
      current.push(line)
    }
  }
  flush()

  return sections
}
