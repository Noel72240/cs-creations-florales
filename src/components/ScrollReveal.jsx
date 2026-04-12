import { useLayoutEffect, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Révèle les blocs <section> du contenu au défilement (hors hero et hors admin).
 */
export default function ScrollReveal() {
  const location = useLocation()
  const observerRef = useRef(null)

  useLayoutEffect(() => {
    const admin = location.pathname.startsWith('/admin')
    const reduce =
      typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (admin || reduce) {
      document.documentElement.classList.remove('scroll-reveal-init')
      return
    }
    document.documentElement.classList.add('scroll-reveal-init')
  }, [location.pathname])

  useEffect(() => {
    const admin = location.pathname.startsWith('/admin')
    const reduce =
      typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (admin || reduce) return undefined

    const setup = () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
      const els = document.querySelectorAll('main.site-main section:not(.hero-section)')
      if (els.length === 0) return

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible')
              observer.unobserve(entry.target)
            }
          })
        },
        { root: null, rootMargin: '0px 0px -7% 0px', threshold: 0.05 },
      )
      observerRef.current = observer

      els.forEach((el, i) => {
        el.classList.remove('is-visible')
        el.style.setProperty('--reveal-delay', `${Math.min(i * 50, 380)}ms`)
        observer.observe(el)
      })
    }

    const id = requestAnimationFrame(() => {
      requestAnimationFrame(setup)
    })

    return () => {
      cancelAnimationFrame(id)
      if (observerRef.current) {
        observerRef.current.disconnect()
        observerRef.current = null
      }
    }
  }, [location.pathname])

  return null
}
