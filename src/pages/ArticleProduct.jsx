import { useMemo, useState, useEffect } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import Seo from '../components/Seo'
import { useSiteConfig } from '../context/SiteContentContext'
import { useCart } from '../context/CartContext'
import {
  articleProductPath,
  findCatalogArticle,
  rubriquePath,
  ARTICLE_PAGE_META,
} from '../data/pageCatalog'
import { getArticlePhotoUrls } from '../lib/articlePhotos'
import { resolveArticlePrice } from '../lib/articlePrices'
import { ArticleDescriptionBlock, stripArticleDescriptionMarkup } from '../lib/articleDescription'
import { formatEuro } from '../utils/formatEuro'
import ArticleColorSwatches, { normalizeHexColor } from '../components/ArticleColorSwatches'
import { useSwipeIndex } from '../hooks/useSwipeIndex'

function QuantityStepper({ value, onChange, min = 1, max = 99 }) {
  return (
    <div className="article-catalog-qty" role="group" aria-label="Quantité">
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

export default function ArticleProduct() {
  const { pageKey, articleId } = useParams()
  const { content } = useSiteConfig()
  const { addItem } = useCart()

  const article = useMemo(
    () => findCatalogArticle(content, pageKey, articleId),
    [content, pageKey, articleId],
  )

  const photos = useMemo(() => (article ? getArticlePhotoUrls(article) : []), [article])
  const [photoIndex, setPhotoIndex] = useState(0)
  const swipePhotos = useSwipeIndex(photos.length, setPhotoIndex)
  const [quantity, setQuantity] = useState(1)
  const [selectedColor, setSelectedColor] = useState('')
  const [added, setAdded] = useState(false)

  const colors = useMemo(() => {
    if (!article?.colors) return []
    return article.colors.map(normalizeHexColor).filter(Boolean).slice(0, 6)
  }, [article])

  useEffect(() => {
    if (colors.length === 1) setSelectedColor(colors[0])
    else setSelectedColor((prev) => (prev && colors.includes(prev) ? prev : ''))
  }, [article?.id, colors])

  if (!ARTICLE_PAGE_META[pageKey]) {
    return <Navigate to="/" replace />
  }

  if (!article) {
    return (
      <section className="py-20 px-4 text-center" style={{ background: 'var(--beige)' }}>
        <p className="font-heading text-xl mb-4" style={{ color: 'var(--violet)' }}>
          Article introuvable
        </p>
        <Link to={rubriquePath(pageKey)} className="btn-primary text-sm">
          Retour à la rubrique
        </Link>
      </section>
    )
  }

  const price = resolveArticlePrice(article.price)
  const cartId = selectedColor ? `${article.id}::${selectedColor}` : article.id
  const rubrique = rubriquePath(pageKey)
  const rubriqueLabel = ARTICLE_PAGE_META[pageKey]?.label || 'Rubrique'
  const mainPhoto = photos[photoIndex] || photos[0]

  const handleAdd = () => {
    addItem({
      id: cartId,
      title: article.title,
      price,
      imageUrl: mainPhoto,
      path: articleProductPath(pageKey, article.id),
      selectedColor,
      quantity,
    })
    setAdded(true)
    window.setTimeout(() => setAdded(false), 2200)
  }

  const descriptionBlocks = String(article.description || '')
    .split(/\n+/)
    .map((s) => s.trim())
    .filter(Boolean)

  return (
    <>
      <Seo
        title={article.title}
        description={
          stripArticleDescriptionMarkup(article.description).slice(0, 155) ||
          `${article.title} — C&S Créations Florales`
        }
        path={articleProductPath(pageKey, article.id)}
        image={mainPhoto}
      />

      <section className="article-product-page py-4 px-3 sm:py-10 sm:px-4" style={{ background: 'var(--beige)' }}>
        <div className="max-w-lg mx-auto">
          <nav className="article-product-breadcrumb text-xs mb-4 flex flex-wrap items-center gap-1" style={{ color: 'var(--text-mid)' }}>
            <Link to="/" className="hover:text-mauve transition-colors shrink-0">
              Accueil
            </Link>
            <span aria-hidden className="shrink-0">›</span>
            <Link to={rubrique} className="hover:text-mauve transition-colors shrink-0 max-w-[42%] truncate">
              {rubriqueLabel}
            </Link>
            <span aria-hidden className="shrink-0">›</span>
            <span className="truncate min-w-0 flex-1" style={{ color: 'var(--violet)' }}>
              {article.title}
            </span>
          </nav>

          <div
            className="article-product-gallery mb-4 sm:mb-5"
            {...(photos.length > 1 ? swipePhotos : {})}
          >
            {mainPhoto ? (
              <img src={mainPhoto} alt={article.title} className="article-product-gallery__main" draggable={false} />
            ) : null}
            {photos.length > 1 ? (
              <p className="article-product-swipe-hint" aria-hidden="true">
                Glissez pour voir les photos
              </p>
            ) : null}
            {photos.length > 1 ? (
              <div className="article-product-dots article-catalog-dots mt-3" role="tablist" aria-label="Photos du produit">
                {photos.map((url, i) => (
                  <button
                    key={url}
                    type="button"
                    role="tab"
                    aria-selected={i === photoIndex}
                    className={i === photoIndex ? 'is-active' : ''}
                    onClick={() => setPhotoIndex(i)}
                    aria-label={`Photo ${i + 1}`}
                  />
                ))}
              </div>
            ) : null}
            {photos.length > 1 ? (
              <div className="article-product-thumbs flex gap-2 mt-3 overflow-x-auto pb-1">
                {photos.map((url, i) => (
                  <button
                    key={`thumb-${url}`}
                    type="button"
                    onClick={() => setPhotoIndex(i)}
                    className={`article-product-thumb shrink-0${i === photoIndex ? ' is-active' : ''}`}
                  >
                    <img src={url} alt="" draggable={false} />
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <h1 className="font-heading text-xl sm:text-3xl font-medium leading-snug mb-1 sm:mb-2" style={{ color: 'var(--violet)' }}>
            {article.title}
          </h1>
          <p className="font-refined text-lg sm:text-xl font-semibold mb-5 sm:mb-6" style={{ color: 'var(--mauve)' }}>
            {formatEuro(price)}
          </p>

          <div className="article-product-options space-y-4 mb-8">
            {colors.length > 0 ? (
              <div className="block">
                <span className="text-sm font-medium mb-2 block" style={{ color: 'var(--violet)' }}>
                  Couleur *
                </span>
                <ArticleColorSwatches
                  colors={colors}
                  labels={article.colorLabels}
                  value={selectedColor}
                  onChange={setSelectedColor}
                />
              </div>
            ) : null}

            <label className="block">
              <span className="text-sm font-medium mb-1 block" style={{ color: 'var(--violet)' }}>
                Quantité *
              </span>
              <QuantityStepper value={quantity} onChange={setQuantity} />
            </label>

            <button
              type="button"
              className="btn-primary w-full text-center justify-center py-3.5 hidden sm:flex"
              onClick={handleAdd}
              disabled={colors.length > 0 && !selectedColor}
            >
              {added ? 'Ajouté au panier ✓' : 'Ajouter au panier'}
            </button>
          </div>

          {descriptionBlocks.length > 0 ? (
            <div className="text-refined text-sm leading-relaxed space-y-3 mb-8" style={{ color: 'var(--text-elegant)' }}>
              {descriptionBlocks.map((block, i) => (
                <p key={i}>
                  <ArticleDescriptionBlock text={block} />
                </p>
              ))}
            </div>
          ) : null}

          <Link to={rubrique} className="btn-outline text-sm inline-block w-full sm:w-auto text-center">
            ← Retour à {rubriqueLabel}
          </Link>
        </div>
      </section>

      <div className="article-product-sticky sm:hidden" role="region" aria-label="Ajouter au panier">
        <div className="article-product-sticky__inner">
          <div className="article-product-sticky__price">
            <span className="article-product-sticky__label">Total</span>
            <strong>{formatEuro(price * quantity)}</strong>
          </div>
          <button
            type="button"
            className="btn-primary article-product-sticky__btn"
            onClick={handleAdd}
            disabled={colors.length > 0 && !selectedColor}
          >
            {added ? 'Ajouté ✓' : 'Ajouter au panier'}
          </button>
        </div>
      </div>
    </>
  )
}
