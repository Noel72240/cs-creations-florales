import { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useSiteConfig } from '../context/SiteContentContext'
import { useCart } from '../context/CartContext'
import { useCustomerAuth } from '../context/CustomerAuthContext'

function PromoBannerRich({ text, code }) {
  const c = (code || '').trim()
  if (!c || !text.includes(c)) return text
  const parts = text.split(c)
  return parts.map((part, i) => (
    <span key={`${i}-${part.slice(0, 8)}`}>
      {part}
      {i < parts.length - 1 && <span className="site-promo-code">{c}</span>}
    </span>
  ))
}

const menuItems = [
  { label: 'Accueil', path: '/' },
  {
    label: 'Événements floraux',
    path: '/evenements-floraux',
    children: [
      { label: 'Anniversaire', path: '/evenements-floraux/anniversaire' },
      { label: 'Mariage', path: '/evenements-floraux/mariage' },
      { label: 'Baptême / Communion', path: '/evenements-floraux/bapteme-communion' },
    ],
  },
  { label: 'Créations florales', path: '/creations-florales' },
  { label: 'Créations funéraires', path: '/creations-funeraires' },
  {
    label: 'Créations saisonnières',
    path: '/creations-saisonnieres',
    children: [
      { label: 'Pâques', path: '/creations-saisonnieres/paques' },
      { label: 'Noël', path: '/creations-saisonnieres/noel' },
      { label: 'Fête des Mères', path: '/creations-saisonnieres/fete-des-meres' },
    ],
  },
  { label: 'Personnalisation', path: '/personnalisation' },
  { label: 'Paiement', path: '/paiement' },
  { label: 'Contact', path: '/contact' },
]

export default function Navbar() {
  const { itemCount } = useCart()
  const { isAuthenticated } = useCustomerAuth()
  const { content } = useSiteConfig()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState(null)
  const location = useLocation()
  const dropdownRef = useRef(null)
  const headerRef = useRef(null)

  const promo = content.navbar?.promoBanner
  const showPromo = promo?.enabled && (promo?.text || '').trim().length > 0
  const promoFontScale = (() => {
    const v = promo?.fontScale
    const n = typeof v === 'number' ? v : parseFloat(v)
    if (!Number.isFinite(n)) return 1.08
    return Math.min(1.5, Math.max(0.75, n))
  })()

  useLayoutEffect(() => {
    const el = headerRef.current
    if (!el) return
    const apply = () => {
      document.documentElement.style.setProperty('--site-header-offset', `${el.offsetHeight}px`)
    }
    apply()
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(apply) : null
    if (ro) ro.observe(el)
    window.addEventListener('resize', apply)
    return () => {
      window.removeEventListener('resize', apply)
      if (ro) ro.disconnect()
    }
  }, [showPromo, location.pathname, content.navbar?.topBarMessage])

  const isNavActive = (path) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname === path || location.pathname.startsWith(`${path}/`)
  }

  const isCompteActive = location.pathname.startsWith('/compte')

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setOpenDropdown(null)
  }, [location.pathname])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdown(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 left-0 right-0 z-50 overflow-visible transition-all duration-500 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md shadow-mauve/5'
          : 'bg-white/80 backdrop-blur-sm'
      }`}
    >
      {showPromo && (
        <div
          className="site-promo-banner bg-fuchsia-600 text-white text-center px-2 sm:px-4 py-1 sm:py-1.5 border-b border-fuchsia-800/40 shadow-sm"
          role="region"
          aria-label="Offre promotionnelle"
        >
          <p
            className="site-promo-banner-text max-w-6xl mx-auto leading-tight"
            style={{ '--promo-scale': promoFontScale }}
          >
            <PromoBannerRich text={(promo.text || '').trim()} code={promo.code || ''} />
          </p>
        </div>
      )}

      {/* Top bar — serif + casse naturelle (pas d’uppercase) pour une lecture confortable */}
      <div className="bg-gradient-to-r from-mauve-dark/90 via-mauve to-mauve-dark/90 py-3.5 px-3 sm:px-4 text-center border-b border-white/10">
        <p className="nav-topbar-message max-w-4xl mx-auto text-lg sm:text-xl md:text-[1.35rem] text-white font-refined font-medium leading-snug sm:leading-normal tracking-wide">
          {content.navbar.topBarMessage}
        </p>
      </div>

      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-mauve-light/20 bg-gradient-to-b from-white to-[#faf8fb] overflow-visible"
        ref={dropdownRef}
      >
        <div className="flex items-center gap-4 min-h-[4.5rem] py-2.5 w-full">
          {/* Marque : logo circulaire + sous-ligne (le nom est dans le visuel du logo) */}
          <Link to="/" className="flex items-center group shrink-0 min-w-0 rounded-xl pr-2 -ml-1 transition-opacity hover:opacity-90">
            <img
              src="/logo-cs-rond-complet.png"
              alt="C&S Créations Florales — accueil"
              width={56}
              height={56}
              className="h-12 w-12 sm:h-14 sm:w-14 shrink-0 object-contain block"
              decoding="async"
            />
          </Link>

          <div className="flex flex-1 items-center justify-end min-w-0 gap-3">
          {/* Desktop nav — aligné à droite */}
          <nav className="hidden lg:flex flex-wrap justify-end items-center gap-x-2.5 xl:gap-x-4 2xl:gap-x-5">
            {menuItems.map((item) => (
              <div key={item.path} className="relative group shrink-0">
                {item.children ? (
                  <>
                    <button
                      type="button"
                      className={`nav-link nav-link-header flex items-center gap-0.5 bg-transparent cursor-pointer ${
                        isNavActive(item.path) ? 'nav-link-active' : ''
                      }`}
                      onClick={() => setOpenDropdown(openDropdown === item.path ? null : item.path)}
                    >
                      {item.label}
                      <svg className={`w-3.5 h-3.5 shrink-0 transition-transform ${openDropdown === item.path ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {openDropdown === item.path && (
                      <div
                        className="absolute top-full right-0 mt-2.5 w-56 rounded-2xl border border-mauve-light/40 py-2 z-[100] animate-fade-in overflow-hidden"
                        style={{
                          background: '#ffffff',
                          boxShadow: '0 16px 40px rgba(59, 35, 48, 0.14), 0 0 0 1px rgba(192, 122, 151, 0.12)',
                        }}
                      >
                        <Link
                          to={item.path}
                          className="block px-4 py-2.5 text-[0.9375rem] font-heading transition-colors rounded-lg mx-1 hover:bg-mauve-pale"
                          style={{ color: 'var(--violet)' }}
                        >
                          Voir tout
                        </Link>
                        <div className="h-px bg-mauve-light/30 my-1 mx-3" />
                        {item.children.map((child) => (
                          <Link
                            key={child.path}
                            to={child.path}
                            className="block px-4 py-2.5 text-[0.9375rem] font-body transition-colors rounded-lg mx-1 hover:bg-mauve-pale"
                            style={{ color: 'var(--text-dark)' }}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    to={item.path}
                    className={`nav-link nav-link-header ${isNavActive(item.path) ? 'nav-link-active' : ''}`}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>

            <Link
              to={isAuthenticated ? '/compte' : '/compte/connexion'}
              className={`hidden sm:inline-flex shrink-0 items-center px-3 py-2 rounded-xl text-[0.8125rem] font-refined font-medium transition-colors ${
                isCompteActive ? 'bg-mauve-pale ring-1 ring-mauve-light/50' : 'hover:bg-mauve-pale/80'
              }`}
              style={{ color: 'var(--violet)' }}
            >
              {isAuthenticated ? 'Mon compte' : 'Connexion'}
            </Link>

            <Link
              to="/panier"
              className={`relative shrink-0 p-2.5 rounded-xl transition-colors ${
                location.pathname === '/panier'
                  ? 'bg-mauve-pale ring-1 ring-mauve-light/50'
                  : 'hover:bg-mauve-pale/80'
              }`}
              style={{ color: 'var(--violet)' }}
              aria-label={itemCount > 0 ? `Panier, ${itemCount} article${itemCount > 1 ? 's' : ''}` : 'Panier'}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.75}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              {itemCount > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 min-w-[1.15rem] h-[1.15rem] px-0.5 flex items-center justify-center rounded-full text-[10px] font-bold leading-none text-white"
                  style={{ background: 'var(--mauve)' }}
                >
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </Link>

            <button
              type="button"
              className="lg:hidden p-2 rounded-lg text-mauve-dark hover:bg-mauve-pale transition-colors shrink-0"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-mauve-light/30 shadow-lg animate-fade-in">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
            {menuItems.map((item) => (
              <div key={item.path}>
                <Link
                  to={item.path}
                  className="block py-2.5 px-3 rounded-lg text-[0.9375rem] font-body hover:bg-mauve-pale transition-colors"
                  style={{ color: 'var(--text-dark)' }}
                >
                  {item.label}
                </Link>
                {item.children && (
                  <div className="pl-6 space-y-1 mt-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.path}
                        to={child.path}
                        className="block py-2 px-3 rounded-lg text-[0.9375rem] font-body hover:bg-mauve-pale transition-colors"
                        style={{ color: 'var(--text-mid)' }}
                      >
                        → {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="pt-3 border-t border-mauve-light/30 space-y-2">
              <Link
                to={isAuthenticated ? '/compte' : '/compte/connexion'}
                className="block py-2.5 px-3 rounded-lg text-[0.9375rem] font-body hover:bg-mauve-pale transition-colors"
                style={{ color: 'var(--text-dark)' }}
              >
                {isAuthenticated ? 'Mon compte' : 'Connexion / créer un compte'}
              </Link>
              <Link
                to="/panier"
                className="block py-2.5 px-3 rounded-lg text-[0.9375rem] font-body hover:bg-mauve-pale transition-colors"
                style={{ color: 'var(--text-dark)' }}
              >
                Panier{itemCount > 0 ? ` (${itemCount})` : ''}
              </Link>
              <Link to="/contact" className="btn-primary block text-center text-xs py-2.5">
                Demander un devis
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
