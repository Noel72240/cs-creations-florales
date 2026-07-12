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

function SupportQuoteBox({ quote, ownerFullName, showAuthor }) {
  if (!quote?.trim()) return null
  return (
    <div
      className="mt-10 p-6 rounded-2xl"
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

  const textBlock = (
    <>
      {intro.pretitle ? (
        <p className={`section-subtitle mb-2 ${isCenter ? 'text-center' : 'text-left'}`}>{intro.pretitle}</p>
      ) : null}
      {intro.title ? (
        <h2
          className={`font-heading font-medium mb-6 ${isCenter ? 'section-title mb-4' : 'text-3xl md:text-4xl'}`}
          style={{ color: 'var(--violet)' }}
        >
          {intro.title}
        </h2>
      ) : null}
      {isCenter && intro.title ? (
        <div className="floral-divider mb-8">
          <span className="floral-icon">✿</span>
        </div>
      ) : null}
      {!isCenter ? (
        <div className="flex items-center gap-3 mb-7">
          <div className="h-px w-16 bg-mauve-light" />
          <span className="text-mauve text-sm">✿</span>
        </div>
      ) : null}
      {intro.paragraphs.map((p, i) => (
        <p
          key={i}
          className={`text-refined mb-5 ${isCenter ? 'max-w-[36rem] mx-auto text-center' : 'text-left'}`}
        >
          {p}
        </p>
      ))}
      {intro.cta.enabled && intro.cta.label ? (
        <div className={`mt-2 ${isCenter ? 'text-center' : ''}`}>
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

  if (!intro.pretitle && !intro.title && !intro.paragraphs.length && !showImage && !intro.supportBox.enabled) {
    return null
  }

  return (
    <section className="py-16 px-4" style={{ background: 'var(--blanc)' }}>
      <div className={showImage ? 'max-w-4xl mx-auto' : 'max-w-3xl mx-auto'}>
        {showImage ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>{textBlock}</div>
            <div className="img-overlay rounded-2xl page-intro-photo" style={{ minHeight: '380px' }}>
              <img
                src={imageUrl}
                alt={intro.image?.alt || intro.title || 'Illustration'}
                className="w-full h-full object-cover"
              />
              {intro.image?.overlayTitle ? (
                <div className={`overlay ${intro.image?.overlayPosition === 'bottom-left' ? 'overlay--bottom-left' : 'overlay--centered'}`}>
                  <span
                    className="font-refined text-[26px] sm:text-[27px] font-semibold tracking-wide text-white/95 not-italic"
                    style={{ textShadow: '0 1px 4px rgba(0,0,0,0.55)' }}
                  >
                    {intro.image.overlayTitle}
                  </span>
                </div>
              ) : null}
            </div>
          </div>
        ) : (
          textBlock
        )}
      </div>
    </section>
  )
}
