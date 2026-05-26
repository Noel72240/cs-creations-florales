import { Link } from 'react-router-dom'
import PageHeader from '../../components/PageHeader'
import Seo from '../../components/Seo'
import { SEO_HUB, SEO_PAGES } from '../../data/seoPages'

export default function SeoHub() {
  return (
    <>
      <Seo
        title={SEO_HUB.title}
        description={SEO_HUB.description}
        path={SEO_HUB.path}
        breadcrumb={[
          { name: 'Accueil', path: '/' },
          { name: 'Guides', path: '/guides' },
        ]}
      />
      <PageHeader title="Guides & inspirations florales" subtitle="Conseils par occasion" />
      <section className="py-14 px-4" style={{ background: 'var(--blanc)' }}>
        <div className="max-w-3xl mx-auto">
          <p className="text-refined mb-8 text-center">
            Retrouvez nos conseils pour choisir la bonne composition selon votre événement, votre ville en Sarthe et
            vos envies de personnalisation.
          </p>
          <ul className="space-y-3">
            {SEO_PAGES.map((page) => (
              <li key={page.slug}>
                <Link
                  to={`/guides/${page.slug}`}
                  className="block rounded-xl border border-mauve-light/30 bg-white px-5 py-4 hover:shadow-md transition-shadow"
                >
                  <span className="font-heading text-lg" style={{ color: 'var(--violet)' }}>
                    {page.h1}
                  </span>
                  <span className="block text-sm mt-1" style={{ color: 'var(--text-mid)' }}>
                    {page.metaDescription.slice(0, 120)}…
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="text-center mt-10">
            <Link to="/contact" className="btn-primary text-sm py-3 px-8">
              Demander un devis gratuit
            </Link>
          </p>
        </div>
      </section>
    </>
  )
}
