import { Link, useParams } from 'react-router-dom'
import PageHeader from '../../components/PageHeader'
import Seo, { buildFaqSchema, buildLocalBusinessSchema } from '../../components/Seo'
import { getSeoPageBySlug } from '../../data/seoPages'

export default function SeoLandingPage() {
  const { slug } = useParams()
  const page = getSeoPageBySlug(slug)

  if (!page) {
    return (
      <>
        <Seo title="Page introuvable" description="Ce guide n'existe pas." path="/guides" noindex />
        <section className="py-24 px-4 text-center">
          <h1 className="section-title mb-4">Guide introuvable</h1>
          <Link to="/guides" className="btn-primary text-sm py-3 px-8">
            Voir tous les guides
          </Link>
        </section>
      </>
    )
  }

  const path = `/guides/${page.slug}`
  const faqSchema = buildFaqSchema(page.faq)
  const jsonLd = faqSchema ? [buildLocalBusinessSchema(), faqSchema] : buildLocalBusinessSchema()

  return (
    <>
      <Seo
        title={page.title}
        description={page.metaDescription}
        path={path}
        type="article"
        jsonLd={jsonLd}
        breadcrumb={[
          { name: 'Accueil', path: '/' },
          { name: 'Guides', path: '/guides' },
          { name: page.h1, path },
        ]}
      />
      <PageHeader title={page.h1} subtitle={page.subtitle} />

      <article className="py-14 px-4" style={{ background: 'var(--blanc)' }}>
        <div className="max-w-3xl mx-auto prose-seo">
          {page.sections.map((section) => (
            <section key={section.heading} className="mb-10">
              <h2 className="font-heading text-2xl mb-4" style={{ color: 'var(--violet)' }}>
                {section.heading}
              </h2>
              {section.paragraphs.map((p) => (
                <p key={p.slice(0, 40)} className="text-refined mb-4 leading-relaxed">
                  {p}
                </p>
              ))}
            </section>
          ))}

          {page.faq?.length > 0 ? (
            <section className="mb-10 rounded-2xl border border-mauve-light/25 bg-mauve-pale/20 p-6">
              <h2 className="font-heading text-xl mb-4" style={{ color: 'var(--violet)' }}>
                Questions fréquentes
              </h2>
              <dl className="space-y-4">
                {page.faq.map((item) => (
                  <div key={item.question}>
                    <dt className="font-medium mb-1" style={{ color: 'var(--violet)' }}>
                      {item.question}
                    </dt>
                    <dd className="text-sm leading-relaxed" style={{ color: 'var(--text-mid)' }}>
                      {item.answer}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          ) : null}

          {page.relatedLinks?.length > 0 ? (
            <nav className="mb-10" aria-label="Pages associées">
              <h2 className="font-heading text-lg mb-3" style={{ color: 'var(--violet)' }}>
                Découvrir aussi
              </h2>
              <ul className="flex flex-wrap gap-2">
                {page.relatedLinks.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="inline-block text-sm rounded-full border border-mauve-light/40 px-4 py-2 hover:bg-mauve-pale/40 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}

          <div className="flex flex-wrap gap-3 justify-center pt-4 border-t border-mauve-light/20">
            <Link to={page.shopPath} className="btn-primary text-sm py-3 px-8">
              Voir les créations
            </Link>
            <Link to="/contact" className="btn-outline text-sm py-3 px-8">
              Demander un devis
            </Link>
          </div>
        </div>
      </article>
    </>
  )
}
