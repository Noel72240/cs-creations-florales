export default function PageHeader({ title, subtitle, image, legal, className = '' }) {
  const hasText = Boolean(String(title || '').trim() || String(subtitle || '').trim())

  return (
    <div
      className={`page-header page-header--fx page-header--responsive relative overflow-hidden ${
        image ? 'page-header--image' : 'page-header--plain'
      }${hasText ? '' : ' page-header--image-only'}${className ? ` ${className}` : ''}`}
      style={
        image
          ? {
              backgroundImage: `linear-gradient(to top, rgba(45, 22, 40, 0.55) 0%, rgba(45, 22, 40, 0.12) 38%, transparent 62%), url(${image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }
          : {}
      }
    >
      {image ? <div className="page-header-shimmer" aria-hidden="true" /> : null}
      <div className="page-header-vignette" aria-hidden="true" />

      {hasText ? (
        <div
          className={`relative z-10 page-header__caption ${
            image ? 'page-header__caption--on-image' : 'page-header__caption--plain'
          }`}
        >
          <div className="max-w-3xl mx-auto text-center px-4">
            {title ? (
              <h1
                className={`text-white drop-shadow-lg ${
                  legal ? 'page-legal-header__title' : 'font-heading page-header__title'
                }`}
                style={{
                  ...(legal ? {} : { fontSize: 'clamp(1.55rem, 3.8vw, 2.45rem)' }),
                  fontWeight: legal ? 700 : 500,
                  color: image ? 'white' : 'var(--violet)',
                  textShadow: image ? '0 2px 10px rgba(0,0,0,0.45)' : 'none',
                }}
              >
                {title}
              </h1>
            ) : null}
            {subtitle ? (
              <p className={legal ? 'page-legal-header__subtitle' : 'page-header__subtitle mt-1.5 mb-0'}>
                {subtitle}
              </p>
            ) : null}
            {!image ? (
              <div className="floral-divider mt-3">
                <span className="floral-icon text-mauve-light opacity-70">✿</span>
              </div>
            ) : null}
          </div>
        </div>
      ) : (
        <h1 className="sr-only">{title || 'C&S Créations Florales'}</h1>
      )}
    </div>
  )
}
