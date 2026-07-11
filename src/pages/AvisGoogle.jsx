import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import StarRating from '../components/StarRating'
import { useSiteConfig } from '../context/SiteContentContext'

export default function AvisGoogle() {
  const { content } = useSiteConfig()
  const gr = content.googleReviews || {}
  const items = gr.items || []
  const googleUrl = (gr.googleUrl || '').trim()

  const avg =
    items.length > 0
      ? items.reduce((sum, it) => sum + (Number(it.rating) || 0), 0) / items.length
      : 0

  return (
    <>
      <PageHeader title={gr.pageTitle || 'Nos avis clients'} subtitle={gr.pageSubtitle || 'Ce que nos clients disent'} />

      <section className="py-14 px-4" style={{ background: 'var(--blanc)' }}>
        <div className="max-w-3xl mx-auto">
          {gr.intro && (
            <p className="text-refined text-center mb-10" style={{ color: 'var(--text-elegant)' }}>
              {gr.intro}
            </p>
          )}

          {items.length > 0 && (
            <div
              className="google-reviews-summary flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 p-6 rounded-2xl border border-mauve-light/35"
              style={{ background: 'var(--beige)' }}
            >
              <div className="text-center">
                <p className="font-heading text-4xl mb-1" style={{ color: 'var(--violet)' }}>
                  {avg.toFixed(1).replace('.0', '')}
                </p>
                <StarRating rating={Math.round(avg)} size="lg" />
                <p className="font-body text-xs mt-2" style={{ color: 'var(--text-mid)' }}>
                  {items.length} avis affiché{items.length > 1 ? 's' : ''}
                </p>
              </div>
              {googleUrl && (
                <a
                  href={googleUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary text-sm py-3 px-6 shrink-0"
                >
                  {gr.ctaLabel || 'Voir sur Google'} ↗
                </a>
              )}
            </div>
          )}

          {items.length === 0 ? (
            <p className="text-center font-body text-sm" style={{ color: 'var(--text-mid)', lineHeight: 1.8 }}>
              Les avis seront bientôt disponibles. En attendant,{' '}
              <Link to="/contact" className="hover:text-mauve transition-colors" style={{ color: 'var(--mauve)' }}>
                contactez-nous
              </Link>
              .
            </p>
          ) : (
            <ul className="space-y-6">
              {items.map((review) => (
                <li
                  key={review.id}
                  className="google-review-card rounded-2xl border border-mauve-light/30 p-6 shadow-sm"
                  style={{ background: 'rgba(255, 248, 251, 0.9)' }}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                    <div>
                      <p className="font-heading text-lg font-medium" style={{ color: 'var(--violet)' }}>
                        {review.authorName || 'Client'}
                      </p>
                      {review.publishedAt && (
                        <p className="font-body text-xs mt-0.5" style={{ color: 'var(--text-mid)' }}>
                          {review.publishedAt}
                        </p>
                      )}
                    </div>
                    <StarRating rating={review.rating} size="sm" />
                  </div>
                  <p className="font-body text-sm leading-relaxed" style={{ color: 'var(--text-elegant)' }}>
                    {review.text}
                  </p>
                </li>
              ))}
            </ul>
          )}

          {googleUrl && items.length > 0 && (
            <p className="text-center mt-10">
              <a
                href={googleUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline text-sm py-3 px-6 inline-block"
              >
                {gr.ctaLabel || 'Laisser un avis sur Google'}
              </a>
            </p>
          )}
        </div>
      </section>
    </>
  )
}
