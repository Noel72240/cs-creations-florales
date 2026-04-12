import { Link } from 'react-router-dom'
import { useSiteConfig } from '../context/SiteContentContext'
import { openCookiePreferences } from '../lib/cookieConsent'
import SocialIconLinks from './SocialIconLinks'

export default function Footer() {
  const year = new Date().getFullYear()
  const { content, sumupUrl } = useSiteConfig()
  const SITE = content.site
  const WEB_DEV = content.webDev
  const ft = content.footer

  return (
    <footer className="site-footer bg-gradient-to-b from-mauve-pale to-white border-t border-mauve-light/30 relative overflow-hidden">
      <div className="site-footer-glow" aria-hidden="true" />
      <div className="h-px bg-gradient-to-r from-transparent via-mauve-light/40 to-transparent relative z-10" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 py-8">
          {/* Brand */}
          <div>
            <h3 className="font-heading text-2xl font-medium mb-3" style={{ color: 'var(--violet)' }}>
              {ft.brandTitle}
            </h3>
            <p className="text-sm font-body mb-4" style={{ color: 'var(--text-mid)', lineHeight: '1.8' }}>
              {ft.brandLead}
            </p>
            <p className="text-xs font-body mb-4 leading-relaxed" style={{ color: 'var(--text-mid)' }}>
              <span className="font-medium" style={{ color: 'var(--violet)' }}>Paiement :</span>{' '}
              {sumupUrl ? ft.paymentWithSumup : ft.paymentWithoutSumup}
            </p>
            <SocialIconLinks
              facebookUrl={ft.facebookUrl}
              instagramUrl={ft.instagramUrl}
              tiktokUrl={ft.tiktokUrl}
            />
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-heading text-lg font-medium mb-4" style={{ color: 'var(--violet)' }}>
              Navigation
            </h4>
            <ul className="space-y-2 text-sm font-body" style={{ color: 'var(--text-mid)' }}>
              {[
                ['Accueil', '/'],
                ['Panier', '/panier'],
                ['Événements floraux', '/evenements-floraux'],
                ['Créations florales', '/creations-florales'],
                ['Créations funéraires', '/creations-funeraires'],
                ['Créations saisonnières', '/creations-saisonnieres'],
                ['Personnalisation', '/personnalisation'],
                ['Paiement', '/paiement'],
                ['Contact', '/contact'],
              ].map(([label, path]) => (
                <li key={path}>
                  <Link to={path} className="hover:text-mauve transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading text-lg font-medium mb-4" style={{ color: 'var(--violet)' }}>
              Contact
            </h4>
            <ul className="space-y-3 text-sm font-body" style={{ color: 'var(--text-mid)' }}>
              <li className="flex items-start gap-2">
                <span className="text-mauve mt-0.5">📍</span>
                <span>{SITE.postalCode} {SITE.city}, {SITE.region}</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-mauve">📞</span>
                <a href={SITE.phoneHref} className="hover:text-mauve transition-colors">
                  {SITE.phoneDisplay}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-mauve">✉</span>
                <a href={`mailto:${SITE.email}`} className="hover:text-mauve transition-colors">
                  {SITE.email}
                </a>
              </li>
            </ul>
            <Link to="/contact" className="btn-primary inline-block mt-5 text-xs py-2 px-5">
              Nous contacter
            </Link>
          </div>
        </div>

        {/* Réalisation site — Arial / sans-serif (lisible, type mentions légales) */}
        <div
          className="footer-webdev-credits border-t border-mauve-light/30 pt-4 mb-4 rounded-xl px-3 py-2.5 sm:py-3 text-center max-w-xl mx-auto"
          style={{ background: 'rgba(240,210,221,0.12)', color: 'var(--text-mid)' }}
        >
          <p className="footer-webdev-title">Conception & réalisation du site</p>
          <p className="footer-webdev-line">
            {WEB_DEV.contactName} — <strong className="font-semibold text-[var(--text-dark)]">{WEB_DEV.company}</strong>{' '}
            <span className="text-[var(--text-mid)]">({WEB_DEV.legalForm})</span>
          </p>
          <p className="footer-webdev-line">
            {WEB_DEV.addressLine}, {WEB_DEV.postalCode} {WEB_DEV.city}
          </p>
          <p className="footer-webdev-line footer-webdev-line--meta">
            SIRET {WEB_DEV.siret} ·{' '}
            <a href={WEB_DEV.phoneHref} className="hover:text-mauve transition-colors">{WEB_DEV.phoneDisplay}</a>
            {' · '}
            <a href={`mailto:${WEB_DEV.email}`} className="hover:text-mauve transition-colors">{WEB_DEV.email}</a>
          </p>
        </div>

        {/* Bottom bar — manuscrite (corps légal relevé dans index.css) */}
        <div
          className="footer-bottom-bar border-t border-mauve-light/30 pt-4 sm:pt-5 flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-3 text-center sm:text-left"
          style={{ color: 'var(--text-mid)' }}
        >
          <p className="max-w-prose px-1 sm:px-0 m-0">© {year} {SITE.businessName} — {SITE.ownerFullName}</p>
          <div className="flex gap-2.5 sm:gap-3 flex-wrap justify-center sm:justify-end items-center">
            <Link to="/mentions-legales" className="hover:text-mauve transition-colors shrink-0">
              Mentions légales
            </Link>
            <Link to="/politique-de-confidentialite" className="hover:text-mauve transition-colors shrink-0">
              Confidentialité
            </Link>
            <Link to="/cgv" className="hover:text-mauve transition-colors shrink-0">
              CGV
            </Link>
            <button
              type="button"
              onClick={openCookiePreferences}
              className="hover:text-mauve transition-colors underline-offset-2 hover:underline bg-transparent border-0 cursor-pointer p-0 font-inherit text-inherit shrink-0"
            >
              Gérer les cookies
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
