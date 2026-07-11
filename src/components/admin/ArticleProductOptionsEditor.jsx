import { getOptionFieldDef } from '../../data/productOptionFields'
import {
  PRODUCT_OPTION_TEMPLATE_LIST,
  getProductOptionTemplate,
  suggestTemplateIdFromTitle,
} from '../../data/productOptionTemplates'
import { normalizeArticleProductOptions } from '../../lib/articleProductOptions'

export default function ArticleProductOptionsEditor({ config, title, onChange }) {
  const normalized = normalizeArticleProductOptions(config, title)
  const template = getProductOptionTemplate(normalized.templateId)
  const templateFields = template?.fields || []

  const setPartial = (patch) => onChange({ ...normalized, ...patch })

  const toggleField = (fieldId) => {
    const set = new Set(normalized.enabledFields.length ? normalized.enabledFields : templateFields)
    if (set.has(fieldId)) set.delete(fieldId)
    else set.add(fieldId)
    setPartial({ enabledFields: [...set] })
  }

  const onTemplateChange = (templateId) => {
    const next = getProductOptionTemplate(templateId)
    setPartial({
      templateId,
      enabledFields: next?.fields ? [...next.fields] : [],
    })
  }

  return (
    <div className="sm:col-span-2 rounded-xl border border-mauve-light/35 p-4 space-y-3" style={{ background: 'rgba(255,248,251,0.65)' }}>
      <p className="text-sm font-medium" style={{ color: 'var(--violet)' }}>
        Options de personnalisation (formulaire client)
      </p>
      <p className="text-[11px] leading-snug" style={{ color: 'var(--text-mid)' }}>
        Activez le modèle adapté à la création. Cochez les champs à afficher sur la fiche produit.
        Le modèle est suggéré selon le titre — vous pouvez le changer.
      </p>

      <label className="block">
        Activer le formulaire d’options
        <select
          className="form-field mt-1"
          value={normalized.active ? 'yes' : 'no'}
          onChange={(e) => {
            const active = e.target.value === 'yes'
            const templateId = normalized.templateId || suggestTemplateIdFromTitle(title)
            const tpl = getProductOptionTemplate(templateId)
            setPartial({
              active,
              templateId,
              enabledFields: tpl?.fields ? [...tpl.fields] : normalized.enabledFields,
            })
          }}
        >
          <option value="no">Non</option>
          <option value="yes">Oui</option>
        </select>
      </label>

      {normalized.active ? (
        <>
          <label className="block">
            Modèle de création
            <select
              className="form-field mt-1"
              value={normalized.templateId || ''}
              onChange={(e) => onTemplateChange(e.target.value)}
            >
              <option value="">— Choisir un modèle —</option>
              {PRODUCT_OPTION_TEMPLATE_LIST.map((tpl) => (
                <option key={tpl.id} value={tpl.id}>
                  {tpl.label}
                </option>
              ))}
            </select>
          </label>

          {templateFields.length ? (
            <fieldset className="space-y-2">
              <legend className="text-xs font-medium mb-1" style={{ color: 'var(--violet)' }}>
                Champs affichés au client
              </legend>
              <div className="grid sm:grid-cols-2 gap-1.5">
                {templateFields.map((fieldId) => {
                  const def = getOptionFieldDef(fieldId)
                  if (!def) return null
                  const checked = (normalized.enabledFields.length ? normalized.enabledFields : templateFields).includes(fieldId)
                  return (
                    <label key={fieldId} className="flex items-center gap-2 text-xs cursor-pointer">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleField(fieldId)}
                      />
                      <span>{def.label}</span>
                    </label>
                  )
                })}
              </div>
            </fieldset>
          ) : null}
        </>
      ) : null}
    </div>
  )
}
