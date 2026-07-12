import { useCallback, useEffect, useId, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { MAX_PAGE_ARTICLES } from '../data/siteContent.defaults'
import { isPublishableCatalogArticle } from '../lib/articleHubAggregation'
import { articleProductPath, pageKeyFromPath } from '../data/pageCatalog'
import { getArticlePhotoUrls } from '../lib/articlePhotos'
import { formatEuro } from '../utils/formatEuro'
import { resolveArticlePrice } from '../lib/articlePrices'

function sortArticles(list, mode) {
  const copy = [...list]
  if (mode === 'price-asc') return copy.sort((a, b) => resolveArticlePrice(a.price) - resolveArticlePrice(b.price))
  if (mode === 'price-desc') return copy.sort((a, b) => resolveArticlePrice(b.price) - resolveArticlePrice(a.price))
  if (mode === 'title-asc') return copy.sort((a, b) => String(a.title).localeCompare(String(b.title), 'fr'))
  return copy
}

function ArticleCatalogCard({ item, pageKey, onPreview }) {
  const catalogPageKey = item.sourcePageKey || pageKey
  const slides = useMemo(() => getArticlePhotoUrls(item), [item])
  const primary = slides[0] || ''
  const [slideIndex, setSlideIndex] = useState(0)
  const [imgSrc, setImgSrc] = useState(primary)

  useEffect(() => {
    setImgSrc(slides[slideIndex] || primary)
  }, [slides, slideIndex, primary])

  useEffect(() => {
    setSlideIndex(0)
    setImgSrc(primary)
  }, [item.id, primary])

  const price = resolveArticlePrice(item.price)
  const isNew = item.isNew === true || item.badge === 'nouveaute'
  const productPath = articleProductPath(catalogPageKey, item.id)

  return (
    <article className="article-catalog-card">
      <div className="article-catalog-card__media">
        {isNew ? (
          <span className="article-catalog-badge" aria-label="Nouveauté">
            Nouveauté ✿
          </span>
        ) : null}
        <Link
          to={productPath}
          className="article-catalog-card__zoom block touch-manipulation"
          aria-label={`Voir la fiche : ${item.title}`}
        >
          {imgSrc ? (
            <img src={imgSrc} alt={item.title} loading="lazy" draggable={false} />
          ) : (
            <span className="article-catalog-card__placeholder" aria-hidden />
          )}
        </Link>
        <button
          type="button"
          className="article-catalog-card__lightbox-btn"
          onClick={() => onPreview?.({ src: imgSrc, title: item.title })}
          aria-label={`Agrandir : ${item.title}`}
          disabled={!imgSrc}
        >
          Agrandir
        </button>
        {slides.length > 1 ? (
          <div className="article-catalog-dots" role="tablist" aria-label="Photos du produit">
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

      <div className="article-catalog-card__summary">
        <h3 className="font-heading text-lg sm:text-xl font-medium leading-snug mb-1" style={{ color: 'var(--violet)' }}>
          <Link to={productPath} className="hover:text-mauve transition-colors">
            {item.title}
          </Link>
        </h3>
        <p className="font-refined text-base font-semibold mb-3" style={{ color: 'var(--mauve)' }}>
          {formatEuro(price)}
        </p>
        <Link to={productPath} className="article-catalog-card__cta btn-outline text-sm py-2.5 px-4">
          Voir la fiche →
        </Link>
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
      className="article-catalog-lightbox fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black/80 p-4 sm:p-8"
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
          draggable={false}
          className="max-h-[min(85vh,820px)] w-auto max-w-full rounded-lg object-contain shadow-2xl select-none"
        />
      </div>
    </div>
  )

  return typeof document !== 'undefined' ? createPortal(node, document.body) : null
}

/**
 * Vitrine articles — clic vers fiche produit dédiée.
 */
export default function PageArticleGrid({
  sectionTitle = 'Articles',
  intro,
  showIntro = false,
  items,
  pagePath,
  pageKey: pageKeyProp,
  maxItems = MAX_PAGE_ARTICLES,
}) {
  const pageKey = pageKeyProp || pageKeyFromPath(pagePath)
  const list = Array.isArray(items) ? items.filter(isPublishableCatalogArticle).slice(0, maxItems) : []
  const [preview, setPreview] = useState(null)
  const [sort, setSort] = useState('default')
  const closePreview = useCallback(() => setPreview(null), [])

  const sorted = useMemo(() => sortArticles(list, sort), [list, sort])

  if (!list.length || !pageKey) return null

  return (
    <>
      <section className="article-catalog-section py-10 px-3 sm:py-16 sm:px-4" style={{ background: 'var(--beige)' }}>
        <div className="max-w-3xl mx-auto lg:max-w-4xl">
          <h2 className="section-title mb-2">{sectionTitle}</h2>
          <div className="floral-divider mb-6">
            <span className="floral-icon">✿</span>
          </div>
          {showIntro && intro ? <p className="text-refined text-center max-w-2xl mx-auto mb-6">{intro}</p> : null}

          <div className="article-catalog-toolbar mb-8">
            <span className="text-sm font-medium" style={{ color: 'var(--violet)' }}>
              {list.length} article{list.length > 1 ? 's' : ''}
            </span>
            <label className="article-catalog-sort">
              <span className="sr-only">Trier les articles</span>
              <select value={sort} onChange={(e) => setSort(e.target.value)} className="form-field text-sm py-2">
                <option value="default">Trier : par défaut</option>
                <option value="price-asc">Prix croissant</option>
                <option value="price-desc">Prix décroissant</option>
                <option value="title-asc">Nom A → Z</option>
              </select>
            </label>
          </div>

          <p
            className="article-catalog-notice font-refined text-sm text-center max-w-2xl mx-auto mb-8 sm:mb-10 px-3 py-3 sm:px-4 rounded-xl border border-mauve-light/35"
            style={{ background: 'rgba(255, 248, 251, 0.95)', color: 'var(--text-mid)' }}
          >
            <span className="font-semibold" style={{ color: 'var(--violet)' }}>Délai de commande :</span>{' '}
            réalisation en général sous <strong>1 semaine</strong>, selon disponibilité — confirmé au devis.
          </p>

          <div className="article-catalog-list">
            {sorted.map((item, index) => (
              <ArticleCatalogCard
                key={`${item.sourcePageKey || pageKey}:${item.id || index}`}
                item={item}
                pageKey={pageKey}
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
