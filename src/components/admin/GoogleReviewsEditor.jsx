import { useEffect, useState } from 'react'
import StarRatingInput from '../StarRatingInput'

function newReviewId() {
  return `rev-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

const emptyReview = () => ({
  id: newReviewId(),
  authorName: '',
  rating: 5,
  text: '',
  publishedAt: '',
})

export default function GoogleReviewsEditor({ initial, onDraftChange }) {
  const [pageTitle, setPageTitle] = useState(initial?.pageTitle || '')
  const [pageSubtitle, setPageSubtitle] = useState(initial?.pageSubtitle || '')
  const [intro, setIntro] = useState(initial?.intro || '')
  const [googleUrl, setGoogleUrl] = useState(initial?.googleUrl || '')
  const [ctaLabel, setCtaLabel] = useState(initial?.ctaLabel || '')
  const [items, setItems] = useState(() =>
    (initial?.items?.length ? initial.items : []).map((it) => ({
      id: it.id || newReviewId(),
      authorName: it.authorName || '',
      rating: Math.min(5, Math.max(1, Number(it.rating) || 5)),
      text: it.text || '',
      publishedAt: it.publishedAt || '',
    })),
  )

  const setField = (idx, key, value) => {
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, [key]: value } : it)))
  }

  const addItem = () => setItems((prev) => [...prev, emptyReview()])

  const removeItem = (idx) => setItems((prev) => prev.filter((_, i) => i !== idx))

  const move = (from, to) => {
    setItems((prev) => {
      const next = [...prev]
      const [it] = next.splice(from, 1)
      next.splice(to, 0, it)
      return next
    })
  }

  useEffect(() => {
    onDraftChange({
      pageTitle,
      pageSubtitle,
      intro,
      googleUrl,
      ctaLabel,
      items: items
        .filter((it) => (it.authorName || '').trim() || (it.text || '').trim())
        .map((it) => ({
          id: it.id,
          authorName: (it.authorName || '').trim(),
          rating: Math.min(5, Math.max(1, Math.round(Number(it.rating) || 5))),
          text: (it.text || '').trim(),
          publishedAt: (it.publishedAt || '').trim(),
        })),
    })
  }, [pageTitle, pageSubtitle, intro, googleUrl, ctaLabel, items, onDraftChange])

  return (
    <div className="space-y-6">
      <fieldset className="space-y-2">
        <legend className="text-lg mb-2" style={{ color: 'var(--violet)' }}>
          Page Nos avis clients
        </legend>
        <p className="text-xs leading-relaxed">
          Textes affichés en haut de la page <code>/avis-google</code> (menu « Nos avis clients »). Laissez l’URL Google vide pour masquer le bouton externe.
          Les avis ne se synchronisent pas automatiquement avec Google : recopiez ici les témoignages de votre fiche Google, ou collez l’URL de la fiche pour le bouton « Voir sur Google ».
        </p>
        <input className="form-field" value={pageTitle} onChange={(e) => setPageTitle(e.target.value)} placeholder="Titre de la page" />
        <input className="form-field" value={pageSubtitle} onChange={(e) => setPageSubtitle(e.target.value)} placeholder="Sous-titre" />
        <textarea className="form-field" rows={3} value={intro} onChange={(e) => setIntro(e.target.value)} placeholder="Introduction" />
        <input
          className="form-field"
          value={googleUrl}
          onChange={(e) => setGoogleUrl(e.target.value)}
          placeholder="URL fiche Google (https://...)"
        />
        <input className="form-field" value={ctaLabel} onChange={(e) => setCtaLabel(e.target.value)} placeholder="Libellé bouton Google" />
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="text-lg mb-2" style={{ color: 'var(--violet)' }}>
          Avis clients
        </legend>
        <button type="button" className="btn-outline text-xs py-2 px-4" onClick={addItem}>
          + Ajouter un avis
        </button>

        {items.length === 0 && (
          <p className="text-xs" style={{ color: 'var(--text-mid)' }}>
            Aucun avis pour l’instant. Cliquez sur « Ajouter un avis ».
          </p>
        )}

        <div className="space-y-4">
          {items.map((it, idx) => (
            <div key={it.id} className="border border-mauve-light/30 rounded-xl p-4 space-y-3">
              <div className="flex flex-wrap gap-2 items-center justify-between">
                <p className="text-xs font-medium" style={{ color: 'var(--violet)' }}>
                  Avis {idx + 1}
                </p>
                <div className="flex gap-2">
                  <button type="button" className="btn-outline text-[11px] py-1.5 px-3" disabled={idx === 0} onClick={() => move(idx, idx - 1)}>
                    ↑
                  </button>
                  <button
                    type="button"
                    className="btn-outline text-[11px] py-1.5 px-3"
                    disabled={idx === items.length - 1}
                    onClick={() => move(idx, idx + 1)}
                  >
                    ↓
                  </button>
                  <button type="button" className="btn-outline text-[11px] py-1.5 px-3" onClick={() => removeItem(idx)}>
                    Supprimer
                  </button>
                </div>
              </div>

              <label className="block">
                Nom du client
                <input
                  className="form-field mt-1"
                  value={it.authorName}
                  onChange={(e) => setField(idx, 'authorName', e.target.value)}
                  placeholder="ex. Marie D."
                />
              </label>

              <div>
                <span className="block text-sm mb-1">Note</span>
                <StarRatingInput
                  id={`review-rating-${it.id}`}
                  value={it.rating}
                  onChange={(n) => setField(idx, 'rating', n)}
                />
              </div>

              <label className="block">
                Avis laissé
                <textarea
                  className="form-field mt-1"
                  rows={4}
                  value={it.text}
                  onChange={(e) => setField(idx, 'text', e.target.value)}
                  placeholder="Texte de l’avis…"
                />
              </label>

              <label className="block">
                Date (optionnel, ex. mars 2025)
                <input
                  className="form-field mt-1"
                  value={it.publishedAt}
                  onChange={(e) => setField(idx, 'publishedAt', e.target.value)}
                  placeholder="ex. 12 mars 2025"
                />
              </label>
            </div>
          ))}
        </div>
      </fieldset>
    </div>
  )
}
