/** Éditeur des textes complémentaires (CTA, bandeau contact) par page rubrique. */
export default function PageTextsEditor({ value, onChange, showContactBlock = false, showMidCta = true, showOrderCta = true }) {
  const v = value || {}
  const patch = (partial) => onChange({ ...v, ...partial })

  const patchContactCta = (field, val) =>
    patch({ contactCta: { ...(v.contactCta || {}), [field]: val } })

  const patchMidCta = (field, val) =>
    patch({ midCta: { ...(v.midCta || {}), [field]: val } })

  const patchOrderCta = (field, val) =>
    patch({ orderCta: { ...(v.orderCta || {}), [field]: val } })

  const patchContactBlock = (field, val) =>
    patch({ contactBlock: { ...(v.contactBlock || {}), [field]: val } })

  return (
    <fieldset className="rounded-xl border border-mauve-light/35 p-4 space-y-3">
      <legend className="text-sm font-medium px-1" style={{ color: 'var(--violet)' }}>
        Textes de la page (boutons & bandeau contact)
      </legend>
      <p className="text-[11px] leading-snug" style={{ color: 'var(--text-mid)' }}>
        Laissez un champ vide pour garder le texte par défaut du site. Vos articles et photos ne sont pas modifiés.
      </p>

      <p className="text-xs font-medium pt-1" style={{ color: 'var(--violet)' }}>
        Bandeau « Parlons de votre projet » (bas de page)
      </p>
      <label className="block text-xs">
        Titre
        <input
          className="form-field mt-1"
          value={v.contactCta?.title || ''}
          onChange={(e) => patchContactCta('title', e.target.value)}
          placeholder="Parlons de votre projet"
        />
      </label>
      <label className="block text-xs">
        Message
        <textarea
          className="form-field mt-1"
          rows={2}
          value={v.contactCta?.message || ''}
          onChange={(e) => patchContactCta('message', e.target.value)}
          placeholder="Texte d’invitation au contact"
        />
      </label>
      <div className="grid sm:grid-cols-2 gap-2">
        <label className="block text-xs">
          Bouton principal
          <input
            className="form-field mt-1"
            value={v.contactCta?.primaryLabel || ''}
            onChange={(e) => patchContactCta('primaryLabel', e.target.value)}
            placeholder="Demander un devis gratuit"
          />
        </label>
        <label className="block text-xs">
          Bouton téléphone (avant le prénom)
          <input
            className="form-field mt-1"
            value={v.contactCta?.phoneLabelPrefix || ''}
            onChange={(e) => patchContactCta('phoneLabelPrefix', e.target.value)}
            placeholder="Appeler "
          />
        </label>
      </div>

      {showMidCta ? (
        <>
          <p className="text-xs font-medium pt-2" style={{ color: 'var(--violet)' }}>
            Bouton au milieu de la page (optionnel)
          </p>
          <label className="block text-xs">
            Afficher
            <select
              className="form-field mt-1"
              value={v.midCta?.enabled ? 'yes' : 'no'}
              onChange={(e) => patchMidCta('enabled', e.target.value === 'yes')}
            >
              <option value="no">Non</option>
              <option value="yes">Oui</option>
            </select>
          </label>
          {v.midCta?.enabled ? (
            <div className="grid sm:grid-cols-2 gap-2">
              <label className="block text-xs">
                Libellé
                <input
                  className="form-field mt-1"
                  value={v.midCta?.label || ''}
                  onChange={(e) => patchMidCta('label', e.target.value)}
                  placeholder="Commander une création"
                />
              </label>
              <label className="block text-xs">
                Lien
                <input
                  className="form-field mt-1"
                  value={v.midCta?.path || '/contact'}
                  onChange={(e) => patchMidCta('path', e.target.value)}
                  placeholder="/contact"
                />
              </label>
            </div>
          ) : null}
        </>
      ) : null}

      {showOrderCta ? (
        <>
          <p className="text-xs font-medium pt-2" style={{ color: 'var(--violet)' }}>
            Bouton « Commander » (sous la grille)
          </p>
          <label className="block text-xs">
            Afficher
            <select
              className="form-field mt-1"
              value={v.orderCta?.enabled ? 'yes' : 'no'}
              onChange={(e) => patchOrderCta('enabled', e.target.value === 'yes')}
            >
              <option value="no">Non</option>
              <option value="yes">Oui</option>
            </select>
          </label>
          {v.orderCta?.enabled ? (
            <label className="block text-xs">
              Libellé
              <input
                className="form-field mt-1"
                value={v.orderCta?.label || ''}
                onChange={(e) => patchOrderCta('label', e.target.value)}
                placeholder="Commander cette création"
              />
            </label>
          ) : null}
        </>
      ) : null}

      {showContactBlock ? (
        <>
          <p className="text-xs font-medium pt-2" style={{ color: 'var(--violet)' }}>
            Bloc contact (avant le bandeau rose)
          </p>
          <label className="block text-xs">
            Afficher
            <select
              className="form-field mt-1"
              value={v.contactBlock?.enabled ? 'yes' : 'no'}
              onChange={(e) => patchContactBlock('enabled', e.target.value === 'yes')}
            >
              <option value="no">Non</option>
              <option value="yes">Oui</option>
            </select>
          </label>
          {v.contactBlock?.enabled ? (
            <>
              <label className="block text-xs">
                Titre
                <input
                  className="form-field mt-1"
                  value={v.contactBlock?.title || ''}
                  onChange={(e) => patchContactBlock('title', e.target.value)}
                />
              </label>
              <label className="block text-xs">
                Texte
                <textarea
                  className="form-field mt-1"
                  rows={2}
                  value={v.contactBlock?.text || ''}
                  onChange={(e) => patchContactBlock('text', e.target.value)}
                />
              </label>
              <div className="grid sm:grid-cols-2 gap-2">
                <label className="block text-xs">
                  Bouton téléphone
                  <input
                    className="form-field mt-1"
                    value={v.contactBlock?.phoneLabel || ''}
                    onChange={(e) => patchContactBlock('phoneLabel', e.target.value)}
                  />
                </label>
                <label className="block text-xs">
                  Bouton message
                  <input
                    className="form-field mt-1"
                    value={v.contactBlock?.messageLabel || ''}
                    onChange={(e) => patchContactBlock('messageLabel', e.target.value)}
                  />
                </label>
              </div>
            </>
          ) : null}
        </>
      ) : null}
    </fieldset>
  )
}
