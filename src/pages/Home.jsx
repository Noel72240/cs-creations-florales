import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSiteConfig } from '../context/SiteContentContext'
import { resolvePhotoSrc } from '../data/photoResolver'
import { useSiteBackgroundUrl } from '../hooks/useSiteBackgroundUrl'
import { P, w600 } from '../data/flowerPhotos'
import { renderQuiParagraphAccents } from '../utils/quiTextAccents'

const CREATOR_PHOTO_DEFAULT = w600(P.womanFlorist)
const CREATOR_PHOTO_PATHS = ['/charlene.png', '/charlene.webp', '/charlene.jpg']
const MOTO_FLORALE_PATHS = ['/moto-florale.png', '/moto-florale.webp', '/moto-florale.jpg']

// ─── SECTION 1: Hero ─────────────────────────────────────────────────────────
function HeroSection({ site, hero }) {
  const heroBg = useSiteBackgroundUrl()
  const useImageBg = Boolean(heroBg && heroBg.trim())

  return (
    <section
      className={`hero-section relative flex items-center justify-center overflow-hidden min-h-[calc(100svh-var(--site-header-offset,7rem))] ${!useImageBg ? 'hero-bg-soft' : ''}`}
      style={
        useImageBg
          ? {
              backgroundImage: `url(${JSON.stringify(heroBg)})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }
          : undefined
      }
    >
      <div className="relative z-10 text-center px-4 animate-fade-up">
        <div className="hero-square-wrap mx-auto">
          <div className="hero-square-frame hero-square-frame--plain" data-animate="hero-frame">

          <p
            className="hero-pretitle mb-3 text-lg sm:text-xl md:text-[1.35rem] font-refined font-medium leading-snug sm:leading-normal tracking-wide"
            style={{ color: 'var(--mauve)' }}
          >
            {hero.pretitle}
          </p>

          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-12" style={{ background: 'var(--lavande)' }} />
            <span className="text-sm" style={{ color: 'var(--mauve)' }}>✦</span>
            <div className="h-px w-12" style={{ background: 'var(--lavande)' }} />
          </div>

          <h1
            className="hero-brand-title"
            style={{
              fontSize: 'clamp(2rem, 5.2vw, 3.65rem)',
              color: 'var(--violet)',
            }}
          >
            {hero.titleLine1}
          </h1>
          <p className="hero-brand-subtitle mt-3" style={{ fontSize: 'clamp(1.2rem, 2.6vw, 1.95rem)' }}>
            {hero.titleLine2}
          </p>

          <div className="flex items-center justify-center gap-3 mt-4 mb-5">
            <div className="hero-brand-location-rule h-px w-12" />
            <span className="hero-brand-location-star text-sm">✦</span>
            <div className="hero-brand-location-rule h-px w-12" />
          </div>

          <p className="hero-brand-location-wrap">
            <span className="hero-brand-location-name">{site.ownerFirstName}</span>
            <span className="hero-brand-location-rest">
              — {site.city} ({site.postalCode.slice(0, 2)})
            </span>
          </p>
          </div>
        </div>

        <div className="max-w-xl mx-auto mt-7">
          <div className="hero-search">
            <span className="hero-search__icon" aria-hidden="true">⌕</span>
            <input
              type="search"
              className="hero-search__input"
              placeholder={hero.searchPlaceholder}
              aria-label="Rechercher sur le site"
            />
          </div>
          <p
            className="hero-search-hint mt-3 text-lg sm:text-xl md:text-[1.35rem] font-refined font-medium leading-snug sm:leading-normal tracking-wide text-center px-1"
            style={{ color: 'rgba(61, 42, 74, 0.68)' }}
          >
            {hero.searchHint}
          </p>
        </div>

        <div className="flex flex-wrap gap-4 justify-center mt-10">
          <Link
            to={hero.ctaPrimaryPath}
            className="btn-primary text-sm py-3 px-8"
            style={{ background: 'white', color: 'var(--violet)' }}
          >
            {hero.ctaPrimaryLabel}
          </Link>
          <Link
            to={hero.ctaSecondaryPath}
            className="btn-outline text-sm py-3 px-8"
            style={{ borderColor: 'var(--mauve)', color: 'var(--violet)' }}
          >
            {hero.ctaSecondaryLabel}
          </Link>
        </div>

        <div className="mt-12 md:mt-14 flex flex-col items-center gap-2 animate-float opacity-80 pb-6">
          <p
            className="hero-scroll-label text-lg sm:text-xl md:text-[1.35rem] font-refined font-medium leading-snug sm:leading-normal tracking-wide"
            style={{ color: 'var(--violet)' }}
          >
            {hero.scrollLabel}
          </p>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: 'var(--violet)' }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </section>
  )
}

function IntroSection({ intro }) {
  const headline = intro?.headline?.trim() || ''
  const tagline = intro?.tagline?.trim() || ''
  const paragraph = intro?.paragraph?.trim() || ''
  if (!headline && !tagline && !paragraph) return null

  return (
    <section className="py-16 md:py-20 px-4" style={{ background: 'var(--blanc)' }}>
      <div className="max-w-3xl mx-auto text-center">
        {headline && (
          <p className="section-subtitle mb-3">{headline}</p>
        )}
        {tagline && (
          <h2
            className="font-heading font-medium leading-snug mb-6"
            style={{ fontSize: 'clamp(1.65rem, 4vw, 2.75rem)', color: 'var(--violet)' }}
          >
            {tagline}
          </h2>
        )}
        {paragraph && (
          <p className="text-refined max-w-[36rem] mx-auto">{paragraph}</p>
        )}
      </div>
    </section>
  )
}

function QuiSuisJeSection({ site, qui }) {
  const [creatorPhoto, setCreatorPhoto] = useState(CREATOR_PHOTO_DEFAULT)

  useEffect(() => {
    let cancelled = false
    let i = 0
    const probe = () => {
      if (i >= CREATOR_PHOTO_PATHS.length) return
      const path = CREATOR_PHOTO_PATHS[i]
      const img = new Image()
      img.onload = () => {
        if (!cancelled) setCreatorPhoto(path)
      }
      img.onerror = () => {
        i += 1
        probe()
      }
      img.src = path
    }
    probe()
    return () => {
      cancelled = true
    }
  }, [])

  const brandExtra = site?.businessName ? [site.businessName] : []
  const q = qui ?? {}
  const paragraphs = (q.paragraphs || []).map((p) =>
    String(p ?? '').replace(/\{firstName\}/g, site?.ownerFirstName ?? ''),
  )

  return (
    <section
      className="py-20 px-4"
      style={{ background: 'linear-gradient(to bottom, #fff7fb, var(--beige))' }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="relative">
            <div
              className="absolute inset-0 rounded-2xl -rotate-2 opacity-20"
              style={{ background: 'var(--lavande)', transform: 'rotate(-2deg) scale(0.98)', borderRadius: '1rem' }}
            />
            <div className="relative rounded-2xl overflow-hidden shadow-xl" style={{ aspectRatio: '4/5' }}>
              <img
                src={creatorPhoto}
                alt={`${site.ownerFirstName} — Portrait`}
                className="w-full h-full object-cover"
              />
              <div
                className="absolute bottom-0 left-0 right-0 h-24"
                style={{ background: 'linear-gradient(to top, rgba(139,75,106,0.2), transparent)' }}
              />
            </div>
            <div
              className="absolute -bottom-5 -right-5 bg-white rounded-xl px-5 py-3 shadow-lg border border-mauve-light/30"
            >
              <p className="font-heading text-sm font-medium" style={{ color: 'var(--violet)' }}>{q.badgeTitle}</p>
              <p className="font-body text-xs" style={{ color: 'var(--mauve)' }}>{q.badgeLine}</p>
            </div>
          </div>

          <div className="animate-fade-up">
            <p className="section-subtitle text-left mb-2">{q.sectionPretitle}</p>
            <h2 className="qui-section-title mb-6" style={{ fontSize: 'clamp(2.25rem, 4.5vw, 3.25rem)' }}>
              {q.sectionTitle}
            </h2>
            <div className="flex items-center gap-3 mb-7">
              <div className="h-px w-16 bg-mauve-light" />
              <span className="text-mauve text-sm">✿</span>
            </div>

            <div className="space-y-5 text-refined text-left">
              {paragraphs.map((text, idx) => (
                <p key={idx}>
                  {renderQuiParagraphAccents(text, site.ownerFirstName, brandExtra)}
                </p>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8 mt-8">
              {(q.values || []).map(({ icon, label }) => (
                <div key={label} className="text-center p-3 rounded-xl" style={{ background: 'rgba(240,210,221,0.22)' }}>
                  <p className="text-2xl mb-1">{icon}</p>
                  <p className="font-body text-xs tracking-wider uppercase" style={{ color: 'var(--mauve)' }}>{label}</p>
                </div>
              ))}
            </div>

            <Link to="/contact" className="btn-primary">
              {q.ctaLabel}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

function CreationSurMesureSection({ moto }) {
  const [motoPhoto, setMotoPhoto] = useState(w600(P.floristShop))

  useEffect(() => {
    let cancelled = false
    let i = 0
    const probe = () => {
      if (i >= MOTO_FLORALE_PATHS.length) return
      const path = MOTO_FLORALE_PATHS[i]
      const img = new Image()
      img.onload = () => {
        if (!cancelled) setMotoPhoto(path)
      }
      img.onerror = () => {
        i += 1
        probe()
      }
      img.src = path
    }
    probe()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section className="py-20 px-4" style={{ background: 'var(--blanc)' }}>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="img-overlay rounded-3xl" style={{ minHeight: '360px' }}>
            <img src={motoPhoto} alt="Création sur mesure — moto florale" className="w-full h-full object-cover" />
            <div className="overlay" style={{ opacity: 1, background: 'linear-gradient(to top, rgba(139, 75, 106, 0.72) 0%, rgba(139, 75, 106, 0.12) 65%)' }}>
              <span
                className="font-refined text-[26px] sm:text-[27px] font-semibold tracking-wide text-white/95"
                style={{ textShadow: '0 1px 4px rgba(0,0,0,0.55)' }}
              >
                {moto.overlayTitle}
              </span>
            </div>
          </div>

          <div className="animate-fade-up">
            <p className="section-subtitle text-left mb-2">{moto.pretitle}</p>
            <h2 className="font-heading font-medium mb-6" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--violet)' }}>
              {moto.title}
            </h2>
            <div className="space-y-4 text-refined text-left">
              {(moto.paragraphs || []).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/contact" className="btn-primary">{moto.ctaPrimary}</Link>
              <Link to="/evenements-floraux" className="btn-outline">{moto.ctaSecondary}</Link>
            </div>
            <p className="mt-4 text-xs font-body" style={{ color: 'var(--text-mid)' }}>
              {moto.tip}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

function CoupsDeCoeurSection({ cd }) {
  return (
    <section className="py-20 px-4" style={{ background: 'linear-gradient(to bottom, var(--beige), #fff7fb)' }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="section-subtitle mb-2">{cd.pretitle}</p>
          <h2 className="section-title">{cd.title}</h2>
          <div className="floral-divider mt-3">
            <span className="floral-icon">✿</span>
          </div>
          <p className="text-refined--sm mt-4 max-w-xl mx-auto">
            {cd.intro}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5 sm:gap-6">
          {(cd.items || []).map((item, idx) => (
            <div key={`${item.label}-${idx}`} className="text-center">
              <div className="coup-rond img-overlay mx-auto">
                <img src={resolvePhotoSrc(item.src || item.photoKey)} alt={item.label} className="w-full h-full object-cover" />
                <div className="overlay">
                  <span>{item.label}</span>
                </div>
              </div>
              <p className="mt-3 font-heading italic text-sm" style={{ color: 'var(--violet)', opacity: 0.92 }}>
                {item.label}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link to={cd.ctaPath} className="btn-outline">
            {cd.ctaLabel}
          </Link>
        </div>
      </div>
    </section>
  )
}

function CategoryPreviewSection({ prest }) {
  return (
    <section className="py-20 px-4" style={{ background: 'var(--blanc)' }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="section-subtitle mb-2">{prest.pretitle}</p>
          <h2 className="section-title">{prest.title}</h2>
          <div className="floral-divider mt-3">
            <span className="floral-icon">✿</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {(prest.categories || []).map((cat) => (
            <Link key={cat.path} to={cat.path} className="card group block overflow-hidden">
              <div className="img-overlay h-64 sm:h-72 rounded-2xl">
                <img src={resolvePhotoSrc(cat.src || cat.photoKey)} alt={cat.title} className="w-full h-full object-cover" />
                <div className="overlay">
                  <div>
                    <p
                      className="font-refined text-[26px] sm:text-[27px] font-semibold tracking-wide text-white/95 mb-2"
                      style={{ textShadow: '0 1px 4px rgba(0,0,0,0.55)' }}
                    >
                      {cat.icon} Prestation
                    </p>
                    <p className="font-heading text-xl md:text-2xl italic text-white mb-2">{cat.title}</p>
                    <p className="text-[12px] text-white/85 font-body leading-relaxed max-w-[28ch]">{cat.desc}</p>
                    <p className="mt-4 text-xs font-body text-white/80">Découvrir →</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

function ContactStrip({ site, strip }) {
  return (
    <section
      className="py-20 px-4 text-center relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, var(--violet) 0%, var(--mauve) 60%, #c49fd4 100%)',
      }}
    >
      <div className="absolute top-4 left-8 text-white/10 text-6xl font-heading">✿</div>
      <div className="absolute bottom-4 right-8 text-white/10 text-6xl font-heading">❀</div>
      <div className="relative z-10 max-w-2xl mx-auto">
        <p className="contact-strip-pretitle mb-3 text-lg sm:text-xl md:text-[1.35rem] font-refined font-medium leading-snug sm:leading-normal tracking-wide text-white/95">
          {strip.pretitle}
        </p>
        <h2
          className="font-heading font-medium text-white mb-4"
          style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}
        >
          {strip.title}
        </h2>
        <p className="font-heading text-base font-normal tracking-[0.12em] text-white/85 mb-8">
          {strip.subtitle}
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            to="/contact"
            className="btn-primary"
            style={{ background: 'white', color: 'var(--violet)' }}
          >
            {strip.ctaLabel}
          </Link>
          <a
            href={site.phoneHref}
            className="btn-outline"
            style={{ borderColor: 'white', color: 'white' }}
          >
            {strip.phoneCtaPrefix}{site.ownerFirstName}
          </a>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  const { content } = useSiteConfig()
  const site = content.site
  const h = content.home

  return (
    <>
      <HeroSection site={site} hero={h.hero} />
      <QuiSuisJeSection site={site} qui={h.quiSuisJe} />
      <IntroSection intro={h.intro} />
      <CoupsDeCoeurSection cd={h.coupsDeCoeur} />
      <CreationSurMesureSection moto={h.moto} />
      <CategoryPreviewSection prest={h.prestations} />
      <ContactStrip site={site} strip={h.contactStrip} />
    </>
  )
}
