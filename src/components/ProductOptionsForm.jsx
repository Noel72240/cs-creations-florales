import FloralColorPicker from './FloralColorPicker'
import { isFieldVisible } from '../lib/productOptionsEngine'
import { formatEuro } from '../utils/formatEuro'
import {
  CHIFFRE_SIZE_PRICES,
  countChiffreDigits,
  glassUnitPrice,
} from '../lib/productOptionsEngine'

function YesNoSelect({ id, value, onChange, required }) {
  return (
    <select
      id={id}
      className="form-field w-full text-sm"
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      required={required}
    >
      <option value="">— Choisir —</option>
      <option value="oui">Oui</option>
      <option value="non">Non</option>
    </select>
  )
}

function FieldHint({ field, values, templateId }) {
  if (field.id === 'glassQuantity' && values.glassQuantity) {
    const q = parseInt(values.glassQuantity, 10) || 1
    if (templateId === 'gobelet-bapteme') {
      return (
        <p className="font-body text-[11px] mt-1.5" style={{ color: 'var(--text-mid)' }}>
          Prix à l&apos;unité · Quantité : {q}
        </p>
      )
    }
    const unit = glassUnitPrice(values.glassQuantity)
    return (
      <p className="font-body text-[11px] mt-1.5" style={{ color: 'var(--text-mid)' }}>
        Tarif : {formatEuro(unit)} / verre · Total : {formatEuro(unit * q)}
      </p>
    )
  }
  if (field.id === 'chiffreNumber' && templateId === 'chiffres-floraux') {
    const digits = countChiffreDigits(values.chiffreNumber)
    const size = String(values.chiffreSize || '')
    const per = CHIFFRE_SIZE_PRICES[size]
    if (digits > 0 && per) {
      const qty = parseInt(values.chiffreQuantity, 10) || 1
      return (
        <p className="font-body text-[11px] mt-1.5" style={{ color: 'var(--text-mid)' }}>
          {digits} chiffre{digits > 1 ? 's' : ''} × {formatEuro(per)} = {formatEuro(per * digits)}
          {qty > 1 ? ` · ${qty} création${qty > 1 ? 's' : ''}` : ''}
        </p>
      )
    }
  }
  if (field.id === 'chiffreSize' && templateId === 'chiffres-floraux') {
    return (
      <p className="font-body text-[11px] mt-1.5" style={{ color: 'var(--text-mid)' }}>
        Prix à l&apos;unité (par chiffre), selon la taille choisie.
      </p>
    )
  }
  if (field.id === 'chiffreQuantity' && templateId === 'chiffres-floraux') {
    return (
      <p className="font-body text-[11px] mt-1.5" style={{ color: 'var(--text-mid)' }}>
        Exemple : pour deux chiffres, sélectionner une quantité de 2.
      </p>
    )
  }
  return null
}

export default function ProductOptionsForm({
  fields,
  values,
  onChange,
  errors = {},
  templateId = '',
}) {
  const setValue = (fieldId, next) => {
    onChange({ ...values, [fieldId]: next })
  }

  return (
    <div className="product-options-form space-y-4">
      {fields.map((field) => {
        if (!isFieldVisible(field, values)) return null
        const err = errors[field.id]
        const fieldId = `opt-${field.id}`

        return (
          <div key={field.id} className="product-options-form__field">
            <label htmlFor={field.type === 'color' || field.type === 'colorMulti' ? undefined : fieldId} className="block">
              <span className="text-sm font-medium mb-0.5 block" style={{ color: 'var(--violet)' }}>
                {templateId === 'box-florale' && field.id === 'bagColorExtended'
                  ? 'Couleur du support'
                  : (templateId === 'croix-florale' || templateId === 'coeur-sur-plaque') && field.id === 'textColor'
                    ? 'Couleur du texte (plaque)'
                    : field.label}
                {field.required ? ' *' : ''}
              </span>

              {field.type === 'color' ? (
                <FloralColorPicker
                  palette={field.palette}
                  value={values[field.id] || ''}
                  onChange={(v) => setValue(field.id, v)}
                />
              ) : null}

              {field.type === 'colorMulti' ? (
                <FloralColorPicker
                  palette={field.palette}
                  multiple
                  max={field.max ?? 99}
                  value={values[field.id] || []}
                  onChange={(v) => setValue(field.id, v)}
                />
              ) : null}

              {field.type === 'textarea' ? (
                <textarea
                  id={fieldId}
                  className="form-field w-full min-h-[5rem] resize-y text-sm"
                  value={values[field.id] || ''}
                  onChange={(e) => setValue(field.id, e.target.value)}
                  placeholder={field.placeholder || ''}
                  maxLength={500}
                  required={field.required}
                />
              ) : null}

              {field.type === 'text' ? (
                <input
                  id={fieldId}
                  type="text"
                  className="form-field w-full text-sm"
                  value={values[field.id] || ''}
                  onChange={(e) => setValue(field.id, e.target.value)}
                  placeholder={field.placeholder || ''}
                  maxLength={120}
                  required={field.required}
                />
              ) : null}

              {field.type === 'number' ? (
                <input
                  id={fieldId}
                  type="number"
                  className="form-field w-full text-sm"
                  value={values[field.id] ?? ''}
                  onChange={(e) => setValue(field.id, e.target.value)}
                  min={field.min ?? 1}
                  max={field.max ?? 999}
                  required={field.required}
                />
              ) : null}

              {field.type === 'yesNo' ? (
                <YesNoSelect
                  id={fieldId}
                  value={values[field.id] || ''}
                  onChange={(v) => setValue(field.id, v)}
                  required={field.required}
                />
              ) : null}

              {field.type === 'select' ? (
                <select
                  id={fieldId}
                  className="form-field w-full text-sm"
                  value={values[field.id] || ''}
                  onChange={(e) => setValue(field.id, e.target.value)}
                  required={field.required}
                >
                  <option value="">— Choisir —</option>
                  {(field.options || []).map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : null}

              {field.type === 'selectMulti' ? (
                <div className="space-y-1.5" id={fieldId}>
                  {(field.options || []).map((opt) => {
                    const selected = Array.isArray(values[field.id]) ? values[field.id] : []
                    const checked = selected.includes(opt.value)
                    const max = field.max ?? 99
                    const atMax = !checked && selected.length >= max
                    return (
                      <label
                        key={opt.value}
                        className={`flex items-center gap-2 text-sm ${atMax ? 'opacity-50' : ''}`}
                        style={{ color: 'var(--text-dark)' }}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          disabled={atMax}
                          onChange={() => {
                            const next = checked
                              ? selected.filter((v) => v !== opt.value)
                              : [...selected, opt.value].slice(0, max)
                            setValue(field.id, next)
                          }}
                        />
                        {opt.label}
                      </label>
                    )
                  })}
                  {field.max && field.max < 99 ? (
                    <p className="font-body text-[11px] mt-1" style={{ color: 'var(--text-mid)' }}>
                      {(Array.isArray(values[field.id]) ? values[field.id].length : 0)} / {field.max} choix
                    </p>
                  ) : null}
                </div>
              ) : null}
            </label>

            <FieldHint field={field} values={values} templateId={templateId} />
            {err ? (
              <p className="font-body text-xs mt-1" style={{ color: '#b42318' }} role="alert">
                {err}
              </p>
            ) : null}
          </div>
        )
      })}
    </div>
  )
}
