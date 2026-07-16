import { getOptionFieldDef } from '../../data/productOptionFields'
import {
  PRODUCT_OPTION_TEMPLATE_LIST,
  getProductOptionTemplate,
  suggestTemplateIdFromTitle,
} from '../../data/productOptionTemplates'
import {
  normalizeArticleProductOptions,
  getDefaultProductOptionsSectionTitle,
  getLockedOptionFieldIds,
} from '../../lib/articleProductOptions'

export default function ArticleProductOptionsEditor({ config, title, onChange }) {
  const normalized = normalizeArticleProductOptions(config, title)
  const template = getProductOptionTemplate(normalized.templateId)
  const templateFields = template?.fields || []
  const enabledSet = new Set(normalized.enabledFields)
  const lockedFields = new Set(getLockedOptionFieldIds(normalized.templateId))

  const setPartial = (patch) => onChange({ ...normalized, ...patch })

  const toggleField = (fieldId) => {
    if (lockedFields.has(fieldId)) return
    const set = new Set(enabledSet)
    if (set.has(fieldId)) set.delete(fieldId)
    else set.add(fieldId)
    // Toujours conserver les champs verrouillés.
    for (const id of lockedFields) {
      if (templateFields.includes(id)) set.add(id)
    }
    setPartial({ enabledFields: [...set] })
  }

  const setFieldSetting = (fieldId, patch) => {
    const prev = normalized.fieldSettings?.[fieldId] || {}
    const nextSettings = { ...normalized.fieldSettings }
    const merged = { ...prev, ...patch }
    if (!merged.multi) {
      delete nextSettings[fieldId]
    } else {
      nextSettings[fieldId] = merged
    }
    setPartial({ fieldSettings: nextSettings })
  }

  const onTemplateChange = (templateId) => {
    const next = getProductOptionTemplate(templateId)
    setPartial({
      templateId,
      enabledFields: next?.fields ? [...next.fields] : [],
      fieldSettings: {},
    })
  }

  return (
    <div className="sm:col-span-2 rounded-xl border border-mauve-light/35 p-4 space-y-3" style={{ background: 'rgba(255,248,251,0.65)' }}>
      <p className="text-sm font-medium" style={{ color: 'var(--violet)' }}>
        Options de personnalisation (formulaire client)
      </p>
      <p className="text-[11px] leading-snug" style={{ color: 'var(--text-mid)' }}>
        Activez le modèle adapté à la création. Cochez les champs à afficher. Pour les pastilles couleur, vous pouvez
        autoriser <strong>plusieurs couleurs</strong> sur certains articles (ex. couleur du texte + roses).
      </p>

      <label className="block">
        Titre au-dessus du formulaire client
        <input
          type="text"
          className="form-field mt-1"
          value={normalized.sectionTitle || ''}
          onChange={(e) => setPartial({ sectionTitle: e.target.value })}
          placeholder={getDefaultProductOptionsSectionTitle(normalized.templateId)}
          maxLength={120}
        />
        <span className="block text-[10px] mt-1 leading-snug" style={{ color: 'var(--text-mid)' }}>
          Ex. : Personnalisez votre verre, Personnalisez votre création… Laissez vide pour le titre par défaut du modèle.
        </span>
      </label>

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
              fieldSettings: normalized.fieldSettings || {},
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
            <fieldset className="space-y-3">
              <legend className="text-xs font-medium mb-1" style={{ color: 'var(--violet)' }}>
                Champs affichés au client
              </legend>
              <div className="space-y-2">
                {templateFields.map((fieldId) => {
                  const def = getOptionFieldDef(fieldId)
                  if (!def) return null
                  const checked = enabledSet.has(fieldId)
                  const isColor = def.type === 'color' || def.type === 'colorMulti'
                  const settings = normalized.fieldSettings?.[fieldId] || {}
                  const multiActive = Boolean(settings.multi) || def.type === 'colorMulti'
                  const maxVal = settings.max ?? def.max ?? 99

                  return (
                    <div
                      key={fieldId}
                      className="rounded-lg border border-mauve-light/25 px-3 py-2 space-y-2"
                      style={{ background: 'rgba(255,255,255,0.55)' }}
                    >
                      <label
                        className={`flex items-center gap-2 text-xs ${lockedFields.has(fieldId) ? 'cursor-default' : 'cursor-pointer'}`}
                      >
                        <input
                          type="checkbox"
                          checked={checked || lockedFields.has(fieldId)}
                          disabled={lockedFields.has(fieldId)}
                          onChange={() => toggleField(fieldId)}
                        />
                        <span className="font-medium" style={{ color: 'var(--violet)' }}>
                          {def.label}
                          {lockedFields.has(fieldId) ? ' (obligatoire)' : ''}
                        </span>
                      </label>
                      {checked && isColor ? (
                        <div className="pl-6 space-y-2">
                          {def.type === 'color' ? (
                            <label className="flex items-center gap-2 text-[11px] cursor-pointer">
                              <input
                                type="checkbox"
                                checked={Boolean(settings.multi)}
                                onChange={(e) =>
                                  setFieldSetting(fieldId, {
                                    multi: e.target.checked,
                                    max: maxVal,
                                  })
                                }
                              />
                              <span>Le client peut choisir plusieurs couleurs</span>
                            </label>
                          ) : (
                            <p className="text-[10px]" style={{ color: 'var(--text-mid)' }}>
                              Choix multiple (défini par le modèle)
                            </p>
                          )}
                          {multiActive ? (
                            <label className="block text-[11px]">
                              Nombre max. de couleurs
                              <input
                                type="number"
                                min={1}
                                max={99}
                                className="form-field mt-1 w-24 py-1 text-xs"
                                value={maxVal}
                                onChange={(e) =>
                                  setFieldSetting(fieldId, {
                                    multi: true,
                                    max: parseInt(e.target.value, 10) || 1,
                                  })
                                }
                              />
                            </label>
                          ) : null}
                        </div>
                      ) : null}
                    </div>
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
