import { useCallback, useEffect, useId, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { MAX_PAGE_ARTICLES } from '../data/siteContent.defaults'
import { resolvePhotoSrc } from '../data/photoResolver'
import { formatEuro } from '../utils/formatEuro'
import { resolveArticlePrice } from '../lib/articlePrices'
import { useCart } from '../context/CartContext'

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

function sortArticles(list, mode) {
  const copy = [...list]
  if (mode === 'price-asc') return copy.sort((a, b) => resolveArticlePrice(a.price) - resolveArticlePrice(b.price))
  if (mode === 'price-desc') return copy.sort((a, b) => resolveArticlePrice(b.price) - resolveArticlePrice(a.price))
  if (mode === 'title-asc') return copy.sort((a, b) => String(a.title).localeCompare(String(b.title), 'fr'))
  return copy
}

function QuantityStepper({ value, onChange, min = 1, max = 99 }) {
  return (
    <div className="article-shop-qty" role="group" aria-label="Quantité">
      <button type="button" onClick={() => onChange(Math.max(min, value - 1))} aria-label="Diminuer">
        −
      </button>
      <span aria-live="polite">{value}</span>
      <button type="button" onClick={() => onChange(Math.min(max, value + 1))} aria-label="Augmenter">
        +
      </button>
    </div>
  )
}

function ArticleShopCard({ item, pagePath, onPreview, defaultExpanded = false }) {
  const { addItem } = useCart()
  const customSrc = (item.src || '').trim()
  const customSrc2 = (item.src2 || '').trim()
  const primary = resolvePhotoSrc(customSrc || item.photoKey)
  const fallback = resolvePhotoSrc(item.photoKey)
  const secondaryRaw = (customSrc2 || item.photoKey2 || '').trim()
  const secondarySrc = secondaryRaw ? resolvePhotoSrc(secondaryRaw) : ''
  const slides = useMemo(() => {
    const urls = [primary]
    if (secondarySrc && secondarySrc !== primary) urls.push(secondarySrc)
    return urls
  }, [primary, secondarySrc])

  const [slideIndex, setSlideIndex] = useState(0)
  const [imgSrc, setImgSrc] = useState(primary)
  const [expanded, setExpanded] = useState(defaultExpanded)
  const [quantity, setQuantity] = useState(1)
  const [selectedColor, setSelectedColor] = useState('')
  const [added, setAdded] = useState(false)

  useEffect(() => {
    setImgSrc(slides[slideIndex] || primary)
  }, [slides, slideIndex, primary])

  useEffect(() => {
    setSlideIndex(0)
    setImgSrc(primary)
  }, [customSrc, item.photoKey, primary])

  useEffect(() => {
    const colors = Array.isArray(item.colors) ? item.colors.map(normalizeHexColor).filter(Boolean).slice(0, 6) : []
    setSelectedColor((prev) => {
      if (prev && colors.includes(prev)) return prev
      return colors[0] || ''
    })
  }, [item.colors])

  const price = resolveArticlePrice(item.price)
  const colors = Array.isArray(item.colors) ? item.colors.map(normalizeHexColor).filter(Boolean).slice(0, 6) : []
  const cartId = selectedColor ? `${item.id}::${selectedColor}` : item.id
  const isNew = item.isNew === true || item.badge === 'nouveaute'

  const handleImgError = () => {
    if (customSrc && imgSrc !== fallback) setImgSrc(fallback)
  }

  const handleAddToCart = () => {
    addItem({
      id: cartId,
      title: item.title,
      price,
      imageUrl: imgSrc,
      path: pagePath,
      selectedColor,
      quantity,
    })
    setAdded(true)
    window.setTimeout(() => setAdded(false), 2200)
  }

  const descriptionBlocks = String(item.description || '')
    .split(/\n+/)
    .map((s) => s.trim())
    .filter(Boolean)

  return (
    <article className={`article-shop-card${expanded ? ' article-shop-card--open' : ''}`}>
      <div className="article-shop-card__media">
        {isNew ? (
          <span className="article-shop-badge" aria-label="Nouveauté">
            Nouveauté ✿
          </span>
        ) : null}
        <button
          type="button"
          className="article-shop-card__image-btn"
          onClick={() => onPreview?.({ src: imgSrc, title: item.title })}
          aria-label={`Agrandir : ${item.title}`}
        >
          <img src={imgSrc} alt={item.title} loading="lazy" className="article-shop-card__image" onError={handleImgError} />
        </button>
        {slides.length > 1 ? (
          <div className="article-shop-dots" role="tablist" aria-label="Photos du produit">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === slideIndex}
                className={i === slideIndex ? 'is-active' : ''}
                onClick={() => setSlideIndex(i)}
                aria-label={`Photo ${i + 1}`}
              />
            ))}
          </div>
        ) : null}
      </div>

      <div className="article-shop-card__head">
        <h3 className="article-shop-card__title">{item.title}</h3>
        <p className="article-shop-card__price">{formatEuro(price)}</p>
        <button
          type="button"
          className="article-shop-card__toggle"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
        >
          {expanded ? 'Masquer le détail' : 'Voir le détail'}
        </button>
      </div>

      {expanded ? (
        <div className="article-shop-card__body">
          {colors.length > 0 ? (
            <label className="article-shop-field">
              <span className="article-shop-field__label">Couleur *</span>
              <select
                className="article-shop-select"
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                required
              >
                <option value="">Sélectionner</option>
                {colors.map((c, i) => (
                  <option key={c} value={c}>
                    {item.colorLabels?.[i] || `Teinte ${i + 1}`}
                  </option>
                ))}
              </select>
            </label>
          ) : null}

          <label className="article-shop-field">
            <span className="article-shop-field__label">Quantité *</span>
            <QuantityStepper value={quantity} onChange={setQuantity} />
          </label>

          <button
            type="button"
            className="article-shop-btn"
            onClick={handleAddToCart}
            disabled={colors.length > 0 && !selectedColor}
          >
            {added ? 'Ajouté au panier ✓' : 'Ajouter au panier'}
          </button>

          {descriptionBlocks.length > 0 ? (
            <div className="article-shop-desc">
              {descriptionBlocks.map((block, i) => (
                <p key={i}>{block}</p>
              ))}
            </div>
          ) : null}

          <p className="article-shop-note">
            Création artisanale — délai indicatif : environ <strong>1 semaine</strong> (confirmé au devis).
          </p>
        </div>
      ) : null}
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
        />
      </div>
    </div>
  )

  return typeof document !== 'undefined' ? createPortal(node, document.body) : null
}

/**
 * Vitrine articles — style boutique (liste verticale, fond mauve, fiche détaillée).
 */
export default function PageArticleGrid({ sectionTitle = 'Articles', intro, items, pagePath }) {
  const list = Array.isArray(items) ? items.slice(0, MAX_PAGE_ARTICLES) : []
  const [preview, setPreview] = useState(null)
  const [sort, setSort] = useState('default')
  const closePreview = useCallback(() => setPreview(null), [])

  const sorted = useMemo(() => sortArticles(list, sort), [list, sort])

  if (!list.length) return null

  return (
    <>
      <section className="article-shop-section py-12 sm:py-16 px-4 sm:px-6">
        <div className="article-shop-wrap max-w-2xl mx-auto lg:max-w-4xl">
          <header className="article-shop-header mb-8 sm:mb-10">
            <p className="article-shop-eyebrow">Boutique</p>
            <h2 className="article-shop-heading">{sectionTitle}</h2>
            {intro ? <p className="article-shop-intro">{intro}</p> : null}
            <div className="article-shop-toolbar">
              <span className="article-shop-count">
                {list.length} article{list.length > 1 ? 's' : ''}
              </span>
              <label className="article-shop-sort">
                <span className="sr-only">Trier les articles</span>
                <select value={sort} onChange={(e) => setSort(e.target.value)} className="article-shop-select article-shop-select--inline">
                  <option value="default">Trier : par défaut</option>
                  <option value="price-asc">Prix croissant</option>
                  <option value="price-desc">Prix décroissant</option>
                  <option value="title-asc">Nom A → Z</option>
                </select>
              </label>
            </div>
          </header>

          <div className="article-shop-list">
            {sorted.map((item, index) => (
              <ArticleShopCard
                key={item.id || `article-${index}`}
                item={item}
                pagePath={pagePath}
                onPreview={setPreview}
              />
            ))}
          </div>
        </div>
      </section>
      <ImageLightbox open={Boolean(preview)} onClose={closePreview} src={preview?.src} title={preview?.title} />
    </>
  )
}
