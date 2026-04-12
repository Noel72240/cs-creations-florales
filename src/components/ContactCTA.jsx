import { Link } from 'react-router-dom'
import { useSiteConfig } from '../context/SiteContentContext'

export default function ContactCTA({ message = "Une question ? Un projet ? Je suis là pour vous accompagner." }) {
  const { content } = useSiteConfig()
  const SITE = content.site

  return (
    <section
      className="contact-cta-band py-20 px-4 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, var(--beige), var(--lavande)/30, var(--blanc))' }}
    >
      <div className="contact-cta-band__glow" aria-hidden="true" />
      <div className="max-w-2xl mx-auto text-center relative z-10">
        <p className="text-4xl mb-4" style={{ color: 'var(--mauve)', opacity: 0.6 }}>✿</p>
        <h2 className="font-heading text-3xl md:text-4xl mb-4" style={{ color: 'var(--violet)' }}>
          Parlons de votre projet
        </h2>
        <p className="text-refined--sm max-w-md mx-auto mb-8">
          {message}
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link to="/contact" className="btn-primary">
            Demander un devis gratuit
          </Link>
          <a href={SITE.phoneHref} className="btn-outline">
            Appeler {SITE.ownerFirstName}
          </a>
        </div>
      </div>
    </section>
  )
}
