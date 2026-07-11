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
    const unit = glassUnitPrice(values.glassQuantity)
    const q = parseInt(values.glassQuantity, 10) || 1
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
      return (
        <p className="font-body text-[11px] mt-1.5" style={{ color: 'var(--text-mid)' }}>
          {digits} chiffre{digits > 1 ? 's' : ''} × {formatEuro(per)} = {formatEuro(per * digits)}
        </p>
      )
    }
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
              <span className="text-sm font-medium mb-1 block" style={{ color: 'var(--violet)' }}>
                {field.label}
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
