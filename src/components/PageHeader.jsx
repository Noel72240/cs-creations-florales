export default function PageHeader({ title, subtitle, image, legal }) {
  return (
    <div
      className={`page-header page-header--fx pt-8 pb-16 relative overflow-hidden ${image ? 'page-header--image' : 'page-header--plain'}`}
      style={image ? {
        backgroundImage: `linear-gradient(to bottom, rgba(139,75,106,0.55), rgba(192,122,151,0.3)), url(${image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      } : {}}
    >
      {image && <div className="page-header-shimmer" aria-hidden="true" />}
      <div className="page-header-vignette" aria-hidden="true" />
      <div className="relative z-10 max-w-3xl mx-auto text-center px-4">
        {subtitle && (
          <p className={legal ? 'page-legal-header__subtitle' : 'section-subtitle mb-3'}>{subtitle}</p>
        )}
        <h1
          className={`text-white drop-shadow-lg ${legal ? 'page-legal-header__title' : 'font-heading'}`}
          style={{
            ...(legal ? {} : { fontSize: 'clamp(2.2rem, 5vw, 4rem)' }),
            fontWeight: legal ? 700 : 500,
            color: image ? 'white' : 'var(--violet)',
            textShadow: image ? '0 2px 12px rgba(80,40,100,0.4)' : 'none',
          }}
        >
          {title}
        </h1>
        <div className="floral-divider mt-4">
          <span className="floral-icon text-mauve-light opacity-70">✿</span>
        </div>
      </div>
    </div>
  )
}
