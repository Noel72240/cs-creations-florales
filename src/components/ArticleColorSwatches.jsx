function normalizeHexColor(value) {
  const s = String(value || '').trim()
  if (!s) return ''
  if (/^#([0-9a-fA-F]{6})$/.test(s)) return s.toLowerCase()
  if (/^#([0-9a-fA-F]{3})$/.test(s)) {
    const h = s.slice(1)
    return `#${h[0]}${h[0]}${h[1]}${h[1]}${h[2]}${h[2]}`.toLowerCase()
  }
  return ''
}

/**
 * Choix couleur par pastilles rondes (couleurs enregistrées dans l’admin).
 */
export default function ArticleColorSwatches({ colors = [], labels = [], value = '', onChange, name = 'couleur' }) {
  const options = colors.map(normalizeHexColor).filter(Boolean).slice(0, 6)
  if (!options.length) return null

  return (
    <div className="article-color-swatches" role="radiogroup" aria-label="Couleur">
      {options.map((hex, i) => {
        const active = value === hex
        const label = labels?.[i] || `Couleur ${i + 1}`
        return (
          <button
            key={hex}
            type="button"
            role="radio"
            name={name}
            aria-checked={active}
            aria-label={label}
            title={label}
            className={`article-color-swatch${active ? ' is-active' : ''}`}
            style={{ background: hex }}
            onClick={() => onChange?.(hex)}
          />
        )
      })}
    </div>
  )
}

export { normalizeHexColor }
