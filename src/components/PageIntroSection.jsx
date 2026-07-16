import { Link } from 'react-router-dom'
import { useSiteConfig } from '../context/SiteContentContext'
import { resolvePhotoSrc } from '../data/photoResolver'
import { resolvePageIntro } from '../lib/pageIntro'

function resolveIntroImage(intro) {
  const img = intro?.image
  if (!img) return ''
  const src = String(img.src || '').trim()
  if (src) return resolvePhotoSrc(src)
  if (img.photoKey?.trim()) return resolvePhotoSrc(img.photoKey)
  return ''
}

function overlayClass(position) {
  if (position === 'bottom-left') return 'overlay overlay--bottom-left'
  if (position === 'bottom-right') return 'overlay overlay--bottom-right'
  if (position === 'bottom-center') return 'overlay overlay--bottom-center'
  return 'overlay overlay--centered'
}

function SupportQuoteBox({ quote, ownerFullName, showAuthor }) {
  if (!quote?.trim()) return null
  return (
    <div
      className="mt-6 p-5 rounded-2xl"
      style={{
        background: 'linear-gradient(to right, rgba(240,210,221,0.2), rgba(239,230,234,0.3))',
        border: '1px solid rgba(240,210,221,0.4)',
      }}
    >
      <p className="font-heading text-base italic text-center" style={{ color: 'var(--violet)' }}>
        « {quote} »
      </p>
      {showAuthor && ownerFullName ? (
        <p className="text-center font-body text-xs mt-3" style={{ color: 'var(--mauve)' }}>
          — {ownerFullName}
        </p>
      ) : null}
    </div>
  )
}

export default function PageIntroSection({ pageKey }) {
  const { content } = useSiteConfig()
  const pa = content.pageArticles?.[pageKey]
  const intro = resolvePageIntro(pa, pageKey)
  const ownerFullName = content.site?.ownerFullName || ''
  const isCenter = intro.layout !== 'split'

  if (!intro.enabled) return null

  const imageUrl = resolveIntroImage(intro)
  const showImage = !isCenter && imageUrl

  if (!intro.pretitle && !intro.title && !intro.paragraphs.length && !showImage && !intro.supportBox.enabled) {
    return null
  }

  const headerBlock = (
    <div className={`page-intro-header ${showImage ? 'page-intro-header--centered mb-8' : ''}`}>
      {intro.pretitle ? (
        <p className={`section-subtitle mb-2 ${showImage || isCenter ? 'text-center' : 'text-left'}`}>
          {intro.pretitle}
        </p>
      ) : null}
      {intro.title ? (
        <h2
          className={`font-heading font-medium mb-3 ${
            showImage || isCenter ? 'section-title mb-2 text-center' : 'text-2xl md:text-3xl text-left'
          }`}
          style={{ color: 'var(--violet)' }}
        >
          {intro.title}
        </h2>
      ) : null}
      {(showImage || isCenter) && intro.title ? (
        <div className="floral-divider mb-4">
          <span className="floral-icon">✿</span>
        </div>
      ) : null}
      {!showImage && !isCenter ? (
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px w-16 bg-mauve-light" />
          <span className="text-mauve text-sm">✿</span>
        </div>
      ) : null}
    </div>
  )

  const bodyBlock = (
    <>
      {intro.paragraphs.length ? (
        <div className={`page-intro-copy ${showImage ? 'page-intro-copy--split' : ''} ${isCenter && !showImage ? 'text-center' : ''}`}>
          {intro.paragraphs.map((p, i) => (
            <p
              key={i}
              className={
                showImage
                  ? 'page-intro-copy__p'
                  : `article-catalog-intro mb-3 ${isCenter ? '' : 'article-catalog-intro--left'}`
              }
            >
              {p}
            </p>
          ))}
        </div>
      ) : null}
      {intro.cta.enabled && intro.cta.label ? (
        <div className={`mt-5 ${showImage || isCenter ? '' : ''} ${!showImage && isCenter ? 'text-center' : ''}`}>
          <Link to={intro.cta.path || '/contact'} className="btn-primary">
            {intro.cta.label}
          </Link>
        </div>
      ) : null}
      {intro.supportBox.enabled ? (
        <SupportQuoteBox
          quote={intro.supportBox.quote}
          ownerFullName={ownerFullName}
          showAuthor={intro.supportBox.showAuthor}
        />
      ) : null}
    </>
  )

  return (
    <section
      className={`page-intro-section py-10 px-4${showImage ? ' page-intro-section--split' : ''}`}
      style={{ background: showImage ? 'linear-gradient(to bottom, #fff7fb, var(--beige))' : 'var(--blanc)' }}
    >
      <div className={showImage ? 'max-w-6xl mx-auto' : 'max-w-3xl mx-auto'}>
        {showImage ? (
          <>
            {headerBlock}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="img-overlay rounded-2xl page-intro-photo order-2 md:order-1" style={{ minHeight: '300px' }}>
                <img
                  src={imageUrl}
                  alt={intro.image?.alt || intro.title || 'Illustration'}
                  className="w-full h-full object-cover"
                />
                {intro.image?.overlayTitle ? (
                  <div className={overlayClass(intro.image?.overlayPosition)}>
                    <span
                      className="font-refined text-[26px] sm:text-[27px] font-semibold tracking-wide text-white/95 not-italic"
                      style={{ textShadow: '0 1px 4px rgba(0,0,0,0.55)' }}
                    >
                      {intro.image.overlayTitle}
                    </span>
                  </div>
                ) : null}
              </div>
              <div className="order-1 md:order-2 animate-fade-up">{bodyBlock}</div>
            </div>
          </>
        ) : (
          <>
            {headerBlock}
            {bodyBlock}
          </>
        )}
      </div>
    </section>
  )
}
