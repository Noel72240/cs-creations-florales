import { paletteEntries } from '../data/floralColorPalette'

/**
 * Pastilles couleur — sélection simple ou multiple.
 * @param {{ palette?: string, value?: string|string[], onChange: Function, multiple?: boolean, max?: number, name?: string }} props
 */
export default function FloralColorPicker({
  palette = 'roses',
  value,
  onChange,
  multiple = false,
  max = 99,
  name = 'color',
}) {
  const entries = paletteEntries(palette)
  const selected = multiple
    ? (Array.isArray(value) ? value : value ? [value] : [])
    : value
      ? [value]
      : []

  const toggle = (key) => {
    if (!multiple) {
      onChange(key === value ? '' : key)
      return
    }
    const set = new Set(selected)
    if (set.has(key)) set.delete(key)
    else if (set.size < max) set.add(key)
    onChange([...set])
  }

  return (
    <div className="floral-color-picker" role={multiple ? 'group' : 'radiogroup'} aria-label="Couleurs">
      <div className="floral-color-picker__grid">
        {entries.map(({ key, label, hex }) => {
          const active = selected.includes(key)
          return (
            <button
              key={key}
              type="button"
              role={multiple ? 'checkbox' : 'radio'}
              aria-checked={active}
              aria-label={label}
              title={label}
              className={`floral-color-picker__swatch${active ? ' is-active' : ''}`}
              style={{ '--swatch-color': hex }}
              onClick={() => toggle(key)}
              name={multiple ? undefined : name}
            >
              <span className="sr-only">{label}</span>
            </button>
          )
        })}
      </div>
      {multiple && max < 99 ? (
        <p className="font-body text-[11px] mt-1.5" style={{ color: 'var(--text-mid)' }}>
          {selected.length} / {max} couleur{max > 1 ? 's' : ''}
        </p>
      ) : null}
    </div>
  )
}
