import { useLayoutEffect, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

const SECTION_SELECTOR = 'main.site-main section:not(.hero-section):not(.article-product-page)'

/**
 * Révèle les blocs <section> du contenu au défilement (hors hero, fiches produit et admin).
 * Observe aussi les sections ajoutées après chargement async (ex. contenu Supabase au F5).
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

    const main = document.querySelector('main.site-main')
    if (!main) return undefined

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

    const attachSection = (el, index) => {
      if (!(el instanceof HTMLElement)) return
      if (el.dataset.scrollRevealBound === '1') return
      el.dataset.scrollRevealBound = '1'
      el.classList.remove('is-visible')
      el.style.setProperty('--reveal-delay', `${Math.min(index * 50, 380)}ms`)
      observer.observe(el)
    }

    const scanSections = () => {
      main.querySelectorAll('section.article-product-page').forEach((el) => {
        el.classList.add('is-visible')
      })
      const els = main.querySelectorAll(SECTION_SELECTOR)
      els.forEach((el, i) => attachSection(el, i))
    }

    scanSections()

    const mutationObserver = new MutationObserver(() => {
      scanSections()
    })
    mutationObserver.observe(main, { childList: true, subtree: true })

    const id = requestAnimationFrame(() => {
      requestAnimationFrame(scanSections)
    })

    return () => {
      cancelAnimationFrame(id)
      mutationObserver.disconnect()
      observer.disconnect()
      observerRef.current = null
      main.querySelectorAll('[data-scroll-reveal-bound]').forEach((el) => {
        delete el.dataset.scrollRevealBound
      })
    }
  }, [location.pathname])

  return null
}
