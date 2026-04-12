import { useEffect, useState } from 'react'
import { MAX_PAGE_ARTICLES } from '../data/siteContent.defaults'
import { resolvePhotoSrc } from '../data/photoResolver'
import { formatEuro } from '../utils/formatEuro'
import AddToCartButton from './AddToCartButton'

function ArticleCard({ item, pagePath }) {
  const customSrc = (item.src || '').trim()
  const primary = resolvePhotoSrc(customSrc || item.photoKey)
  const fallback = resolvePhotoSrc(item.photoKey)
  const [imgSrc, setImgSrc] = useState(primary)

  useEffect(() => {
    setImgSrc(resolvePhotoSrc(customSrc || item.photoKey))
  }, [customSrc, item.photoKey])

  const price = typeof item.price === 'number' ? item.price : Number(item.price) || 0

  const handleImgError = () => {
    if (customSrc && imgSrc !== fallback) {
      setImgSrc(fallback)
    }
  }

  return (
    <article
      className="flex flex-col rounded-2xl overflow-hidden bg-white border border-mauve-light/25 shadow-sm hover:shadow-md transition-shadow"
      style={{ boxShadow: '0 4px 24px rgba(139, 75, 106, 0.08)' }}
    >
      <div className="aspect-[4/3] w-full overflow-hidden bg-mauve-pale">
        <img
          src={imgSrc}
          alt={item.title}
          loading="lazy"
          className="w-full h-full object-cover"
          onError={handleImgError}
        />
      </div>
      <div className="flex flex-col flex-1 p-5 sm:p-6">
        <h3 className="font-heading text-lg font-medium mb-2 leading-snug" style={{ color: 'var(--violet)' }}>
          {item.title}
        </h3>
        <p className="text-refined text-sm flex-1 mb-4 leading-relaxed" style={{ color: 'var(--text-elegant)' }}>
          {item.description}
        </p>
        <p className="font-refined text-lg font-semibold mb-3" style={{ color: 'var(--mauve-dark)' }}>
          {formatEuro(price)}
        </p>
        <AddToCartButton
          product={{
            id: item.id,
            title: item.title,
            price,
            imageUrl: imgSrc,
            path: pagePath,
          }}
          label="Ajouter au panier"
          className="w-full text-center justify-center"
        />
      </div>
    </article>
  )
}

/**
 * Grille d’articles (photo, titre, description, prix) pour les pages rubrique.
 * @param {{ sectionTitle?: string, intro?: string, items?: Array<{ id: string, title: string, description: string, price: number, photoKey?: string, src?: string }>, pagePath: string }} props
 */
export default function PageArticleGrid({ sectionTitle = 'Articles', intro, items, pagePath }) {
  const list = Array.isArray(items) ? items.slice(0, MAX_PAGE_ARTICLES) : []
  if (!list.length) return null

  return (
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
            <ArticleCard key={item.id || `article-${index}`} item={item} pagePath={pagePath} />
          ))}
        </div>
      </div>
    </section>
  )
}
