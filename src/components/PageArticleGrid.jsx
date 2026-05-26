import { useCallback, useEffect, useId, useState } from 'react'
import { createPortal } from 'react-dom'
import { MAX_PAGE_ARTICLES } from '../data/siteContent.defaults'
import { resolvePhotoSrc } from '../data/photoResolver'
import { formatEuro } from '../utils/formatEuro'
import AddToCartButton from './AddToCartButton'

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

function ArticleCard({ item, pagePath, onPreview }) {
  const customSrc = (item.src || '').trim()
  const customSrc2 = (item.src2 || '').trim()
  const primary = resolvePhotoSrc(customSrc || item.photoKey)
  const fallback = resolvePhotoSrc(item.photoKey)
  const [imgSrc, setImgSrc] = useState(primary)
  const secondaryRaw = (customSrc2 || item.photoKey2 || '').trim()
  const secondarySrc = secondaryRaw ? resolvePhotoSrc(secondaryRaw) : ''
  const [selectedColor, setSelectedColor] = useState('')

  useEffect(() => {
    setImgSrc(resolvePhotoSrc(customSrc || item.photoKey))
  }, [customSrc, item.photoKey])

  useEffect(() => {
    const colors = Array.isArray(item.colors) ? item.colors.map(normalizeHexColor).filter(Boolean).slice(0, 3) : []
    setSelectedColor((prev) => {
      if (prev && colors.includes(prev)) return prev
      return colors[0] || ''
    })
  }, [item.colors])

  const price = typeof item.price === 'number' ? item.price : Number(item.price) || 0

  const handleImgError = () => {
    if (customSrc && imgSrc !== fallback) {
      setImgSrc(fallback)
    }
  }

  const colors = Array.isArray(item.colors) ? item.colors.map(normalizeHexColor).filter(Boolean).slice(0, 3) : []

  return (
    <article
      className="flex flex-col rounded-2xl overflow-hidden bg-white border border-mauve-light/25 shadow-sm hover:shadow-md transition-shadow"
      style={{ boxShadow: '0 4px 24px rgba(139, 75, 106, 0.08)' }}
    >
      <div className="aspect-[4/3] w-full overflow-hidden bg-mauve-pale relative group">
        <button
          type="button"
          className="absolute inset-0 z-[1] cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-mauve focus-visible:ring-inset"
          onClick={() => onPreview?.({ src: imgSrc, title: item.title })}
          aria-label={`Agrandir la photo : ${item.title}`}
        />
        <img
          src={imgSrc}
          alt={item.title}
          loading="lazy"
          className="w-full h-full object-cover pointer-events-none"
          onError={handleImgError}
        />
        <span
          className="pointer-events-none absolute bottom-2 right-2 rounded-md bg-black/45 px-2 py-0.5 text-[10px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
          aria-hidden
        >
          Agrandir
        </span>
      </div>
      <div className="flex flex-col flex-1 p-5 sm:p-6">
        <h3 className="font-heading text-lg font-medium mb-2 leading-snug" style={{ color: 'var(--violet)' }}>
          {item.title}
        </h3>
        {secondarySrc ? (
          <div className="flex items-center gap-3 mb-3">
            <button
              type="button"
              className="rounded-xl overflow-hidden border border-mauve-light/30 hover:border-mauve transition-colors bg-white"
              onClick={() => setImgSrc(secondarySrc)}
              aria-label="Afficher la photo secondaire"
              title="Cliquer pour afficher cette photo"
            >
              <img src={secondarySrc} alt="" className="h-12 w-16 object-cover" loading="lazy" />
            </button>
            <button
              type="button"
              className="text-[11px] underline"
              style={{ color: 'var(--text-mid)' }}
              onClick={() => setImgSrc(resolvePhotoSrc(customSrc || item.photoKey))}
            >
              Revenir à la photo principale
            </button>
          </div>
        ) : null}
        <p className="text-refined text-sm flex-1 mb-4 leading-relaxed" style={{ color: 'var(--text-elegant)' }}>
          {item.description}
        </p>
        <p className="font-refined text-lg font-semibold mb-3" style={{ color: 'var(--mauve-dark)' }}>
          {formatEuro(price)}
        </p>
        {colors.length ? (
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              {colors.map((c) => {
                const active = c === selectedColor
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setSelectedColor(c)}
                    className={`h-6 w-6 rounded-full border ${active ? 'border-mauve' : 'border-mauve-light/50'} shadow-sm`}
                    style={{
                      background: c,
                      outline: active ? '2px solid rgba(139, 75, 106, 0.35)' : 'none',
                      outlineOffset: 2,
                    }}
                    aria-label={`Choisir la couleur ${c}`}
                    title={c}
                  />
                )
              })}
            </div>
            <span className="text-[11px]" style={{ color: 'var(--text-mid)' }}>
              {selectedColor ? `Couleur : ${selectedColor}` : ''}
            </span>
          </div>
        ) : null}
        <AddToCartButton
          product={{
            id: item.id,
            title: item.title,
            price,
            imageUrl: imgSrc,
            path: pagePath,
            selectedColor,
          }}
          label="Ajouter au panier"
          className="w-full text-center justify-center"
        />
      </div>
    </article>
  )
}

function ImageLightbox({ open, onClose, src, title }) {
  const titleId = useId()
  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  if (!open || !src) return null

  const node = (
    <div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black/80 p-4 sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onClick={onClose}
    >
      <div className="relative flex max-h-[min(92vh,900px)] w-full max-w-5xl flex-col items-center" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="absolute -top-1 right-0 z-10 rounded-full bg-white/95 px-3 py-1.5 text-sm font-medium shadow-md transition hover:bg-white sm:-right-2 sm:-top-10"
          style={{ color: 'var(--violet)' }}
          onClick={onClose}
          aria-label="Fermer l’aperçu"
        >
          Fermer
        </button>
        <p id={titleId} className="mb-3 max-w-full truncate text-center text-sm text-white/95 sm:text-base">
          {title}
        </p>
        <img
          src={src}
          alt=""
          className="max-h-[min(85vh,820px)] w-auto max-w-full rounded-lg object-contain shadow-2xl"
          style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.45)' }}
        />
        <p className="mt-4 text-center text-xs text-white/70">Clic en dehors de l’image ou Échap pour fermer</p>
      </div>
    </div>
  )

  return typeof document !== 'undefined' ? createPortal(node, document.body) : null
}

/**
 * Grille d’articles (photo, titre, description, prix) pour les pages rubrique.
 * @param {{ sectionTitle?: string, intro?: string, items?: Array<{ id: string, title: string, description: string, price: number, photoKey?: string, src?: string }>, pagePath: string }} props
 */
export default function PageArticleGrid({ sectionTitle = 'Articles', intro, items, pagePath }) {
  const list = Array.isArray(items) ? items.slice(0, MAX_PAGE_ARTICLES) : []
  const [preview, setPreview] = useState(null)
  const closePreview = useCallback(() => setPreview(null), [])

  if (!list.length) return null

  return (
    <>
      <section className="py-16 px-4" style={{ background: 'var(--beige)' }}>
        <div className="max-w-6xl mx-auto">
          <h2 className="section-title mb-2">{sectionTitle}</h2>
          <div className="floral-divider mb-6">
            <span className="floral-icon">✿</span>
          </div>
          {intro ? (
            <p className="text-refined text-center max-w-2xl mx-auto mb-6">{intro}</p>
          ) : null}
          <p
            className="font-refined text-sm text-center max-w-2xl mx-auto mb-10 px-4 py-3 rounded-xl border border-mauve-light/35"
            style={{ background: 'rgba(255, 248, 251, 0.95)', color: 'var(--text-mid)' }}
          >
            <span className="font-semibold" style={{ color: 'var(--violet)' }}>Délai de commande :</span>{' '}
            réalisation en général sous <strong>1 semaine</strong>, selon disponibilité des fleurs et créneaux du planning — confirmé lors de votre commande ou devis.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {list.map((item, index) => (
              <ArticleCard
                key={item.id || `article-${index}`}
                item={item}
                pagePath={pagePath}
                onPreview={setPreview}
              />
            ))}
          </div>
        </div>
      </section>
      <ImageLightbox
        open={Boolean(preview)}
        onClose={closePreview}
        src={preview?.src}
        title={preview?.title}
      />
    </>
  )
}
