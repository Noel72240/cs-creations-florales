import { useLocation } from 'react-router-dom'
import Seo, { buildLocalBusinessSchema } from './Seo'
import { ROUTE_SEO } from '../data/routeSeo'
/** Applique title / meta / canonical sur les pages catalogue (hors guides gérés localement). */
export default function SeoRouteHandler() {
  const { pathname } = useLocation()

  if (pathname.startsWith('/guides')) {
    return null
  }

  const meta = ROUTE_SEO[pathname]
  if (!meta) {
    return (
      <Seo
        title="C&S Créations Florales"
        description="Créatrice florale artisanale à Écommoy, Sarthe."
        path={pathname}
        noindex
      />
    )
  }

  if (pathname === '/') {
    return (
      <Seo
        title={meta.title}
        description={meta.description}
        path="/"
        jsonLd={buildLocalBusinessSchema()}
      />
    )
  }

  return (
    <Seo
      title={meta.title}
      description={meta.description}
      path={pathname}
      noindex={meta.noindex}
    />
  )
}
