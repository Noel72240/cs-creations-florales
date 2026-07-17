export default function PageHeader({ title, subtitle, image, legal, className = '' }) {
  const hasText = Boolean(String(title || '').trim() || String(subtitle || '').trim())

  return (
    <div
      className={`page-header page-header--fx page-header--responsive pt-4 pb-7 sm:pt-5 sm:pb-10 relative overflow-hidden ${image ? 'page-header--image' : 'page-header--plain'}${!hasText && image ? ' page-header--image-only' : ''}${className ? ` ${className}` : ''}`}
      style={
        image
          ? {
              backgroundImage: hasText
                ? `linear-gradient(to bottom, rgba(139,75,106,0.4), rgba(192,122,151,0.2)), url(${image})`
                : `url(${image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }
          : undefined
      }
    >
      {image && hasText ? <div className="page-header-shimmer" aria-hidden="true" /> : null}
      {hasText ? <div className="page-header-vignette" aria-hidden="true" /> : null}
      {hasText ? (
        <div className="relative z-10 max-w-3xl mx-auto text-center px-4">
          {title ? (
            <h1
              className={`text-white drop-shadow-lg ${legal ? 'page-legal-header__title' : 'font-heading page-header__title'}`}
              style={{
                ...(legal ? {} : { fontSize: 'clamp(1.75rem, 4.2vw, 2.85rem)' }),
                fontWeight: legal ? 700 : 500,
                color: image ? 'white' : 'var(--violet)',
                textShadow: image ? '0 2px 12px rgba(80,40,100,0.4)' : 'none',
              }}
            >
              {title}
            </h1>
          ) : null}
          {subtitle ? (
            <p className={legal ? 'page-legal-header__subtitle' : 'page-header__subtitle mt-2 mb-1'}>{subtitle}</p>
          ) : null}
          <div className="floral-divider mt-4">
            <span className="floral-icon text-mauve-light opacity-70">✿</span>
          </div>
        </div>
      ) : (
        <h1 className="sr-only">C&S Créations Florales</h1>
      )}
    </div>
  )
}
