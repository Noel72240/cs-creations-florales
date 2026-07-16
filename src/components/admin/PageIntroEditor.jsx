import { useEffect, useState } from 'react'
import { PHOTO_KEY_OPTIONS } from '../../data/homePhotos'
import { resolvePhotoSrc } from '../../data/photoResolver'
import { normalizePageIntro } from '../../lib/pageIntro'

function paragraphsToText(paragraphs) {
  return Array.isArray(paragraphs) ? paragraphs.join('\n\n') : ''
}

function textToParagraphs(text) {
  // Conserve les espaces et les paragraphes en cours de saisie (y compris lignes vides finales).
  return String(text || '').split(/\n\n/)
}

export default function PageIntroEditor({ pageKey, value, onChange, fileToSrc }) {
  const intro = normalizePageIntro(value, pageKey, { trimText: false })
  const [imageSrc, setImageSrc] = useState(intro.image?.src || '')
  const [imageKey, setImageKey] = useState(intro.image?.photoKey || '')
  const [paragraphsText, setParagraphsText] = useState(() => paragraphsToText(intro.paragraphs))

  useEffect(() => {
    const next = normalizePageIntro(value, pageKey, { trimText: false })
    setImageSrc(next.image?.src || '')
    setImageKey(next.image?.photoKey || '')
    const text = paragraphsToText(next.paragraphs)
    setParagraphsText((prev) => (prev === text ? prev : text))
  }, [pageKey, value])

  const patch = (partial) => onChange(normalizePageIntro({ ...intro, ...partial }, pageKey, { trimText: false }))

  const pickImage = async (fileList) => {
    const file = fileList?.[0]
    if (!file) return
    try {
      const url = await fileToSrc(file, { variant: 'gallery', folder: 'site/page-intro' })
      if (url) {
        setImageSrc(url)
        setImageKey('')
        patch({
          image: {
            ...(intro.image || {}),
            src: url,
            photoKey: '',
          },
        })
      }
    } catch {
      /* ignore */
    }
  }

  const preview = imageSrc.trim()
    ? resolvePhotoSrc(imageSrc)
    : imageKey.trim()
      ? resolvePhotoSrc(imageKey)
      : ''

  return (
    <fieldset className="rounded-xl border border-mauve-light/35 p-4 space-y-3 sm:col-span-2">
      <legend className="text-sm font-medium px-1" style={{ color: 'var(--violet)' }}>
        Texte central (sous le bandeau)
      </legend>
      <p className="text-[11px] leading-snug" style={{ color: 'var(--text-mid)' }}>
        Bloc titre + texte au milieu de la page. Désactivez pour masquer. Le cadre « Je suis à votre écoute » est
        optionnel (utile pour le funéraire ou toute page).
      </p>

      <label className="block">
        Afficher ce bloc
        <select
          className="form-field mt-1"
          value={intro.enabled ? 'yes' : 'no'}
          onChange={(e) => patch({ enabled: e.target.value === 'yes' })}
        >
          <option value="no">Non</option>
          <option value="yes">Oui</option>
        </select>
      </label>

      {intro.enabled ? (
        <>
          <label className="block">
            Mise en page
            <select
              className="form-field mt-1"
              value={intro.layout}
              onChange={(e) => patch({ layout: e.target.value })}
            >
              <option value="center">Centré (texte seul)</option>
              <option value="split">Texte + photo à droite</option>
            </select>
          </label>
          <input
            className="form-field"
            value={intro.pretitle}
            onChange={(e) => patch({ pretitle: e.target.value })}
            placeholder="Sur-titre (optionnel)"
          />
          <input
            className="form-field"
            value={intro.title}
            onChange={(e) => patch({ title: e.target.value })}
            placeholder="Titre (optionnel)"
          />
          <textarea
            className="form-field"
            rows={5}
            value={paragraphsText}
            onChange={(e) => {
              const next = e.target.value
              setParagraphsText(next)
              patch({ paragraphs: textToParagraphs(next) })
            }}
            placeholder="Paragraphes (séparés par une ligne vide)"
          />

          {intro.layout === 'split' ? (
            <div className="space-y-2 rounded-lg border border-mauve-light/30 p-3">
              <p className="text-xs font-medium" style={{ color: 'var(--violet)' }}>
                Photo à droite (cadre gris)
              </p>
              <p className="text-[11px] leading-snug" style={{ color: 'var(--text-mid)' }}>
                Vous pouvez changer cette photo quand vous voulez : Parcourir… puis Enregistrer cette page.
              </p>
              <label className="btn-outline text-xs py-2 px-4 cursor-pointer inline-block">
                Parcourir…
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(e) => {
                    pickImage(e.target.files)
                    e.target.value = ''
                  }}
                />
              </label>
              <input
                className="form-field"
                value={imageSrc}
                onChange={(e) => {
                  setImageSrc(e.target.value)
                  patch({ image: { ...(intro.image || {}), src: e.target.value, photoKey: imageKey } })
                }}
                placeholder="/images/… ou URL"
              />
              <select
                className="form-field"
                value={imageKey}
                onChange={(e) => {
                  setImageKey(e.target.value)
                  patch({ image: { ...(intro.image || {}), src: imageSrc, photoKey: e.target.value } })
                }}
              >
                <option value="">— Clé photo (si pas d’URL) —</option>
                {PHOTO_KEY_OPTIONS.map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
              <input
                className="form-field"
                value={intro.image?.overlayTitle || ''}
                onChange={(e) =>
                  patch({ image: { ...(intro.image || {}), overlayTitle: e.target.value, src: imageSrc, photoKey: imageKey } })
                }
                placeholder="Texte sur la photo (optionnel)"
              />
              <label className="block text-xs">
                Position du texte sur la photo
                <select
                  className="form-field mt-1"
                  value={intro.image?.overlayPosition || 'centered'}
                  onChange={(e) =>
                    patch({
                      image: {
                        ...(intro.image || {}),
                        overlayPosition: e.target.value,
                        src: imageSrc,
                        photoKey: imageKey,
                      },
                    })
                  }
                >
                  <option value="centered">Centré</option>
                  <option value="bottom-center">Bas centre</option>
                  <option value="bottom-left">Bas gauche</option>
                  <option value="bottom-right">Bas droite</option>
                </select>
              </label>
              <input
                className="form-field"
                value={intro.image?.alt || ''}
                onChange={(e) =>
                  patch({ image: { ...(intro.image || {}), alt: e.target.value, src: imageSrc, photoKey: imageKey } })
                }
                placeholder="Description pour l’accessibilité"
              />
              {preview ? (
                <img src={preview} alt="" className="h-32 w-full max-w-xs rounded-lg object-cover border border-mauve-light/30" />
              ) : null}
            </div>
          ) : null}

          <div className="grid sm:grid-cols-2 gap-2">
            <label className="block">
              Bouton (optionnel)
              <select
                className="form-field mt-1"
                value={intro.cta.enabled ? 'yes' : 'no'}
                onChange={(e) => patch({ cta: { ...intro.cta, enabled: e.target.value === 'yes' } })}
              >
                <option value="no">Masqué</option>
                <option value="yes">Affiché</option>
              </select>
            </label>
            {intro.cta.enabled ? (
              <>
                <input
                  className="form-field"
                  value={intro.cta.label}
                  onChange={(e) => patch({ cta: { ...intro.cta, label: e.target.value } })}
                  placeholder="Libellé bouton"
                />
                <input
                  className="form-field sm:col-span-2"
                  value={intro.cta.path}
                  onChange={(e) => patch({ cta: { ...intro.cta, path: e.target.value } })}
                  placeholder="/contact"
                />
              </>
            ) : null}
          </div>

          <div className="rounded-lg border border-mauve-light/30 p-3 space-y-2">
            <label className="flex items-center gap-2 text-xs cursor-pointer">
              <input
                type="checkbox"
                checked={intro.supportBox.enabled}
                onChange={(e) => patch({ supportBox: { ...intro.supportBox, enabled: e.target.checked } })}
              />
              Cadre « Je suis à votre écoute » (citation)
            </label>
            {intro.supportBox.enabled ? (
              <textarea
                className="form-field"
                rows={3}
                value={intro.supportBox.quote}
                onChange={(e) => patch({ supportBox: { ...intro.supportBox, quote: e.target.value } })}
                placeholder="Votre message d’accompagnement…"
              />
            ) : null}
          </div>
        </>
      ) : null}
    </fieldset>
  )
}
