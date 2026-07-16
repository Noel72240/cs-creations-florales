import { useMemo, useState, useEffect } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import Seo from '../components/Seo'
import ProductOptionsForm from '../components/ProductOptionsForm'
import ProductOptionsSectionHeading from '../components/ProductOptionsSectionHeading'
import { useSiteConfig } from '../context/SiteContentContext'
import { useCart } from '../context/CartContext'
import {
  articleProductPath,
  findCatalogArticle,
  rubriquePath,
  ARTICLE_PAGE_META,
} from '../data/pageCatalog'
import { resolveCatalogPageKey } from '../lib/articleHubAggregation'
import { getArticlePhotoUrls } from '../lib/articlePhotos'
import { resolveArticlePrice } from '../lib/articlePrices'
import {
  ArticleDescriptionBlock,
  splitArticleDescriptionSections,
  stripArticleDescriptionMarkup,
} from '../lib/articleDescription'
import { formatEuro } from '../utils/formatEuro'
import ArticleColorSwatches, { normalizeHexColor } from '../components/ArticleColorSwatches'
import { useSwipeIndex } from '../hooks/useSwipeIndex'
import {
  buildArticleCartLineId,
  isPersonalizationMessageEnabled,
} from '../lib/articlePersonalization'
import {
  getArticleProductOptionsConfig,
  isProductOptionsActive,
  isGobeletPlastiqueArticle,
  resolveProductOptionsSectionTitle,
} from '../lib/articleProductOptions'
import {
  computeOptionsCartQuantity,
  computeOptionsUnitPrice,
  formatProductOptionsSummary,
  resolveProductOptionFields,
  shouldHideCartQuantityStepper,
  validateProductOptions,
} from '../lib/productOptionsEngine'
import { getProductOptionTemplate } from '../data/productOptionTemplates'

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

function optionsCartKey(templateId, values) {
  try {
    return JSON.stringify({ t: templateId, v: values })
  } catch {
    return templateId
  }
}

export default function ArticleProduct() {
  const { pageKey, articleId } = useParams()
  const { content, remoteLoaded } = useSiteConfig()
  const { addItem } = useCart()

  const catalogPageKey = useMemo(
    () => resolveCatalogPageKey(content, pageKey, articleId),
    [content, pageKey, articleId],
  )

  const article = useMemo(
    () => findCatalogArticle(content, pageKey, articleId),
    [content, pageKey, articleId],
  )

  const photos = useMemo(() => (article ? getArticlePhotoUrls(article) : []), [article])
  const [photoIndex, setPhotoIndex] = useState(0)
  const swipePhotos = useSwipeIndex(photos.length, setPhotoIndex)
  const [quantity, setQuantity] = useState(1)
  const [selectedColor, setSelectedColor] = useState('')
  const [personalizationMessage, setPersonalizationMessage] = useState('')
  const [optionValues, setOptionValues] = useState({})
  const [optionErrors, setOptionErrors] = useState({})
  const [added, setAdded] = useState(false)

  const productOptionsConfig = useMemo(
    () => (article ? getArticleProductOptionsConfig(article) : null),
    [article],
  )
  const advancedOptionsActive = article ? isProductOptionsActive(article) : false
  const optionFields = useMemo(() => {
    if (!advancedOptionsActive || !productOptionsConfig?.templateId) return []
    return resolveProductOptionFields(
      productOptionsConfig.templateId,
      productOptionsConfig.enabledFields,
      productOptionsConfig.fieldSettings,
    )
  }, [advancedOptionsActive, productOptionsConfig])

  const colors = useMemo(() => {
    if (!article?.colors || advancedOptionsActive) return []
    return article.colors.map(normalizeHexColor).filter(Boolean).slice(0, 6)
  }, [article, advancedOptionsActive])

  useEffect(() => {
    if (colors.length === 1) setSelectedColor(colors[0])
    else setSelectedColor((prev) => (prev && colors.includes(prev) ? prev : ''))
    setPersonalizationMessage('')
    setOptionValues({})
    setOptionErrors({})
  }, [article?.id, colors])

  if (!ARTICLE_PAGE_META[pageKey]) {
    return <Navigate to="/" replace />
  }

  if (!remoteLoaded) {
    return (
      <section
        className="article-product-page is-visible py-10 px-4 text-center"
        style={{ background: 'var(--beige)' }}
        aria-busy="true"
      >
        <p className="font-body text-sm" style={{ color: 'var(--text-mid)' }}>
          Chargement de l’article…
        </p>
      </section>
    )
  }

  if (!article) {
    return (
      <section className="article-product-page is-visible py-10 px-4 text-center" style={{ background: 'var(--beige)' }}>
        <p className="font-heading text-xl mb-4" style={{ color: 'var(--violet)' }}>
          Article introuvable
        </p>
        <Link to={rubriquePath(pageKey)} className="btn-primary text-sm">
          Retour à la rubrique
        </Link>
      </section>
    )
  }

  const basePrice = resolveArticlePrice(article.price)
  const personalizationEnabled =
    !advancedOptionsActive && isPersonalizationMessageEnabled(article)
  const trimmedPersonalizationMessage = personalizationMessage.trim()

  const unitPrice = advancedOptionsActive
    ? computeOptionsUnitPrice({
        templateId: productOptionsConfig.templateId,
        values: optionValues,
        basePrice,
      })
    : basePrice

  const optionTemplate = advancedOptionsActive
    ? getProductOptionTemplate(productOptionsConfig.templateId)
    : null
  const forceGobeletUnit = article ? isGobeletPlastiqueArticle(article) : false
  const useCatalogBasePrice =
    forceGobeletUnit ||
    optionTemplate?.pricingMode === 'unitQuantity' ||
    productOptionsConfig?.templateId === 'gobelet-bapteme'
  const displayPrice =
    advancedOptionsActive && !useCatalogBasePrice && unitPrice > 0 ? unitPrice : basePrice

  const hideQtyStepper = advancedOptionsActive && shouldHideCartQuantityStepper(productOptionsConfig.templateId)
  const hasShopSection =
    advancedOptionsActive || colors.length > 0 || personalizationEnabled || !hideQtyStepper
  let optionsSectionTitle = ''
  if (hasShopSection) {
    if (advancedOptionsActive && productOptionsConfig) {
      optionsSectionTitle = resolveProductOptionsSectionTitle(productOptionsConfig, article.title)
    } else {
      const custom = String(article.productOptions?.sectionTitle || '').trim()
      optionsSectionTitle = custom || 'Personnalisez votre création'
    }
  }
  const cartQuantity = advancedOptionsActive
    ? computeOptionsCartQuantity({
        templateId: productOptionsConfig.templateId,
        values: optionValues,
        fallbackQty: quantity,
      }) * (hideQtyStepper ? 1 : quantity)
    : quantity

  const customOptionsKey = advancedOptionsActive
    ? optionsCartKey(productOptionsConfig.templateId, optionValues)
    : ''

  const cartId = buildArticleCartLineId(article.id, {
    selectedColor: advancedOptionsActive ? '' : selectedColor,
    personalizationMessage: advancedOptionsActive ? '' : trimmedPersonalizationMessage,
    customOptionsKey,
  })

  const rubrique = rubriquePath(catalogPageKey)
  const rubriqueLabel = ARTICLE_PAGE_META[catalogPageKey]?.label || 'Rubrique'
  const productPath = articleProductPath(catalogPageKey, article.id)
  const mainPhoto = photos[photoIndex] || photos[0]
  const missingColor = colors.length > 0 && !selectedColor
  const missingPersonalizationMessage = personalizationEnabled && !trimmedPersonalizationMessage

  const optionsValidation = advancedOptionsActive
    ? validateProductOptions(optionFields, optionValues)
    : { valid: true, errors: {} }

  const cannotAddToCart =
    missingColor ||
    missingPersonalizationMessage ||
    (advancedOptionsActive && (!optionsValidation.valid || displayPrice <= 0))

  const handleAdd = () => {
    if (advancedOptionsActive && !optionsValidation.valid) {
      setOptionErrors(optionsValidation.errors)
      return
    }
    if (cannotAddToCart) return

    const customOptions = advancedOptionsActive
      ? {
          templateId: productOptionsConfig.templateId,
          values: { ...optionValues },
          summary: formatProductOptionsSummary(optionFields, optionValues),
        }
      : undefined

    addItem({
      id: cartId,
      title: article.title,
      price: useCatalogBasePrice || forceGobeletUnit ? basePrice : unitPrice,
      parcelTier: article.parcelTier,
      imageUrl: mainPhoto,
      path: productPath,
      selectedColor: advancedOptionsActive ? undefined : selectedColor || undefined,
      personalizationMessage: advancedOptionsActive ? undefined : trimmedPersonalizationMessage || undefined,
      customOptions,
      quantity: cartQuantity,
    })
    setAdded(true)
    window.setTimeout(() => setAdded(false), 2200)
  }

  // Blocs serrés (lignes collées) séparés par les lignes vides de l’admin.
  const descriptionSections = splitArticleDescriptionSections(article.description)
  const hasDescription = descriptionSections.some((s) => s.type === 'block')

  const lineTotal = unitPrice * (hideQtyStepper ? cartQuantity : quantity)

  return (
    <>
      <Seo
        title={article.title}
        description={
          stripArticleDescriptionMarkup(article.description).slice(0, 155) ||
          `${article.title} — C&S Créations Florales`
        }
        path={productPath}
        image={mainPhoto}
      />

      <section className="article-product-page is-visible py-4 px-3 sm:py-10 sm:px-4" style={{ background: 'var(--beige)' }}>
        <div className="max-w-6xl mx-auto">
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

          <div className="article-product-layout">
            <div
              className="article-product-layout__gallery order-1"
              {...(photos.length > 1 ? swipePhotos : {})}
            >
              <div className="article-product-gallery">
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
            </div>

            <div className="article-product-layout__shop order-4 lg:order-3">
              <div className="article-product-options space-y-4">
                <ProductOptionsSectionHeading title={optionsSectionTitle} />

                {advancedOptionsActive ? (
                  <ProductOptionsForm
                    fields={optionFields}
                    values={optionValues}
                    onChange={(next) => {
                      setOptionValues(next)
                      setOptionErrors({})
                    }}
                    errors={optionErrors}
                    templateId={productOptionsConfig.templateId}
                  />
                ) : null}

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

                {personalizationEnabled ? (
                  <label className="block">
                    <span className="text-sm font-medium mb-1 block" style={{ color: 'var(--violet)' }}>
                      Votre message de personnalisation *
                    </span>
                    <textarea
                      className="form-field w-full min-h-[6rem] resize-y text-sm"
                      value={personalizationMessage}
                      onChange={(e) => setPersonalizationMessage(e.target.value)}
                      placeholder="Prénom, date, texte à graver, couleur souhaitée…"
                      maxLength={500}
                      required
                    />
                    <p className="font-body text-[11px] mt-1.5 leading-snug" style={{ color: 'var(--text-mid)' }}>
                      Ce message sera transmis avec votre commande pour personnaliser la création.
                    </p>
                  </label>
                ) : null}

                {!hideQtyStepper ? (
                  <label className="block">
                    <span className="text-sm font-medium mb-1 block" style={{ color: 'var(--violet)' }}>
                      Quantité *
                    </span>
                    <QuantityStepper value={quantity} onChange={setQuantity} />
                  </label>
                ) : null}

                <button
                  type="button"
                  className="btn-primary w-full text-center justify-center py-3.5 hidden lg:flex"
                  onClick={handleAdd}
                  disabled={cannotAddToCart}
                >
                  {added ? 'Ajouté au panier ✓' : 'Ajouter au panier'}
                </button>
              </div>
            </div>

            <div className="article-product-layout__info">
              <div className="article-product-layout__head order-2">
                <h1 className="font-heading text-xl sm:text-2xl lg:text-3xl font-medium leading-snug mb-1 sm:mb-2 text-center sm:text-left" style={{ color: 'var(--violet)' }}>
                  {article.title}
                </h1>
                <p className="font-refined text-lg sm:text-xl font-semibold mb-0 text-center sm:text-left" style={{ color: 'var(--mauve)' }}>
                  {formatEuro(displayPrice)}
                  {advancedOptionsActive && productOptionsConfig.templateId === 'chiffres-floraux' ? (
                    <span className="block text-xs font-body font-normal mt-0.5" style={{ color: 'var(--text-mid)' }}>
                      Prix à l&apos;unité (par chiffre), selon la taille choisie
                    </span>
                  ) : null}
                  {advancedOptionsActive && productOptionsConfig.templateId === 'panneau-bapteme' ? (
                    <span className="block text-xs font-body font-normal mt-0.5" style={{ color: 'var(--text-mid)' }}>
                      Prix à l&apos;unité
                    </span>
                  ) : null}
                  {advancedOptionsActive &&
                  (forceGobeletUnit || productOptionsConfig.templateId === 'gobelet-bapteme') ? (
                    <span className="block text-xs font-body font-normal mt-0.5" style={{ color: 'var(--text-mid)' }}>
                      Prix à l&apos;unité
                    </span>
                  ) : null}
                  {advancedOptionsActive &&
                  !forceGobeletUnit &&
                  productOptionsConfig.templateId !== 'gobelet-bapteme' &&
                  (productOptionsConfig.templateId === 'verres-personnalises' ||
                    productOptionsConfig.templateId === 'verre-communion') ? (
                    <span className="block text-xs font-body font-normal mt-0.5" style={{ color: 'var(--text-mid)' }}>
                      à partir de 9,90 € / verre
                    </span>
                  ) : null}
                </p>
              </div>

              <div className="article-product-layout__desc order-3 lg:order-4">
                {hasDescription ? (
                  <div className="article-product-description">
                    {descriptionSections.map((section, i) =>
                      section.type === 'gap' ? (
                        <div key={`gap-${i}`} className="article-product-description__gap" aria-hidden="true" />
                      ) : (
                        <p key={`block-${i}`} className="article-product-description__block">
                          {section.lines.map((line, li) => (
                            <span key={li}>
                              {li > 0 ? <br /> : null}
                              <ArticleDescriptionBlock text={line} />
                            </span>
                          ))}
                        </p>
                      ),
                    )}
                  </div>
                ) : null}
              </div>

              <div className="article-product-layout__back order-5">
                <Link to={rubrique} className="btn-outline text-sm inline-block w-full sm:w-auto text-center mt-4 sm:mt-6">
                  ← Retour à {rubriqueLabel}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="article-product-sticky lg:hidden" role="region" aria-label="Ajouter au panier">
        <div className="article-product-sticky__inner">
          <div className="article-product-sticky__price">
            <span className="article-product-sticky__label">Total</span>
            <strong>{formatEuro(lineTotal)}</strong>
          </div>
          <button
            type="button"
            className="btn-primary article-product-sticky__btn"
            onClick={handleAdd}
            disabled={cannotAddToCart}
          >
            {added ? 'Ajouté ✓' : 'Ajouter au panier'}
          </button>
        </div>
      </div>
    </>
  )
}
